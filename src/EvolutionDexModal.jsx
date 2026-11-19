import React, { useState } from 'react';
import PetSprite from './PetSprite';
import { SPECIES } from './evolutionTree';

const OUTER_RING_IDS = [
  'ADULT_PINK_CAT',
  'ADULT_STAR_BUNNY',
  'ADULT_OWL',
  'ADULT_SATURN',
  'ADULT_PARROT',
  'ADULT_ASTRONAUT',
  'ADULT_DOLPHIN',
  'ADULT_RED_PANDA',
  'ADULT_RIBBON_DOG',
  'ADULT_HEART_BUNNY',
  'ADULT_AXOLOTL',
  'ADULT_PENGUIN',
  'ADULT_GREEN_DOG',
  'ADULT_ROBO',
  'ADULT_MAMETCHI',
  'ADULT_CURLY',
  'ADULT_CACTUS',
  'ADULT_NINJA',
];

const LEGEND_IDS = [
  'LEGEND_DRAGON',
  'LEGEND_MERMAID',
  'LEGEND_UNICORN',
  'LEGEND_EAST_DRAGON',
  'LEGEND_NARWHAL',
  'LEGEND_SECRET',
];

const INNER_RING_IDS = [
  'KID_SKY',
  'TEEN_FIN',
  'KID_WATER',
  'TEEN_CLOUD',
  'TEEN_SPROUT',
  'TEEN_JELLY',
  'KID_LAND',
  'TEEN_CUBE',
  'TEEN_STAR',
];

const BIOME_COLORS = {
  SKY: '#f472b6',
  WATER: '#38bdf8',
  LAND: '#a3e635',
};

const BIOME_LABELS = {
  SKY: '하늘/코즈믹 (놀이)',
  WATER: '바다/얼음 (청결)',
  LAND: '대지/숲 (식사)',
  LEGEND: '★ 전설·히든 (올스탯 4↑ & 5승)',
  ALL: '공통 기본 단계',
};

export default function EvolutionDexModal({ unlockedSpecies = [], currentSpeciesId, careStats, onClose }) {
  const [selectedId, setSelectedId] = useState(currentSpeciesId || 'BABY_MARU');
  const selectedSpec = SPECIES[selectedId] || SPECIES.BABY_MARU;
  const isSelectedUnlocked = unlockedSpecies.includes(selectedId);

  const totalCount = Object.keys(SPECIES).length; // 35종
  const unlockedCount = unlockedSpecies.length;

  return (
    <div
      onClick={onClose}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px',
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '436px',
          maxHeight: '468px',
          background: 'rgba(255, 255, 255, 0.98)',
          border: '3px solid #38bdf8',
          borderRadius: '22px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 12px',
          boxSizing: 'border-box',
          userSelect: 'none',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: '900', color: '#0369a1' }}>
              📖 방사형 진화 도감
            </span>
            <span
              style={{
                background: '#e0f2fe',
                color: '#0284c7',
                fontSize: '11px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '10px',
              }}
            >
              {unlockedCount} / {totalCount}종
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              background: '#ef4444',
              border: 'none',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: '800',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(239, 68, 68, 0.35)',
              flexShrink: 0,
            }}
          >
            ✕ 닫기
          </button>
        </div>

        <div
          style={{
            position: 'relative',
            width: '286px',
            height: '286px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '236px',
              height: '236px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #e0f2fe 0%, #bae6fd 100%)',
              border: '2px dashed #7dd3fc',
            }}
          />

          <svg
            width="286"
            height="286"
            viewBox="0 0 286 286"
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          >
            {OUTER_RING_IDS.map((id, idx) => {
              const spec = SPECIES[id];
              const angleRad = ((idx * 20 - 90) * Math.PI) / 180;
              const x2 = 143 + Math.cos(angleRad) * 102;
              const y2 = 143 + Math.sin(angleRad) * 102;
              const strokeColor = BIOME_COLORS[spec.biome] || '#94a3b8';

              return (
                <line
                  key={id}
                  x1="143"
                  y1="143"
                  x2={x2}
                  y2={y2}
                  stroke={strokeColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              );
            })}
          </svg>

          <NodeBadge
            speciesId="BABY_MARU"
            x={143}
            y={143}
            size={32}
            unlocked={unlockedSpecies.includes('BABY_MARU')}
            isCurrent={currentSpeciesId === 'BABY_MARU'}
            isSelected={selectedId === 'BABY_MARU'}
            onClick={() => setSelectedId('BABY_MARU')}
          />

          {INNER_RING_IDS.map((id, idx) => {
            const angleRad = ((idx * 40 - 90) * Math.PI) / 180;
            const radius = 58;
            const x = 143 + Math.cos(angleRad) * radius;
            const y = 143 + Math.sin(angleRad) * radius;

            return (
              <NodeBadge
                key={id}
                speciesId={id}
                x={x}
                y={y}
                size={24}
                unlocked={unlockedSpecies.includes(id)}
                isCurrent={currentSpeciesId === id}
                isSelected={selectedId === id}
                onClick={() => setSelectedId(id)}
              />
            );
          })}

          {OUTER_RING_IDS.map((id, idx) => {
            const angleRad = ((idx * 20 - 90) * Math.PI) / 180;
            const radius = 120;
            const x = 143 + Math.cos(angleRad) * radius;
            const y = 143 + Math.sin(angleRad) * radius;

            return (
              <NodeBadge
                key={id}
                speciesId={id}
                x={x}
                y={y}
                size={28}
                unlocked={unlockedSpecies.includes(id)}
                isCurrent={currentSpeciesId === id}
                isSelected={selectedId === id}
                onClick={() => setSelectedId(id)}
              />
            );
          })}
        </div>

        <div
          style={{
            width: '100%',
            background: 'linear-gradient(90deg, #fefce8 0%, #fef08a 50%, #fefce8 100%)',
            border: '1.5px solid #facc15',
            borderRadius: '12px',
            padding: '4px 8px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: '900', color: '#854d0e' }}>★ 전설·히든</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {LEGEND_IDS.map((id) => {
              const unlocked = unlockedSpecies.includes(id);
              const isCurrent = currentSpeciesId === id;
              const isSelected = selectedId === id;
              return (
                <div
                  key={id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(id);
                  }}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: isCurrent ? 'rgba(254,226,226,0.8)' : 'rgba(255,255,255,0.75)',
                    border: isSelected ? '2px solid #ca8a04' : '1px solid #fde047',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.18)' : 'scale(1)',
                    transition: 'transform 0.15s',
                  }}
                >
                  <div
                    style={{
                      transform: 'scale(0.32)',
                      filter: unlocked ? 'none' : 'brightness(0) opacity(0.35)',
                    }}
                  >
                    <PetSprite speciesId={id} lcdMode={false} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            width: '100%',
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '12px',
            padding: '6px 10px',
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '11.5px',
                fontWeight: '900',
                color: '#0f172a',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {isSelectedUnlocked ? selectedSpec.name : '??? (미발견)'}
              {currentSpeciesId === selectedId && (
                <span style={{ marginLeft: '5px', fontSize: '9.5px', color: '#0284c7' }}>● 육성중</span>
              )}
            </div>
            <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '1px' }}>
              <b>{BIOME_LABELS[selectedSpec.biome]}</b>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', fontSize: '9.5px', fontWeight: '800', flexShrink: 0 }}>
            <span style={{ color: '#db2777', background: '#fce7f3', padding: '2px 5px', borderRadius: '6px' }}>
              하늘:{careStats?.sky || 1}
            </span>
            <span style={{ color: '#65a30d', background: '#ecfccb', padding: '2px 5px', borderRadius: '6px' }}>
              대지:{careStats?.land || 1}
            </span>
            <span style={{ color: '#0284c7', background: '#e0f2fe', padding: '2px 5px', borderRadius: '6px' }}>
              바다:{careStats?.water || 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NodeBadge({ speciesId, x, y, size, unlocked, isCurrent, isSelected, onClick }) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        position: 'absolute',
        left: `${x - size / 2}px`,
        top: `${y - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transform: isSelected ? 'scale(1.25)' : 'scale(1)',
        transition: 'transform 0.15s ease',
        zIndex: isSelected ? 10 : 2,
      }}
    >
      {isCurrent && (
        <div
          style={{
            position: 'absolute',
            inset: '-3px',
            borderRadius: '50%',
            border: '2px solid #ef4444',
            background: 'rgba(254, 226, 226, 0.45)',
          }}
        />
      )}

      <div
        style={{
          transform: `scale(${size / 98})`,
          filter: unlocked ? 'none' : 'brightness(0) opacity(0.35)',
        }}
      >
        <PetSprite speciesId={speciesId} lcdMode={false} />
      </div>
    </div>
  );
}