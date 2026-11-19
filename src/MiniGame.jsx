import React, { useState, useEffect } from 'react';
import { sfx } from './sound';

const RPS_OPTIONS = [
  { id: 'SCISSORS', label: '✌️', beats: 'PAPER' },
  { id: 'ROCK', label: '✊', beats: 'SCISSORS' },
  { id: 'PAPER', label: '🖐️', beats: 'ROCK' },
];

export default function MiniGame({ onFinish }) {
  const [mode, setMode] = useState('RPS'); // 'RPS' | 'LOOK' | 'TIMING'
  const [resultText, setResultText] = useState('가위바위보!');
  const [locked, setLocked] = useState(false);

  // 타이밍 캐치 상태 (0 ~ 100 왕복)
  const [cursorPos, setCursorPos] = useState(0);
  const [cursorDir, setCursorDir] = useState(1);

  useEffect(() => {
    if (mode !== 'TIMING' || locked) return;
    const timer = setInterval(() => {
      setCursorPos((prev) => {
        let next = prev + cursorDir * 6.5;
        if (next >= 100) {
          next = 100;
          setCursorDir(-1);
        } else if (next <= 0) {
          next = 0;
          setCursorDir(1);
        }
        return next;
      });
    }, 45);
    return () => clearInterval(timer);
  }, [mode, locked, cursorDir]);

  const switchMode = (nextMode, title) => {
    if (locked) return;
    sfx.beep();
    setMode(nextMode);
    setResultText(title);
    setCursorPos(0);
    setCursorDir(1);
  };

  const playRps = (userChoice) => {
    if (locked) return;
    setLocked(true);
    sfx.beep();

    const petChoice = RPS_OPTIONS[Math.floor(Math.random() * RPS_OPTIONS.length)];
    if (userChoice.id === petChoice.id) {
      setResultText(`펫:${petChoice.label} 비김!`);
      setTimeout(() => onFinish(10, '비겼어! 🤝', 5), 850);
    } else if (userChoice.beats === petChoice.id) {
      sfx.win();
      setResultText(`펫:${petChoice.label} 승리!`);
      setTimeout(() => onFinish(25, '내가 졌다! 🎉', 15), 850);
    } else {
      setResultText(`펫:${petChoice.label} 패배!`);
      setTimeout(() => onFinish(10, '내가 이겼다! 🏆', 5), 850);
    }
  };

  const playLook = (dir) => {
    if (locked) return;
    setLocked(true);
    sfx.beep();

    const petDir = Math.random() < 0.5 ? 'LEFT' : 'RIGHT';
    const label = petDir === 'LEFT' ? '⬅️' : '➡️';
    if (dir === petDir) {
      sfx.win();
      setResultText(`펫:${label} 적중!`);
      setTimeout(() => onFinish(25, '어떻게 알았지?! 😲', 15), 850);
    } else {
      setResultText(`펫:${label} 빗나감!`);
      setTimeout(() => onFinish(10, '메롱~ 😜', 5), 850);
    }
  };

  const stopTiming = () => {
    if (locked) return;
    setLocked(true);

    // 1단계: PERFECT (정중앙 빨간 테두리 박스 46 ~ 54 -> +15코인)
    if (cursorPos >= 46 && cursorPos <= 54) {
      sfx.win();
      setResultText('★ PERFECT!! ★');
      setTimeout(() => onFinish(25, '퍼펙트 캐치! ⚡', 15), 850);
    }
    // 2단계: NICE (좌우 초록 테두리 박스 35 ~ 65 -> 승리 인정 +10코인)
    else if (cursorPos >= 35 && cursorPos <= 65) {
      sfx.win();
      setResultText('✨ NICE! ✨');
      setTimeout(() => onFinish(20, '나이스 캐치! 🎯', 10), 850);
    }
    // 3단계: GOOD (외곽 검은 트랙 -> +5코인)
    else {
      sfx.beep();
      setResultText('👍 GOOD!');
      setTimeout(() => onFinish(10, '굿! 아쉽다 😅', 5), 850);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#0f172a',
        padding: '1px 0',
      }}
    >
      {/* 3종 미니게임 전환 탭 */}
      <div style={{ display: 'flex', gap: '2px', width: '100%' }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            switchMode('RPS', '가위바위보!');
          }}
          style={tabStyle(mode === 'RPS')}
        >
          가위
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            switchMode('LOOK', '어딜 볼까?');
          }}
          style={tabStyle(mode === 'LOOK')}
        >
          방향
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            switchMode('TIMING', '빨간 칸에 멈춰라!');
          }}
          style={tabStyle(mode === 'TIMING')}
        >
          타이밍
        </button>
      </div>

      {/* 안내 및 결과 문구 */}
      <div style={{ fontSize: '9px', fontWeight: 'bold', textAlign: 'center' }}>{resultText}</div>

      {/* 1. 가위바위보 */}
      {mode === 'RPS' && (
        <div style={{ display: 'flex', gap: '4px' }}>
          {RPS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playRps(opt);
              }}
              disabled={locked}
              style={emojiBtnStyle}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* 2. 방향 맞추기 */}
      {mode === 'LOOK' && (
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playLook('LEFT');
            }}
            disabled={locked}
            style={emojiBtnStyle}
          >
            ⬅️ 왼쪽
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playLook('RIGHT');
            }}
            disabled={locked}
            style={emojiBtnStyle}
          >
            ➡️ 오른쪽
          </button>
        </div>
      )}

      {/* 3. 타이밍 캐치 (첨부 이미지 기반: 검정 전체 바 + 좌우 초록 NICE 박스 + 중앙 빨강 PERFECT 박스) */}
      {mode === 'TIMING' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
          <div style={{ position: 'relative', width: '100%', paddingTop: '5px' }}>
            {/* 상단 이동 화살표 마커 */}
            <div
              style={{
                position: 'absolute',
                left: `calc(${cursorPos}% - 3px)`,
                top: '-1px',
                width: 0,
                height: 0,
                borderLeft: '3px solid transparent',
                borderRight: '3px solid transparent',
                borderTop: '5px solid #0f172a',
                zIndex: 4,
              }}
            />

            {/* 전체 검정 테두리 게이지 바 */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '13px',
                border: '2px solid #0f172a',
                background: '#ffffff',
                boxSizing: 'border-box',
              }}
            >
              {/* 좌측 초록 NICE 박스 (35% ~ 46%) */}
              <div
                style={{
                  position: 'absolute',
                  left: '35%',
                  width: '11%',
                  height: '100%',
                  border: '2px solid #16a34a',
                  background: 'rgba(34, 197, 94, 0.14)',
                  boxSizing: 'border-box',
                  zIndex: 1,
                }}
              />

              {/* 정중앙 빨강 PERFECT 박스 (46% ~ 54%) */}
              <div
                style={{
                  position: 'absolute',
                  left: '46%',
                  width: '8%',
                  height: '100%',
                  border: '2px solid #dc2626',
                  background: 'rgba(239, 68, 68, 0.18)',
                  boxSizing: 'border-box',
                  zIndex: 2,
                }}
              />

              {/* 우측 초록 NICE 박스 (54% ~ 65%) */}
              <div
                style={{
                  position: 'absolute',
                  left: '54%',
                  width: '11%',
                  height: '100%',
                  border: '2px solid #16a34a',
                  background: 'rgba(34, 197, 94, 0.14)',
                  boxSizing: 'border-box',
                  zIndex: 1,
                }}
              />

              {/* 왕복 판정 커서 바 */}
              <div
                style={{
                  position: 'absolute',
                  left: `calc(${cursorPos}% - 1.5px)`,
                  top: 0,
                  width: '3px',
                  height: '100%',
                  background: '#0f172a',
                  zIndex: 3,
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              stopTiming();
            }}
            disabled={locked}
            style={stopBtnStyle}
          >
            STOP! 멈추기
          </button>
        </div>
      )}
    </div>
  );
}

const tabStyle = (active) => ({
  flex: 1,
  background: active ? '#1e293b' : 'rgba(255,255,255,0.45)',
  color: active ? '#f8fafc' : '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '3px',
  fontSize: '7.8px',
  padding: '1px 1px',
  cursor: 'pointer',
});

const emojiBtnStyle = {
  background: 'rgba(255,255,255,0.55)',
  border: '1.5px solid #1e293b',
  borderRadius: '4px',
  padding: '2px 5px',
  fontSize: '10.5px',
  cursor: 'pointer',
  filter: 'grayscale(100%) contrast(180%)',
};

const stopBtnStyle = {
  width: '100%',
  background: '#1e293b',
  color: '#f8fafc',
  border: 'none',
  borderRadius: '3px',
  padding: '2.5px 0',
  fontSize: '8.5px',
  fontWeight: 'bold',
  cursor: 'pointer',
};