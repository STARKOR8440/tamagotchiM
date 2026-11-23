import React, { useState, useEffect, useRef } from 'react';
import PetSprite from './PetSprite';
import { SPECIES } from './evolutionTree';
import { FIREBASE_DB_URL, isFirebaseConfigured } from './firebaseConfig';
import { sfx } from './sound';

const AVATAR_CANDIDATES = Object.values(SPECIES).filter((s) => s.stage !== 'EGG');

const RPS_OPTIONS = [
  { id: 'ROCK', icon: '✊', label: '바위' },
  { id: 'SCISSORS', icon: '✌️', label: '가위' },
  { id: 'PAPER', icon: '🖐️', label: '보' },
];

export default function PlazaModal({
  userId,
  nickname,
  avatarId,
  petCoins,
  onUpdateProfile,
  onSendGiftCoin,
  onWinBattleCoin,
  onClose,
}) {
  const [tab, setTab] = useState('PLAZA'); // 'PLAZA' | 'BATTLE'
  const [editingProfile, setEditingProfile] = useState(false);
  const [tempNick, setTempNick] = useState(nickname);
  const [tempAvatar, setTempAvatar] = useState(avatarId);

  // 광장 실시간 데이터
  const [usersMap, setUsersMap] = useState({});
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedTarget, setSelectedTarget] = useState(null);

  // 1:1 IR 통신 대전 상태
  const [roomCode, setRoomCode] = useState('');
  const [joinedRoom, setJoinedRoom] = useState('');
  const [roomData, setRoomData] = useState(null);

  const chatEndRef = useRef(null);

  // 내 접속 상태(Presence) 등록 및 15초마다 하트비트 갱신
  useEffect(() => {
    const pushPresence = async () => {
      const payload = {
        userId,
        nickname,
        avatarId,
        lastSeen: Date.now(),
      };
      if (!isFirebaseConfigured()) {
        setUsersMap((prev) => ({
          ...prev,
          [userId]: payload,
          bot_1: { userId: 'bot_1', nickname: '마메치친구', avatarId: 'ADULT_MAMETCHI', lastSeen: Date.now() },
          bot_2: { userId: 'bot_2', nickname: '스누피팬', avatarId: 'SECRET_SNOOPY', lastSeen: Date.now() },
        }));
        return;
      }
      try {
        await fetch(`${FIREBASE_DB_URL}/plaza/users/${userId}.json`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } catch {
        // 네트워크 일시 오류 무시
      }
    };

    pushPresence();
    const hb = setInterval(pushPresence, 15000);
    return () => clearInterval(hb);
  }, [userId, nickname, avatarId]);

  // 광장 유저 & 채팅 폴링 (2.5초 주기)
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setMessages((prev) =>
        prev.length > 0
          ? prev
          : [
              {
                id: 'sys_1',
                sender: '안내',
                text: 'Firebase DB URL을 연결하면 실시간 멀티 광장이 열립니다!',
                isSystem: true,
              },
            ]
      );
      return;
    }

    const fetchPlaza = async () => {
      try {
        const [uRes, mRes] = await Promise.all([
          fetch(`${FIREBASE_DB_URL}/plaza/users.json`),
          fetch(`${FIREBASE_DB_URL}/plaza/messages.json?orderBy="$key"&limitToLast=25`),
        ]);
        const uData = (await uRes.json()) || {};
        const mData = (await mRes.json()) || {};

        // 최근 3분 이내 활동 유저만 온라인으로 필터링
        const now = Date.now();
        const activeUsers = {};
        Object.values(uData).forEach((u) => {
          if (u && now - (u.lastSeen || 0) < 180000) {
            activeUsers[u.userId] = u;
          }
        });
        setUsersMap(activeUsers);

        const msgList = Object.entries(mData).map(([k, v]) => ({ id: k, ...v }));
        setMessages(msgList);
      } catch {
        // 무시
      }
    };

    fetchPlaza();
    const timer = setInterval(fetchPlaza, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 1:1 통신 방 폴링
  useEffect(() => {
    if (!joinedRoom || !isFirebaseConfigured()) return;

    const pollRoom = async () => {
      try {
        const res = await fetch(`${FIREBASE_DB_URL}/plaza/rooms/${joinedRoom}.json`);
        const data = await res.json();
        setRoomData(data);
      } catch {
        // 무시
      }
    };

    pollRoom();
    const t = setInterval(pollRoom, 1500);
    return () => clearInterval(t);
  }, [joinedRoom]);

  const postChatMessage = async (text, isSystem = false) => {
    if (!text.trim()) return;
    const msgObj = {
      sender: nickname,
      senderId: userId,
      avatarId,
      text: text.trim().slice(0, 50),
      isSystem,
      ts: Date.now(),
    };

    if (!isFirebaseConfigured()) {
      setMessages((prev) => [...prev, { id: String(Date.now()), ...msgObj }]);
      return;
    }

    try {
      await fetch(`${FIREBASE_DB_URL}/plaza/messages.json`, {
        method: 'POST',
        body: JSON.stringify(msgObj),
      });
    } catch {
      // 무시
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sfx.beep();
    postChatMessage(chatInput, false);
    setChatInput('');
  };

  const handleSaveProfile = () => {
    const cleanNick = tempNick.trim().slice(0, 8) || '다마유저';
    sfx.confirm();
    onUpdateProfile(cleanNick, tempAvatar);
    setEditingProfile(false);
  };

  const handleSendGift = async (targetUser, giftType) => {
    if (targetUser.userId === userId) return;

    if (giftType === 'COIN') {
      if (petCoins < 20) {
        sfx.beep();
        alert('코인이 부족합니다! (20🪙 필요)');
        return;
      }
      onSendGiftCoin(20);
    }

    sfx.win();
    const giftLabels = {
      HEART: '❤️ 하트(행복+15)',
      CAKE: '🍰 달콤 케이크(포만+15)',
      COIN: '🪙 20코인 용돈',
    };

    if (isFirebaseConfigured()) {
      try {
        await fetch(`${FIREBASE_DB_URL}/plaza/gifts/${targetUser.userId}.json`, {
          method: 'POST',
          body: JSON.stringify({
            from: nickname,
            type: giftType,
            ts: Date.now(),
          }),
        });
      } catch {
        // 무시
      }
    }

    await postChatMessage(
      `🎁 [${nickname}]님이 [${targetUser.nickname}]님에게 ${giftLabels[giftType]} 선물!`,
      true
    );
    setSelectedTarget(null);
  };

  // 1:1 통신방 입장
  const handleJoinRoom = async () => {
    const cleanCode = roomCode.trim();
    if (cleanCode.length !== 4) {
      alert('4자리 숫자 초대코드를 입력하세요!');
      return;
    }
    sfx.confirm();
    setJoinedRoom(cleanCode);

    if (!isFirebaseConfigured()) {
      setRoomData({
        players: {
          [userId]: { userId, nickname, avatarId, choice: '' },
          cpu_guest: { userId: 'cpu_guest', nickname: '적외선친구', avatarId: 'SECRET_KITTY', choice: 'SCISSORS' },
        },
      });
      return;
    }

    try {
      const res = await fetch(`${FIREBASE_DB_URL}/plaza/rooms/${cleanCode}.json`);
      const existing = (await res.json()) || { players: {} };
      const players = existing.players || {};

      // 이전 판 결과가 완료된 방이면 초기화
      const pKeys = Object.keys(players);
      if (pKeys.length >= 2 && !players[userId]) {
        alert('이미 2명이 통신 중인 방입니다. 다른 코드를 입력하세요!');
        setJoinedRoom('');
        return;
      }

      players[userId] = { userId, nickname, avatarId, choice: '' };
      await fetch(`${FIREBASE_DB_URL}/plaza/rooms/${cleanCode}.json`, {
        method: 'PUT',
        body: JSON.stringify({ players, updatedAt: Date.now() }),
      });
    } catch {
      // 무시
    }
  };

  const handleSelectBattleChoice = async (choiceId) => {
    sfx.beep();
    if (!isFirebaseConfigured()) {
      setRoomData((prev) => ({
        ...prev,
        players: {
          ...prev.players,
          [userId]: { ...prev.players[userId], choice: choiceId },
        },
      }));
      return;
    }

    try {
      await fetch(`${FIREBASE_DB_URL}/plaza/rooms/${joinedRoom}/players/${userId}/choice.json`, {
        method: 'PUT',
        body: JSON.stringify(choiceId),
      });
    } catch {
      // 무시
    }
  };

  const handleResetBattleRound = async () => {
    sfx.confirm();
    if (!isFirebaseConfigured()) {
      const cpuMoves = ['ROCK', 'SCISSORS', 'PAPER'];
      const nextCpu = cpuMoves[Math.floor(Math.random() * 3)];
      setRoomData((prev) => ({
        ...prev,
        players: {
          [userId]: { ...prev.players[userId], choice: '' },
          cpu_guest: { ...prev.players.cpu_guest, choice: nextCpu },
        },
      }));
      return;
    }

    if (!roomData?.players) return;
    const resetPlayers = {};
    Object.values(roomData.players).forEach((p) => {
      resetPlayers[p.userId] = { ...p, choice: '' };
    });
    await fetch(`${FIREBASE_DB_URL}/plaza/rooms/${joinedRoom}/players.json`, {
      method: 'PUT',
      body: JSON.stringify(resetPlayers),
    });
  };

  const onlineList = Object.values(usersMap);

  // 배틀 판정 계산
  const playersArr = roomData?.players ? Object.values(roomData.players) : [];
  const mePlayer = playersArr.find((p) => p.userId === userId);
  const oppPlayer = playersArr.find((p) => p.userId !== userId);
  const bothChosen = mePlayer?.choice && oppPlayer?.choice;

  let battleResultText = '';
  if (bothChosen) {
    if (mePlayer.choice === oppPlayer.choice) {
      battleResultText = '비겼습니다! 한 번 더! 🤝';
    } else if (
      (mePlayer.choice === 'ROCK' && oppPlayer.choice === 'SCISSORS') ||
      (mePlayer.choice === 'SCISSORS' && oppPlayer.choice === 'PAPER') ||
      (mePlayer.choice === 'PAPER' && oppPlayer.choice === 'ROCK')
    ) {
      battleResultText = '승리! 보너스 +50🪙 획득 🎉';
    } else {
      battleResultText = '아쉽네요! 상대방 승리 😅';
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.76)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          maxHeight: '88dvh',
          background: '#ffffff',
          borderRadius: '24px',
          border: '3.5px solid #0284c7',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.45)',
          padding: '14px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          color: '#0f172a',
        }}
      >
        {/* 상단 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '15px', fontWeight: '900', color: '#0369a1' }}>
              📡 다마고치 커넥션 광장
            </span>
            <span
              style={{
                background: '#dcfce7',
                color: '#15803d',
                fontSize: '11px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '10px',
              }}
            >
              접속 {onlineList.length}명
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '5px 10px',
              fontSize: '11.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            ✕ 닫기
          </button>
        </div>

        {/* 내 프로필 바 (닉네임 & 광장 캐릭터 변경) */}
        <div
          style={{
            background: '#f0f9ff',
            border: '1.5px solid #bae6fd',
            borderRadius: '14px',
            padding: '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ transform: 'scale(0.36)' }}>
                  <PetSprite speciesId={avatarId} lcdMode={false} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: '900' }}>{nickname}</div>
                <div style={{ fontSize: '10.5px', color: '#0284c7', fontWeight: '700' }}>
                  {SPECIES[avatarId]?.name || '몽글 베이비'}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sfx.beep();
                setTempNick(nickname);
                setTempAvatar(avatarId);
                setEditingProfile(!editingProfile);
              }}
              style={{
                background: '#0284c7',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {editingProfile ? '취소' : '✏️ 닉네임·캐릭터 변경'}
            </button>
          </div>

          {editingProfile && (
            <div
              style={{
                borderTop: '1px dashed #7dd3fc',
                paddingTop: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  maxLength={8}
                  value={tempNick}
                  onChange={(e) => setTempNick(e.target.value)}
                  placeholder="닉네임 (최대 8자)"
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: '8px',
                    border: '1.5px solid #38bdf8',
                    fontSize: '12px',
                    fontWeight: '700',
                  }}
                />
                <button
                  onClick={handleSaveProfile}
                  style={{
                    background: '#16a34a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                  }}
                >
                  저장
                </button>
              </div>

              <div style={{ fontSize: '10.5px', fontWeight: '800', color: '#475569' }}>
                광장 아바타 선택 (기존 캐릭터 {AVATAR_CANDIDATES.length}종):
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '4px',
                  maxHeight: '110px',
                  overflowY: 'auto',
                  background: '#ffffff',
                  padding: '6px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                }}
              >
                {AVATAR_CANDIDATES.map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => {
                      sfx.beep();
                      setTempAvatar(sp.id);
                    }}
                    title={sp.name}
                    style={{
                      height: '36px',
                      padding: 0,
                      borderRadius: '8px',
                      border: tempAvatar === sp.id ? '2px solid #0284c7' : '1px solid #e2e8f0',
                      background: tempAvatar === sp.id ? '#e0f2fe' : '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ transform: 'scale(0.32)' }}>
                      <PetSprite speciesId={sp.id} lcdMode={false} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 탭 전환: 광장 & 채팅 / 1:1 IR 적외선 배틀 */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => {
              sfx.beep();
              setTab('PLAZA');
            }}
            style={{
              flex: 1,
              padding: '7px',
              borderRadius: '10px',
              border: 'none',
              background: tab === 'PLAZA' ? '#0f172a' : '#e2e8f0',
              color: tab === 'PLAZA' ? '#ffffff' : '#334155',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            💬 광장 & 선물 주고받기
          </button>
          <button
            onClick={() => {
              sfx.beep();
              setTab('BATTLE');
            }}
            style={{
              flex: 1,
              padding: '7px',
              borderRadius: '10px',
              border: 'none',
              background: tab === 'BATTLE' ? '#0f172a' : '#e2e8f0',
              color: tab === 'BATTLE' ? '#ffffff' : '#334155',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            ⚡ 1:1 IR 통신 대전
          </button>
        </div>

        {tab === 'PLAZA' ? (
          <>
            {/* 접속 중인 친구 캐릭터 광장 필드 */}
            <div
              style={{
                background: 'linear-gradient(180deg, #dcfce7 0%, #bbf7d0 100%)',
                border: '2px solid #4ade80',
                borderRadius: '16px',
                padding: '8px',
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                minHeight: '76px',
                alignItems: 'center',
              }}
            >
              {onlineList.map((u) => {
                const isMe = u.userId === userId;
                const isSelected = selectedTarget?.userId === u.userId;
                return (
                  <button
                    key={u.userId}
                    onClick={() => {
                      if (isMe) return;
                      sfx.beep();
                      setSelectedTarget(isSelected ? null : u);
                    }}
                    style={{
                      minWidth: '64px',
                      background: isSelected ? '#fef08a' : 'rgba(255,255,255,0.85)',
                      border: isMe
                        ? '2px solid #0284c7'
                        : isSelected
                        ? '2px solid #eab308'
                        : '1.5px solid #86efac',
                      borderRadius: '12px',
                      padding: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: isMe ? 'default' : 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ transform: 'scale(0.34)' }}>
                        <PetSprite speciesId={u.avatarId} lcdMode={false} />
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: '#0f172a' }}>
                      {u.nickname}
                    </span>
                    <span style={{ fontSize: '8.5px', color: isMe ? '#0284c7' : '#16a34a', fontWeight: '700' }}>
                      {isMe ? '나' : '선물하기'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 친구 선택 시 선물 보내기 패널 */}
            {selectedTarget && (
              <div
                style={{
                  background: '#fef9c3',
                  border: '1.5px solid #facc15',
                  borderRadius: '12px',
                  padding: '8px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ fontSize: '11.5px', fontWeight: '900', color: '#854d0e' }}>
                  🎁 [{selectedTarget.nickname}]님에게 선물 보내기
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => handleSendGift(selectedTarget, 'HEART')} style={giftBtnStyle}>
                    ❤️ 하트 (무료)
                  </button>
                  <button onClick={() => handleSendGift(selectedTarget, 'CAKE')} style={giftBtnStyle}>
                    🍰 케이크 (무료)
                  </button>
                  <button onClick={() => handleSendGift(selectedTarget, 'COIN')} style={giftBtnStyle}>
                    🪙 20코인 보내기
                  </button>
                </div>
              </div>
            )}

            {/* 실시간 한줄 채팅창 */}
            <div
              style={{
                flex: 1,
                minHeight: '130px',
                maxHeight: '180px',
                overflowY: 'auto',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '14px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    fontSize: '11.5px',
                    background: m.isSystem ? '#fef08a' : '#ffffff',
                    border: m.isSystem ? '1px solid #facc15' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    lineHeight: 1.35,
                  }}
                >
                  {m.isSystem ? (
                    <strong style={{ color: '#854d0e' }}>{m.text}</strong>
                  ) : (
                    <>
                      <strong style={{ color: '#0284c7' }}>[{m.sender}]</strong>{' '}
                      <span>{m.text}</span>
                    </>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* 한줄 채팅 입력 폼 */}
            <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                maxLength={50}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="광장에 한줄 인사 남기기..."
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '12px',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#0284c7',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0 14px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                전송
              </button>
            </form>
          </>
        ) : (
          /* 1:1 IR 적외선 통신 대전 화면 */
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              borderRadius: '16px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {!joinedRoom ? (
              <>
                <div style={{ fontSize: '13px', fontWeight: '900', color: '#0f172a' }}>
                  📡 4자리 초대코드로 친구와 연결!
                </div>
                <div style={{ fontSize: '11px', color: '#475569', textAlign: 'center' }}>
                  같은 4자리 숫자를 입력하면 두 캐릭터가 만나 실시간 가위바위보 대결을 펼칩니다.
                </div>
                <div style={{ display: 'flex', gap: '6px', width: '100%', maxWidth: '240px' }}>
                  <input
                    type="tel"
                    maxLength={4}
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="예: 8440"
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: '900',
                      letterSpacing: '4px',
                      padding: '8px',
                      borderRadius: '10px',
                      border: '2px solid #0284c7',
                    }}
                  />
                  <button
                    onClick={handleJoinRoom}
                    style={{
                      background: '#0284c7',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0 14px',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    접속
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: '900', color: '#0284c7' }}>
                    방 코드: [{joinedRoom}]
                  </span>
                  <button
                    onClick={() => {
                      setJoinedRoom('');
                      setRoomData(null);
                    }}
                    style={{
                      background: '#e2e8f0',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '3px 8px',
                      fontSize: '10.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    방 나가기
                  </button>
                </div>

                {/* 두 캐릭터 합동 모션 스테이지 */}
                <div
                  style={{
                    width: '100%',
                    height: '96px',
                    background: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)',
                    borderRadius: '14px',
                    border: '2px solid #38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ transform: 'scale(0.58)' }}>
                      <PetSprite speciesId={avatarId} direction={1} frame={1} actionState="HAPPY" lcdMode={false} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '900' }}>{nickname}</span>
                  </div>

                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#ef4444' }}>
                    {bothChosen
                      ? `${RPS_OPTIONS.find((r) => r.id === mePlayer.choice)?.icon} vs ${
                          RPS_OPTIONS.find((r) => r.id === oppPlayer.choice)?.icon
                        }`
                      : '⚡IR⚡'}
                  </div>

                  {oppPlayer ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ transform: 'scale(0.58)' }}>
                        <PetSprite speciesId={oppPlayer.avatarId} direction={-1} frame={0} actionState="HAPPY" lcdMode={false} />
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '900' }}>{oppPlayer.nickname}</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '11px', color: '#475569', fontWeight: '700' }}>
                      상대 입장 대기중...
                    </div>
                  )}
                </div>

                {oppPlayer && !bothChosen && (
                  <>
                    <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#334155' }}>
                      {mePlayer?.choice ? '상대방 선택을 기다리는 중...' : '가위·바위·보를 선택하세요!'}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                      {RPS_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectBattleChoice(opt.id)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '12px',
                            border: mePlayer?.choice === opt.id ? '2.5px solid #0284c7' : '1.5px solid #cbd5e1',
                            background: mePlayer?.choice === opt.id ? '#e0f2fe' : '#ffffff',
                            fontSize: '18px',
                            cursor: 'pointer',
                          }}
                        >
                          {opt.icon}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {bothChosen && (
                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '900', color: '#0f172a' }}>
                      {battleResultText}
                    </div>
                    <button
                      onClick={() => {
                        if (battleResultText.includes('승리!')) {
                          onWinBattleCoin(50);
                        }
                        handleResetBattleRound();
                      }}
                      style={{
                        background: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '7px 14px',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                      }}
                    >
                      보상 수령 & 다음 판 준비
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const giftBtnStyle = {
  flex: 1,
  background: '#ffffff',
  border: '1px solid #eab308',
  borderRadius: '8px',
  padding: '5px 4px',
  fontSize: '10.5px',
  fontWeight: '800',
  cursor: 'pointer',
  color: '#0f172a',
};