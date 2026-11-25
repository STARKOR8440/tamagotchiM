import React, { useState, useEffect, useRef } from 'react';
import PetSprite from './PetSprite';
import { SPECIES } from './evolutionTree';
import { FIREBASE_DB_URL, isFirebaseConfigured } from './firebaseConfig';
import { sfx } from './sound';

const AVATAR_CANDIDATES = Object.values(SPECIES).filter((s) => s.stage !== 'EGG');

const BATTLE_MODES = [
  { id: 'RPS', icon: '✊', label: '가위바위보', reward: 50 },
  { id: 'DICE', icon: '🎲', label: '2D6 주사위', reward: 50 },
  { id: 'DUEL', icon: '⚔️', label: '창·방패·필살', reward: 60 },
];

const RPS_OPTIONS = [
  { id: 'ROCK', icon: '✊', label: '바위' },
  { id: 'SCISSORS', icon: '✌️', label: '가위' },
  { id: 'PAPER', icon: '🖐️', label: '보' },
];

const DUEL_OPTIONS = [
  { id: 'SPEAR', icon: '⚔️', label: '창(공격)', sub: '필살기 제압' },
  { id: 'SHIELD', icon: '🛡️', label: '방패(수비)', sub: '창 공격 반격' },
  { id: 'ULT', icon: '🔥', label: '필살기', sub: '방패 관통' },
];

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export default function PlazaModal({
  userId,
  nickname,
  avatarId,
  petCoins,
  irBattleWinsToday = 0,
  irBattleDailyLimit = 5,
  onUpdateProfile,
  onSendGiftCoin,
  onWinBattleCoin,
  onClose,
}) {
  const [tab, setTab] = useState('PLAZA');
  const [editingProfile, setEditingProfile] = useState(false);
  const [tempNick, setTempNick] = useState(nickname);
  const [tempAvatar, setTempAvatar] = useState(avatarId);

  const [usersMap, setUsersMap] = useState({});
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [giftCoinAmount, setGiftCoinAmount] = useState(20);

  const [roomCode, setRoomCode] = useState('');
  const [joinedRoom, setJoinedRoom] = useState('');
  const [selectedMode, setSelectedMode] = useState('RPS');
  const [roomData, setRoomData] = useState(null);

  const chatEndRef = useRef(null);

  const normalizedGiftCoins = Math.max(1, Math.min(999999, Math.floor(Number(giftCoinAmount) || 1)));

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
        // 무시
      }
    };

    pushPresence();
    const hb = setInterval(pushPresence, 15000);
    return () => clearInterval(hb);
  }, [userId, nickname, avatarId]);

  // 광장 유저 & 채팅 폴링
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setMessages((prev) =>
        prev.length > 0
          ? prev
          : [
              {
                id: 'sys_1',
                sender: '안내',
                text: '⚠️ src/firebaseConfig.js에 Firebase DB URL을 입력하면 실시간 멀티 통신이 활성화됩니다.',
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
          fetch(`${FIREBASE_DB_URL}/plaza/messages.json?orderBy="$key"&limitToLast=30`),
        ]);
        const uData = (await uRes.json()) || {};
        const mData = (await mRes.json()) || {};

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
        if (data?.mode) {
          setSelectedMode(data.mode);
        }
      } catch {
        // 무시
      }
    };

    pollRoom();
    const t = setInterval(pollRoom, 1200);
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
      if ((petCoins || 0) < normalizedGiftCoins) {
        sfx.beep();
        alert(`코인이 부족합니다! (${normalizedGiftCoins}🪙 필요, 보유: ${petCoins || 0}🪙)`);
        return;
      }
      onSendGiftCoin(normalizedGiftCoins);
    }

    sfx.win();
    const giftLabels = {
      HEART: '❤️ 하트(행복+15)',
      CAKE: '🍰 달콤 케이크(포만+15)',
      COIN: `🪙 ${normalizedGiftCoins}코인 용돈`,
    };

    if (isFirebaseConfigured()) {
      try {
        await fetch(`${FIREBASE_DB_URL}/plaza/gifts/${targetUser.userId}.json`, {
          method: 'POST',
          body: JSON.stringify({
            from: nickname,
            type: giftType,
            amount: giftType === 'COIN' ? normalizedGiftCoins : 0,
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

  const makeBotChoiceForMode = (mode) => {
    if (mode === 'DICE') {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      return `${d1},${d2}`;
    }
    if (mode === 'DUEL') {
      return ['SPEAR', 'SHIELD', 'ULT'][Math.floor(Math.random() * 3)];
    }
    return ['ROCK', 'SCISSORS', 'PAPER'][Math.floor(Math.random() * 3)];
  };

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
        mode: selectedMode,
        players: {
          [userId]: { userId, nickname, avatarId, choice: '' },
          cpu_guest: {
            userId: 'cpu_guest',
            nickname: '적외선친구',
            avatarId: 'SECRET_KITTY',
            choice: makeBotChoiceForMode(selectedMode),
          },
        },
      });
      return;
    }

    try {
      const res = await fetch(`${FIREBASE_DB_URL}/plaza/rooms/${cleanCode}.json`);
      const existing = await res.json();
      const now = Date.now();

      const isExpired = !existing || now - (existing.updatedAt || 0) > 120000;
      const players = isExpired ? {} : existing.players || {};
      const activeMode = isExpired ? selectedMode : existing.mode || selectedMode;

      const pKeys = Object.keys(players);
      if (pKeys.length >= 2 && !players[userId]) {
        alert('현재 다른 2명이 대전 중인 방입니다. 다른 4자리 코드를 입력하세요!');
        setJoinedRoom('');
        return;
      }

      players[userId] = { userId, nickname, avatarId, choice: '' };
      const nextRoomState = { mode: activeMode, players, updatedAt: now };
      setSelectedMode(activeMode);

      await fetch(`${FIREBASE_DB_URL}/plaza/rooms/${cleanCode}.json`, {
        method: 'PUT',
        body: JSON.stringify(nextRoomState),
      });
      setRoomData(nextRoomState);
    } catch {
      // 무시
    }
  };

  const handleSwitchBattleMode = async (nextMode) => {
    sfx.beep();
    setSelectedMode(nextMode);
    if (!joinedRoom || !roomData?.players) return;

    const resetPlayers = {};
    Object.values(roomData.players).forEach((p) => {
      resetPlayers[p.userId] = {
        ...p,
        choice: p.userId === 'cpu_guest' ? makeBotChoiceForMode(nextMode) : '',
      };
    });
    const nextState = { mode: nextMode, players: resetPlayers, updatedAt: Date.now() };
    setRoomData(nextState);

    if (isFirebaseConfigured()) {
      try {
        await fetch(`${FIREBASE_DB_URL}/plaza/rooms/${joinedRoom}.json`, {
          method: 'PUT',
          body: JSON.stringify(nextState),
        });
      } catch {
        // 무시
      }
    }
  };

  const handleLeaveRoom = async () => {
    sfx.beep();
    const targetRoom = joinedRoom;
    setJoinedRoom('');
    setRoomData(null);

    if (!targetRoom || !isFirebaseConfigured()) return;

    try {
      const res = await fetch(`${FIREBASE_DB_URL}/plaza/rooms/${targetRoom}.json`);
      const current = await res.json();
      if (!current || !current.players) return;

      delete current.players[userId];
      if (Object.keys(current.players).length === 0) {
        await fetch(`${FIREBASE_DB_URL}/plaza/rooms/${targetRoom}.json`, {
          method: 'DELETE',
        });
      } else {
        await fetch(`${FIREBASE_DB_URL}/plaza/rooms/${targetRoom}.json`, {
          method: 'PUT',
          body: JSON.stringify({
            mode: current.mode || selectedMode,
            players: current.players,
            updatedAt: Date.now(),
          }),
        });
      }
    } catch {
      // 무시
    }
  };

  const handleCloseModal = () => {
    if (joinedRoom) {
      handleLeaveRoom();
    }
    onClose();
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
      await Promise.all([
        fetch(`${FIREBASE_DB_URL}/plaza/rooms/${joinedRoom}/players/${userId}/choice.json`, {
          method: 'PUT',
          body: JSON.stringify(choiceId),
        }),
        fetch(`${FIREBASE_DB_URL}/plaza/rooms/${joinedRoom}/updatedAt.json`, {
          method: 'PUT',
          body: JSON.stringify(Date.now()),
        }),
      ]);
    } catch {
      // 무시
    }
  };

  const handleRollDice = () => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    handleSelectBattleChoice(`${d1},${d2}`);
  };

  const handleResetBattleRound = async () => {
    sfx.confirm();
    const activeMode = roomData?.mode || selectedMode;
    if (!isFirebaseConfigured()) {
      setRoomData((prev) => ({
        ...prev,
        mode: activeMode,
        players: {
          [userId]: { ...prev.players[userId], choice: '' },
          cpu_guest: {
            ...prev.players.cpu_guest,
            choice: makeBotChoiceForMode(activeMode),
          },
        },
      }));
      return;
    }

    if (!roomData?.players) return;
    const resetPlayers = {};
    Object.values(roomData.players).forEach((p) => {
      resetPlayers[p.userId] = { ...p, choice: '' };
    });
    const nextState = { mode: activeMode, players: resetPlayers, updatedAt: Date.now() };
    await fetch(`${FIREBASE_DB_URL}/plaza/rooms/${joinedRoom}.json`, {
      method: 'PUT',
      body: JSON.stringify(nextState),
    });
    setRoomData(nextState);
  };

  const onlineList = Object.values(usersMap);
  const playersArr = roomData?.players ? Object.values(roomData.players) : [];
  const mePlayer = playersArr.find((p) => p.userId === userId);
  const oppPlayer = playersArr.find((p) => p.userId !== userId);
  const activeMode = roomData?.mode || selectedMode;
  const bothChosen = Boolean(mePlayer?.choice && oppPlayer?.choice);

  const hasBattleRewardLeft = irBattleWinsToday < irBattleDailyLimit;

  const parseDice = (str) => {
    const [a, b] = String(str || '').split(',').map((n) => Number(n) || 1);
    return { d1: a, d2: b, sum: a + b, isDouble: a === b };
  };

  let battleResultText = '';
  let battleReward = 0;
  let centerDisplay = '⚡IR⚡';

  if (bothChosen) {
    if (activeMode === 'DICE') {
      const myDice = parseDice(mePlayer.choice);
      const oppDice = parseDice(oppPlayer.choice);
      centerDisplay = `${DICE_FACES[myDice.d1 - 1]}${DICE_FACES[myDice.d2 - 1]}(${myDice.sum}) vs ${
        DICE_FACES[oppDice.d1 - 1]
      }${DICE_FACES[oppDice.d2 - 1]}(${oppDice.sum})`;

      if (myDice.sum === oppDice.sum) {
        battleResultText = `무승부 (${myDice.sum} vs ${oppDice.sum})! 한 번 더! 🤝`;
      } else if (myDice.sum > oppDice.sum) {
        battleReward = myDice.isDouble ? 100 : 50;
        battleResultText = myDice.isDouble
          ? `더블 대승리! 보너스 2배 +${battleReward}🪙 🎉`
          : `주사위 승리! +${battleReward}🪙 획득 🎉`;
      } else {
        battleResultText = `아쉽네요! 상대 주사위(${oppDice.sum}) 승리 😅`;
      }
    } else if (activeMode === 'DUEL') {
      const myOpt = DUEL_OPTIONS.find((r) => r.id === mePlayer.choice);
      const oppOpt = DUEL_OPTIONS.find((r) => r.id === oppPlayer.choice);
      centerDisplay = `${myOpt?.icon || ''} vs ${oppOpt?.icon || ''}`;

      if (mePlayer.choice === oppPlayer.choice) {
        battleResultText = '동시 격돌 무승부! 한 번 더! 🤝';
      } else if (
        (mePlayer.choice === 'SPEAR' && oppPlayer.choice === 'ULT') ||
        (mePlayer.choice === 'SHIELD' && oppPlayer.choice === 'SPEAR') ||
        (mePlayer.choice === 'ULT' && oppPlayer.choice === 'SHIELD')
      ) {
        battleReward = 60;
        battleResultText = `상성 간파 승리! +${battleReward}🪙 획득 🎉`;
      } else {
        battleResultText = '상대에게 빈틈을 찔렸습니다! 😅';
      }
    } else {
      const myOpt = RPS_OPTIONS.find((r) => r.id === mePlayer.choice);
      const oppOpt = RPS_OPTIONS.find((r) => r.id === oppPlayer.choice);
      centerDisplay = `${myOpt?.icon || ''} vs ${oppOpt?.icon || ''}`;

      if (mePlayer.choice === oppPlayer.choice) {
        battleResultText = '비겼습니다! 한 번 더! 🤝';
      } else if (
        (mePlayer.choice === 'ROCK' && oppPlayer.choice === 'SCISSORS') ||
        (mePlayer.choice === 'SCISSORS' && oppPlayer.choice === 'PAPER') ||
        (mePlayer.choice === 'PAPER' && oppPlayer.choice === 'ROCK')
      ) {
        battleReward = 50;
        battleResultText = `승리! 보너스 +${battleReward}🪙 획득 🎉`;
      } else {
        battleResultText = '아쉽네요! 상대방 승리 😅';
      }
    }
  } else if (mePlayer?.choice) {
    if (activeMode === 'DICE') {
      const myDice = parseDice(mePlayer.choice);
      centerDisplay = `${DICE_FACES[myDice.d1 - 1]}${DICE_FACES[myDice.d2 - 1]}(${myDice.sum}) vs ?`;
    } else if (activeMode === 'DUEL') {
      const myOpt = DUEL_OPTIONS.find((r) => r.id === mePlayer.choice);
      centerDisplay = `${myOpt?.icon || ''} vs ?`;
    } else {
      const myOpt = RPS_OPTIONS.find((r) => r.id === mePlayer.choice);
      centerDisplay = `${myOpt?.icon || ''} vs ?`;
    }
  }

  const effectiveBattleReward = hasBattleRewardLeft ? battleReward : 0;

  return (
    <div
      onClick={handleCloseModal}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92dvh',
          background: '#ffffff',
          borderRadius: '26px',
          border: '3.5px solid #0284c7',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.45)',
          padding: '18px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          color: '#0f172a',
          overflow: 'hidden',
        }}
      >
        {/* 상단 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#0369a1' }}>
              📡 다마고치 커넥션 광장
            </span>
            <span
              style={{
                background: isFirebaseConfigured() ? '#dcfce7' : '#fef3c7',
                color: isFirebaseConfigured() ? '#15803d' : '#b45309',
                fontSize: '12px',
                fontWeight: '800',
                padding: '3px 9px',
                borderRadius: '12px',
              }}
            >
              {isFirebaseConfigured() ? `접속 ${onlineList.length}명` : '로컬모드'}
            </span>
          </div>
          <button
            onClick={handleCloseModal}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '7px 13px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            ✕ 닫기
          </button>
        </div>

        {/* 내 프로필 바 */}
        <div
          style={{
            background: '#f0f9ff',
            border: '1.5px solid #bae6fd',
            borderRadius: '16px',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ transform: 'scale(0.45)' }}>
                  <PetSprite speciesId={avatarId} lcdMode={false} />
                </div>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: '900', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {nickname}
                </div>
                <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: '700' }}>
                  {SPECIES[avatarId]?.name || '몽글 베이비'} · 보유 {petCoins}🪙
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
                borderRadius: '11px',
                padding: '7px 12px',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {editingProfile ? '취소' : '✏️ 프로필'}
            </button>
          </div>

          {editingProfile && (
            <div
              style={{
                borderTop: '1px dashed #7dd3fc',
                paddingTop: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <input
                  type="text"
                  maxLength={8}
                  value={tempNick}
                  onChange={(e) => setTempNick(e.target.value)}
                  placeholder="닉네임 (최대 8자)"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '1.5px solid #38bdf8',
                    fontSize: '16px',
                    fontWeight: '700',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={handleSaveProfile}
                  style={{
                    background: '#16a34a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 16px',
                    fontSize: '13.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  저장
                </button>
              </div>

              <div style={{ fontSize: '12px', fontWeight: '800', color: '#475569' }}>
                광장 캐릭터 선택 ({AVATAR_CANDIDATES.length}종):
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '6px',
                  maxHeight: '130px',
                  overflowY: 'auto',
                  background: '#ffffff',
                  padding: '8px',
                  borderRadius: '12px',
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
                      height: '44px',
                      padding: 0,
                      borderRadius: '10px',
                      border: tempAvatar === sp.id ? '2.5px solid #0284c7' : '1px solid #e2e8f0',
                      background: tempAvatar === sp.id ? '#e0f2fe' : '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ transform: 'scale(0.38)' }}>
                      <PetSprite speciesId={sp.id} lcdMode={false} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 탭 전환 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              sfx.beep();
              setTab('PLAZA');
            }}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '12px',
              border: 'none',
              background: tab === 'PLAZA' ? '#0f172a' : '#e2e8f0',
              color: tab === 'PLAZA' ? '#ffffff' : '#334155',
              fontSize: '13.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            💬 광장 & 선물
          </button>
          <button
            onClick={() => {
              sfx.beep();
              setTab('BATTLE');
            }}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '12px',
              border: 'none',
              background: tab === 'BATTLE' ? '#0f172a' : '#e2e8f0',
              color: tab === 'BATTLE' ? '#ffffff' : '#334155',
              fontSize: '13.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            ⚡ 1:1 IR 대전 (3종)
          </button>
        </div>

        {tab === 'PLAZA' ? (
          <>
            <div
              style={{
                background: 'linear-gradient(180deg, #dcfce7 0%, #bbf7d0 100%)',
                border: '2px solid #4ade80',
                borderRadius: '18px',
                padding: '10px',
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                minHeight: '90px',
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
                      minWidth: '78px',
                      background: isSelected ? '#fef08a' : 'rgba(255,255,255,0.88)',
                      border: isMe
                        ? '2px solid #0284c7'
                        : isSelected
                        ? '2px solid #eab308'
                        : '1.5px solid #86efac',
                      borderRadius: '14px',
                      padding: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: isMe ? 'default' : 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ transform: 'scale(0.4)' }}>
                        <PetSprite speciesId={u.avatarId} lcdMode={false} />
                      </div>
                    </div>
                    <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#0f172a' }}>
                      {u.nickname}
                    </span>
                    <span style={{ fontSize: '10px', color: isMe ? '#0284c7' : '#16a34a', fontWeight: '700' }}>
                      {isMe ? '나' : '선물하기'}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedTarget && (
              <div
                style={{
                  background: '#fef9c3',
                  border: '1.5px solid #facc15',
                  borderRadius: '14px',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: '900', color: '#854d0e' }}>
                    🎁 [{selectedTarget.nickname}]님에게 선물 보내기
                  </span>
                  <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#a16207' }}>
                    보유 코인: {petCoins || 0}🪙
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleSendGift(selectedTarget, 'HEART')} style={giftBtnStyle}>
                    ❤️ 하트(행복+15)
                  </button>
                  <button onClick={() => handleSendGift(selectedTarget, 'CAKE')} style={giftBtnStyle}>
                    🍰 케이크(포만+15)
                  </button>
                </div>

                {/* 코인 금액 지정 영역 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                    background: 'rgba(255,255,255,0.78)',
                    padding: '6px 8px',
                    borderRadius: '10px',
                    border: '1px solid #fde047',
                  }}
                >
                  {[10, 30, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        sfx.beep();
                        setGiftCoinAmount(preset);
                      }}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '8px',
                        border: normalizedGiftCoins === preset ? '1.5px solid #ca8a04' : '1px solid #cbd5e1',
                        background: normalizedGiftCoins === preset ? '#facc15' : '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        color: '#0f172a',
                      }}
                    >
                      {preset}🪙
                    </button>
                  ))}
                  <input
                    type="number"
                    min={1}
                    max={999999}
                    value={giftCoinAmount}
                    onChange={(e) => setGiftCoinAmount(e.target.value.replace(/\D/g, ''))}
                    onBlur={() => setGiftCoinAmount(String(normalizedGiftCoins))}
                    placeholder="금액"
                    style={{
                      width: '78px',
                      padding: '4px 6px',
                      borderRadius: '8px',
                      border: '1.5px solid #eab308',
                      fontSize: '13px',
                      fontWeight: '800',
                      textAlign: 'right',
                      background: '#ffffff',
                      color: '#0f172a',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleSendGift(selectedTarget, 'COIN')}
                    style={{
                      flex: 1,
                      minWidth: '96px',
                      background: '#eab308',
                      color: '#0f172a',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '5px 8px',
                      fontSize: '12px',
                      fontWeight: '900',
                      cursor: 'pointer',
                    }}
                  >
                    🪙 {normalizedGiftCoins}코인 보내기
                  </button>
                </div>
              </div>
            )}

            <div
              style={{
                flex: 1,
                minHeight: '140px',
                maxHeight: '210px',
                overflowY: 'auto',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    fontSize: '13px',
                    background: m.isSystem ? '#fef08a' : '#ffffff',
                    border: m.isSystem ? '1px solid #facc15' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '6px 10px',
                    lineHeight: 1.4,
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

            <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <input
                type="text"
                maxLength={50}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="광장에 한줄 인사 남기기..."
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '10px 12px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#0284c7',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 18px',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                전송
              </button>
            </form>
          </>
        ) : (
          /* 1:1 IR 적외선 통신 대전 화면 (3종 모드 선택형) */
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              borderRadius: '18px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              boxSizing: 'border-box',
              overflowY: 'auto',
            }}
          >
            {/* 대전 종목 선택 바 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', width: '100%' }}>
              {BATTLE_MODES.map((m) => {
                const isSelected = activeMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSwitchBattleMode(m.id)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #0284c7' : '1.5px solid #cbd5e1',
                      background: isSelected ? '#e0f2fe' : '#ffffff',
                      color: isSelected ? '#0369a1' : '#475569',
                      fontSize: '12px',
                      fontWeight: '900',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    <span>{m.icon} {m.label}</span>
                    <span style={{ fontSize: '10.5px', fontWeight: '700', color: isSelected ? '#0284c7' : '#94a3b8' }}>
                      {hasBattleRewardLeft ? `승리 +${m.reward}🪙` : '친선전 모드'}
                    </span>
                  </button>
                );
              })}
            </div>

            {!joinedRoom ? (
              <>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a', textAlign: 'center', marginTop: '4px' }}>
                  📡 4자리 초대코드로 친구와 연결!
                </div>
                <div style={{ fontSize: '13px', color: '#475569', textAlign: 'center', lineHeight: 1.45 }}>
                  {activeMode === 'DICE' && '주사위 2개를 굴려 합이 높은 쪽이 승리! (더블 승리 시 2배 +100🪙)'}
                  {activeMode === 'DUEL' && '⚔️창 > 🔥필살기 > 🛡️방패 > ⚔️창 상성 심리전 대결!'}
                  {activeMode === 'RPS' && '같은 4자리 숫자를 입력하면 두 캐릭터가 만나 가위바위보 대결을 펼칩니다.'}
                </div>
                <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#0369a1' }}>
                  오늘 IR 코인 보상: {Math.min(irBattleWinsToday, irBattleDailyLimit)} / {irBattleDailyLimit}회
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: '10px',
                    width: '100%',
                    maxWidth: '320px',
                    boxSizing: 'border-box',
                  }}
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="8440"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      width: '100%',
                      textAlign: 'center',
                      fontSize: '18px',
                      fontWeight: '900',
                      letterSpacing: '3px',
                      padding: '10px 8px',
                      borderRadius: '12px',
                      border: '2px solid #0284c7',
                      background: '#ffffff',
                      color: '#0f172a',
                      boxSizing: 'border-box',
                      WebkitAppearance: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleJoinRoom}
                    style={{
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0 20px',
                      fontSize: '14.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    접속
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '900', color: '#0284c7' }}>
                    방 코드: [{joinedRoom}] · 보상 {Math.min(irBattleWinsToday, irBattleDailyLimit)}/{irBattleDailyLimit}회
                  </span>
                  <button
                    onClick={handleLeaveRoom}
                    style={{
                      background: '#e2e8f0',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    방 나가기
                  </button>
                </div>

                {/* 배틀 무대 */}
                <div
                  style={{
                    width: '100%',
                    height: '122px',
                    background: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)',
                    borderRadius: '16px',
                    border: '2px solid #38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    padding: '0 6px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ transform: 'scale(0.68)' }}>
                      <PetSprite speciesId={avatarId} direction={1} frame={1} actionState="HAPPY" lcdMode={false} />
                    </div>
                    <span style={{ fontSize: '12.5px', fontWeight: '900' }}>{nickname}</span>
                  </div>

                  <div
                    style={{
                      fontSize: activeMode === 'DICE' && bothChosen ? '16px' : '21px',
                      fontWeight: '900',
                      color: '#ef4444',
                      textAlign: 'center',
                    }}
                  >
                    {centerDisplay}
                  </div>

                  {oppPlayer ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ transform: 'scale(0.68)' }}>
                        <PetSprite speciesId={oppPlayer.avatarId} direction={-1} frame={0} actionState="HAPPY" lcdMode={false} />
                      </div>
                      <span style={{ fontSize: '12.5px', fontWeight: '900' }}>{oppPlayer.nickname}</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: '#475569', fontWeight: '700' }}>
                      상대 입장 대기중...
                    </div>
                  )}
                </div>

                {/* 종목별 입력 컨트롤 */}
                {oppPlayer && !bothChosen && (
                  <>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#334155', textAlign: 'center' }}>
                      {mePlayer?.choice
                        ? '상대방의 행동을 기다리는 중...'
                        : activeMode === 'DICE'
                        ? '주사위 2개를 굴려 합산 점수를 겨루세요!'
                        : activeMode === 'DUEL'
                        ? '⚔️창 > 🔥필살 > 🛡️방패 > ⚔️창 상성을 노리세요!'
                        : '가위·바위·보를 선택하세요!'}
                    </div>

                    {activeMode === 'DICE' ? (
                      <button
                        type="button"
                        disabled={Boolean(mePlayer?.choice)}
                        onClick={handleRollDice}
                        style={{
                          width: '100%',
                          padding: '13px',
                          borderRadius: '14px',
                          border: '2px solid #0284c7',
                          background: mePlayer?.choice ? '#cbd5e1' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                          color: '#ffffff',
                          fontSize: '15px',
                          fontWeight: '900',
                          cursor: mePlayer?.choice ? 'default' : 'pointer',
                        }}
                      >
                        {mePlayer?.choice
                          ? `🎲 내 결과: ${parseDice(mePlayer.choice).sum}점 (상대 대기중)`
                          : '🎲 2D6 주사위 굴리기!'}
                      </button>
                    ) : activeMode === 'DUEL' ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', width: '100%' }}>
                        {DUEL_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectBattleChoice(opt.id)}
                            style={{
                              padding: '10px 4px',
                              borderRadius: '14px',
                              border: mePlayer?.choice === opt.id ? '2.5px solid #0284c7' : '1.5px solid #cbd5e1',
                              background: mePlayer?.choice === opt.id ? '#e0f2fe' : '#ffffff',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '2px',
                            }}
                          >
                            <span style={{ fontSize: '20px' }}>{opt.icon}</span>
                            <span style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a' }}>{opt.label}</span>
                            <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b' }}>{opt.sub}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                        {RPS_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectBattleChoice(opt.id)}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: '14px',
                              border: mePlayer?.choice === opt.id ? '2.5px solid #0284c7' : '1.5px solid #cbd5e1',
                              background: mePlayer?.choice === opt.id ? '#e0f2fe' : '#ffffff',
                              fontSize: '22px',
                              cursor: 'pointer',
                            }}
                          >
                            {opt.icon}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {bothChosen && (
                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <div style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a' }}>
                      {battleResultText}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#0369a1' }}>
                      오늘 IR 코인 보상: {Math.min(irBattleWinsToday, irBattleDailyLimit)} / {irBattleDailyLimit}회
                    </div>
                    <button
                      onClick={() => {
                        if (effectiveBattleReward > 0) {
                          onWinBattleCoin(effectiveBattleReward);
                        }
                        handleResetBattleRound();
                      }}
                      style={{
                        background: effectiveBattleReward > 0 ? '#16a34a' : '#475569',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px 18px',
                        fontSize: '13.5px',
                        fontWeight: '800',
                        cursor: 'pointer',
                      }}
                    >
                      {effectiveBattleReward > 0
                        ? `+${effectiveBattleReward}🪙 보상 수령 & 다음 판`
                        : battleReward > 0
                        ? '일일 보상 소진 (친선 다음 판)'
                        : '다음 판 준비'}
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
  border: '1.5px solid #eab308',
  borderRadius: '10px',
  padding: '7px 6px',
  fontSize: '12px',
  fontWeight: '800',
  cursor: 'pointer',
  color: '#0f172a',
};