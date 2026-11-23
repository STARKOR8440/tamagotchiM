import React, { useState, useEffect, useRef } from 'react';
import PetSprite from './PetSprite';
import MiniGame from './MiniGame';
import TamagotchiShell, { SHELL_SKINS } from './TamagotchiShell';
import EvolutionDexModal from './EvolutionDexModal';
import GuideModal from './GuideModal';
import ShareCardModal from './ShareCardModal';
import PlazaModal from './PlazaModal';
import { FIREBASE_DB_URL, isFirebaseConfigured } from './firebaseConfig';
import {
  SPECIES,
  checkEvolutionStatus,
  evolveCrossRandom,
  reincarnateAdult,
  resolveSecretVariant,
} from './evolutionTree';
import { sfx } from './sound';

const STORAGE_KEY = 'mobile_tamagotchi_pwa_v1';
const MENU_IDS = ['FEED', 'PLAY', 'CLEAN', 'SHOP', 'STATUS', 'DEX'];
const DEV_PASSCODE = '8440';

const FOOD_MENU = [
  // 1페이지: 식사류 (효과 비례: 무료 -> 7코인 -> 9코인)
  { id: 'RICE', category: 'MEAL', name: '🍙 주먹밥', price: 0, hunger: 20, happiness: 0, energy: 15, clean: 0, biome: 'land', stat: 1 },
  { id: 'SUSHI', category: 'MEAL', name: '🍣 초밥', price: 7, hunger: 25, happiness: 10, energy: 20, clean: 0, biome: 'water', stat: 2 },
  { id: 'RAMEN', category: 'MEAL', name: '🍜 라멘', price: 9, hunger: 35, happiness: 5, energy: 25, clean: 0, biome: 'land', stat: 2 },
  // 2페이지: 간식류 (효과 비례: 3코인 -> 5코인 -> 7코인)
  { id: 'CAKE', category: 'SNACK', name: '🍰 케이크', price: 3, hunger: 10, happiness: 20, energy: 5, clean: 0, biome: 'sky', stat: 1 },
  { id: 'MILK', category: 'SNACK', name: '🥛 우유', price: 5, hunger: 15, happiness: 8, energy: 15, clean: 10, biome: 'water', stat: 1 },
  { id: 'PARFAIT', category: 'SNACK', name: '🍨 파르페', price: 7, hunger: 12, happiness: 25, energy: 10, clean: 0, biome: 'sky', stat: 2 },
];

const getTodayStr = () => new Date().toISOString().slice(0, 10);
const createUserId = () => 'u_' + Math.random().toString(36).slice(2, 10);

const INITIAL_STATE = {
  userId: createUserId(),
  nickname: '다마친구',
  plazaAvatarId: 'BABY_MARU',
  hunger: 75,
  happiness: 75,
  cleanliness: 90,
  energy: 100,
  poopCount: 0,
  ageSeconds: 0,
  adultSeconds: 0,
  gameWins: 0,
  winStreak: 0,
  coins: 50,
  digestUntil: 0,
  snacksToday: 0,
  snackDate: getTodayStr(),
  speciesId: 'EGG',
  skin: 'SODA_BLUE',
  unlockedSkins: ['SODA_BLUE'],
  careStats: { sky: 1, land: 1, water: 1 },
  unlockedSpecies: ['EGG'],
  secretHistory: [],
};

export default function App() {
  const [pet, setPet] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_STATE;

    const parsed = JSON.parse(saved);
    const elapsed = Math.max(0, Math.floor((Date.now() - parsed.lastUpdated) / 1000));
    const decay = Math.floor(elapsed / 90);
    const energyGain = Math.floor(elapsed / 15);

    return {
      ...INITIAL_STATE,
      ...parsed,
      userId: parsed.userId || createUserId(),
      nickname: parsed.nickname || '다마친구',
      plazaAvatarId: parsed.plazaAvatarId || (parsed.speciesId !== 'EGG' ? parsed.speciesId : 'BABY_MARU'),
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
  const [foodPage, setFoodPage] = useState(0);
  const [shopTab, setShopTab] = useState('SKIN');
  const [skinPage, setSkinPage] = useState(0);
  const [selectedMenuIdx, setSelectedMenuIdx] = useState(0);
  const [showDex, setShowDex] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showPlaza, setShowPlaza] = useState(false);
  const [devUnlocked, setDevUnlocked] = useState(false);
  const [actionState, setActionState] = useState('IDLE');
  const [isMuted, setIsMuted] = useState(false);

  // 상단 네온 전광판 상태 (방금 올라온 최신 메시지 1개만 단독 표시)
  const [tickerText, setTickerText] = useState('');
  const [tickerActive, setTickerActive] = useState(false);
  const [tickerHighlight, setTickerHighlight] = useState(false);
  const [tickerRunId, setTickerRunId] = useState(0);

  const [direction, setDirection] = useState(1);
  const [frame, setFrame] = useState(0);
  const [reaction, setReaction] = useState('');

  const lastHintAlertRef = useRef(0);
  const devTapRef = useRef({ count: 0, lastTime: 0 });
  const lastMsgKeyRef = useRef(null);
  const highlightTimerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...pet, lastUpdated: Date.now() }));
  }, [pet]);

  // 새 메시지 1개 감지 시 전광판 강제 리셋 및 3회 스크롤 가동 & 6초간 네온 강조
  const triggerSingleTicker = (singleMessage) => {
    setTickerText(singleMessage);
    setTickerActive(true);
    setTickerHighlight(true);
    setTickerRunId((id) => id + 1);

    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = setTimeout(() => {
      setTickerHighlight(false);
    }, 6000);
  };

  // 광장 가장 최신 메시지 1개만 폴링
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const fetchLatestTicker = async () => {
      try {
        const res = await fetch(`${FIREBASE_DB_URL}/plaza/messages.json?orderBy="$key"&limitToLast=1`);
        const data = await res.json();
        if (!data) return;

        const keys = Object.keys(data);
        const latestKey = keys[keys.length - 1];
        if (!latestKey || latestKey === lastMsgKeyRef.current) return;

        lastMsgKeyRef.current = latestKey;
        const latestMsg = data[latestKey];
        if (latestMsg) {
          const text = latestMsg.isSystem
            ? latestMsg.text
            : `[${latestMsg.sender}] ${latestMsg.text}`;
          triggerSingleTicker(text);
        }
      } catch {
        // 네트워크 일시 오류 무시
      }
    };

    fetchLatestTicker();
    const tickerTimer = setInterval(fetchLatestTicker, 3000);
    return () => clearInterval(tickerTimer);
  }, [showPlaza]);

  // 친구가 보낸 선물 실시간 수신 체크
  useEffect(() => {
    if (!isFirebaseConfigured() || !pet.userId) return;

    const checkGifts = async () => {
      try {
        const res = await fetch(`${FIREBASE_DB_URL}/plaza/gifts/${pet.userId}.json`);
        const gifts = await res.json();
        if (!gifts) return;

        await fetch(`${FIREBASE_DB_URL}/plaza/gifts/${pet.userId}.json`, { method: 'DELETE' });

        const list = Object.values(gifts);
        if (list.length > 0) {
          const latest = list[list.length - 1];
          sfx.win();
          triggerAction('HAPPY');
          setPet((p) => {
            let addHappiness = 0;
            let addHunger = 0;
            let addCoins = 0;
            list.forEach((g) => {
              if (g.type === 'HEART') addHappiness += 15;
              if (g.type === 'CAKE') addHunger += 15;
              if (g.type === 'COIN') addCoins += 20;
            });
            return {
              ...p,
              happiness: Math.min(100, p.happiness + addHappiness),
              hunger: Math.min(100, p.hunger + addHunger),
              coins: (p.coins || 0) + addCoins,
            };
          });
          triggerReaction(`🎁 [${latest.from}]님의 선물 도착!`);
        }
      } catch {
        // 무시
      }
    };

    const giftTimer = setInterval(checkGifts, 5000);
    return () => clearInterval(giftTimer);
  }, [pet.userId]);

  const handleSecretBadgeTap = () => {
    if (devUnlocked) return;
    const now = Date.now();
    if (now - devTapRef.current.lastTime < 600) {
      devTapRef.current.count += 1;
    } else {
      devTapRef.current.count = 1;
    }
    devTapRef.current.lastTime = now;

    if (devTapRef.current.count >= 5) {
      devTapRef.current.count = 0;
      const input = window.prompt('Developer Passcode:');
      if (input === DEV_PASSCODE) {
        sfx.confirm();
        setDevUnlocked(true);
        triggerReaction('DEV 모드 활성화 🛠️');
      }
    }
  };

  const applyEvolvedState = (prev, nextSpeciesId) => {
    const evolvedSpec = SPECIES[nextSpeciesId] || SPECIES.ADULT_MAMETCHI;
    const dexKey = evolvedSpec.isSecretVariant ? 'LEGEND_SECRET' : nextSpeciesId;
    const nextUnlockedSpecies = prev.unlockedSpecies?.includes(dexKey)
      ? prev.unlockedSpecies
      : [...(prev.unlockedSpecies || ['EGG']), dexKey];

    let nextSecretHistory = prev.secretHistory || [];
    if (evolvedSpec.isSecretVariant && !nextSecretHistory.includes(nextSpeciesId)) {
      nextSecretHistory = [...nextSecretHistory, nextSpeciesId];
    }

    let nextSkin = prev.skin;
    let nextUnlockedSkins = prev.unlockedSkins || ['SODA_BLUE'];

    if (evolvedSpec.bonusSkin) {
      nextSkin = evolvedSpec.bonusSkin;
      if (!nextUnlockedSkins.includes(evolvedSpec.bonusSkin)) {
        nextUnlockedSkins = [...nextUnlockedSkins, evolvedSpec.bonusSkin];
      }
    }

    return {
      speciesId: nextSpeciesId,
      plazaAvatarId: nextSpeciesId,
      unlockedSpecies: nextUnlockedSpecies,
      secretHistory: nextSecretHistory,
      skin: nextSkin,
      unlockedSkins: nextUnlockedSkins,
      evolvedSpec,
    };
  };

  useEffect(() => {
    const loop = setInterval(() => {
      setPet((prev) => {
        const nextAge = prev.ageSeconds + 1;
        const currentSpec = SPECIES[prev.speciesId] || SPECIES.EGG;
        const nextAdultSec = currentSpec.stage === 'ADULT' ? (prev.adultSeconds || 0) + 1 : 0;

        let evolvedPatch = {
          speciesId: prev.speciesId,
          plazaAvatarId: prev.plazaAvatarId,
          unlockedSpecies: prev.unlockedSpecies || ['EGG'],
          secretHistory: prev.secretHistory || [],
          skin: prev.skin,
          unlockedSkins: prev.unlockedSkins || ['SODA_BLUE'],
        };

        const evoStatus = checkEvolutionStatus({ ...prev, ageSeconds: nextAge });
        if (evoStatus.ready) {
          const nextSpeciesId = evolveCrossRandom(currentSpec.stage, prev.careStats, prev);
          const applied = applyEvolvedState(prev, nextSpeciesId);
          evolvedPatch = {
            speciesId: applied.speciesId,
            plazaAvatarId: applied.plazaAvatarId,
            unlockedSpecies: applied.unlockedSpecies,
            secretHistory: applied.secretHistory,
            skin: applied.skin,
            unlockedSkins: applied.unlockedSkins,
          };
          sfx.evolve();
          triggerAction('HAPPY');
          triggerReaction(
            applied.evolvedSpec.bonusSkin
              ? `시크릿! ${applied.evolvedSpec.name} + 전용스킨! 🎁`
              : `${applied.evolvedSpec.name} 진화! ✨`
          );
        } else if (evoStatus.reason && Date.now() - lastHintAlertRef.current > 45000) {
          triggerReaction(evoStatus.reason);
          lastHintAlertRef.current = Date.now();
        }

        const nextEnergy = nextAge % 15 === 0 ? Math.min(100, (prev.energy ?? 100) + 1) : (prev.energy ?? 100);

        if (nextAge % 90 === 0 && currentSpec.stage !== 'EGG') {
          const nextClean = Math.max(0, prev.cleanliness - 1);
          const addPoop = nextClean < 50 && Math.random() < 0.12 ? 1 : 0;

          return {
            ...prev,
            ...evolvedPatch,
            ageSeconds: nextAge,
            adultSeconds: nextAdultSec,
            energy: nextEnergy,
            hunger: Math.max(0, prev.hunger - 1),
            happiness: Math.max(0, prev.happiness - 1),
            cleanliness: nextClean,
            poopCount: Math.min(3, prev.poopCount + addPoop),
          };
        }

        return {
          ...prev,
          ...evolvedPatch,
          ageSeconds: nextAge,
          adultSeconds: nextAdultSec,
          energy: nextEnergy,
        };
      });
    }, 1000);

    return () => clearInterval(loop);
  }, []);

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
    setTimeout(() => setReaction(''), 2500);
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
    if (isHardReset) {
      setPet((prev) => ({
        ...INITIAL_STATE,
        userId: prev.userId,
        nickname: prev.nickname,
        snackDate: getTodayStr(),
      }));
    } else {
      setPet((prev) => ({
        ...INITIAL_STATE,
        userId: prev.userId,
        nickname: prev.nickname,
        plazaAvatarId: prev.plazaAvatarId,
        snackDate: getTodayStr(),
        coins: prev.coins + 50,
        skin: prev.skin,
        unlockedSkins: prev.unlockedSkins,
        unlockedSpecies: prev.unlockedSpecies,
        secretHistory: prev.secretHistory || [],
      }));
    }
    setLcdScreen('PET');
    setShowDex(false);
    setShowGuide(false);
    triggerReaction(isHardReset ? '처음부터 새 알! 🥚' : '독립 완료! 2세대 알 도착 🥚');
  };

  // 2) feedPet 함수 교체 (약 303번째 줄)
  const feedPet = (foodItem) => {
    const now = Date.now();
    const today = getTodayStr();
    const currentSnacks = pet.snackDate === today ? pet.snacksToday : 0;
    const cost = foodItem.price || 0;

    if ((pet.coins || 0) < cost) {
      sfx.beep();
      triggerReaction(`코인 부족! (${cost}🪙 필요) 💸`);
      setLcdScreen('PET');
      return;
    }

    if (foodItem.category === 'MEAL') {
      if (pet.hunger >= 95) {
        sfx.beep();
        triggerReaction('배가 꽉 찼어! (포만 95↑) 🙅');
        setLcdScreen('PET');
        return;
      }
      if (now < (pet.digestUntil || 0)) {
        const remainSec = Math.ceil((pet.digestUntil - now) / 1000);
        const min = Math.floor(remainSec / 60);
        const sec = remainSec % 60;
        sfx.beep();
        triggerReaction(`소화 중! ${min > 0 ? `${min}분 ` : ''}${sec}초 뒤 가능 ⏳`);
        setLcdScreen('PET');
        return;
      }

      sfx.eat();
      triggerAction('EAT');
      setPet((p) => ({
        ...p,
        coins: (p.coins || 0) - cost,
        hunger: Math.min(100, p.hunger + foodItem.hunger),
        happiness: Math.min(100, p.happiness + foodItem.happiness),
        energy: Math.min(100, (p.energy ?? 100) + foodItem.energy),
        digestUntil: now + 3 * 60 * 1000,
        careStats: {
          ...p.careStats,
          [foodItem.biome]: (p.careStats?.[foodItem.biome] || 1) + foodItem.stat,
        },
      }));
      triggerReaction(`${foodItem.name} 냠! ${cost > 0 ? `(-${cost}🪙)` : '(무료)'}`);
    } else {
      if (currentSnacks >= 6) {
        sfx.beep();
        triggerReaction('오늘 간식(6/6) 끝! 내일 또 먹자 🦷');
        setLcdScreen('PET');
        return;
      }
      sfx.eat();
      triggerAction('EAT');
      setPet((p) => ({
        ...p,
        coins: (p.coins || 0) - cost,
        hunger: Math.min(100, p.hunger + foodItem.hunger),
        happiness: Math.min(100, p.happiness + foodItem.happiness),
        energy: Math.min(100, (p.energy ?? 100) + foodItem.energy),
        cleanliness: Math.min(100, p.cleanliness + foodItem.clean),
        snacksToday: currentSnacks + 1,
        snackDate: today,
        careStats: {
          ...p.careStats,
          [foodItem.biome]: (p.careStats?.[foodItem.biome] || 1) + foodItem.stat,
        },
      }));
      triggerReaction(`${foodItem.name} 냠! -${cost}🪙 (${currentSnacks + 1}/6)`);
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

    const nextSpeciesId = reincarnateAdult(
      pet.speciesId,
      pet.careStats,
      pet.unlockedSpecies,
      pet.gameWins || 0
    );
    const applied = applyEvolvedState(pet, nextSpeciesId);

    sfx.evolve();
    triggerAction('HAPPY');
    setPet((p) => ({
      ...p,
      ...applied,
      coins: p.coins - price,
    }));
    setLcdScreen('PET');
    triggerReaction(
      applied.evolvedSpec.bonusSkin
        ? `시크릿 환생! ${applied.evolvedSpec.name} + 전용스킨 🎁`
        : `${applied.evolvedSpec.name}(으)로 환생 완료! 🔮✨`
    );
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
      if ((pet.energy ?? 100) < 12) {
        sfx.beep();
        triggerReaction('체력 부족! 밥이나 간식 필요 ⚡');
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
    if (lcdScreen === 'FOOD') {
      setFoodPage((prev) => (prev === 0 ? 1 : 0));
      return;
    }
    if (lcdScreen === 'SHOP') {
      setShopTab((prev) => (prev === 'SKIN' ? 'ITEM' : 'SKIN'));
      return;
    }
    setSelectedMenuIdx((prev) => (prev + 1) % MENU_IDS.length);
  };

  const handlePressB = () => {
    if (lcdScreen === 'FOOD') {
      sfx.beep();
      setFoodPage((prev) => (prev === 0 ? 1 : 0));
      return;
    }
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

  const availableShopSkins = Object.keys(SHELL_SKINS).filter(
    (k) => !SHELL_SKINS[k].isSecret || pet.unlockedSkins?.includes(k)
  );
  const totalSkinPages = Math.ceil(availableShopSkins.length / 4);
  const safeSkinPage = skinPage >= totalSkinPages ? 0 : skinPage;
  const pagedSkins = availableShopSkins.slice(safeSkinPage * 4, safeSkinPage * 4 + 4);

  const visibleFoods = FOOD_MENU.filter((f) =>
    foodPage === 0 ? f.category === 'MEAL' : f.category === 'SNACK'
  );
  const todaySnacksUsed = pet.snackDate === getTodayStr() ? pet.snacksToday : 0;

  // 단일 최신 메시지 길이에 맞춘 1회 롤링 시간 (최소 5.5초)
  const tickerDuration = Math.max(5.5, Math.round(tickerText.length * 0.22));

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 12px',
        boxSizing: 'border-box',
        position: 'relative',
        background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
      }}
    >
      {/* 네온 LED 전광판: 왼쪽 끝에서 즉시 시작해 3회 롤링 후 자동 리셋 */}
      <style>{`
        @keyframes neonMarqueeImmediate {
          0% { transform: translateX(8%); }
          12% { transform: translateX(8%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes neonFlashPulse {
          0%, 100% {
            border-color: #facc15;
            box-shadow: 0 0 14px rgba(250, 204, 21, 0.9), inset 0 0 10px rgba(250, 204, 21, 0.45);
          }
          50% {
            border-color: #f43f5e;
            box-shadow: 0 0 18px rgba(244, 63, 94, 0.95), inset 0 0 12px rgba(244, 63, 94, 0.55);
          }
        }
      `}</style>

      {/* 상단 영역 (유틸리티 바 + 네온 채팅 전광판) */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          gap: '7px',
          zIndex: 10,
        }}
      >
        {/* 1행: 상단 유틸리티 바 */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <div
            onClick={handleSecretBadgeTap}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#ffffff',
              border: '1.5px solid #bae6fd',
              borderRadius: '20px',
              padding: '5px 9px',
              color: '#0f172a',
              fontSize: '11.5px',
              fontWeight: '800',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.06)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            }}
          >
            <span style={{ color: '#0284c7' }}>●</span>
            <span>{currentSpec.name}</span>
          </div>

          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            <button
              onClick={() => {
                sfx.confirm();
                setShowPlaza(true);
              }}
              style={{ ...topBtnStyle, background: '#e0f2fe', borderColor: '#38bdf8', color: '#0369a1' }}
              title="실시간 광장 및 1:1 통신 대전"
            >
              📡 광장
            </button>
            <button
              onClick={() => {
                sfx.confirm();
                setShowShare(true);
              }}
              style={topBtnStyle}
              title="인증샷 저장 및 공유"
            >
              📸
            </button>
            <button
              onClick={() => {
                sfx.confirm();
                setShowGuide(true);
              }}
              style={topBtnStyle}
              title="사용 가이드"
            >
              ?
            </button>
            <button onClick={toggleMute} style={topBtnStyle} title="소리 켜기/끄기">
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button
              onClick={() => {
                if (window.confirm('현재 캐릭터와 스킨을 초기화하고 새 알부터 시작할까요?')) {
                  startNextGeneration(true);
                }
              }}
              style={topBtnStyle}
              title="초기화"
            >
              🔄
            </button>
          </div>
        </div>

        {/* 2행: 실시간 광장 네온 LED 전광판 (최신 메시지 1개만 단독 노출 + 3회 스크롤 후 대기 리셋) */}
        <div
          onClick={() => {
            sfx.beep();
            setTickerHighlight(false);
            setShowPlaza(true);
          }}
          title="터치하여 광장 채팅 열기"
          style={{
            width: '100%',
            height: '26px',
            background: 'linear-gradient(90deg, #090d16 0%, #111827 50%, #090d16 100%)',
            border: tickerHighlight ? '1.5px solid #facc15' : '1.5px solid #38bdf8',
            borderRadius: '12px',
            boxShadow: tickerHighlight
              ? '0 0 14px rgba(250, 204, 21, 0.9)'
              : '0 0 10px rgba(56, 189, 248, 0.3), inset 0 0 8px rgba(14, 165, 233, 0.22)',
            animation: tickerHighlight ? 'neonFlashPulse 0.85s ease-in-out infinite' : 'none',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
        >
          {/* 좌측 LIVE / NEW 네온 뱃지 */}
          <div
            style={{
              background: tickerHighlight ? '#f59e0b' : '#0284c7',
              color: tickerHighlight ? '#0f172a' : '#ffffff',
              fontSize: '9px',
              fontWeight: '900',
              letterSpacing: '0.5px',
              padding: '0 7px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              zIndex: 2,
              boxShadow: '2px 0 8px rgba(0, 0, 0, 0.6)',
              transition: 'background 0.25s',
            }}
          >
            {tickerHighlight ? 'NEW!' : 'LIVE'}
          </div>

          {/* 우측 트랙: 방금 올라온 최신 메시지 1개만 표시되며 3회 스크롤 후 자동 리셋 */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            {tickerActive && tickerText ? (
              <div
                key={tickerRunId}
                onAnimationEnd={() => {
                  setTickerActive(false);
                  setTickerHighlight(false);
                }}
                style={{
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  paddingRight: '40px',
                  animation: `neonMarqueeImmediate ${tickerDuration}s linear 3`,
                }}
              >
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: '800',
                    color: tickerHighlight ? '#fef08a' : '#7dd3fc',
                    textShadow: tickerHighlight
                      ? '0 0 7px #facc15, 0 0 14px #f59e0b'
                      : '0 0 6px #38bdf8, 0 0 12px #0284c7',
                  }}
                >
                  {tickerText}
                </span>
              </div>
            ) : (
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '10.5px',
                  fontWeight: '700',
                  color: '#64748b',
                  letterSpacing: '0.3px',
                }}
              >
                📡 광장 연결됨 · 터치하여 실시간 채팅 및 선물하기
              </div>
            )}
          </div>
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
            transform: 'scale(1.28)',
            transformOrigin: 'center center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TamagotchiShell
            skinKey={pet.skin}
            coins={pet.coins}
            isSleeping={isSleeping}
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
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2px', color: '#0f172a' }}>
                <div style={{ display: 'flex', gap: '2px', width: '100%' }}>
                  <button
                    onClick={() => { sfx.beep(); setFoodPage(0); }}
                    style={{
                      flex: 1,
                      background: foodPage === 0 ? '#1e293b' : 'rgba(15,23,42,0.08)',
                      color: foodPage === 0 ? '#f8fafc' : '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '3px',
                      fontSize: '8px',
                      padding: '1px 0',
                      cursor: 'pointer',
                    }}
                  >
                    식사(3분쿨)
                  </button>
                  <button
                    onClick={() => { sfx.beep(); setFoodPage(1); }}
                    style={{
                      flex: 1,
                      background: foodPage === 1 ? '#1e293b' : 'rgba(15,23,42,0.08)',
                      color: foodPage === 1 ? '#f8fafc' : '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '3px',
                      fontSize: '8px',
                      padding: '1px 0',
                      cursor: 'pointer',
                    }}
                  >
                    간식({todaySnacksUsed}/6)
                  </button>
                </div>

                {visibleFoods.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => feedPet(item)}
                    style={{
                      ...lcdBtnStyle,
                      padding: '2px 4px',
                      fontSize: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{item.name}</span>
                    <span style={{ opacity: 0.85, fontWeight: '800' }}>
                      {item.price === 0 ? '무료' : `${item.price}🪙`}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {lcdScreen === 'GAME' && (
              <MiniGame
                winStreak={pet.winStreak || 0}
                onFinish={(bonus, msg, customCoins, bonusWins, isWin) => {
                  setPet((p) => ({
                    ...p,
                    energy: Math.max(0, (p.energy ?? 100) - 12),
                    happiness: Math.min(100, p.happiness + bonus),
                    coins: p.coins + customCoins,
                    gameWins: (p.gameWins || 0) + bonusWins,
                    winStreak: isWin ? (p.winStreak || 0) + 1 : 0,
                    careStats: { ...p.careStats, sky: (p.careStats?.sky || 1) + (isWin ? 2 : 1) },
                  }));
                  triggerAction('HAPPY');
                  setLcdScreen('PET');
                  triggerReaction(`${msg} +${customCoins}🪙`);
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
                    스킨({availableShopSkins.length})
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
                      onClick={() => { sfx.beep(); setSkinPage((p) => (p + 1) % totalSkinPages); }}
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
                      다음 스킨 ▶ ({safeSkinPage + 1}/{totalSkinPages})
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
                      background: 'rgba(255,255,255,0.82)',
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

      {/* 개발자 전용 숨겨진 테스트 바 */}
      {devUnlocked && (
        <div
          style={{
            display: 'flex',
            gap: '5px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.92)',
            padding: '6px 10px',
            borderRadius: '14px',
            zIndex: 20,
          }}
        >
          <button
            onClick={() => {
              sfx.win();
              setPet((p) => ({ ...p, coins: (p.coins || 0) + 1000, energy: 100 }));
              triggerReaction('+1000🪙 & 풀충전');
            }}
            style={devBtnStyle}
          >
            +1000🪙
          </button>
          <button
            onClick={() => {
              sfx.win();
              setPet((p) => ({
                ...p,
                gameWins: Math.max(50, (p.gameWins || 0) + 50),
                careStats: { sky: 50, land: 50, water: 50 },
              }));
              triggerReaction('올스탯50 & 50승 세팅');
            }}
            style={devBtnStyle}
          >
            전설조건
          </button>
          <button
            onClick={() => {
              const nextId = evolveCrossRandom(currentSpec.stage, pet.careStats, pet);
              const applied = applyEvolvedState(pet, nextId);
              sfx.evolve();
              setPet((p) => ({ ...p, ...applied, hunger: 100, happiness: 100, energy: 100 }));
              triggerReaction(`진화: ${applied.evolvedSpec.name}`);
            }}
            style={devBtnStyle}
          >
            즉시진화
          </button>
          <button
            onClick={() => {
              const nextSec = resolveSecretVariant(pet.speciesId);
              const applied = applyEvolvedState(pet, nextSec);
              sfx.evolve();
              setPet((p) => ({ ...p, ...applied, hunger: 100, happiness: 100, energy: 100 }));
              triggerReaction(`시크릿: ${applied.evolvedSpec.name}`);
            }}
            style={devBtnStyle}
          >
            시크릿5종
          </button>
          <button
            onClick={() => setDevUnlocked(false)}
            style={{ ...devBtnStyle, background: '#ef4444' }}
          >
            닫기
          </button>
        </div>
      )}

      {/* 통합 통신 광장 모달 */}
      {showPlaza && (
        <PlazaModal
          userId={pet.userId}
          nickname={pet.nickname}
          avatarId={pet.plazaAvatarId || 'BABY_MARU'}
          petCoins={pet.coins}
          onUpdateProfile={(newNick, newAvatar) => {
            setPet((p) => ({ ...p, nickname: newNick, plazaAvatarId: newAvatar }));
          }}
          onSendGiftCoin={(cost) => {
            setPet((p) => ({ ...p, coins: Math.max(0, (p.coins || 0) - cost) }));
          }}
          onWinBattleCoin={(reward) => {
            sfx.win();
            setPet((p) => ({ ...p, coins: (p.coins || 0) + reward }));
          }}
          onClose={() => {
            sfx.beep();
            setShowPlaza(false);
          }}
        />
      )}

      {/* 인증샷 카드 모달 */}
      {showShare && (
        <ShareCardModal
          pet={pet}
          onClose={() => {
            sfx.beep();
            setShowShare(false);
          }}
        />
      )}

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
            secretHistory={pet.secretHistory || []}
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
  fontSize: '11px',
  fontWeight: '800',
  padding: '5px 7px',
  cursor: 'pointer',
  boxShadow: '0 2px 5px rgba(15, 23, 42, 0.06)',
};

const devBtnStyle = {
  background: '#0284c7',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '10.5px',
  fontWeight: '800',
  padding: '5px 8px',
  cursor: 'pointer',
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