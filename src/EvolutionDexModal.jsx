import React, { useState } from 'react';
import PetSprite from './PetSprite';
import { SPECIES } from './evolutionTree';

const OUTER_RING_IDS = [
  // 상단 하늘 계열 (6종)
  'ADULT_PINK_CAT',
  'ADULT_STAR_BUNNY',
  'ADULT_OWL',
  'ADULT_SATURN',
  'ADULT_PARROT',
  'ADULT_ASTRONAUT',
  // 우측·하단 바다 계열 (6종)
  'ADULT_DOLPHIN',
  'ADULT_RED_PANDA',
  'ADULT_RIBBON_DOG',
  'ADULT_HEART_BUNNY',
  'ADULT_AXOLOTL',
  'ADULT_PENGUIN',
  // 좌측 대지 계열 (6종)
  'ADULT_GREEN_DOG',
  'ADULT_ROBO',
  'ADULT_MAMETCHI',
  'ADULT_CURLY',
  'ADULT_CACTUS',
  'ADULT_NINJA',
];

const INNER_RING_IDS = [
  'KID_SKY',
  'TEEN_STAR',
  'TEEN_CLOUD',
  'KID_WATER',
  'TEEN_FIN',
  'TEEN_JELLY',
  'KID_LAND',
  'TEEN_SPROUT',
  'TEEN_CUBE',
];

const LEGEND_IDS = [
  'LEGEND_DRAGON',
  'LEGEND_MERMAID',
  'LEGEND_UNICORN',
  'LEGEND_EAST_DRAGON',
  'LEGEND_NARWHAL',
  'LEGEND_SECRET',
];

export default function EvolutionDexModal({
  unlockedSpecies = ['EGG'],
  currentSpeciesId = 'EGG',
  careStats = { sky: 1, land: 1, water: 1 },
  onClose,
}) {
  // 현재 시크릿 변신 4종 중 하나라면 도감에서는 LEGEND_SECRET으로 포커스
  const activeDexId = SPECIES[currentSpeciesId]?.isSecretVariant
    ? 'LEGEND_SECRET'
    : currentSpeciesId;

  const [selectedId, setSelectedId] = useState(
    activeDexId === 'EGG' ? 'BABY_MARU' : activeDexId
  );

  // 시크릿 변신 4종(isSecretVariant)은 도감 카운트에서 제외하여 총 35종 유지
  const visibleSpeciesList = Object.values(SPECIES).filter((s) => !s.isSecretVariant);
  const totalCount = visibleSpeciesList.length;
  const unlockedCount = visibleSpeciesList.filter((s) =>
    unlockedSpecies.includes(s.id)
  ).length;

  const selectedSpec = SPECIES[selectedId] || SPECIES.BABY_MARU;
  const isSelectedUnlocked = unlockedSpecies.includes(selectedId);

  const getConditionText = (spec) => {
    if (spec.id === 'LEGEND_SECRET') {
      return '★ 전설·히든 (올스탯 50↑ & 50승 · 시크릿 4종 랜덤 변신 + 전용 스킨)';
    }
    if (spec.isLegend) {
      return '★ 전설·히든 (올스탯 50↑ & 50승)';
    }
    if (spec.stage === 'BABY') return '기본 부화 단계 (5분 경과)';
    if (spec.stage === 'KID') {
      return spec.biome === 'SKY'
        ? '하늘(케이크·놀이) 중심 육성 (1시간)'
        : spec.biome === 'WATER'
        ? '바다(청소·청결) 중심 육성 (1시간)'
        : '대지(주먹밥·식사) 중심 육성 (1시간)';
    }
    if (spec.stage === 'TEEN') {
      return `${
        spec.biome === 'SKY' ? '하늘' : spec.biome === 'WATER' ? '바다' : '대지'
      } 계열 성장기 (6시간 & 미니게임 2승)`;
    }
    return `${
      spec.biome === 'SKY' ? '하늘' : spec.biome === 'WATER' ? '바다' : '대지'
    } 계열 최종 성체 (24시간 & 청결 유지)`;
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '94vw',
        maxWidth: '420px',
        background: '#ffffff',
        borderRadius: '24px',
        border: '3.5px solid #38bdf8',
        boxShadow: '0 20px 45px rgba(15, 23, 42, 0.45)',
        padding: '14px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        color: '#0f172a',
        userSelect: 'none',
      }}
    >
      {/* 상단 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a' }}>
            📖 방사형 진화 도감
          </span>
          <span
            style={{
              background: '#e0f2fe',
              color: '#0284c7',
              fontSize: '11.5px',
              fontWeight: '800',
              padding: '2px 9px',
              borderRadius: '12px',
            }}
          >
            {unlockedCount} / {totalCount}종
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            background: '#ef4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '5px 11px',
            fontSize: '11.5px',
            fontWeight: '800',
            cursor: 'pointer',
          }}
        >
          ✕ 닫기
        </button>
      </div>

      {/* 중앙 방사형 진화 트리 맵 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          maxHeight: '320px',
          margin: '0 auto',
          borderRadius: '20px',
          background: 'radial-gradient(circle, #ffffff 18%, #e0f2fe 72%, #bae6fd 100%)',
          border: '2px solid #bae6fd',
          overflow: 'hidden',
        }}
      >
        {/* 방사형 연결선 SVG */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 300 300"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          {OUTER_RING_IDS.map((id, idx) => {
            const angle = ((idx * 360) / OUTER_RING_IDS.length - 90) * (Math.PI / 180);
            const x2 = 150 + Math.cos(angle) * 124;
            const y2 = 150 + Math.sin(angle) * 124;
            const spec = SPECIES[id];
            const strokeColor =
              spec.biome === 'SKY'
                ? '#f472b6'
                : spec.biome === 'WATER'
                ? '#38bdf8'
                : '#4ade80';
            return (
              <line
                key={id}
                x1="150"
                y1="150"
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth="2"
                opacity="0.65"
              />
            );
          })}
          <circle
            cx="150"
            cy="150"
            r="68"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <circle
            cx="150"
            cy="150"
            r="124"
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        </svg>

        {/* 중앙 1단계 베이비 */}
        <NodeSlot
          id="BABY_MARU"
          xPct={50}
          yPct={50}
          size={36}
          unlocked={unlockedSpecies.includes('BABY_MARU')}
          selected={selectedId === 'BABY_MARU'}
          isCurrent={activeDexId === 'BABY_MARU'}
          onSelect={() => setSelectedId('BABY_MARU')}
        />

        {/* 중간 2~3단계 9종 */}
        {INNER_RING_IDS.map((id, idx) => {
          const angle = ((idx * 360) / INNER_RING_IDS.length - 90) * (Math.PI / 180);
          const xPct = 50 + Math.cos(angle) * 22.5;
          const yPct = 50 + Math.sin(angle) * 22.5;
          return (
            <NodeSlot
              key={id}
              id={id}
              xPct={xPct}
              yPct={yPct}
              size={28}
              unlocked={unlockedSpecies.includes(id)}
              selected={selectedId === id}
              isCurrent={activeDexId === id}
              onSelect={() => setSelectedId(id)}
            />
          );
        })}

        {/* 외곽 4단계 성체 18종 */}
        {OUTER_RING_IDS.map((id, idx) => {
          const angle = ((idx * 360) / OUTER_RING_IDS.length - 90) * (Math.PI / 180);
          const xPct = 50 + Math.cos(angle) * 41.2;
          const yPct = 50 + Math.sin(angle) * 41.2;
          return (
            <NodeSlot
              key={id}
              id={id}
              xPct={xPct}
              yPct={yPct}
              size={30}
              unlocked={unlockedSpecies.includes(id)}
              selected={selectedId === id}
              isCurrent={activeDexId === id}
              onSelect={() => setSelectedId(id)}
            />
          );
        })}
      </div>

      {/* 전설 · 히든 6종 전용 바 */}
      <div
        style={{
          background: 'linear-gradient(90deg, #fef9c3 0%, #fef08a 100%)',
          border: '1.5px solid #facc15',
          borderRadius: '14px',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '11.5px', fontWeight: '900', color: '#854d0e' }}>
          ★ 전설·히든
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {LEGEND_IDS.map((id) => {
            const unlocked = unlockedSpecies.includes(id);
            const selected = selectedId === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedId(id)}
                style={{
                  width: '32px',
                  height: '32px',
                  padding: 0,
                  borderRadius: '10px',
                  border: selected ? '2px solid #0284c7' : '1.5px solid #eab308',
                  background: selected ? '#e0f2fe' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    transform: 'scale(0.32)',
                    filter: unlocked ? 'none' : 'brightness(0) opacity(0.45)',
                  }}
                >
                  <PetSprite speciesId={id} lcdMode={false} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 하단 선택 캐릭터 정보 & 출현 조건 카드 */}
      <div
        style={{
          background: '#f8fafc',
          border: '1.5px solid #e2e8f0',
          borderRadius: '14px',
          padding: '10px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13.5px', fontWeight: '900', color: '#0f172a' }}>
            {isSelectedUnlocked || selectedSpec.isLegend ? selectedSpec.name : '??? (미발견)'}
          </div>
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px', lineHeight: 1.35 }}>
            {getConditionText(selectedSpec)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          <span style={statBadgeStyle('#fce7f3', '#db2777')}>하늘:{careStats.sky || 1}</span>
          <span style={statBadgeStyle('#dcfce7', '#16a34a')}>대지:{careStats.land || 1}</span>
          <span style={statBadgeStyle('#e0f2fe', '#0284c7')}>바다:{careStats.water || 1}</span>
        </div>
      </div>
    </div>
  );
}

function NodeSlot({ id, xPct, yPct, size, unlocked, selected, isCurrent, onSelect }) {
  return (
    <button
      onClick={onSelect}
      style={{
        position: 'absolute',
        left: `${xPct}%`,
        top: `${yPct}%`,
        transform: 'translate(-50%, -50%)',
        width: `${size}px`,
        height: `${size}px`,
        padding: 0,
        borderRadius: '50%',
        border: isCurrent
          ? '2.5px solid #f59e0b'
          : selected
          ? '2px solid #0284c7'
          : '1px solid rgba(148,163,184,0.45)',
        background: selected ? '#ffffff' : 'rgba(255,255,255,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: selected ? '0 2px 6px rgba(2,132,199,0.35)' : 'none',
      }}
    >
      <div
        style={{
          transform: `scale(${size / 95})`,
          filter: unlocked ? 'none' : 'brightness(0) opacity(0.35)',
          pointerEvents: 'none',
        }}
      >
        <PetSprite speciesId={id} lcdMode={false} />
      </div>
    </button>
  );
}

const statBadgeStyle = (bg, color) => ({
  background: bg,
  color,
  fontSize: '10px',
  fontWeight: '800',
  padding: '3px 6px',
  borderRadius: '8px',
});
