import React, { useState, useEffect } from 'react';
import { sfx } from './sound';

const GAME_TYPES = ['CATCH', 'HIGHLOW', 'DODGE'];

export default function MiniGame({ winStreak = 0, onFinish, onClose }) {
  const [gameType] = useState(
    () => GAME_TYPES[Math.floor(Math.random() * GAME_TYPES.length)]
  );

  // 1) 퍼펙트 캐치 상태
  const [cursorPos, setCursorPos] = useState(0);
  const [cursorDir, setCursorDir] = useState(1);

  // 2) 하이로우 숫자 예측 상태
  const [baseNum] = useState(() => Math.floor(Math.random() * 7) + 2); // 2~8

  // 3) 좌우 피하기 상태
  const [playerLane, setPlayerLane] = useState(1); // 0:좌, 1:중, 2:우
  const [meteorLane] = useState(() => Math.floor(Math.random() * 3));
  const [meteorY, setMeteorY] = useState(0);

  useEffect(() => {
    if (gameType === 'CATCH') {
      const t = setInterval(() => {
        setCursorPos((p) => {
          if (p >= 90) {
            setCursorDir(-1);
            return 85;
          }
          if (p <= 0) {
            setCursorDir(1);
            return 5;
          }
          return p + cursorDir * 10;
        });
      }, 65);
      return () => clearInterval(t);
    }

    if (gameType === 'DODGE') {
      const t = setInterval(() => {
        setMeteorY((y) => {
          if (y >= 4) {
            clearInterval(t);
            const survived = playerLane !== meteorLane;
            finishGame(survived, survived ? '회피 성공!' : '충돌 앗!');
            return 4;
          }
          return y + 1;
        });
      }, 280);
      return () => clearInterval(t);
    }
  }, [gameType, cursorDir, playerLane, meteorLane]);

  const finishGame = (isWin, label) => {
    if (isWin) {
      sfx.win();
      const nextStreak = winStreak + 1;
      const isStreakBonus = nextStreak >= 3;
      const coins = isStreakBonus ? 30 : 15;
      const bonusWins = isStreakBonus ? 2 : 1;
      onFinish(
        25,
        isStreakBonus ? `${label} (${nextStreak}연승! 승+2)` : label,
        coins,
        bonusWins,
        true
      );
    } else {
      sfx.beep();
      onFinish(10, label, 5, 0, false);
    }
  };

  // 1) 퍼펙트 캐치 UI
  if (gameType === 'CATCH') {
    const handleStop = (e) => {
      e.stopPropagation();
      const isHit = cursorPos >= 35 && cursorPos <= 65;
      finishGame(isHit, isHit ? '퍼펙트 캐치!' : '아깝다!');
    };

    return (
      <div style={wrapStyle}>
        <div style={titleStyle}>[퍼펙트 캐치]</div>
        <div style={{ fontSize: '7.5px' }}>중앙 노란 칸에 멈춰라!</div>
        <div
          style={{
            width: '92%',
            height: '14px',
            border: '1.5px solid #1e293b',
            borderRadius: '4px',
            position: 'relative',
            background: 'rgba(255,255,255,0.45)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '35%',
              width: '30%',
              height: '100%',
              background: '#facc15',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${cursorPos}%`,
              width: '10%',
              height: '100%',
              background: '#ef4444',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '4px', width: '92%' }}>
          <button onClick={handleStop} style={btnStyle}>
            🎯 멈춤!
          </button>
          <button onClick={onClose} style={subBtnStyle}>
            닫기
          </button>
        </div>
      </div>
    );
  }

  // 2) 하이로우 숫자 예측 UI
  if (gameType === 'HIGHLOW') {
    const handleGuess = (guessHigh) => {
      let nextNum = Math.floor(Math.random() * 9) + 1;
      if (nextNum === baseNum) nextNum = baseNum < 5 ? baseNum + 1 : baseNum - 1;
      const isWin = guessHigh ? nextNum > baseNum : nextNum < baseNum;
      finishGame(isWin, `${baseNum}→${nextNum} ${isWin ? '적중!' : '실패!'}`);
    };

    return (
      <div style={wrapStyle}>
        <div style={titleStyle}>[하이 & 로우]</div>
        <div style={{ fontSize: '13px', fontWeight: '900' }}>기준: {baseNum} vs ?</div>
        <div style={{ display: 'flex', gap: '4px', width: '94%' }}>
          <button onClick={() => handleGuess(true)} style={btnStyle}>
            ▲ 크다
          </button>
          <button onClick={() => handleGuess(false)} style={btnStyle}>
            ▼ 작다
          </button>
        </div>
      </div>
    );
  }

  // 3) 별똥별 피하기 UI
  return (
    <div style={wrapStyle}>
      <div style={titleStyle}>[별똥별 피하기]</div>
      <div
        style={{
          width: '90%',
          height: '44px',
          border: '1px solid #1e293b',
          borderRadius: '4px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          position: 'relative',
          background: 'rgba(255,255,255,0.35)',
        }}
      >
        {[0, 1, 2].map((lane) => (
          <div
            key={lane}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '2px 0',
              fontSize: '10px',
            }}
          >
            <span>{meteorLane === lane ? '☄️' : ''}</span>
            <span>{playerLane === lane ? '🐣' : ''}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '4px', width: '90%' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            sfx.beep();
            setPlayerLane((l) => Math.max(0, l - 1));
          }}
          style={btnStyle}
        >
          ◀ 좌
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            sfx.beep();
            setPlayerLane((l) => Math.min(2, l + 1));
          }}
          style={btnStyle}
        >
          우 ▶
        </button>
      </div>
    </div>
  );
}

const wrapStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  color: '#0f172a',
};

const titleStyle = {
  fontSize: '9px',
  fontWeight: '900',
};

const btnStyle = {
  flex: 1,
  background: '#1e293b',
  color: '#f8fafc',
  border: 'none',
  borderRadius: '4px',
  padding: '3px 4px',
  fontSize: '8.5px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const subBtnStyle = {
  background: 'rgba(15,23,42,0.15)',
  color: '#0f172a',
  border: '1px solid #334155',
  borderRadius: '4px',
  padding: '3px 6px',
  fontSize: '8px',
  cursor: 'pointer',
};
