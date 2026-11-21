export const SPECIES = {
  // 0단계: 알 (1종)
  EGG: { id: 'EGG', stage: 'EGG', name: '신비한 알', biome: 'ALL', color: '#fef08a', ear: 'none' },

  // 1단계: 중앙 베이비 (1종)
  BABY_MARU: { id: 'BABY_MARU', stage: 'BABY', name: '몽글 베이비', biome: 'ALL', color: '#fde047', ear: 'round' },

  // 2단계: 3대 속성 키드 (3종)
  KID_SKY: { id: 'KID_SKY', stage: 'KID', name: '구름 삐약', biome: 'SKY', color: '#fbcfe8', ear: 'cat' },
  KID_WATER: { id: 'KID_WATER', stage: 'KID', name: '물방울 퐁', biome: 'WATER', color: '#bae6fd', ear: 'fin' },
  KID_LAND: { id: 'KID_LAND', stage: 'KID', name: '새싹 통통', biome: 'LAND', color: '#fde68a', ear: 'antenna' },

  // 3단계: 중간 성장기 (6종)
  TEEN_STAR: { id: 'TEEN_STAR', stage: 'TEEN', name: '별빛 링링', biome: 'SKY', color: '#c7d2fe', ear: 'antenna' },
  TEEN_CLOUD: { id: 'TEEN_CLOUD', stage: 'TEEN', name: '솜사탕 냥', biome: 'SKY', color: '#f9a8d4', ear: 'cat' },
  TEEN_FIN: { id: 'TEEN_FIN', stage: 'TEEN', name: '파도 꼬리', biome: 'WATER', color: '#7dd3fc', ear: 'fin' },
  TEEN_JELLY: { id: 'TEEN_JELLY', stage: 'TEEN', name: '해파리 몽', biome: 'WATER', color: '#93c5fd', ear: 'floppy' },
  TEEN_SPROUT: { id: 'TEEN_SPROUT', stage: 'TEEN', name: '도토리 싹', biome: 'LAND', color: '#fdba74', ear: 'curl' },
  TEEN_CUBE: { id: 'TEEN_CUBE', stage: 'TEEN', name: '네모 블록', biome: 'LAND', color: '#cbd5e1', ear: 'mame' },

  // 4단계: 일반 성체 (18종 - 속성별 6종씩)
  ADULT_PINK_CAT: { id: 'ADULT_PINK_CAT', stage: 'ADULT', name: '핑크 체리냥', biome: 'SKY', color: '#f472b6', ear: 'cat', accent: '#fef08a' },
  ADULT_STAR_BUNNY: { id: 'ADULT_STAR_BUNNY', stage: 'ADULT', name: '별빛 트윈링', biome: 'SKY', color: '#e0e7ff', ear: 'twin', accent: '#facc15' },
  ADULT_OWL: { id: 'ADULT_OWL', stage: 'ADULT', name: '지혜 부엉이', biome: 'SKY', color: '#94a3b8', ear: 'owl', accent: '#fde047' },
  ADULT_SATURN: { id: 'ADULT_SATURN', stage: 'ADULT', name: '토성 별님', biome: 'SKY', color: '#fde047', ear: 'star', accent: '#38bdf8' },
  ADULT_PARROT: { id: 'ADULT_PARROT', stage: 'ADULT', name: '트로피컬 앵무', biome: 'SKY', color: '#4ade80', ear: 'parrot', accent: '#facc15' },
  ADULT_ASTRONAUT: { id: 'ADULT_ASTRONAUT', stage: 'ADULT', name: '코즈믹 우주인', biome: 'SKY', color: '#38bdf8', ear: 'astronaut', accent: '#f43f5e' },

  ADULT_DOLPHIN: { id: 'ADULT_DOLPHIN', stage: 'ADULT', name: '스카이 돌핀', biome: 'WATER', color: '#38bdf8', ear: 'fin', accent: '#fef08a' },
  ADULT_RED_PANDA: { id: 'ADULT_RED_PANDA', stage: 'ADULT', name: '파스텔 레서', biome: 'WATER', color: '#f9a8d4', ear: 'panda', accent: '#3b82f6' },
  ADULT_RIBBON_DOG: { id: 'ADULT_RIBBON_DOG', stage: 'ADULT', name: '리본 말티즈', biome: 'WATER', color: '#ffffff', ear: 'floppy', accent: '#ef4444' },
  ADULT_HEART_BUNNY: { id: 'ADULT_HEART_BUNNY', stage: 'ADULT', name: '하트 프릴토끼', biome: 'WATER', color: '#f8fafc', ear: 'bunny', accent: '#f43f5e' },
  ADULT_AXOLOTL: { id: 'ADULT_AXOLOTL', stage: 'ADULT', name: '핑크 우파루파', biome: 'WATER', color: '#fbcfe8', ear: 'axolotl', accent: '#f472b6' },
  ADULT_PENGUIN: { id: 'ADULT_PENGUIN', stage: 'ADULT', name: '아이스 펭귄', biome: 'WATER', color: '#60a5fa', ear: 'penguin', accent: '#facc15' },

  ADULT_GREEN_DOG: { id: 'ADULT_GREEN_DOG', stage: 'ADULT', name: '에일리언 멍멍', biome: 'LAND', color: '#4ade80', ear: 'floppy', accent: '#fb923c' },
  ADULT_ROBO: { id: 'ADULT_ROBO', stage: 'ADULT', name: '메카 마메치', biome: 'LAND', color: '#e2e8f0', ear: 'mame', accent: '#0284c7' },
  ADULT_MAMETCHI: { id: 'ADULT_MAMETCHI', stage: 'ADULT', name: '클래식 마메치', biome: 'LAND', color: '#fde047', ear: 'mame', accent: '#1e3a8a' },
  ADULT_CURLY: { id: 'ADULT_CURLY', stage: 'ADULT', name: '반짝 뽀글이', biome: 'LAND', color: '#fb923c', ear: 'curl', accent: '#38bdf8' },
  ADULT_CACTUS: { id: 'ADULT_CACTUS', stage: 'ADULT', name: '선인장 삐약', biome: 'LAND', color: '#86efac', ear: 'cactus', accent: '#f43f5e' },
  ADULT_NINJA: { id: 'ADULT_NINJA', stage: 'ADULT', name: '닌자 고자루', biome: 'LAND', color: '#1e293b', ear: 'ninja', accent: '#38bdf8' },

  // 5단계(히든): 전설 & 시크릿 성체 (6종 -> 도감 표시 기준 총 35종)
  LEGEND_DRAGON: { id: 'LEGEND_DRAGON', stage: 'ADULT', isLegend: true, name: '루비 드래곤', biome: 'LEGEND', color: '#f43f5e', ear: 'dragon', accent: '#38bdf8' },
  LEGEND_MERMAID: { id: 'LEGEND_MERMAID', stage: 'ADULT', isLegend: true, name: '오션 머메이드', biome: 'LEGEND', color: '#7dd3fc', ear: 'mermaid', accent: '#fbcfe8' },
  LEGEND_UNICORN: { id: 'LEGEND_UNICORN', stage: 'ADULT', isLegend: true, name: '실버 유니콘', biome: 'LEGEND', color: '#ffffff', ear: 'unicorn', accent: '#facc15' },
  LEGEND_EAST_DRAGON: { id: 'LEGEND_EAST_DRAGON', stage: 'ADULT', isLegend: true, name: '에메랄드 청룡', biome: 'LEGEND', color: '#4ade80', ear: 'east_dragon', accent: '#fde047' },
  LEGEND_NARWHAL: { id: 'LEGEND_NARWHAL', stage: 'ADULT', isLegend: true, name: '오로라 일각고래', biome: 'LEGEND', color: '#a5b4fc', ear: 'narwhal', accent: '#38bdf8' },
  LEGEND_SECRET: { id: 'LEGEND_SECRET', stage: 'ADULT', isLegend: true, name: '시크릿 스페이스', biome: 'LEGEND', color: '#1e1b4b', ear: 'secret', accent: '#facc15' },

  // 6단계(도감 미표시 시크릿 변신 5종): LEGEND_SECRET 당첨 시 랜덤 변신 & 전용 스킨 지급
  SECRET_WOODY: { id: 'SECRET_WOODY', stage: 'ADULT', isLegend: true, isSecretVariant: true, bonusSkin: 'SECRET_TOYSTORY', name: '보안관 우디', biome: 'LEGEND', color: '#facc15', ear: 'woody', accent: '#ef4444' },
  SECRET_GROGU: { id: 'SECRET_GROGU', stage: 'ADULT', isLegend: true, isSecretVariant: true, bonusSkin: 'SECRET_GROGU', name: '베이비 그로구', biome: 'LEGEND', color: '#86efac', ear: 'grogu', accent: '#d6d3d1' },
  SECRET_KITTY: { id: 'SECRET_KITTY', stage: 'ADULT', isLegend: true, isSecretVariant: true, bonusSkin: 'SECRET_KITTY', name: '리본 헬로키티', biome: 'LEGEND', color: '#ffffff', ear: 'kitty', accent: '#ef4444' },
  SECRET_R2D2: { id: 'SECRET_R2D2', stage: 'ADULT', isLegend: true, isSecretVariant: true, bonusSkin: 'SECRET_R2D2', name: '드로이드 R2-D2', biome: 'LEGEND', color: '#f8fafc', ear: 'r2d2', accent: '#2563eb' },
  SECRET_SNOOPY: { id: 'SECRET_SNOOPY', stage: 'ADULT', isLegend: true, isSecretVariant: true, bonusSkin: 'SECRET_PEANUTS', name: '피너츠 스누피', biome: 'LEGEND', color: '#ffffff', ear: 'snoopy', accent: '#ef4444' },
};

export const SECRET_VARIANTS = [
  'SECRET_WOODY',
  'SECRET_GROGU',
  'SECRET_KITTY',
  'SECRET_R2D2',
  'SECRET_SNOOPY',
];

export function resolveSecretVariant(currentSpeciesId = '') {
  const candidates = SECRET_VARIANTS.filter((id) => id !== currentSpeciesId);
  const pool = candidates.length > 0 ? candidates : SECRET_VARIANTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function checkEvolutionStatus(pet) {
  const currentSpec = SPECIES[pet.speciesId] || SPECIES.EGG;
  const age = pet.ageSeconds;

  if (currentSpec.stage === 'EGG') {
    if (age >= 300) return { ready: true };
    return { ready: false, reason: '' };
  }

  if (currentSpec.stage === 'BABY') {
    if (age < 3600) return { ready: false, reason: '' };
    if (pet.hunger < 50 || pet.happiness < 50) {
      return { ready: false, reason: '배고프고 심심해서 진화 못 해!' };
    }
    return { ready: true };
  }

  if (currentSpec.stage === 'KID') {
    if (age < 21600) return { ready: false, reason: '' };
    if ((pet.gameWins || 0) < 2) {
      return { ready: false, reason: `미니게임 ${2 - (pet.gameWins || 0)}승 더 필요해!` };
    }
    return { ready: true };
  }

  if (currentSpec.stage === 'TEEN') {
    if (age < 86400) return { ready: false, reason: '' };
    if (pet.poopCount > 0 || pet.hunger < 40) {
      return { ready: false, reason: '주변이 깨끗하고 배불러야 진화해!' };
    }
    return { ready: true };
  }

  return { ready: false, reason: '' };
}

export function evolveCrossRandom(currentStage, careStats, petState = {}) {
  const { sky = 1, land = 1, water = 1 } = careStats;

  const targetStage =
    currentStage === 'EGG'
      ? 'BABY'
      : currentStage === 'BABY'
      ? 'KID'
      : currentStage === 'KID'
      ? 'TEEN'
      : 'ADULT';

  if (targetStage === 'BABY') return SPECIES.BABY_MARU.id;

  // 전설 히든 출현 조건: 올스탯 50 이상 & 50승 이상
  if (targetStage === 'ADULT') {
    const isAllStats50 = sky >= 50 && land >= 50 && water >= 50;
    const isWins50 = (petState.gameWins || 0) >= 50;
    if (isAllStats50 && isWins50) {
      const legends = Object.values(SPECIES).filter((s) => s.isLegend && !s.isSecretVariant);
      const pickedLegend = legends[Math.floor(Math.random() * legends.length)];
      if (pickedLegend) {
        return pickedLegend.id === 'LEGEND_SECRET' ? resolveSecretVariant() : pickedLegend.id;
      }
    }
  }

  const ranked = [
    { biome: 'SKY', score: sky + Math.random() * 2 },
    { biome: 'LAND', score: land + Math.random() * 2 },
    { biome: 'WATER', score: water + Math.random() * 2 },
  ].sort((a, b) => b.score - a.score);

  const chosenBiome = Math.random() < 0.7 ? ranked[0].biome : ranked[1].biome;

  const candidates = Object.values(SPECIES).filter(
    (s) => s.stage === targetStage && s.biome === chosenBiome && !s.isLegend
  );

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  return picked ? picked.id : SPECIES.ADULT_MAMETCHI.id;
}

export function reincarnateAdult(currentSpeciesId, careStats = {}, unlockedSpecies = [], gameWins = 0) {
  const { sky = 1, land = 1, water = 1 } = careStats;
  const isLegendQualified = sky >= 50 && land >= 50 && water >= 50 && gameWins >= 50;

  const allAdults = Object.values(SPECIES).filter(
    (s) => s.stage === 'ADULT' && !s.isSecretVariant && s.id !== currentSpeciesId
  );

  const candidatePool = isLegendQualified
    ? allAdults
    : allAdults.filter((s) => !s.isLegend);

  const uncollected = candidatePool.filter((s) => !unlockedSpecies.includes(s.id));
  const finalPool = uncollected.length > 0 ? uncollected : candidatePool;

  const picked = finalPool[Math.floor(Math.random() * finalPool.length)];
  if (!picked) return SPECIES.ADULT_MAMETCHI.id;

  return picked.id === 'LEGEND_SECRET' ? resolveSecretVariant(currentSpeciesId) : picked.id;
}
