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
  // 코믹 팝 (해금 조건: 100 코인)
  COMIC_POP: {
    id: 'COMIC_POP',
    name: '코믹 팝',
    price: 100,
    bodyBg: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    border: '#0f172a',
    antenna: '#ef4444',
    irPort: '#0f172a',
    bezelBg: '#0f172a',
    bezelBorder: '#000000',
    lcdBg: '#d8dec8',
    btnColor: '#1d4ed8',
    btnBorder: '#0f172a',
    pattern: 'radial-gradient(rgba(15,23,42,0.12) 15%, transparent 16%)',
    patternSize: '10px 10px',
  },
  MATCHA_LATTE: {
    id: 'MATCHA_LATTE',
    name: '말차 라떼',
    price: 150,
    bodyBg: 'radial-gradient(circle at 35% 25%, #dcfce7 0%, #86efac 55%, #22c55e 100%)',
    border: '#15803d',
    antenna: '#86efac',
    irPort: '#7f1d1d',
    bezelBg: '#fef3c7',
    bezelBorder: '#b45309',
    lcdBg: '#d4dcc8',
    btnColor: '#fb923c',
    btnBorder: '#c2410c',
    pattern: 'radial-gradient(rgba(255,255,255,0.5) 16%, transparent 17%)',
    patternSize: '30px 30px',
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
  // 스낵 팝콘 (해금 조건: 250 코인)
  GRAPE_JELLY: {
    id: 'GRAPE_JELLY',
    name: '스낵 팝콘',
    price: 250,
    bodyBg: 'radial-gradient(circle at 35% 25%, rgba(251, 146, 60, 0.88) 0%, rgba(234, 88, 12, 0.92) 55%, rgba(154, 52, 18, 0.96) 100%)',
    border: '#9a3412',
    antenna: 'rgba(234, 88, 12, 0.85)',
    irPort: '#7c2d12',
    bezelBg: '#facc15',
    bezelBorder: '#ca8a04',
    lcdBg: '#e2e8f0',
    btnColor: '#ea580c',
    btnBorder: '#9a3412',
    pattern: 'radial-gradient(rgba(255,255,255,0.22) 10%, transparent 12%)',
    patternSize: '26px 26px',
  },
  // 1996 레트로 (해금 조건: 300 코인)
  CLEAR_90S: {
    id: 'CLEAR_90S',
    name: '1996 레트로',
    price: 300,
    bodyBg: 'radial-gradient(circle at 35% 45%, #ec4899 0%, #db2777 65%, #be185d 100%)',
    border: '#9d174d',
    antenna: 'rgba(203, 213, 225, 0.85)',
    irPort: '#1e3a8a',
    bezelBg: '#38bdf8',
    bezelBorder: '#0284c7',
    lcdBg: '#e2e8f0',
    btnColor: '#facc15',
    btnBorder: '#b45309',
    pattern: 'radial-gradient(rgba(255,255,255,0.45) 8%, transparent 10%)',
    patternSize: '24px 24px',
  },
  // 오로라 엔젤 (해금 조건: 350 코인)
  PINK_ICE: {
    id: 'PINK_ICE',
    name: '오로라 엔젤',
    price: 350,
    bodyBg: 'radial-gradient(circle at 45% 30%, rgba(248, 250, 252, 0.92) 0%, rgba(226, 232, 240, 0.88) 55%, rgba(203, 213, 225, 0.94) 100%)',
    border: '#94a3b8',
    antenna: 'rgba(241, 245, 249, 0.9)',
    irPort: '#cbd5e1',
    bezelBg: '#e2e8f0',
    bezelBorder: '#64748b',
    lcdBg: '#cce7f5',
    btnColor: '#ffffff',
    btnBorder: '#94a3b8',
    pattern: 'radial-gradient(rgba(255,255,255,0.85) 10%, transparent 12%), radial-gradient(rgba(244,114,182,0.22) 14%, transparent 16%)',
    patternSize: '22px 22px',
  },
  // 엔젤 가든 (해금 조건: 500 코인)
  ANGEL_GARDEN: {
    id: 'ANGEL_GARDEN',
    name: '엔젤 가든',
    price: 500,
    bodyBg: 'radial-gradient(circle at 50% 25%, #273473 0%, #172052 55%, #0e1438 100%)',
    border: '#090d26',
    antenna: '#273473',
    irPort: '#1e1b4b',
    bezelBg: '#19225c',
    bezelBorder: '#38bdf8',
    lcdBg: '#cce7f5',
    btnColor: '#99f6e4',
    btnBorder: '#0d9488',
    pattern: 'radial-gradient(rgba(254,240,138,0.65) 6%, transparent 8%)',
    patternSize: '42px 42px',
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

// 1. 함수 선언부 props에 onOpenGuide 추가
export default function TamagotchiShell({
  skinKey,
  coins = 0,
  selectedMenuIdx,
  onPressA,
  onPressB,
  onPressC,
  onSelectMenu,
  onOpenGuide,
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

      {/* 2. 우측 상단 볼체인 고리 -> 클릭 가능한 사용 가이드(?) 버튼 */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenGuide?.();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        title="사용 가이드 열기"
        style={{
          position: 'absolute',
          top: '5px',
          right: '32px',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          border: `2.5px solid ${skin.border}`,
          background: '#fef08a',
          color: '#0f172a',
          fontSize: '11px',
          fontWeight: '900',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.35)',
          padding: 0,
          zIndex: 10,
        }}
      >
        ?
      </button>

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
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        {/* 오로라 엔젤(PINK_ICE) 전용 커스텀 아트 오버레이 */}
        {skinKey === 'PINK_ICE' && (
          <svg
            width="236"
            height="284"
            viewBox="0 0 236 284"
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}
          >
            <polygon points="34,42 74,26 84,56 42,74" fill="#fbcfe8" opacity="0.68" />
            <polygon points="154,28 198,46 186,82 146,62" fill="#bae6fd" opacity="0.68" />
            <polygon points="18,162 56,174 48,224 14,208" fill="#a5f3fc" opacity="0.62" />
            <polygon points="182,166 220,158 216,214 176,204" fill="#f5d0fe" opacity="0.65" />
            <polygon points="88,226 142,222 152,256 96,262" fill="#e0e7ff" opacity="0.7" />
            <polygon points="48,218 82,212 76,246 42,242" fill="#fde68a" opacity="0.55" />
            <path
              d="M 42 104 C 14 92, 6 116, 24 126 C 10 132, 14 148, 34 146 C 24 156, 34 166, 44 156 Z"
              fill="#ffffff"
              stroke="#f9a8d4"
              strokeWidth="1.6"
            />
            <path
              d="M 38 112 C 20 105, 16 118, 28 124"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 194 104 C 222 92, 230 116, 212 126 C 226 132, 222 148, 202 146 C 212 156, 202 166, 192 156 Z"
              fill="#ffffff"
              stroke="#bae6fd"
              strokeWidth="1.6"
            />
            <path
              d="M 198 112 C 216 105, 220 118, 208 124"
              fill="none"
              stroke="#f9a8d4"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <ellipse cx="48" cy="186" rx="8" ry="3" fill="none" stroke="#facc15" strokeWidth="1.5" />
            <ellipse cx="188" cy="186" rx="8" ry="3" fill="none" stroke="#facc15" strokeWidth="1.5" />
            {[
              { x: 108, y: 18, s: 5 },
              { x: 156, y: 54, s: 4 },
              { x: 32, y: 84, s: 4 },
              { x: 204, y: 86, s: 4 },
              { x: 162, y: 232, s: 5 },
              { x: 64, y: 238, s: 4 },
            ].map((sp, i) => (
              <path
                key={i}
                d={`M ${sp.x} ${sp.y - sp.s} L ${sp.x + 1.5} ${sp.y - 1.5} L ${sp.x + sp.s} ${sp.y} L ${sp.x + 1.5} ${sp.y + 1.5} L ${sp.x} ${sp.y + sp.s} L ${sp.x - 1.5} ${sp.y + 1.5} L ${sp.x - sp.s} ${sp.y} L ${sp.x - 1.5} ${sp.y - 1.5} Z`}
                fill="#ffffff"
              />
            ))}
          </svg>
        )}

        {/* 스낵 팝콘(GRAPE_JELLY) 전용 커스텀 아트 오버레이 */}
        {skinKey === 'GRAPE_JELLY' && (
          <svg
            width="236"
            height="284"
            viewBox="0 0 236 284"
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}
          >
            <polygon
              points="96,4 102,15 114,8 109,20 120,24 108,28 112,38 101,31 94,39 95,27 83,24 94,18"
              fill="#2563eb"
            />
            <polygon
              points="132,12 135,19 143,19 137,24 139,31 132,27 125,31 127,24 121,19 129,19"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.8"
            />
            <g transform="translate(34, 62) rotate(-25)">
              <rect x="0" y="2" width="38" height="12" rx="6" fill="#fde68a" stroke="#b45309" strokeWidth="1.2" />
              <rect x="2" y="5" width="34" height="6" rx="3" fill="#dc2626" />
              <path d="M 5 8 Q 10 5 15 8 T 25 8 T 33 8" fill="none" stroke="#facc15" strokeWidth="1.5" />
            </g>
            <polygon points="32,86 38,94 46,90 42,99 50,104 40,106 38,114 32,107 24,111 28,102 20,97 29,95" fill="#2563eb" />
            <g transform="translate(14, 118)">
              <path d="M 4 12 Q 18 2 32 12 Z" fill="#fcd34d" stroke="#b45309" strokeWidth="1.2" />
              <rect x="3" y="12" width="30" height="3" rx="1.5" fill="#4ade80" />
              <rect x="4" y="15" width="28" height="4" rx="2" fill="#78350f" />
              <path d="M 4 19 L 32 19 Q 30 24 18 24 Q 6 24 4 19 Z" fill="#fcd34d" stroke="#b45309" strokeWidth="1.2" />
            </g>
            <g transform="translate(174, 54) rotate(22)">
              <polygon points="0,0 28,6 10,34" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
              <rect x="-2" y="-2" width="32" height="5" rx="2" fill="#f59e0b" />
              <circle cx="12" cy="11" r="2.8" fill="#dc2626" />
              <circle cx="16" cy="20" r="2.5" fill="#dc2626" />
            </g>
            <polygon points="204,88 212,94 220,90 215,99 222,106 212,106 208,115 203,106 194,108 199,99 193,92 202,93" fill="#2563eb" />
            <g transform="translate(192, 122)">
              <rect x="4" y="0" width="3" height="14" fill="#facc15" transform="rotate(-12 4 0)" />
              <rect x="9" y="-2" width="3" height="15" fill="#fde047" />
              <rect x="14" y="0" width="3" height="14" fill="#facc15" transform="rotate(10 14 0)" />
              <rect x="19" y="2" width="3" height="13" fill="#eab308" transform="rotate(18 19 2)" />
              <polygon points="2,10 24,10 21,24 5,24" fill="#ef4444" stroke="#991b1b" strokeWidth="1.2" />
            </g>
            <path d="M 10 205 Q 118 228 226 205 L 226 284 L 10 284 Z" fill="#ffffff" />
            <path d="M 12 201 Q 118 224 224 201" fill="none" stroke="#fef08a" strokeWidth="4" />
            {[
              { x: 52, y: 230 },
              { x: 102, y: 218 },
              { x: 180, y: 228 },
            ].map((pop, idx) => (
              <g key={idx} transform={`translate(${pop.x}, ${pop.y})`}>
                <path
                  d="M -6 -4 C -10 -10, -2 -14, 2 -8 C 7 -13, 14 -8, 10 -2 C 15 3, 10 11, 4 8 C 0 13, -8 10, -6 4 C -12 2, -11 -4, -6 -4 Z"
                  fill="#fef9c3"
                  stroke="#2563eb"
                  strokeWidth="2.2"
                />
                <circle cx="0" cy="0" r="2" fill="#facc15" />
              </g>
            ))}
          </svg>
        )}

        {/* 1996 레트로(CLEAR_90S) 전용 커스텀 아트 오버레이 */}
        {skinKey === 'CLEAR_90S' && (
          <svg
            width="236"
            height="284"
            viewBox="0 0 236 284"
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}
          >
            <path d="M 18 76 Q 118 96 218 76 L 218 0 L 18 0 Z" fill="rgba(226, 232, 240, 0.86)" />
            <circle cx="58" cy="36" r="1.5" fill="#ffffff" />
            <circle cx="82" cy="52" r="2" fill="#ffffff" />
            <circle cx="154" cy="48" r="1.8" fill="#ffffff" />
            <circle cx="176" cy="34" r="1.5" fill="#ffffff" />
            <circle cx="118" cy="64" r="1.5" fill="#bae6fd" />
            <polygon points="16,74 74,104 68,112 12,82" fill="#facc15" />
            <polygon points="12,82 68,112 62,124 8,94" fill="#f5d0fe" opacity="0.85" />
            <polygon points="220,74 162,104 168,112 224,82" fill="#facc15" />
            <polygon points="224,82 168,112 174,124 228,94" fill="#f5d0fe" opacity="0.85" />
            <polygon points="105,284 236,184 236,284" fill="rgba(226, 232, 240, 0.85)" />
            <polygon points="105,284 236,184 236,194 118,284" fill="#f5d0fe" opacity="0.9" />
            <text
              x="148"
              y="246"
              fontSize="15"
              fontWeight="900"
              fontStyle="italic"
              fill="#db2777"
              stroke="#ffffff"
              strokeWidth="2.5"
              paintOrder="stroke"
              transform="rotate(-28 168 238)"
            >
              TMGC
            </text>
            <polygon points="24,142 27,150 36,150 29,155 31,163 24,158 17,163 19,155 12,150 21,150" fill="#facc15" />
            <polygon points="34,166 36,171 42,171 37,174 39,179 34,176 29,179 31,174 26,171 32,171" fill="#fde047" />
            <polygon points="208,136 211,144 220,144 213,149 215,157 208,152 201,157 203,149 196,144 205,144" fill="#facc15" />
            <circle cx="196" cy="128" r="2.2" fill="#fde047" />
            <circle cx="204" cy="166" r="2" fill="#facc15" />
          </svg>
        )}

        {/* 엔젤 가든(ANGEL_GARDEN) 전용 커스텀 아트 오버레이 */}
        {skinKey === 'ANGEL_GARDEN' && (
          <svg
            width="236"
            height="284"
            viewBox="0 0 236 284"
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}
          >
            <path d="M 48 64 Q 118 28 188 64" fill="none" stroke="#a5f3fc" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            <path d="M 38 78 Q 22 115 36 155 M 198 78 Q 214 115 200 155" fill="none" stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            <path d="M 38 112 C 14 102, 8 122, 24 130 C 12 136, 16 148, 32 146 C 24 154, 32 162, 42 154 Z" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.5" />
            <path d="M 198 112 C 222 102, 228 122, 212 130 C 224 136, 220 148, 204 146 C 212 154, 204 162, 194 154 Z" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.5" />
            <circle cx="72" cy="24" r="2.2" fill="#fef08a" />
            <circle cx="164" cy="28" r="2.5" fill="#fef08a" />
            <circle cx="148" cy="54" r="2" fill="#fef08a" />
            <circle cx="84" cy="56" r="1.8" fill="#bae6fd" />
            <ellipse cx="42" cy="215" rx="34" ry="26" fill="#34d399" opacity="0.45" />
            <circle cx="34" cy="218" r="16" fill="#fbcfe8" />
            <circle cx="52" cy="226" r="14" fill="#bae6fd" />
            <circle cx="40" cy="236" r="13" fill="#e0e7ff" />
            <ellipse cx="192" cy="215" rx="36" ry="28" fill="#2dd4bf" opacity="0.45" />
            <circle cx="198" cy="220" r="16" fill="#a5f3fc" />
            <circle cx="180" cy="230" r="14" fill="#99f6e4" />
            <circle cx="204" cy="238" r="12" fill="#bae6fd" />
          </svg>
        )}

        {/* 코믹 팝(COMIC_POP) 전용 커스텀 아트 오버레이 */}
        {skinKey === 'COMIC_POP' && (
          <svg
            width="236"
            height="284"
            viewBox="0 0 236 284"
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}
          >
            <polygon points="55,10 180,10 172,72 64,72" fill="#ef4444" stroke="#0f172a" strokeWidth="2.5" />
            <polygon points="75,26 95,18 118,28 142,16 162,28 158,48 166,64 138,60 118,68 96,58 72,64 80,44" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
            <polygon points="4,105 52,98 52,188 4,195" fill="#2563eb" stroke="#0f172a" strokeWidth="2.5" />
            <polygon points="24,116 28,126 39,126 30,133 33,143 24,137 15,143 18,133 9,126 20,126" fill="#ef4444" stroke="#0f172a" strokeWidth="1.5" />
            <polygon points="22,154 25,162 34,162 27,167 29,175 22,170 15,175 17,167 10,162 19,162" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
            <polygon points="184,96 232,105 232,192 184,184" fill="#2563eb" stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="206" cy="144" r="18" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <text x="195" y="149" fontSize="13" fontWeight="900" fill="#ef4444" fontFamily="sans-serif">POW</text>
            <polygon points="10,196 76,192 84,274 26,274" fill="#ef4444" stroke="#0f172a" strokeWidth="2.5" />
            <polygon points="162,192 226,196 210,274 154,274" fill="#facc15" stroke="#0f172a" strokeWidth="2.5" />
            <ellipse cx="196" cy="204" rx="18" ry="11" fill="#ffffff" stroke="#0f172a" strokeWidth="1.8" />
            <text x="186" y="208" fontSize="9.5" fontWeight="900" fill="#0f172a" fontFamily="sans-serif">OK!</text>
            <ellipse cx="42" cy="64" rx="18" ry="11" fill="#ffffff" stroke="#0f172a" strokeWidth="1.8" />
            <text x="30" y="68" fontSize="9" fontWeight="900" fill="#0f172a" fontFamily="sans-serif">YES!</text>
          </svg>
        )}

        {/* 상단 적외선 포트 */}
        {skinKey === 'CLEAR_90S' ? (
          <div
            style={{
              fontSize: '11px',
              fontWeight: '900',
              color: '#0369a1',
              textShadow: '0 1px 0 #ffffff, -1px -1px 0 #bae6fd, 1px -1px 0 #bae6fd',
              letterSpacing: '1.5px',
              marginBottom: '1px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            1996
          </div>
        ) : (
          <div
            style={{
              width: '74px',
              height: '11px',
              background: skin.irPort,
              borderRadius: '20px 20px 6px 6px',
              border: '2px solid rgba(0,0,0,0.28)',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.45)',
              marginBottom: '4px',
              position: 'relative',
              zIndex: 2,
            }}
          />
        )}

        {/* 로고 */}
        <div
          style={{
            fontSize: skinKey === 'CLEAR_90S' ? '14px' : '12px',
            fontWeight: '900',
            fontStyle: 'italic',
            color: skinKey === 'CLEAR_90S' ? '#ec4899' : '#fff',
            textShadow:
              skinKey === 'PINK_ICE'
                ? '0 1.5px 0 #94a3b8, -1px -1px 0 #cbd5e1, 1px -1px 0 #cbd5e1, 0 2px 6px rgba(236,72,153,0.4)'
                : skinKey === 'CLEAR_90S'
                ? '0 2px 0 #ffffff, -1.5px -1.5px 0 #ffffff, 1.5px -1.5px 0 #ffffff, -1.5px 1.5px 0 #ffffff, 0 3px 6px rgba(190,24,93,0.4)'
                : skinKey === 'GRAPE_JELLY'
                ? '0 2px 0 #1d4ed8, -1.5px -1.5px 0 #1d4ed8, 1.5px -1.5px 0 #1d4ed8, -1.5px 1.5px 0 #1d4ed8'
                : skinKey === 'COMIC_POP'
                ? '0 2px 0 #0f172a, -1.5px -1.5px 0 #0f172a, 1.5px -1.5px 0 #0f172a, -1.5px 1.5px 0 #0f172a'
                : '0 1.5px 0 #1e3a8a, -1px -1px 0 #1e3a8a, 1px -1px 0 #1e3a8a, -1px 1px 0 #1e3a8a',
            letterSpacing: '0.3px',
            marginBottom: '6px',
            lineHeight: 1.05,
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          Tamagotchi
          {skinKey !== 'CLEAR_90S' && (
            <div
              style={{
                fontSize: '7.5px',
                letterSpacing: '1.2px',
                color:
                  skinKey === 'PINK_ICE'
                    ? '#ec4899'
                    : skinKey === 'ANGEL_GARDEN'
                    ? '#a5f3fc'
                    : '#fef08a',
              }}
            >
              {skinKey === 'PINK_ICE'
                ? 'AURORA ANGEL'
                : skinKey === 'ANGEL_GARDEN'
                ? 'ANGEL EDITION'
                : skinKey === 'COMIC_POP'
                ? 'COMIC EDITION'
                : skinKey === 'GRAPE_JELLY'
                ? 'SNACK EDITION'
                : 'CONNECTION'}
            </div>
          )}
        </div>

        {/* 중앙 사각 컬러 베젤 */}
        <div
          style={{
            width: '148px',
            height: '146px',
            background:
              skinKey === 'PINK_ICE'
                ? 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)'
                : skin.bezelBg,
            border: `3px solid ${skin.bezelBorder}`,
            borderRadius:
              skinKey === 'PINK_ICE' ||
              skinKey === 'CLEAR_90S' ||
              skinKey === 'ANGEL_GARDEN' ||
              skinKey === 'COMIC_POP' ||
              skinKey === 'GRAPE_JELLY'
                ? '10px'
                : '16px',
            padding: '7px',
            boxSizing: 'border-box',
            boxShadow:
              skinKey === 'PINK_ICE'
                ? '0 0 0 1.5px #ffffff, inset 0 2px 5px rgba(100,116,139,0.4)'
                : skinKey === 'ANGEL_GARDEN'
                ? '0 0 0 2px #172052, inset 0 2px 5px rgba(0,0,0,0.4)'
                : skinKey === 'CLEAR_90S'
                ? '0 0 0 2px #0369a1, inset 0 2px 5px rgba(2,132,199,0.35)'
                : 'inset 0 2px 5px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* LCD 액정 화면 */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background:
                skinKey === 'PINK_ICE' || skinKey === 'ANGEL_GARDEN'
                  ? 'radial-gradient(circle, #ffffff 20%, #bae6fd 85%)'
                  : skinKey === 'COMIC_POP' || skinKey === 'GRAPE_JELLY'
                  ? 'linear-gradient(180deg, #e5e8b6 0%, #e5e8b6 22%, #d8e2dc 22%, #d8e2dc 78%, #e5e8b6 78%, #e5e8b6 100%)'
                  : skinKey === 'CLEAR_90S'
                  ? 'linear-gradient(180deg, #f5d0fe 0%, #f5d0fe 22%, #fef9c3 22%, #fef9c3 78%, #f5d0fe 78%, #f5d0fe 100%)'
                  : skin.lcdBg,
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
            position: 'relative',
            zIndex: 2,
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