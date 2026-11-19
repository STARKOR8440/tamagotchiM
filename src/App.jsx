import React, { useState, useEffect } from 'react';
import PetSprite from './PetSprite';
import MiniGame from './MiniGame';
import TamagotchiShell, { SHELL_SKINS } from './TamagotchiShell';
import EvolutionDexModal from './EvolutionDexModal';
import { SPECIES, checkEvolutionStatus, evolveCrossRandom } from './evolutionTree';
import { sfx } from './sound';

const STORAGE_KEY = 'mobile_tamagotchi_pwa_v1';
const SKIN_KEYS = Object.keys(SHELL_SKINS);
const MENU_IDS = ['FEED', 'PLAY', 'CLEAN', 'SHOP', 'STATUS', 'DEX'];

const getTodayStr = () => new Date().toISOString().slice(0, 10);

const INITIAL_STATE = {
  hunger: 75,
  happiness: 75,
  cleanliness: 90,
  energy: 100,
  poopCount: 0,
  ageSeconds: 0,
  adultSeconds: 0,
  gameWins: 0,
  coins: 50,
  digestUntil: 0,
  snacksToday: 0,
  snackDate: getTodayStr(),
  speciesId: 'EGG',
  skin: 'SODA_BLUE',
  unlockedSkins: ['SODA_BLUE'],
  careStats: { sky: 1, land: 1, water: 1 },
  unlockedSpecies: ['EGG'],
};

export default function App() {
  const [pet, setPet] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_STATE;

    const parsed = JSON.parse(saved);
    const elapsed = Math.max(0, Math.floor((Date.now() - parsed.lastUpdated) / 1000));
    const decay = Math.floor(elapsed / 90);
    const energyGain = Math.floor(elapsed / 30);

    return {
      ...INITIAL_STATE,
      ...parsed,
      hunger: Math.max(0, parsed.hunger - decay),
      happiness: Math.max(0, parsed.happiness - decay),
      cleanliness: Math.max(0, parsed.cleanliness - decay),
      energy: Math.min(100, (parsed.energy ?? 100) + energyGain),
      poopCount: Math.min(3, parsed.poopCount + Math.floor(elapsed / 3600)),
      ageSeconds: (parsed.ageSeconds || 0) + elapsed,
      adultSeconds:
        SPECIES[parsed.speciesId]?.stage === 'ADULT'
          ? (parsed.adultSeconds || 0) + elapsed
          : 0,
    };
  });

  const [lcdScreen, setLcdScreen] = useState('PET');
  const [shopTab, setShopTab] = useState('SKIN');
  const [selectedMenuIdx, setSelectedMenuIdx] = useState(0);
  const [showDex, setShowDex] = useState(false);
  const [actionState, setActionState] = useState('IDLE');
  const [isMuted, setIsMuted] = useState(false);

  const [direction, setDirection] = useState(1);
  const [frame, setFrame] = useState(0);
  const [reaction, setReaction] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...pet, lastUpdated: Date.now() }));
  }, [pet]);

  // 1초 게임 루프
  useEffect(() => {
    const loop = setInterval(() => {
      setPet((prev) => {
        const nextAge = prev.ageSeconds + 1;
        const currentSpec = SPECIES[prev.speciesId] || SPECIES.EGG;
        const nextAdultSec = currentSpec.stage === 'ADULT' ? (prev.adultSeconds || 0) + 1 : 0;
        let nextSpeciesId = prev.speciesId;
        let nextUnlocked = prev.unlockedSpecies || ['EGG'];

        const evoStatus = checkEvolutionStatus({ ...prev, ageSeconds: nextAge });
        if (evoStatus.ready) {
          nextSpeciesId = evolveCrossRandom(currentSpec.stage, prev.careStats);
          const evolvedSpec = SPECIES[nextSpeciesId];
          if (!nextUnlocked.includes(nextSpeciesId)) {
            nextUnlocked = [...nextUnlocked, nextSpeciesId];
          }
          sfx.evolve();
          triggerAction('HAPPY');
          triggerReaction(`${evolvedSpec.name}로 진화! ✨`);
        }

        const nextEnergy = nextAge % 30 === 0 ? Math.min(100, (prev.energy ?? 100) + 1) : (prev.energy ?? 100);

        if (nextAge % 90 === 0 && currentSpec.stage !== 'EGG') {
          const nextClean = Math.max(0, prev.cleanliness - 1);
          const addPoop = nextClean < 50 && Math.random() < 0.12 ? 1 : 0;

          return {
            ...prev,
            ageSeconds: nextAge,
            adultSeconds: nextAdultSec,
            speciesId: nextSpeciesId,
            unlockedSpecies: nextUnlocked,
            energy: nextEnergy,
            hunger: Math.max(0, prev.hunger - 1),
            happiness: Math.max(0, prev.happiness - 1),
            cleanliness: nextClean,
            poopCount: Math.min(3, prev.poopCount + addPoop),
          };
        }

        return {
          ...prev,
          ageSeconds: nextAge,
          adultSeconds: nextAdultSec,
          speciesId: nextSpeciesId,
          unlockedSpecies: nextUnlocked,
          energy: nextEnergy,
        };
      });
    }, 1000);

    return () => clearInterval(loop);
  }, []);

  // LCD 화면 내 캐릭터 도트 애니메이션 루프
  useEffect(() => {
    const animTimer = setInterval(() => {
      setFrame((f) => (f === 0 ? 1 : 0));
      if (Math.random() < 0.2) {
        setDirection((d) => d * -1);
      }
    }, 450);

    return () => clearInterval(animTimer);
  }, []);

  const triggerReaction = (text) => {
    setReaction(text);
    setTimeout(() => setReaction(''), 2200);
  };

  const triggerAction = (state) => {
    setActionState(state);
    setTimeout(() => setActionState('IDLE'), 1800);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    sfx.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) sfx.beep();
  };

  const startNextGeneration = (isHardReset = false) => {
    sfx.confirm();
    setPet((prev) => ({
      ...INITIAL_STATE,
      coins: isHardReset ? 50 : prev.coins + 50,
      skin: prev.skin,
      unlockedSkins: prev.unlockedSkins,
      unlockedSpecies: prev.unlockedSpecies,
    }));
    setLcdScreen('PET');
    setShowDex(false);
    triggerReaction(isHardReset ? '새 알 도착! 🥚' : '독립 완료! 2세대 알 도착 🥚');
  };

  const feedPet = (foodType) => {
    const now = Date.now();
    const today = getTodayStr();
    const currentSnacks = pet.snackDate === today ? pet.snacksToday : 0;

    if (foodType === 'RICE') {
      if (now < (pet.digestUntil || 0)) {
        const remainMin = Math.ceil((pet.digestUntil - now) / 60000);
        sfx.beep();
        triggerReaction(`배불러! ${remainMin}분 뒤 소화 🙅`);
        setLcdScreen('PET');
        return;
      }
      sfx.eat();
      triggerAction('EAT');
      setPet((p) => ({
        ...p,
        hunger: Math.min(100, p.hunger + 25),
        energy: Math.min(100, (p.energy ?? 100) + 15),
        digestUntil: now + 15 * 60 * 1000,
        careStats: { ...p.careStats, land: (p.careStats?.land || 1) + 1 },
      }));
      triggerReaction('주먹밥 냠! 체력+15 🍙');
    } else {
      if (currentSnacks >= 3) {
        sfx.beep();
        triggerReaction('오늘 간식은 끝! 🦷');
        setLcdScreen('PET');
        return;
      }
      sfx.eat();
      triggerAction('EAT');
      setPet((p) => ({
        ...p,
        hunger: Math.min(100, p.hunger + 10),
        happiness: Math.min(100, p.happiness + 15),
        snacksToday: currentSnacks + 1,
        snackDate: today,
        careStats: { ...p.careStats, sky: (p.careStats?.sky || 1) + 1 },
      }));
      triggerReaction(`케이크 냠! (${currentSnacks + 1}/3) 🍰`);
    }
    setLcdScreen('PET');
  };

  const buyOrEquipSkin = (skinKey) => {
    const skinInfo = SHELL_SKINS[skinKey];
    const isUnlocked = pet.unlockedSkins?.includes(skinKey);

    if (isUnlocked) {
      sfx.confirm();
      setPet((p) => ({ ...p, skin: skinKey }));
      triggerReaction(`${skinInfo.name} 장착! 🎨`);
      return;
    }

    if (pet.coins < skinInfo.price) {
      sfx.beep();
      triggerReaction(`코인 부족! (${skinInfo.price}🪙)`);
      return;
    }

    sfx.win();
    setPet((p) => ({
      ...p,
      coins: p.coins - skinInfo.price,
      skin: skinKey,
      unlockedSkins: [...(p.unlockedSkins || ['SODA_BLUE']), skinKey],
    }));
    triggerReaction(`${skinInfo.name} 해금! 🎉`);
  };

  const buyEnergyDrink = () => {
    const price = 15;
    if ((pet.energy ?? 100) >= 100) {
      sfx.beep();
      triggerReaction('체력이 이미 가득해요! ⚡');
      return;
    }
    if (pet.coins < price) {
      sfx.beep();
      triggerReaction('15🪙가 필요해요!');
      return;
    }
    sfx.win();
    triggerAction('HAPPY');
    setPet((p) => ({
      ...p,
      coins: p.coins - price,
      energy: Math.min(100, (p.energy ?? 100) + 50),
    }));
    triggerReaction('파워 충전! 체력 +50 ⚡');
    setLcdScreen('PET');
  };

  const buyAttributeFruit = (biome, label) => {
    const price = 30;
    if (pet.coins < price) {
      sfx.beep();
      triggerReaction('30🪙가 필요해요!');
      return;
    }
    sfx.eat();
    triggerAction('HAPPY');
    setPet((p) => ({
      ...p,
      coins: p.coins - price,
      careStats: {
        ...p.careStats,
        [biome]: (p.careStats?.[biome] || 1) + 3,
      },
    }));
    triggerReaction(`${label} 열매 섭취! (+3) 🍎`);
    setLcdScreen('PET');
  };

  const executeMenuAction = (type) => {
    sfx.confirm();
    if (type === 'DEX') {
      setShowDex(true);
      return;
    }
    if (type === 'SHOP') {
      setLcdScreen('SHOP');
      return;
    }
    if (type === 'STATUS') {
      setLcdScreen('STATUS');
      return;
    }

    const currentSpec = SPECIES[pet.speciesId] || SPECIES.EGG;
    if (currentSpec.stage === 'EGG') {
      const remainSec = Math.max(0, 300 - pet.ageSeconds);
      triggerReaction(`부화까지 ${Math.ceil(remainSec / 60)}분 남음 🥚`);
      return;
    }

    if (type === 'FEED') {
      setLcdScreen('FOOD');
    } else if (type === 'PLAY') {
      if ((pet.energy ?? 100) < 20) {
        sfx.beep();
        triggerReaction('체력 부족! 밥/드링크 필요 ⚡');
        return;
      }
      setLcdScreen('GAME');
    } else if (type === 'CLEAN') {
      if (pet.poopCount === 0 && pet.cleanliness >= 90) {
        sfx.beep();
        triggerReaction('이미 깨끗해요! 🧹');
        setLcdScreen('PET');
        return;
      }
      const earnedCoins = pet.poopCount * 10;
      setPet((p) => ({
        ...p,
        cleanliness: 100,
        poopCount: 0,
        coins: p.coins + earnedCoins,
        careStats: {
          ...p.careStats,
          water: (p.careStats?.water || 1) + (p.poopCount > 0 ? 1 : 0),
        },
      }));
      triggerAction('HAPPY');
      setLcdScreen('PET');
      triggerReaction(earnedCoins > 0 ? `청소 완료! +${earnedCoins}🪙 ✨` : '상쾌해졌어! ✨');
    }
  };

  const handlePressA = () => {
    sfx.beep();
    if (lcdScreen === 'SHOP') {
      setShopTab((prev) => (prev === 'SKIN' ? 'ITEM' : 'SKIN'));
      return;
    }
    setSelectedMenuIdx((prev) => (prev + 1) % MENU_IDS.length);
  };

  const handlePressB = () => {
    if (lcdScreen === 'SHOP') {
      sfx.beep();
      setShopTab((prev) => (prev === 'SKIN' ? 'ITEM' : 'SKIN'));
      return;
    }
    executeMenuAction(MENU_IDS[selectedMenuIdx]);
  };

  const handlePressC = () => {
    sfx.beep();
    setLcdScreen('PET');
  };

  const currentSpec = SPECIES[pet.speciesId] || SPECIES.EGG;
  const currentHour = new Date().getHours();
  const isSleeping = currentHour >= 23 || currentHour < 6;
  const canGraduate = currentSpec.stage === 'ADULT' && (pet.adultSeconds || 0) >= 86400;

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* 상단 유틸리티 바 */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#e2e8f0',
          fontSize: '13px',
          fontWeight: '700',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#38bdf8' }}>●</span>
          <span>{currentSpec.name}</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={toggleMute} style={topBtnStyle}>
            {isMuted ? '🔇 음소거' : '🔊 효과음'}
          </button>
          <button
            onClick={() => {
              if (window.confirm('현재 캐릭터를 초기화하고 새 알부터 시작할까요?')) {
                startNextGeneration(true);
              }
            }}
            style={topBtnStyle}
          >
            🔄 초기화
          </button>
        </div>
      </div>

      {/* 중앙 다마고치 본체 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            transform: 'scale(1.32)',
            transformOrigin: 'center center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TamagotchiShell
            skinKey={pet.skin}
            coins={pet.coins}
            selectedMenuIdx={selectedMenuIdx}
            onPressA={handlePressA}
            onPressB={handlePressB}
            onPressC={handlePressC}
            onSelectMenu={(idx) => {
              setSelectedMenuIdx(idx);
              executeMenuAction(MENU_IDS[idx]);
            }}
          >
            {lcdScreen === 'FOOD' && (
              <div style={lcdColStyle}>
                <div style={{ fontSize: '9px', fontWeight: '900' }}>[식사 및 간식]</div>
                <button onClick={() => feedPet('RICE')} style={lcdBtnStyle}>
                  🍙 주먹밥 (+체력15)
                </button>
                <button onClick={() => feedPet('CAKE')} style={lcdBtnStyle}>
                  🍰 케이크 ({pet.snackDate === getTodayStr() ? pet.snacksToday : 0}/3)
                </button>
              </div>
            )}

            {lcdScreen === 'GAME' && (
              <MiniGame
                onFinish={(bonus, msg) => {
                  const isWin = bonus >= 25;
                  setPet((p) => ({
                    ...p,
                    energy: Math.max(0, (p.energy ?? 100) - 20),
                    happiness: Math.min(100, p.happiness + bonus),
                    coins: p.coins + (isWin ? 15 : 5),
                    gameWins: (p.gameWins || 0) + (isWin ? 1 : 0),
                    careStats: { ...p.careStats, sky: (p.careStats?.sky || 1) + (isWin ? 2 : 1) },
                  }));
                  triggerAction('HAPPY');
                  setLcdScreen('PET');
                  triggerReaction(isWin ? `${msg} +15🪙` : `${msg} +5🪙`);
                }}
                onClose={() => setLcdScreen('PET')}
              />
            )}

            {lcdScreen === 'SHOP' && (
              <div style={lcdColStyle}>
                <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                  <button onClick={() => { sfx.beep(); setShopTab('SKIN'); }} style={tabBtnStyle(shopTab === 'SKIN')}>
                    기기스킨
                  </button>
                  <button onClick={() => { sfx.beep(); setShopTab('ITEM'); }} style={tabBtnStyle(shopTab === 'ITEM')}>
                    아이템
                  </button>
                </div>

                {shopTab === 'SKIN' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', width: '100%' }}>
                    {SKIN_KEYS.map((key) => {
                      const info = SHELL_SKINS[key];
                      const unlocked = pet.unlockedSkins?.includes(key);
                      const equipped = pet.skin === key;
                      return (
                        <button
                          key={key}
                          onClick={() => buyOrEquipSkin(key)}
                          style={{
                            background: equipped ? '#1e293b' : 'rgba(15,23,42,0.1)',
                            color: equipped ? '#cbd5c0' : '#0f172a',
                            border: '1px solid #1e293b',
                            borderRadius: '3px',
                            fontSize: '7.5px',
                            fontWeight: 'bold',
                            padding: '2px 1px',
                            cursor: 'pointer',
                          }}
                        >
                          {info.name.slice(0, 4)} {unlocked ? (equipped ? '✓' : '착용') : `${info.price}🪙`}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
                    <button onClick={buyEnergyDrink} style={shopItemStyle}>
                      ⚡ 드링크 15🪙 (체력+50)
                    </button>
                    <button onClick={() => buyAttributeFruit('sky', '하늘')} style={shopItemStyle}>
                      🍑 하늘열매 30🪙 (+3)
                    </button>
                    <button onClick={() => buyAttributeFruit('land', '대지')} style={shopItemStyle}>
                      🍏 대지열매 30🪙 (+3)
                    </button>
                    <button onClick={() => buyAttributeFruit('water', '바다')} style={shopItemStyle}>
                      🫐 바다열매 30🪙 (+3)
                    </button>
                  </div>
                )}
              </div>
            )}

            {lcdScreen === 'STATUS' && (
              <div style={{ width: '100%', fontSize: '8.5px', fontFamily: 'monospace', color: '#0f172a', fontWeight: 'bold', display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
                <div style={{ textAlign: 'center', borderBottom: '1px solid #1e293b' }}>
                  {currentSpec.name} ({Math.floor(pet.ageSeconds / 60)}분)
                </div>
                <div>포만: {'■'.repeat(Math.ceil(pet.hunger / 20))}{'□'.repeat(5 - Math.ceil(pet.hunger / 20))}</div>
                <div>행복: {'■'.repeat(Math.ceil(pet.happiness / 20))}{'□'.repeat(5 - Math.ceil(pet.happiness / 20))}</div>
                <div>체력: {'■'.repeat(Math.ceil((pet.energy ?? 100) / 20))}{'□'.repeat(5 - Math.ceil((pet.energy ?? 100) / 20))}</div>
                {canGraduate ? (
                  <button
                    onClick={() => startNextGeneration(false)}
                    style={{ background: '#1e293b', color: '#cbd5c0', border: 'none', borderRadius: '3px', fontSize: '8px', fontWeight: 'bold', padding: '2px', cursor: 'pointer', marginTop: '1px' }}
                  >
                    🥚 2세대 알 물려받기
                  </button>
                ) : (
                  <div style={{ fontSize: '7.5px' }}>
                    승리:{pet.gameWins || 0}회 | 도감:{pet.unlockedSpecies?.length || 1}/23
                  </div>
                )}
              </div>
            )}

            {lcdScreen === 'PET' && (
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {reaction && (
                  <div style={{ fontSize: '8.5px', fontWeight: '900', fontFamily: 'monospace', color: '#0f172a', background: 'rgba(255,255,255,0.65)', padding: '1px 4px', borderRadius: '3px', marginBottom: '2px', textAlign: 'center' }}>
                    {reaction}
                  </div>
                )}
                <PetSprite
                  speciesId={pet.speciesId}
                  direction={direction}
                  frame={frame}
                  actionState={actionState}
                  isSleeping={isSleeping}
                  isDirty={pet.cleanliness < 35}
                  lcdMode={true}
                />
                {pet.poopCount > 0 && (
                  <span style={{ position: 'absolute', bottom: 0, right: -14, fontSize: '13px', filter: 'grayscale(100%) contrast(180%)' }}>
                    {'💩'.repeat(pet.poopCount)}
                  </span>
                )}
              </div>
            )}
          </TamagotchiShell>
        </div>
      </div>

      {/* 진화 도감 전체화면 오버레이 모달 */}
      {showDex && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.78)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <EvolutionDexModal
            unlockedSpecies={pet.unlockedSpecies}
            currentSpeciesId={pet.speciesId}
            careStats={pet.careStats}
            onClose={() => {
              sfx.beep();
              setShowDex(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

const topBtnStyle = {
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '8px',
  color: '#f8fafc',
  fontSize: '11px',
  fontWeight: '700',
  padding: '5px 10px',
  cursor: 'pointer',
};

const lcdColStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '3px',
  fontFamily: 'monospace',
  color: '#0f172a',
};

const lcdBtnStyle = {
  width: '100%',
  background: 'rgba(15,23,42,0.12)',
  border: '1.5px solid #1e293b',
  borderRadius: '4px',
  padding: '3px 4px',
  fontSize: '8.5px',
  fontWeight: 'bold',
  color: '#0f172a',
  cursor: 'pointer',
};

const tabBtnStyle = (active) => ({
  flex: 1,
  background: active ? '#1e293b' : 'transparent',
  color: active ? '#cbd5c0' : '#0f172a',
  border: '1px solid #1e293b',
  fontSize: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
});

const shopItemStyle = {
  width: '100%',
  background: 'rgba(15,23,42,0.1)',
  border: '1px solid #1e293b',
  borderRadius: '3px',
  padding: '1.5px 3px',
  fontSize: '7.5px',
  fontWeight: 'bold',
  color: '#0f172a',
  cursor: 'pointer',
  textAlign: 'left',
};