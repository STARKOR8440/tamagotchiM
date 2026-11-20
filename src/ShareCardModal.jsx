import React, { useEffect, useRef, useState } from 'react';
import { SPECIES } from './evolutionTree';
import { SHELL_SKINS } from './TamagotchiShell';
import { sfx } from './sound';

export default function ShareCardModal({ pet, onClose }) {
  const canvasRef = useRef(null);
  const [imgUrl, setImgUrl] = useState('');

  const spec = SPECIES[pet.speciesId] || SPECIES.EGG;
  const skin = SHELL_SKINS[pet.skin] || SHELL_SKINS.SODA_BLUE;
  const visibleTotal = Object.values(SPECIES).filter((s) => !s.isSecretVariant).length;
  const unlockedCount = Object.values(SPECIES).filter(
    (s) => !s.isSecretVariant && pet.unlockedSpecies?.includes(s.id)
  ).length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 540;
    const H = 720;

    // 배경 그라데이션
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 외곽 골드/스카이 프레임
    ctx.strokeStyle = spec.isLegend ? '#facc15' : '#38bdf8';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // 상단 타이틀
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TAMAGOTCHI CONNECTION', W / 2, 74);

    ctx.fillStyle = spec.isLegend ? '#fde047' : '#7dd3fc';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(
      spec.isLegend ? '★ LEGENDARY PARTNER CARD ★' : 'MY DIGITAL PARTNER CARD',
      W / 2,
      104
    );

    // 중앙 기기 실루엣 카드
    ctx.fillStyle = skin.border || '#0284c7';
    ctx.beginPath();
    ctx.ellipse(W / 2, 315, 138, 168, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(W / 2, 315, 130, 160, 0, 0, Math.PI * 2);
    ctx.fill();

    // LCD 액정 박스
    ctx.fillStyle = '#334155';
    ctx.fillRect(W / 2 - 84, 232, 168, 160);
    ctx.fillStyle = skin.lcdBg || '#cbd5c0';
    ctx.fillRect(W / 2 - 76, 240, 152, 144);

    // 액정 내부 정보 텍스트 및 캐릭터 심볼
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`SKIN: ${skin.name}`, W / 2, 262);

    // 캐릭터 컬러 엠블럼 렌더링
    ctx.fillStyle = spec.color || '#fde047';
    ctx.beginPath();
    ctx.arc(W / 2, 314, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // 귀여운 눈 표현
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(W / 2 - 14, 306, 6, 10);
    ctx.fillRect(W / 2 + 8, 306, 6, 10);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(W / 2 - 13, 307, 3, 4);
    ctx.fillRect(W / 2 + 9, 307, 3, 4);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`COINS: ${pet.coins}G`, W / 2, 374);

    // 캐릭터 이름 배너
    ctx.fillStyle = spec.isLegend ? '#fef08a' : '#e0f2fe';
    ctx.fillRect(55, 505, W - 110, 48);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(spec.name, W / 2, 537);

    // 하단 육성 스탯 요약 박스
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px sans-serif';
    const ageHours = Math.floor((pet.ageSeconds || 0) / 3600);
    const ageMins = Math.floor(((pet.ageSeconds || 0) % 3600) / 60);
    ctx.fillText(
      `나이: ${ageHours}시간 ${ageMins}분  |  미니게임: ${pet.gameWins || 0}승`,
      W / 2,
      588
    );
    ctx.fillText(
      `도감 달성: ${unlockedCount} / ${visibleTotal}종  |  시크릿: ${pet.secretHistory?.length || 0} / 4종`,
      W / 2,
      618
    );

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(
      `하늘 ${pet.careStats?.sky || 1}  ·  대지 ${pet.careStats?.land || 1}  ·  바다 ${pet.careStats?.water || 1}`,
      W / 2,
      650
    );

    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText(new Date().toLocaleDateString('ko-KR'), W / 2, 682);

    setImgUrl(canvas.toDataURL('image/png'));
  }, [pet, spec, skin, unlockedCount, visibleTotal]);

  const handleDownload = () => {
    sfx.confirm();
    if (!imgUrl) return;
    const link = document.createElement('a');
    link.download = `tamagotchi_${spec.id.toLowerCase()}.png`;
    link.href = imgUrl;
    link.click();
  };

  const handleShare = async () => {
    sfx.confirm();
    try {
      if (navigator.share && imgUrl) {
        const res = await fetch(imgUrl);
        const blob = await res.blob();
        const file = new File([blob], 'tamagotchi_card.png', { type: 'image/png' });
        await navigator.share({
          title: `내 다마고치 [${spec.name}] 인증샷!`,
          text: `도감 ${unlockedCount}/${visibleTotal}종 달성! (${spec.name})`,
          files: [file],
        });
        return;
      }
    } catch {
      // 공유 취소 또는 미지원 브라우저일 경우 다운로드로 폴백
    }
    handleDownload();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '340px',
          background: '#ffffff',
          borderRadius: '22px',
          border: '3px solid #38bdf8',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 20px 45px rgba(0,0,0,0.45)',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontSize: '15px', color: '#0369a1' }}>📸 육성 인증샷 카드</strong>
          <button
            onClick={onClose}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            ✕ 닫기
          </button>
        </div>

        <canvas ref={canvasRef} width={540} height={720} style={{ display: 'none' }} />

        {imgUrl && (
          <img
            src={imgUrl}
            alt="다마고치 인증 카드"
            style={{
              width: '100%',
              maxHeight: '360px',
              objectFit: 'contain',
              borderRadius: '14px',
              border: '2px solid #cbd5e1',
            }}
          />
        )}

        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <button
            onClick={handleDownload}
            style={{
              flex: 1,
              background: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            💾 이미지 저장
          </button>
          <button
            onClick={handleShare}
            style={{
              flex: 1,
              background: '#16a34a',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            📤 공유하기
          </button>
        </div>
      </div>
    </div>
  );
}
