import React, { useState } from 'react';
import PetSprite from './PetSprite';
import { SPECIES, STAGE_ORDER, SECRET_SPACE_VARIANTS } from './evolutionTree';
import { sfx } from './sound';

const BIOME_META = {
  sky: { label: '하늘', icon: '☁️', color: '#0284c7' },
  land: { label: '대지', icon: '🌱', color: '#16a34a' },
  water: { label: '바다', icon: '💧', color: '#0ea5e9' },
};

export default function EvolutionDexModal({
  unlockedSpecies = ['EGG'],
  secretHistory = [],
  currentSpeciesId = 'EGG',
  careStats = { sky: 1, land: 1, water: 1 },
  onClose,
}) {
  const allList = Object.values(SPECIES).filter((sp) => !sp.isSecretVariant);
  const totalCount = allList.length;
  const unlockedCount = unlockedSpecies.length;

  const [selectedId, setSelectedId] = useState(
    SPECIES[currentSpeciesId]?.isSecretVariant ? 'LEGEND_SECRET' : currentSpeciesId
  );

  const selectedSpec = SPECIES[selectedId] || SPECIES.EGG;
  const isSelectedUnlocked = unlockedSpecies.includes(selectedId);
  const isSecretSpaceSlot = selectedId === 'LEGEND_SECRET';

  const latestSecretId =
    SPECIES[currentSpeciesId]?.isSecretVariant
      ? currentSpeciesId
      : secretHistory[secretHistory.length - 1] || 'SECRET_WOODY';

  const displaySpec =
    isSecretSpaceSlot && isSelectedUnlocked
      ? SPECIES[latestSecretId] || selectedSpec
      : selectedSpec;

  const maxCare = Math.max(10, careStats.sky, careStats.land, careStats.water);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        maxWidth: '560px',
        maxHeight: '92dvh',
        background: '#ffffff',
        borderRadius: '26px',
        border: '3.5px solid #38bdf8',
        boxShadow: '0 24px 50px rgba(0, 0, 0, 0.45)',
        padding: '18px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        color: '#0f172a',
        userSelect: 'none',
      }}
    >
      {/* 상단 타이틀 바 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px', fontWeight: '900', color: '#0369a1' }}>
            📖 다마고치 진화도감
          </span>
          <span
            style={{
              background: '#e0f2fe',
              color: '#0284c7',
              fontSize: '12.5px',
              fontWeight: '800',
              padding: '3px 10px',
              borderRadius: '12px',
            }}
          >
            {unlockedCount} / {totalCount}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#ef4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '7px 13px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
          }}
        >
          ✕ 닫기
        </button>
      </div>

      {/* 현재 육성 속성 게이지 바 */}
      <div
        style={{
          background: '#f8fafc',
          border: '1.5px solid #e2e8f0',
          borderRadius: '16px',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: '800', color: '#475569' }}>
          현재 육성 속성 (전설·시크릿 해금: 올스탯 50↑ & 50승↑)
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {(['sky', 'land', 'water']).map((key) => {
            const meta = BIOME_META[key];
            const val = careStats[key] || 0;
            const pct = Math.min(100, Math.round((val / maxCare) * 100));
            return (
              <div key={key} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800' }}>
                  <span>{meta.icon} {meta.label}</span>
                  <span style={{ color: meta.color }}>{val}</span>
                </div>
                <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: meta.color,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 선택된 캐릭터 상세 카드 */}
      <div
        style={{
          background: isSelectedUnlocked ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' : '#f1f5f9',
          border: isSelectedUnlocked ? '2px solid #7dd3fc' : '2px dashed #cbd5e1',
          borderRadius: '18px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          minHeight: '86px',
        }}
      >
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '16px',
            background: '#ffffff',
            border: '1.5px solid #bae6fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {isSelectedUnlocked ? (
            <div style={{ transform: 'scale(0.68)' }}>
              <PetSprite speciesId={displaySpec.id} frame={0} lcdMode={false} />
            </div>
          ) : (
            <span style={{ fontSize: '26px', color: '#94a3b8', fontWeight: '900' }}>?</span>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>
              {isSelectedUnlocked ? displaySpec.name : '미발견 캐릭터'}
            </span>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#0369a1',
                border: '1px solid #bae6fd',
              }}
            >
              {selectedSpec.stageLabel} · {BIOME_META[selectedSpec.biome]?.label}
            </span>
          </div>
          <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.4 }}>
            {isSelectedUnlocked ? displaySpec.desc : `힌트: ${selectedSpec.hint}`}
          </div>

          {isSecretSpaceSlot && (
            <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#7e22ce', marginTop: '2px' }}>
              🎁 시크릿 에디션 수집 ({secretHistory.length}/{SECRET_SPACE_VARIANTS.length}):{' '}
              {SECRET_SPACE_VARIANTS.map((sid) =>
                secretHistory.includes(sid) ? SPECIES[sid].name.split(' ')[1] : '???'
              ).join(' · ')}
            </div>
          )}
        </div>
      </div>

      {/* 단계별 전체 캐릭터 도감 스크롤 리스트 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingRight: '2px',
        }}
      >
        {STAGE_ORDER.map((st) => {
          const group = allList.filter((sp) => sp.stage === st.key);
          return (
            <div key={st.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#475569' }}>
                {st.label} ({group.filter((g) => unlockedSpecies.includes(g.id)).length}/{group.length})
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '7px',
                }}
              >
                {group.map((sp) => {
                  const unlocked = unlockedSpecies.includes(sp.id);
                  const isCurrent =
                    sp.id === currentSpeciesId ||
                    (sp.id === 'LEGEND_SECRET' && SPECIES[currentSpeciesId]?.isSecretVariant);
                  const isSelected = sp.id === selectedId;
                  const spriteToShow =
                    sp.id === 'LEGEND_SECRET' && unlocked ? latestSecretId : sp.id;

                  return (
                    <button
                      key={sp.id}
                      onClick={() => {
                        sfx.beep();
                        setSelectedId(sp.id);
                      }}
                      style={{
                        background: isSelected ? '#e0f2fe' : unlocked ? '#ffffff' : '#f1f5f9',
                        border: isSelected
                          ? '2px solid #0284c7'
                          : isCurrent
                          ? '2px solid #22c55e'
                          : '1.5px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '6px 3px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        cursor: 'pointer',
                        position: 'relative',
                        minHeight: '68px',
                      }}
                    >
                      {isCurrent && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '3px',
                            right: '4px',
                            fontSize: '9px',
                            fontWeight: '900',
                            color: '#16a34a',
                          }}
                        >
                          NOW
                        </span>
                      )}
                      {unlocked ? (
                        <div style={{ transform: 'scale(0.45)', height: '34px', display: 'flex', alignItems: 'center' }}>
                          <PetSprite speciesId={spriteToShow} frame={0} lcdMode={false} />
                        </div>
                      ) : (
                        <div
                          style={{
                            height: '34px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            fontWeight: '900',
                            color: '#cbd5e1',
                          }}
                        >
                          ?
                        </div>
                      )}
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '800',
                          color: unlocked ? '#0f172a' : '#94a3b8',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '100%',
                        }}
                      >
                        {unlocked
                          ? sp.id === 'LEGEND_SECRET'
                            ? SPECIES[spriteToShow]?.name.split(' ')[1] || '시크릿'
                            : sp.name
                          : '???'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}