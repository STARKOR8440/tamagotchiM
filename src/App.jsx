import React, { useState, useEffect, useRef } from 'react';
import PetSprite from './PetSprite';
import MiniGame from './MiniGame';
import TamagotchiShell, { SHELL_SKINS } from './TamagotchiShell';
import EvolutionDexModal from './EvolutionDexModal';
import GuideModal from './GuideModal';
import {
  SPECIES,
  checkEvolutionStatus,
  evolveCrossRandom,
  reincarnateAdult,
} from './evolutionTree';
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
  const [skinPage, setSkinPage] = useState(0);
  const [selectedMenuIdx, setSelectedMenuIdx] = useState(0);
  const [showDex, setShowDex] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [actionState, setActionState] = useState('IDLE');
  const [isMuted, setIsMuted] = useState(false);

  const [direction, setDirection] = useState(1);
  const [frame, setFrame] = useState(0);
  const [reaction, setReaction] = useState('');

  const lastHintAlertRef = useRef(0);
  const cheatSeqRef = useRef([]);

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
          nextSpeciesId = evolveCrossRandom(currentSpec.stage, prev.careStats, prev);
          const evolvedSpec = SPECIES[nextSpeciesId];
          if (!nextUnlocked.includes(nextSpeciesId)) {
            nextUnlocked = [...nextUnlocked, nextSpeciesId];
          }
          sfx.evolve();
          triggerAction('HAPPY');
          triggerReaction(`${evolvedSpec.name} 진화! ✨`);
        } else if (evoStatus.reason && Date.now() - lastHintAlertRef.current > 45000) {
          triggerReaction(evoStatus.reason);
          lastHintAlertRef.current = Date.now();
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

  // 히든 치트 커맨드 3종
  const recordCheatInput = (btn) => {
    const nextSeq = [...cheatSeqRef.current, btn].slice(-5);
    cheatSeqRef.current = nextSeq;
    const code = nextSeq.join('');

    if (code === 'AABBC') {
      cheatSeqRef.current = [];
      sfx.evolve();
      triggerAction('HAPPY');
      setPet((p) => ({
        ...p,
        coins: (p.coins || 0) + 500,
        energy: 100,
      }));
      setLcdScreen('PET');
      setShowDex(false);
      setShowGuide(false);
      triggerReaction('치트 발동! +500🪙 & 풀충전 🎉');
      return true;
    }

    if (code === 'BBACC') {
      cheatSeqRef.current = [];
      sfx.win();
      triggerAction('HAPPY');
      setPet((p) => ({
        ...p,
        coins: (p.coins || 0) + 2000,
        energy: 100,
        careStats: {
          sky: (p.careStats?.sky || 1) + 5,
          land: (p.careStats?.land || 1) + 5,
          water: (p.careStats?.water || 1) + 5,
        },
      }));
      setLcdScreen('PET');
      setShowDex(false);
      setShowGuide(false);
      triggerReaction('아이템 치트! +2000🪙 & 올스탯+5 🔮');
      return true;
    }

    if (code === 'CCABB') {
      cheatSeqRef.current = [];
      const currentSpec = SPECIES[pet.speciesId] || SPECIES.EGG;

      const nextSpeciesId =
        currentSpec.stage === 'ADULT'
          ? reincarnateAdult(pet.speciesId, pet.careStats, pet.unlockedSpecies)
          : evolveCrossRandom(currentSpec.stage, pet.careStats, {
              ...pet,
              gameWins: Math.max(5, pet.gameWins || 0),
              hunger: 100,
              happiness: 100,
            });

      const evolvedSpec = SPECIES[nextSpeciesId];
      sfx.evolve();
      triggerAction('HAPPY');
      setPet((p) => ({
        ...p,
        speciesId: nextSpeciesId,
        hunger: 100,
        happiness: 100,
        cleanliness: 100,
        energy: 100,
        poopCount: 0,
        unlockedSpecies: p.unlockedSpecies?.includes(nextSpeciesId)
          ? p.unlockedSpecies
          : [...(p.unlockedSpecies || ['EGG']), nextSpeciesId],
      }));
      setLcdScreen('PET');
      setShowDex(false);
      setShowGuide(false);
      triggerReaction(
        currentSpec.stage === 'ADULT'
          ? `성체 환생! ${evolvedSpec.name} 🔮`
          : `치트 진화! ${evolvedSpec.name} ✨`
      );
      return true;
    }

    return false;
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
    setShowGuide(false);
    triggerReaction(isHardReset ? '처음부터 새 알! 🥚' : '독립 완료! 2세대 알 도착 🥚');
  };

  const feedPet = (foodType) => {
    const now = Date.now();
    const today = getTodayStr();
    const currentSnacks = pet.snackDate === today ? pet.snacksToday : 0;

    if (foodType === 'RICE') {
      if (now < (pet.digestUntil || 0)) {
        const remainMin = Math.ceil((pet.digestUntil - now) / 60000);
        sfx.beep();
        triggerReaction(`배불러! ${remainMin}분 뒤 소화됨 🙅`);
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
        triggerReaction('오늘 간식은 끝! 충치 조심 🦷');
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
      triggerReaction(`코인 부족! (${skinInfo.price}🪙 필요)`);
      return;
    }

    sfx.win();
    setPet((p) => ({
      ...p,
      coins: p.coins - skinInfo.price,
      skin: skinKey,
      unlockedSkins: [...(p.unlockedSkins || ['SODA_BLUE']), skinKey],
    }));
    triggerReaction(`${skinInfo.name} 해금 완료! 🎉`);
  };

  const buyEnergyDrink = () => {
    const price = 15;
    if ((pet.energy ?? 100) >= 100) {
      sfx.beep();
      triggerReaction('이미 체력이 가득 찼어요! ⚡');
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

  const buyReincarnationOrb = () => {
    const price = 1000;
    const currentSpec = SPECIES[pet.speciesId] || SPECIES.EGG;
    if (currentSpec.stage !== 'ADULT') {
      sfx.beep();
      triggerReaction('최종 성체만 사용할 수 있어요! 🔮');
      return;
    }
    if (pet.coins < price) {
      sfx.beep();
      triggerReaction('1000🪙가 필요해요!');
      return;
    }

    const nextSpeciesId = reincarnateAdult(pet.speciesId, pet.careStats, pet.unlockedSpecies);
    const nextSpec = SPECIES[nextSpeciesId];

    sfx.evolve();
    triggerAction('HAPPY');
    setPet((p) => ({
      ...p,
      coins: p.coins - price,
      speciesId: nextSpeciesId,
      unlockedSpecies: p.unlockedSpecies?.includes(nextSpeciesId)
        ? p.unlockedSpecies
        : [...(p.unlockedSpecies || ['EGG']), nextSpeciesId],
    }));
    setLcdScreen('PET');
    triggerReaction(`${nextSpec.name}(으)로 환생 완료! 🔮✨`);
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
        triggerReaction('체력 부족! 밥이나 드링크 필요 ⚡');
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
    if (recordCheatInput('A')) return;
    sfx.beep();
    if (lcdScreen === 'SHOP') {
      setShopTab((prev) => (prev === 'SKIN' ? 'ITEM' : 'SKIN'));
      return;
    }
    setSelectedMenuIdx((prev) => (prev + 1) % MENU_IDS.length);
  };

  const handlePressB = () => {
    if (recordCheatInput('B')) return;
    if (lcdScreen === 'SHOP') {
      sfx.beep();
      setShopTab((prev) => (prev === 'SKIN' ? 'ITEM' : 'SKIN'));
      return;
    }
    executeMenuAction(MENU_IDS[selectedMenuIdx]);
  };

  const handlePressC = () => {
    if (recordCheatInput('C')) return;
    sfx.beep();
    setLcdScreen('PET');
  };

  const currentSpec = SPECIES[pet.speciesId] || SPECIES.EGG;
  const currentHour = new Date().getHours();
  const isSleeping = currentHour >= 23 || currentHour < 6;
  const canGraduate = currentSpec.stage === 'ADULT' && (pet.adultSeconds || 0) >= 86400;
  const pagedSkins = SKIN_KEYS.slice(skinPage * 4, skinPage * 4 + 4);

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        boxSizing: 'border-box',
        position: 'relative',
        background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
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
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#ffffff',
            border: '1.5px solid #bae6fd',
            borderRadius: '20px',
            padding: '5px 12px',
            color: '#0f172a',
            fontSize: '13px',
            fontWeight: '800',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.06)',
          }}
        >
          <span style={{ color: '#0284c7' }}>●</span>
          <span>{currentSpec.name}</span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => {
              sfx.confirm();
              setShowGuide(true);
            }}
            style={topBtnStyle}
          >
            ? 도움말
          </button>
          <button onClick={toggleMute} style={topBtnStyle} title="소리 켜기/끄기">
            {isMuted ? '🔇' : '🔊'}
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
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', color: '#0f172a' }}>
                <div style={{ fontSize: '9.5px', textAlign: 'center', fontWeight: 'bold' }}>식사 및 간식</div>
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
                onFinish={(bonus, msg, customCoins) => {
                  const isWin = bonus >= 20;
                  const earnedCoins = customCoins ?? (isWin ? 15 : 5);
                  setPet((p) => ({
                    ...p,
                    energy: Math.max(0, (p.energy ?? 100) - 20),
                    happiness: Math.min(100, p.happiness + bonus),
                    coins: p.coins + earnedCoins,
                    gameWins: (p.gameWins || 0) + (isWin ? 1 : 0),
                    careStats: { ...p.careStats, sky: (p.careStats?.sky || 1) + (isWin ? 2 : 1) },
                  }));
                  triggerAction('HAPPY');
                  setLcdScreen('PET');
                  triggerReaction(`${msg} +${earnedCoins}🪙`);
                }}
                onClose={() => setLcdScreen('PET')}
              />
            )}

            {lcdScreen === 'SHOP' && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2px', color: '#0f172a' }}>
                <div style={{ display: 'flex', gap: '3px', width: '100%' }}>
                  <button
                    onClick={() => { sfx.beep(); setShopTab('SKIN'); }}
                    style={{
                      flex: 1,
                      background: shopTab === 'SKIN' ? '#1e293b' : 'rgba(15,23,42,0.08)',
                      color: shopTab === 'SKIN' ? '#f8fafc' : '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '3px',
                      fontSize: '8.5px',
                      padding: '1px 0',
                      cursor: 'pointer',
                    }}
                  >
                    스킨(8)
                  </button>
                  <button
                    onClick={() => { sfx.beep(); setShopTab('ITEM'); }}
                    style={{
                      flex: 1,
                      background: shopTab === 'ITEM' ? '#1e293b' : 'rgba(15,23,42,0.08)',
                      color: shopTab === 'ITEM' ? '#f8fafc' : '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '3px',
                      fontSize: '8.5px',
                      padding: '1px 0',
                      cursor: 'pointer',
                    }}
                  >
                    아이템(5)
                  </button>
                </div>

                {shopTab === 'SKIN' ? (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', width: '100%' }}>
                      {pagedSkins.map((key) => {
                        const info = SHELL_SKINS[key];
                        const unlocked = pet.unlockedSkins?.includes(key);
                        const equipped = pet.skin === key;
                        return (
                          <button
                            key={key}
                            onClick={() => buyOrEquipSkin(key)}
                            style={{
                              background: equipped ? '#1e293b' : 'rgba(255,255,255,0.45)',
                              color: equipped ? '#f8fafc' : '#0f172a',
                              border: '1px solid #334155',
                              borderRadius: '3px',
                              fontSize: '7.8px',
                              padding: '2px 1px',
                              cursor: 'pointer',
                            }}
                          >
                            {info.name.slice(0, 4)} {unlocked ? (equipped ? '✓' : '착용') : `${info.price}🪙`}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => { sfx.beep(); setSkinPage((p) => (p === 0 ? 1 : 0)); }}
                      style={{
                        width: '100%',
                        background: 'rgba(15,23,42,0.14)',
                        border: '1px solid #334155',
                        borderRadius: '3px',
                        fontSize: '8px',
                        padding: '1px',
                        cursor: 'pointer',
                        color: '#0f172a',
                      }}
                    >
                      {skinPage === 0 ? '다음 스킨 ▶ (1/2)' : '◀ 이전 스킨 (2/2)'}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', width: '100%' }}>
                    <button onClick={buyEnergyDrink} style={shopGridItemStyle}>
                      ⚡드링크 15🪙
                    </button>
                    <button onClick={() => buyAttributeFruit('sky', '하늘')} style={shopGridItemStyle}>
                      🍑하늘 30🪙
                    </button>
                    <button onClick={() => buyAttributeFruit('land', '대지')} style={shopGridItemStyle}>
                      🍏대지 30🪙
                    </button>
                    <button onClick={() => buyAttributeFruit('water', '바다')} style={shopGridItemStyle}>
                      🫐바다 30🪙
                    </button>
                    <button
                      onClick={buyReincarnationOrb}
                      style={{
                        ...shopGridItemStyle,
                        gridColumn: '1 / -1',
                        background: 'rgba(254, 240, 138, 0.75)',
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}
                    >
                      🔮 성체 환생구슬 1000🪙
                    </button>
                  </div>
                )}
              </div>
            )}

            {lcdScreen === 'STATUS' && (
              <div
                style={{
                  width: '100%',
                  fontSize: '8.5px',
                  color: '#0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2.5px',
                }}
              >
                <div style={{ textAlign: 'center', borderBottom: '1px solid #334155', paddingBottom: '1px' }}>
                  {currentSpec.name} ({Math.floor(pet.ageSeconds / 60)}분)
                </div>
                <StatGauge label="포만" value={pet.hunger} />
                <StatGauge label="행복" value={pet.happiness} />
                <StatGauge label="체력" value={pet.energy ?? 100} />
                {canGraduate ? (
                  <button
                    onClick={() => startNextGeneration(false)}
                    style={{
                      background: '#1e293b',
                      color: '#f8fafc',
                      border: 'none',
                      borderRadius: '3px',
                      fontSize: '8px',
                      padding: '2px',
                      cursor: 'pointer',
                    }}
                  >
                    🥚 2세대 알 물려받기
                  </button>
                ) : (
                  <div style={{ fontSize: '8px', textAlign: 'center', opacity: 0.85 }}>
                    승리 {pet.gameWins || 0}회 · 도감 {pet.unlockedSpecies?.length || 1}/35
                  </div>
                )}
              </div>
            )}

            {lcdScreen === 'PET' && (
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {reaction && (
                  <div
                    style={{
                      fontSize: '8.5px',
                      color: '#0f172a',
                      background: 'rgba(255,255,255,0.72)',
                      border: '1px solid rgba(15,23,42,0.2)',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      marginBottom: '1px',
                      textAlign: 'center',
                    }}
                  >
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
                  lcdMode={false}
                />
                {pet.poopCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: -12,
                      fontSize: '12px',
                      filter: 'grayscale(100%) contrast(180%)',
                    }}
                  >
                    {'💩'.repeat(pet.poopCount)}
                  </span>
                )}
              </div>
            )}
          </TamagotchiShell>
        </div>
      </div>

      {/* 사용 가이드 모달 */}
      {showGuide && (
        <GuideModal
          onClose={() => {
            sfx.beep();
            setShowGuide(false);
          }}
        />
      )}

      {/* 진화 도감 전체화면 오버레이 모달 */}
      {showDex && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.72)',
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

function StatGauge({ label, value }) {
  const safeVal = Math.max(0, Math.min(100, value));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
      <span style={{ width: '24px', fontSize: '8px' }}>{label}</span>
      <div
        style={{
          flex: 1,
          height: '6px',
          border: '1px solid #1e293b',
          borderRadius: '2px',
          background: 'rgba(255,255,255,0.35)',
          padding: '0.5px',
        }}
      >
        <div
          style={{
            width: `${safeVal}%`,
            height: '100%',
            background: '#1e293b',
            transition: 'width 0.2s ease',
          }}
        />
      </div>
      <span style={{ width: '20px', textAlign: 'right', fontSize: '7.5px' }}>{safeVal}</span>
    </div>
  );
}

const topBtnStyle = {
  background: '#ffffff',
  border: '1.5px solid #cbd5e1',
  borderRadius: '10px',
  color: '#0f172a',
  fontSize: '11.5px',
  fontWeight: '800',
  padding: '5px 10px',
  cursor: 'pointer',
  boxShadow: '0 2px 5px rgba(15, 23, 42, 0.06)',
};

const lcdBtnStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.45)',
  border: '1px solid #334155',
  borderRadius: '4px',
  padding: '3px 4px',
  fontSize: '8.5px',
  color: '#0f172a',
  cursor: 'pointer',
};

const shopGridItemStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.5)',
  border: '1px solid #334155',
  borderRadius: '3px',
  padding: '2px 2px',
  fontSize: '7.5px',
  color: '#0f172a',
  cursor: 'pointer',
  textAlign: 'center',
};