import React from 'react';
import { SPECIES } from './evolutionTree';

// 색상 밝기 조절 유틸 (입체 음영/하이라이트 자동 생성)
function shadeColor(hex, percent) {
  if (!hex || !hex.startsWith('#')) return hex;
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

// 32x32 고밀도 시크릿 픽셀 스프라이트 렌더러
function SecretPixelSprite({ sprite, frame, size, transformStyle }) {
  const grid = frame === 1 ? sprite.frame1 : sprite.frame0;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges" style={transformStyle}>
      {grid.map((row, y) =>
        row.split('').map((cell, x) => {
          const fill = sprite.palette[cell];
          if (!fill) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
        })
      )}
    </svg>
  );
}

const SECRET_SPRITES = {
  // 1. 보안관 우디 (32x32 고해상도: 카우보이 모자·빨간 스카프·체크 셔츠·얼룩 조끼·보안관 배지·부츠)
  SECRET_WOODY: {
    palette: {
      O: '#271207', // 짙은 아웃라인
      H: '#92400e', // 모자 기본 브라운
      h: '#b45309', // 모자 하이라이트
      d: '#5c280b', // 모자 챙 그림자
      S: '#fed7aa', // 얼굴/손 피부
      s: '#fdba74', // 피부 음영
      W: '#ffffff', // 눈 흰자
      E: '#0f172a', // 눈동자/눈썹
      R: '#dc2626', // 빨간 스카프
      r: '#991b1b', // 스카프 음영
      Y: '#facc15', // 노란 셔츠
      c: '#ea580c', // 셔츠 체크 라인
      V: '#ffffff', // 카우 조끼 바탕
      v: '#1e293b', // 카우 조끼 얼룩
      G: '#fde047', // 보안관 별 배지 / 벨트 버클
      B: '#2563eb', // 청바지
      b: '#1d4ed8', // 청바지 음영
      T: '#78350f', // 카우보이 부츠
    },
    frame0: [
      '..........OOOOOOOOOOOO..........',
      '........OOHHHHHHHHHHHHOO........',
      '.......OHHhhhhhhhhhhhhHHO.......',
      '.......OHHHHHHHHHHHHHHHHO.......',
      '......OddddddddddddddddddO......',
      '...OOOOddddddddddddddddddOOOO...',
      '..OddddddddddddddddddddddddddO..',
      '...OOOOOOSSSSSSSSSSSSSSOOOOOO...',
      '.......OSSSSSSSSSSSSSSSSO.......',
      '.......OSsEEssssssssEEsSO.......',
      '.......OSWEEssssssssWEEsO.......',
      '.......OSSSSSSSSSSSSSSSSO.......',
      '.......OsSSSSSSssSSSSSSsO.......',
      '........OssssSSSSSSssssO........',
      '.........OOSSSSSSSSSSOO.........',
      '........OORRRRRRRRRRRROO........',
      '.......ORRrRRRRRRRRRRrRRO.......',
      '......OYYVVVvVVOOOVVvVVYYO......',
      '.....OSYYVVVVVGOOOVVVVVYYSO.....',
      '....OSSYcVVvVVVOOOVVvVVcYSSO....',
      '....OSSYYVVVVVVOOOVVVVVYYSSO....',
      '.....OOYcVVvVVVOOOVVvVVcYOO.....',
      '......OYYBBBBBBGGBBBBBBYYO......',
      '.......OOBBBBBBBBBBBBBBOO.......',
      '........OBBBBBbOOOBBBBBBO.......',
      '........OBBBBBO..OBBBBBO........',
      '........ObbbbBO..OBbbbbO........',
      '........OTTTTTO..OTTTTTO........',
      '.......OTTTTTTO..OTTTTTTO.......',
      '.......OOOOOOOO..OOOOOOOO.......',
      '................................',
      '................................',
    ],
    frame1: [
      '................................',
      '..........OOOOOOOOOOOO..........',
      '........OOHHHHHHHHHHHHOO........',
      '.......OHHhhhhhhhhhhhhHHO.......',
      '.......OHHHHHHHHHHHHHHHHO.......',
      '......OddddddddddddddddddO......',
      '...OOOOddddddddddddddddddOOOO...',
      '..OddddddddddddddddddddddddddO..',
      '...OOOOOOSSSSSSSSSSSSSSOOOOOO...',
      '.......OSSSSSSSSSSSSSSSSO.......',
      '.......OSsEEssssssssEEsSO.......',
      '.......OSWEEssssssssWEEsO.......',
      '.......OSSSSSSSSSSSSSSSSO.......',
      '.......OsSSSSSSssSSSSSSsO.......',
      '........OssssSSSSSSssssO........',
      '.........OOSSSSSSSSSSOO.........',
      '........OORRRRRRRRRRRROO........',
      '.......ORRrRRRRRRRRRRrRRO.......',
      '.....OSYYVVVvVVOOOVVvVVYYSO.....',
      '....OSSYYVVVVVGOOOVVVVVYYSSO....',
      '....OSSYcVVvVVVOOOVVvVVcYSSO....',
      '.....OOYYVVVVVVOOOVVVVVYYOO.....',
      '......OYYBBBBBBGGBBBBBBYYO......',
      '.......OOBBBBBBBBBBBBBBOO.......',
      '.......OBBBBBbO..ObBBBBBO.......',
      '.......OBBBBBO....OBBBBBO.......',
      '.......ObbbbBO....OBbbbbO.......',
      '.......OTTTTTO....OTTTTTO.......',
      '......OTTTTTTO....OTTTTTTO......',
      '......OOOOOOOO....OOOOOOOO......',
      '................................',
      '................................',
    ],
  },

  // 2. 베이비 그로구 (32x32 고해상도: 대형 뾰족 귀·핑크 귀안·주름진 이마·대형 눈망울·하이칼라 로브)
  SECRET_GROGU: {
    palette: {
      O: '#14381e', // 짙은 숲녹색 아웃라인
      G: '#86efac', // 밝은 민트 그린 피부
      g: '#4ade80', // 중간 그린 음영
      d: '#22c55e', // 짙은 그린 주름/그림자
      P: '#f9a8d4', // 귀 안쪽 핑크
      p: '#f472b6', // 귀 안쪽 진핑크
      E: '#090d16', // 대형 까만 눈동자
      W: '#ffffff', // 눈 반짝임 하이라이트
      C: '#e7e5e4', // 로브 칼라/소매 밝은 베이지
      R: '#d6d3d1', // 로브 기본 베이지
      r: '#a8a29e', // 로브 주름 음영
      m: '#78716c', // 로브 깊은 그림자
    },
    frame0: [
      '................................',
      '................................',
      '...........OOOOOOOOOO...........',
      '.........OOGGGGGGGGGGOO.........',
      '........OGGggggggggggGGO........',
      'OOOO....OGGdddGGGGdddGGO....OOOO',
      'OPppOOOOOGGGGGGGGGGGGGGOOOOOPppO',
      'OPpppPPPGGGGGGGGGGGGGGGGPPPpppPO',
      '.OOPppppGGGGGGGGGGGGGGGGppppPOO.',
      '..OOOGGGgEEEEGGGGGGEEEEgGGGOOO..',
      '....OOGGgEWEEGGGGGGEEWEgGGOO....',
      '.....OOGgEEEEggggggEEEEgGOO.....',
      '......OOGggggggddggggggGOO......',
      '.......OOGggggggggggggGOO.......',
      '........OOddddddddddddOO........',
      '.......OOCCCCCCCCCCCCCCOO.......',
      '......OCCCCmmmmmmmmmmCCCCO......',
      '.....OCCCCmRRRRRRRRRRmCCCCO.....',
      '....OGGCCmRRRRrRRrRRRRmCCGGO....',
      '...OGGGCCmRRRRrRRrRRRRmCCGGGO...',
      '...OGgOCCmRRRRrRRrRRRRmCCOgGO...',
      '....OO.OCmRRRRrRRrRRRRmCO.OO....',
      '.......OCmRRRRrRRrRRRRmCO.......',
      '.......OCmRRRRrRRrRRRRmCO.......',
      '.......OCmRRRRrRRrRRRRmCO.......',
      '.......OCmRRRRrRRrRRRRmCO.......',
      '.......OOmmmmmmmmmmmmmmOO.......',
      '........OOOOOOOOOOOOOOOO........',
      '................................',
      '................................',
      '................................',
      '................................',
    ],
    frame1: [
      '................................',
      '................................',
      '................................',
      '...........OOOOOOOOOO...........',
      '.........OOGGGGGGGGGGOO.........',
      '........OGGggggggggggGGO........',
      'OOOO....OGGdddGGGGdddGGO....OOOO',
      'OPppOOOOOGGGGGGGGGGGGGGOOOOOPppO',
      'OPpppPPPGGGGGGGGGGGGGGGGPPPpppPO',
      '.OOPppppGGGGGGGGGGGGGGGGppppPOO.',
      '..OOOGGGgEEEEGGGGGGEEEEgGGGOOO..',
      '....OOGGgEWEEGGGGGGEEWEgGGOO....',
      '.....OOGgEEEEggggggEEEEgGOO.....',
      '......OOGggggggddggggggGOO......',
      '.......OOGggggggggggggGOO.......',
      '........OOddddddddddddOO........',
      '.......OOCCCCCCCCCCCCCCOO.......',
      '......OCCCCmmmmmmmmmmCCCCO......',
      '....OGGCCmRRRRRRRRRRRRmCCGGO....',
      '...OGGGCCmRRRRrRRrRRRRmCCGGGO...',
      '...OGgOCCmRRRRrRRrRRRRmCCOgGO...',
      '....OO.OCmRRRRrRRrRRRRmCO.OO....',
      '.......OCmRRRRrRRrRRRRmCO.......',
      '.......OCmRRRRrRRrRRRRmCO.......',
      '.......OCmRRRRrRRrRRRRmCO.......',
      '.......OCmRRRRrRRrRRRRmCO.......',
      '.......OOmmmmmmmmmmmmmmOO.......',
      '........OOOOOOOOOOOOOOOO........',
      '................................',
      '................................',
      '................................',
      '................................',
    ],
  },

  // 3. 리본 헬로키티 (32x32 고해상도: 부드러운 윤곽·빨간 입체 리본·6가닥 수염·노란 코·파란 멜빵바지)
  SECRET_KITTY: {
    palette: {
      O: '#1e293b', // 깔끔한 다크 아웃라인
      W: '#ffffff', // 순백색 털
      w: '#e2e8f0', // 부드러운 입체 음영
      R: '#ef4444', // 선명한 레드 리본
      r: '#b91c1c', // 리본 음영
      p: '#fca5a5', // 리본 하이라이트
      Y: '#facc15', // 노란 코 & 반팔 티셔츠
      B: '#2563eb', // 파란 오버롤 멜빵
      b: '#1d4ed8', // 오버롤 음영
    },
    frame0: [
      '................................',
      '................................',
      '.....OOO..............OOO.......',
      '....OWWWO............ORRRO......',
      '...OWWWWWO..........ORpRRrO.....',
      '..OWWWWWWWO.OOOOOO.ORRRORrRO....',
      '..OWWWWWWWWOWWWWWWORRRpORRRrO...',
      '..OWWWWWWWWWWWWWWWORRRRORrRO....',
      '..OWWWWWWWWWWWWWWWWORrRORRO.....',
      '.OWWWWWWWWWWWWWWWWWWOORROO......',
      '.OWWWWWWWWWWWWWWWWWWWWWWWWO.....',
      'OOOWWWWWOOOWWWWWWWOOOWWWWWOOO...',
      '.OWWWWWWOOOWWWWWWWOOOWWWWWWO....',
      'OOOWWWWWOOOWWWWWWWOOOWWWWWOOO...',
      '.OWWWWWWWWWWWYYYWWWWWWWWWWWO....',
      'OOOWWWWWWWWWWYYYWWWWWWWWWWOOO...',
      '..OwwwwWWWWWWWWWWWWWWWwwwwO.....',
      '...OOOOwwwwwwwwwwwwwwwOOOO......',
      '......OOYYYYBBBBBBYYYYOO........',
      '.....OWWYYYYBBBBBBYYYYWWO.......',
      '....OWWWYYYYBBBBBBYYYYWWWO......',
      '....OWwOOBBBBBBBBBBBBOOwwO......',
      '.....OO.OBBBYBBBBYBBBO.OO.......',
      '........OBBBBBBBBBBBBO..........',
      '........OBBBBBBBBBBBBO..........',
      '........ObbbbBO.ObbbbO..........',
      '........OWWWWO...OWWWWO.........',
      '........OOOOOO...OOOOOO.........',
      '................................',
      '................................',
      '................................',
      '................................',
    ],
    frame1: [
      '................................',
      '................................',
      '................................',
      '.....OOO..............OOO.......',
      '....OWWWO............ORRRO......',
      '...OWWWWWO..........ORpRRrO.....',
      '..OWWWWWWWO.OOOOOO.ORRRORrRO....',
      '..OWWWWWWWWOWWWWWWORRRpORRRrO...',
      '..OWWWWWWWWWWWWWWWORRRRORrRO....',
      '..OWWWWWWWWWWWWWWWWORrRORRO.....',
      '.OWWWWWWWWWWWWWWWWWWOORROO......',
      '.OWWWWWWWWWWWWWWWWWWWWWWWWO.....',
      'OOOWWWWWOOOWWWWWWWOOOWWWWWOOO...',
      '.OWWWWWWOOOWWWWWWWOOOWWWWWWO....',
      'OOOWWWWWOOOWWWWWWWOOOWWWWWOOO...',
      '.OWWWWWWWWWWWYYYWWWWWWWWWWWO....',
      'OOOWWWWWWWWWWYYYWWWWWWWWWWOOO...',
      '..OwwwwWWWWWWWWWWWWWWWwwwwO.....',
      '...OOOOwwwwwwwwwwwwwwwOOOO......',
      '.....OWWYYYYBBBBBBYYYYWWO.......',
      '....OWWWYYYYBBBBBBYYYYWWWO......',
      '....OWwOOBBBBBBBBBBBBOOwwO......',
      '.....OO.OBBBYBBBBYBBBO.OO.......',
      '........OBBBBBBBBBBBBO..........',
      '........OBBBBBBBBBBBBO..........',
      '.......ObbbbBO...ObbbbO.........',
      '.......OWWWWO.....OWWWWO........',
      '.......OOOOOO.....OOOOOO........',
      '................................',
      '................................',
      '................................',
      '................................',
    ],
  },

  // 4. 드로이드 R2-D2 (32x32 고해상도: 실버 메탈 돔·광학 렌즈 센서·레드 LED·블루 패널·3족 드로이드 다리)
  SECRET_R2D2: {
    palette: {
      O: '#334155', // 메탈 외곽선
      S: '#e2e8f0', // 실버 돔 기본
      s: '#94a3b8', // 실버 돔 음영
      W: '#ffffff', // 순백 바디 & 반사광
      w: '#cbd5e1', // 화이트 바디 음영
      B: '#2563eb', // 로열 블루 장갑
      b: '#1d4ed8', // 짙은 블루 음영
      D: '#0f172a', // 광학 센서 블랙
      C: '#38bdf8', // 센서 렌즈 빛
      R: '#ef4444', // 붉은 상태 표시등
    },
    frame0: [
      '................................',
      '................................',
      '...........OOOOOOOOOO...........',
      '.........OOSSSSSSSSSSOO.........',
      '.......OOSSSSBBBBBBSSSSOO.......',
      '......OSSSSBBBBBBBBBBSSSSO......',
      '.....OSSSBBBBDDDDDDBBBBSSSO.....',
      '.....OSSBBBBDDDCCDDDBBBBSSO.....',
      '....OSSSBBBBDDDCDDDDBBBBSSSO....',
      '....OSSSBBBBDDDDDDDDBBBBSSSO....',
      '....OSSSSBBBBBBBBBBBBBBSSSSO....',
      '....OSSSSSSSSSSSSSSSSSSSSSSO....',
      '....OSBBSSBBSSBBBBSSBBSSBBSO....',
      '....OSBBSSBBSSBBBRSSBBSSBBSO....',
      '....OOOOOOOOOOOOOOOOOOOOOOOO....',
      '....OWWWWWWWWWWWWWWWWWWWWWWO....',
      '...OOWWWBBBBBBBBBBBBBBBBWWWO....',
      '..OSOWWWWWWWWWWWWWWWWWWWWWWOwO..',
      '..OSOWWWBBBBBBBBBBBBBBBBWWWOwO..',
      '..OSOWWWWWWWWWWWWWWWWWWWWWWOwO..',
      '..OSOWWWWWWWWWBBBBWWWWWWWWWOwO..',
      '..OSOWWWWWWWWWBBBBWWWWWWWWWOwO..',
      '..OSOWWWWWWWWBBWWBBWWWWWWWWOwO..',
      '..OSOWWWWWWWWBBWWBBWWWWWWWWOwO..',
      '..OSOWWWWWWWWBBWWBBWWWWWWWWOwO..',
      '..OSOOwwwwwwwwwwwwwwwwwwwwOOwO..',
      '.OSSSOOOOOOOOOOOOOOOOOOOOOOSSSO.',
      '.OOOOO......OObbbbOO......OOOOO.',
      '...........OOOOOOOOOO...........',
      '................................',
      '................................',
      '................................',
    ],
    frame1: [
      '................................',
      '...........OOOOOOOOOO...........',
      '.........OOSSSSSSSSSSOO.........',
      '.......OOSSSSBBBBBBSSSSOO.......',
      '......OSSSSBBBBBBBBBBSSSSO......',
      '.....OSSSBBBBDDDDDDBBBBSSSO.....',
      '.....OSSBBBBDDDCCDDDBBBBSSO.....',
      '....OSSSBBBBDDDCDDDDBBBBSSSO....',
      '....OSSSBBBBDDDDDDDDBBBBSSSO....',
      '....OSSSSBBBBBBBBBBBBBBSSSSO....',
      '....OSSSSSSSSSSSSSSSSSSSSSSO....',
      '....OSBBSSBBSSBBBBSSBBSSBBSO....',
      '....OSBBSSBBSSBBBRSSBBSSBBSO....',
      '....OOOOOOOOOOOOOOOOOOOOOOOO....',
      '....OWWWWWWWWWWWWWWWWWWWWWWO....',
      '...OOWWWBBBBBBBBBBBBBBBBWWWO....',
      '..OSOWWWWWWWWWWWWWWWWWWWWWWOwO..',
      '..OSOWWWBBBBBBBBBBBBBBBBWWWOwO..',
      '..OSOWWWWWWWWWWWWWWWWWWWWWWOwO..',
      '..OSOWWWWWWWWWBBBBWWWWWWWWWOwO..',
      '..OSOWWWWWWWWWBBBBWWWWWWWWWOwO..',
      '..OSOWWWWWWWWBBWWBBWWWWWWWWOwO..',
      '..OSOWWWWWWWWBBWWBBWWWWWWWWOwO..',
      '..OSOWWWWWWWWBBWWBBWWWWWWWWOwO..',
      '..OSOOwwwwwwwwwwwwwwwwwwwwOOwO..',
      '.OSSSOOOOOOOOOOOOOOOOOOOOOOSSSO.',
      '.OOOOO......OObbbbOO......OOOOO.',
      '...........OOOOOOOOOO...........',
      '................................',
      '................................',
      '................................',
      '................................',
    ],
  },
};

export default function PetSprite({
  speciesId = 'BABY_MARU',
  direction = 1,
  frame = 0,
  actionState = 'IDLE',
  isDragging = false,
  isSleeping = false,
  isDirty = false,
  isOverheated = false,
  lcdMode = false,
}) {
  const spec = SPECIES[speciesId] || SPECIES.BABY_MARU;
  const size = lcdMode ? 72 : 104;

  const baseColor = isOverheated ? '#fca5a5' : spec.color;
  const lightColor = shadeColor(baseColor, 18);
  const shadowColor = shadeColor(baseColor, -18);

  const stickerOutline = spec.isLegend
    ? 'drop-shadow(1.5px 0 0 #fef08a) drop-shadow(-1.5px 0 0 #fef08a) drop-shadow(0 1.5px 0 #fef08a) drop-shadow(0 -1.5px 0 #fef08a) drop-shadow(0 6px 10px rgba(250,204,21,0.5))'
    : 'drop-shadow(1.5px 0 0 #ffffff) drop-shadow(-1.5px 0 0 #ffffff) drop-shadow(0 1.5px 0 #ffffff) drop-shadow(0 -1.5px 0 #ffffff) drop-shadow(0 5px 8px rgba(15,23,42,0.32))';

  const bounceY = isDragging ? 0 : actionState === 'HAPPY' ? (frame === 0 ? -5 : 0) : frame === 1 ? -2 : 0;

  const transformStyle = {
    transform: `scaleX(${direction}) translateY(${bounceY}px)`,
    transition: 'transform 0.14s steps(2)',
    filter: lcdMode ? 'grayscale(100%) contrast(235%) brightness(84%)' : stickerOutline,
  };

  // 시크릿 4종 전용 32x32 고밀도 픽셀 아트
  if (SECRET_SPRITES[speciesId]) {
    return (
      <SecretPixelSprite
        sprite={SECRET_SPRITES[speciesId]}
        frame={frame}
        size={size}
        transformStyle={transformStyle}
      />
    );
  }

  // 0단계: 32x32 세련된 알 스프라이트
  if (spec.stage === 'EGG') {
    const tilt = frame === 1 ? 'rotate(3deg)' : 'rotate(-3deg)';
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        shapeRendering="crispEdges"
        style={{ ...transformStyle, transform: tilt }}
      >
        <path fill="#1e293b" d="M12 4h8v1h3v2h2v4h1v10h-1v4h-2v2h-3v1h-8v-1H9v-2H7v-4H6V11h1V7h2V5h3V4z" />
        <path fill="#fefce8" d="M12 5h8v2h3v4h1v10h-1v3h-3v2h-8v-2H9v-3H8V11h1V7h3V5z" />
        <path fill="#fde047" d="M21 9h2v12h-2v3h-3v1h-6v-1h6v-2h2V9z" />
        <path fill="#ffffff" d="M11 7h3v2h-2v3h-1V7z" />
        <path fill="#38bdf8" d="M11 12h4v3h-4v-3zm7 4h4v3h-4v-3zm-6 4h3v3h-3v-3z" />
      </svg>
    );
  }

  // 1단계: 몽글 베이비 (통통한 1등신 32x32)
  if (spec.stage === 'BABY') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges" style={transformStyle}>
        <path fill="#1e293b" d="M10 9h12v1h3v2h2v3h1v8h-1v3h-3v2H8v-2H5v-3H4v-8h1v-3h2v-2h3V9z" />
        <path fill={baseColor} d="M10 10h12v2h3v3h1v8h-1v2H7v-2H6v-8h1v-3h3v-2z" />
        <path fill={lightColor} d="M10 11h6v2h-6v-2z" />
        <path fill={shadowColor} d="M7 23h18v2H7v-2z" />
        <path fill="#1e293b" d="M10 16h3v4h-3v-4zm9 0h3v4h-3v-4z" />
        <path fill="#ffffff" d="M10 16h1v2h-1v-2zm9 0h1v2h-1v-2z" />
        <path fill="#fb7185" d="M8 20h2v1H8v-1zm14 0h2v1h-2v-1z" />
        <path fill="#1e293b" d="M14 20h1v1h2v-1h1v1h-1v1h-2v-1h-1v-1z" />
      </svg>
    );
  }

  // 2~4단계: 키드 / 청소년 / 성체 (세련된 2등신 전신 도트 32x32)
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges" style={transformStyle}>
      {spec.ear === 'cat' && (
        <path fill={spec.accent || '#fde047'} d={frame === 0 ? 'M3 18h4v3H3v-3zm1-3h3v3H4v-3z' : 'M3 16h4v3H3v-3zm1-3h3v3H4v-3z'} />
      )}
      {spec.ear === 'fin' && (
        <path fill={spec.accent || '#fef08a'} d={frame === 0 ? 'M2 17h4v5H2v-5zm-1 1h1v3H1v-3z' : 'M2 18h4v5H2v-5zm-1 1h1v3H1v-3z'} />
      )}
      {spec.ear === 'owl' && (
        <path fill={spec.accent || '#cbd5e1'} d={frame === 0 ? 'M4 17h3v6H4v-6zm21 0h3v6h-3v-6z' : 'M3 15h4v5H3v-5zm22 0h4v5h-4v-5z'} />
      )}
      {spec.ear === 'dragon' && (
        <path fill={spec.accent || '#38bdf8'} d={frame === 0 ? 'M2 14h5v6H2v-6zm23 0h5v6h-5v-6z' : 'M2 16h5v6H2v-6zm23 0h5v6h-5v-6z'} />
      )}
      {spec.ear === 'mermaid' && (
        <path fill={spec.accent || '#fbcfe8'} d="M3 15h4v5H3v-5zm22 0h4v5h-4v-5zM11 26h10v2H11v-2zm-2 2h5v2H9v-2zm9 0h5v2h-5v-2z" />
      )}
      {spec.ear === 'axolotl' && (
        <path fill={spec.accent || '#f472b6'} d="M3 9h4v2H3V9zm0 4h4v2H3v-2zm22-4h4v2h-4V9zm0 4h4v2h-4v-2z" />
      )}

      {spec.ear === 'cat' && (
        <>
          <path fill="#1e293b" d="M7 3h4v5H7V3zm14 0h4v5h-4V3z" />
          <path fill={spec.accent || '#fde047'} d="M8 4h2v4H8V4zm14 0h2v4h-2V4z" />
        </>
      )}
      {spec.ear === 'mame' && (
        <>
          <path fill="#1e293b" d="M7 2h6v6H7V2zm12 0h6v6h-6V2z" />
          <path fill={spec.accent || '#1e3a8a'} d="M8 3h4v5H8V3zm12 0h4v5h-4V3z" />
        </>
      )}
      {spec.ear === 'bunny' && (
        <>
          <path fill="#1e293b" d="M8 1h4v7H8V1zm12 0h4v7h-4V1z" />
          <path fill={baseColor} d="M9 2h2v6H9V2zm12 0h2v6h-2V2z" />
          <path fill={spec.accent || '#f43f5e'} d="M19 4h5v3h-5V4z" />
        </>
      )}
      {spec.ear === 'secret' && (
        <path fill="#1e1b4b" d="M8 1h4v7H8V1zm12 0h4v7h-4V1z" />
      )}
      {spec.ear === 'floppy' && (
        <>
          <path fill="#1e293b" d="M3 9h4v9H3V9zm22 0h4v9h-4V9z" />
          <path fill={baseColor} d="M4 10h2v7H4v-7zm22 0h2v7h-2v-7z" />
          <path fill={spec.accent || '#ef4444'} d="M12 4h8v3h-8V4z" />
        </>
      )}
      {spec.ear === 'antenna' && (
        <>
          <path fill="#1e293b" d="M15 3h2v4h-2V3z" />
          <path fill={spec.accent || '#facc15'} d="M14 1h4v3h-4V1z" />
        </>
      )}
      {spec.ear === 'curl' && (
        <path fill="#1e293b" d="M14 1h6v1h-6V1zm5 1h1v4h-1V2zm-5 1h4v1h-4V3zm0 1h1v3h-1V4z" />
      )}
      {spec.ear === 'twin' && (
        <>
          <path fill={spec.accent || '#6366f1'} d="M4 4h5v8H4V4zm19 0h5v8h-5V4z" />
          <path fill="#facc15" d="M15 7h2v2h-2V7z" />
        </>
      )}
      {spec.ear === 'panda' && (
        <>
          <path fill="#1e293b" d="M7 4h5v4H7V4zm13 0h5v4h-5V4z" />
          <path fill={spec.accent || '#3b82f6'} d="M8 5h3v3H8V5zm13 0h3v3h-3V5z" />
        </>
      )}
      {spec.ear === 'star' && (
        <path fill={spec.accent || '#38bdf8'} d="M3 16h26v2H3v-2z" />
      )}
      {spec.ear === 'cactus' && (
        <>
          <path fill="#f43f5e" d="M13 2h6v4h-6V2z" />
          <path fill="#facc15" d="M15 3h2v2h-2V3z" />
        </>
      )}
      {spec.ear === 'parrot' && (
        <path fill="#facc15" d="M14 2h3v4h-3V2zm2 4h4v1h-4V6z" />
      )}
      {spec.ear === 'astronaut' && (
        <>
          <path fill="#f43f5e" d="M15 1h2v4h-2V1z" />
          <path fill="rgba(255,255,255,0.55)" d="M7 5h18v16H7V5z" />
        </>
      )}
      {spec.ear === 'dragon' && (
        <path fill="#ffffff" d="M8 2h3v4H8V2zm13 0h3v4h-3V2z" />
      )}
      {spec.ear === 'unicorn' && (
        <>
          <path fill="#facc15" d="M15 1h2v5h-2V1z" />
          <path fill="#c084fc" d="M9 5h6v2H9V5zm8 0h6v2h-6V5z" />
        </>
      )}
      {spec.ear === 'east_dragon' && (
        <>
          <path fill="#fde047" d="M8 1h3v5H8V1zm13 0h3v5h-3V1z" />
          <path fill="#f43f5e" d="M23 8h4v7h-4V8z" />
        </>
      )}
      {spec.ear === 'narwhal' && (
        <path fill="#38bdf8" d="M15 0h2v6h-2V0z" />
      )}

      <path
        fill="#1e293b"
        d="M10 6h12v1h-12V6zM8 7h2v1H8V7zm14 0h2v1h-2V7zM7 8h1v2H7V8zm17 0h1v2h-1V8zM6 10h1v9H6v-9zm19 0h1v9h-1v-9zM7 19h2v1H7v-1zm16 0h2v1h-2v-1z"
      />
      <path
        fill={baseColor}
        d="M10 7h12v1h2v2h1v9h-2v1H9v-1H7v-9h1V8h2V7z"
      />
      <path fill={lightColor} d="M10 8h6v2h-6V8z" />
      <path fill={shadowColor} d="M9 18h14v2H9v-2z" />

      {spec.ear === 'ninja' && <path fill="#fde68a" d="M9 11h14v5H9v-5z" />}
      {spec.ear === 'secret' && <path fill="#facc15" d="M14 10h4v1h-4v-1zm3 1h1v3h-1v-3zm-3 3h3v1h-3v-1zm0 2h2v2h-2v-2z" />}

      {isOverheated && (
        <path fill="#0284c7" d={frame === 0 ? 'M26 6h2v4h-2V6z' : 'M26 8h2v4h-2V8z'} />
      )}

      {spec.ear !== 'secret' && (
        <>
          {isDragging ? (
            <path fill="#1e293b" d="M9 12h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm12-2h1v1h-1v-1zm-1 1h1v1h-1v-1zm1 1h1v1h-1v-1z" />
          ) : isSleeping ? (
            <path fill="#1e293b" d="M9 14h4v1H9v-1zm10 0h4v1h-4v-1z" />
          ) : actionState === 'HAPPY' ? (
            <path fill="#1e293b" d="M9 14h1v-1h2v1h1v1H9v-1zm10 0h1v-1h2v1h1v1h-4v-1z" />
          ) : (
            <>
              <path fill="#1e293b" d="M9 12h4v4H9v-4zm10 0h4v4h-4v-4z" />
              <path fill="#ffffff" d="M9 12h2v2H9v-2zm10 0h2v2h-2v-2z" />
              <path fill="#ffffff" d="M12 15h1v1h-1v-1zm10 0h1v1h-1v-1z" />
            </>
          )}

          <path fill="#fb7185" d="M8 16h2v1H8v-1zm14 0h2v1h-2v-1z" />

          {spec.ear === 'penguin' || spec.ear === 'parrot' ? (
            <path fill="#facc15" d="M14 15h4v2h-4v-2z" />
          ) : actionState === 'EAT' ? (
            <path fill="#ef4444" d={frame === 0 ? 'M14 16h4v2h-4v-2z' : 'M13 16h6v1h-6v-1z'} />
          ) : isDirty || isOverheated ? (
            <path fill="#1e293b" d="M14 17h4v1h-4v-1z" />
          ) : (
            <path fill="#1e293b" d="M14 16h1v1h2v-1h1v1h-1v1h-2v-1h-1v-1z" />
          )}
        </>
      )}

      {spec.ear !== 'mermaid' && (
        <>
          <path fill="#1e293b" d="M10 20h12v6H10v-6z" />
          <path fill={baseColor} d="M11 20h10v5H11v-5z" />
          {spec.ear === 'penguin' && <path fill="#ffffff" d="M12 20h8v5h-8v-5z" />}
          {spec.accent && spec.ear !== 'penguin' && spec.ear !== 'secret' && (
            <path fill={spec.accent} d="M14 21h4v3h-4v-3z" />
          )}

          {frame === 0 ? (
            <>
              <path fill="#1e293b" d="M7 21h3v3H7v-3zm15 0h3v3h-3v-3z" />
              <path fill={baseColor} d="M8 21h2v2H8v-2zm14 0h2v2h-2v-2z" />
            </>
          ) : (
            <>
              <path fill="#1e293b" d="M7 20h3v3H7v-3zm15 0h3v3h-3v-3z" />
              <path fill={baseColor} d="M8 20h2v2H8v-2zm14 0h2v2h-2v-2z" />
            </>
          )}

          {frame === 0 ? (
            <path fill="#1e293b" d="M9 26h5v2H9v-2zm9 0h5v2h-5v-2z" />
          ) : (
            <path fill="#1e293b" d="M11 26h4v2h-4v-2zm6 0h4v2h-4v-2z" />
          )}
        </>
      )}
    </svg>
  );
}
