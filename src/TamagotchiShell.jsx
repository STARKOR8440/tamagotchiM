import React from 'react';

export const SHELL_SKINS = {
  SODA_BLUE: {
    id: 'SODA_BLUE',
    name: '소다 버블',
    price: 0,
    bodyBg: 'radial-gradient(circle at 35% 25%, #bae6fd 0%, #7dd3fc 55%, #38bdf8 100%)',
    border: '#0284c7',
    antenna: '#7dd3fc',
    irPort: '#7f1d1d',
    bezelBg: '#fef08a',
    bezelBorder: '#3b82f6',
    lcdBg: '#cbd5c0',
    btnColor: '#2dd4bf',
    btnBorder: '#0f766e',
    pattern: 'radial-gradient(rgba(255,255,255,0.55) 14%, transparent 15%), radial-gradient(rgba(14,116,144,0.25) 18%, transparent 19%)',
    patternSize: '36px 36px',
  },
  PINK_ICE: {
    id: 'PINK_ICE',
    name: '핑크 스위트',
    price: 100,
    bodyBg: 'radial-gradient(circle at 35% 25%, #fbcfe8 0%, #f472b6 60%, #db2777 100%)',
    border: '#be185d',
    antenna: '#f472b6',
    irPort: '#7f1d1d',
    bezelBg: '#fde047',
    bezelBorder: '#2563eb',
    lcdBg: '#cbd5c0',
    btnColor: '#facc15',
    btnBorder: '#b45309',
    pattern: 'radial-gradient(rgba(254,240,138,0.45) 12%, transparent 13%), radial-gradient(rgba(59,130,246,0.3) 14%, transparent 15%)',
    patternSize: '32px 32px',
  },
  RAINBOW_POP: {
    id: 'RAINBOW_POP',
    name: '레인보우 팝',
    price: 200,
    bodyBg: 'linear-gradient(135deg, #ef4444 0%, #ef4444 26%, #facc15 26%, #facc15 48%, #22c55e 48%, #22c55e 72%, #3b82f6 72%, #3b82f6 100%)',
    border: '#b91c1c',
    antenna: '#0284c7',
    irPort: '#7f1d1d',
    bezelBg: '#38bdf8',
    bezelBorder: '#0369a1',
    lcdBg: '#d4dcc8',
    btnColor: '#7e22ce',
    btnBorder: '#4c1d95',
    pattern: 'radial-gradient(rgba(255,255,255,0.35) 10%, transparent 11%)',
    patternSize: '28px 28px',
  },
  CLEAR_90S: {
    id: 'CLEAR_90S',
    name: '클리어 레트로',
    price: 300,
    bodyBg: 'linear-gradient(145deg, rgba(255,255,255,0.82) 0%, rgba(226,232,240,0.72) 50%, rgba(203,213,225,0.85) 100%)',
    border: '#94a3b8',
    antenna: 'rgba(255,255,255,0.85)',
    irPort: '#881337',
    bezelBg: '#facc15',
    bezelBorder: '#ca8a04',
    lcdBg: '#cbd5c0',
    btnColor: '#ec4899',
    btnBorder: '#9d174d',
    pattern: 'repeating-linear-gradient(45deg, rgba(59,130,246,0.18) 0px, rgba(59,130,246,0.18) 6px, rgba(236,72,153,0.18) 6px, rgba(236,72,153,0.18) 12px)',
    patternSize: '40px 40px',
  },
};

const MENU_ICONS = [
  { id: 'FEED', icon: '🍖', label: '식사' },
  { id: 'PLAY', icon: '🎾', label: '놀이' },
  { id: 'CLEAN', icon: '🧹', label: '청소' },
  { id: 'SHOP', icon: '🏪', label: '상점' },
  { id: 'STATUS', icon: '📊', label: '상태' },
  { id: 'DEX', icon: '📖', label: '도감' },
];

export default function TamagotchiShell({
  skinKey,
  coins = 0,
  selectedMenuIdx,
  onPressA,
  onPressB,
  onPressC,
  onSelectMenu,
  children,
}) {
  const skin = SHELL_SKINS[skinKey] || SHELL_SKINS.SODA_BLUE;

  return (
    <div
      style={{
        position: 'relative',
        width: '248px',
        height: '305px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
      }}
    >
      {/* 좌측 상단 안테나 */}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          left: '34px',
          width: '24px',
          height: '48px',
          background: skin.antenna,
          border: `3px solid ${skin.border}`,
          borderRadius: '14px 14px 4px 4px',
          boxShadow: 'inset 3px 3px 6px rgba(255,255,255,0.6)',
          zIndex: 1,
        }}
      />

      {/* 우측 상단 볼체인 고리 (장식 전용) */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '36px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          border: '3px solid #cbd5e1',
          background: 'rgba(255,255,255,0.4)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* 달걀형 메인 바디 */}
      <div
        style={{
          position: 'relative',
          marginTop: '16px',
          width: '236px',
          height: '284px',
          borderRadius: '50% 50% 47% 47% / 56% 56% 44% 44%',
          backgroundColor: '#fff',
          backgroundImage: `${skin.pattern}, ${skin.bodyBg}`,
          backgroundSize: `${skin.patternSize}, 100% 100%`,
          border: `3.5px solid ${skin.border}`,
          boxShadow:
            '0 14px 28px rgba(0,0,0,0.45), inset 0 8px 14px rgba(255,255,255,0.65), inset 0 -10px 16px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '10px',
          boxSizing: 'border-box',
          zIndex: 2,
        }}
      >
        {/* 상단 적외선 포트 */}
        <div
          style={{
            width: '74px',
            height: '11px',
            background: skin.irPort,
            borderRadius: '20px 20px 6px 6px',
            border: '2px solid rgba(0,0,0,0.35)',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)',
            marginBottom: '4px',
          }}
        />

        {/* 로고 */}
        <div
          style={{
            fontSize: '12px',
            fontWeight: '900',
            fontStyle: 'italic',
            color: '#fff',
            textShadow: '0 1.5px 0 #1e3a8a, -1px -1px 0 #1e3a8a, 1px -1px 0 #1e3a8a, -1px 1px 0 #1e3a8a',
            letterSpacing: '0.3px',
            marginBottom: '6px',
            lineHeight: 1.05,
            textAlign: 'center',
          }}
        >
          Tamagotchi
          <div style={{ fontSize: '7.5px', letterSpacing: '1.2px', color: '#fef08a' }}>CONNECTION</div>
        </div>

        {/* 중앙 사각 컬러 베젤 */}
        <div
          style={{
            width: '148px',
            height: '146px',
            background: skin.bezelBg,
            border: `3px solid ${skin.bezelBorder}`,
            borderRadius: skinKey === 'CLEAR_90S' ? '6px' : '16px',
            transform: skinKey === 'CLEAR_90S' ? 'rotate(-2deg)' : 'none',
            padding: '7px',
            boxSizing: 'border-box',
            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* LCD 액정 화면 */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background: skin.lcdBg,
              border: '2px solid #64748b',
              borderRadius: '6px',
              boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.28)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '3px 4px',
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* 상단 6개 메뉴 아이콘 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px dashed rgba(30,41,59,0.25)',
                paddingBottom: '2px',
              }}
            >
              {MENU_ICONS.map((m, idx) => {
                const isSelected = selectedMenuIdx === idx;
                return (
                  <span
                    key={m.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMenu(idx);
                    }}
                    title={m.label}
                    style={{
                      fontSize: '10.5px',
                      cursor: 'pointer',
                      opacity: isSelected ? 1 : 0.35,
                      transform: isSelected ? 'scale(1.2)' : 'scale(0.95)',
                      filter: 'grayscale(100%) contrast(160%)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {m.icon}
                  </span>
                );
              })}
            </div>

            {/* 중앙 콘텐츠 영역 */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {children}
            </div>

            {/* 하단 메뉴명 & 보유 코인 표시 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px dashed rgba(30,41,59,0.25)',
                paddingTop: '1px',
                fontSize: '8.5px',
                fontWeight: '800',
                color: '#1e293b',
                fontFamily: 'monospace',
              }}
            >
              <span>[{MENU_ICONS[selectedMenuIdx].label}]</span>
              <span>🪙{coins}</span>
            </div>
          </div>
        </div>

        {/* 하단 물리 버튼 3개 */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '12px',
            alignItems: 'center',
          }}
        >
          <PhysicalButton label="A" title="메뉴 이동" color={skin.btnColor} border={skin.btnBorder} onClick={onPressA} />
          <PhysicalButton
            label="B"
            title="선택 / 실행"
            color={skin.btnColor}
            border={skin.btnBorder}
            onClick={onPressB}
            offsetY={4}
          />
          <PhysicalButton label="C" title="취소 / 닫기" color={skin.btnColor} border={skin.btnBorder} onClick={onPressC} />
        </div>
      </div>
    </div>
  );
}

function PhysicalButton({ label, title, color, border, onClick, offsetY = 0 }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={title}
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: color,
        border: `2.5px solid ${border}`,
        boxShadow: '0 3px 0 rgba(0,0,0,0.35), inset 0 2px 3px rgba(255,255,255,0.65)',
        cursor: 'pointer',
        transform: `translateY(${offsetY}px)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '8px',
        fontWeight: '900',
        color: 'rgba(0,0,0,0.55)',
        padding: 0,
      }}
    >
      {label}
    </button>
  );
}