import React, { useState } from 'react';
import { SHELL_SKINS } from './TamagotchiShell';

const TABS = [
  { id: 'PLAY', label: '🎮 조작·기능' },
  { id: 'EVO', label: '🥚 육성·진화' },
  { id: 'SKIN', label: '🎨 스킨·상점' },
];

export default function GuideModal({ onClose }) {
  const [tab, setTab] = useState('PLAY');

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
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.42)',
          display: 'flex',
          flexDirection: 'column',
          padding: '10px 12px',
          boxSizing: 'border-box',
          userSelect: 'none',
          overflow: 'hidden',
        }}
      >
        {/* 상단 헤더 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '13.5px', fontWeight: '900', color: '#0369a1' }}>
            📘 바탕화면 다마고치 사용 가이드
          </span>
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
            }}
          >
            ✕ 닫기
          </button>
        </div>

        {/* 3개 카테고리 탭 */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexShrink: 0 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: '5px 4px',
                borderRadius: '8px',
                border: tab === t.id ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                background: tab === t.id ? '#e0f2fe' : '#f8fafc',
                color: tab === t.id ? '#0369a1' : '#475569',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 본문 스크롤 영역 */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            fontSize: '11px',
            lineHeight: 1.5,
            color: '#1e293b',
            paddingRight: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {tab === 'PLAY' && (
            <>
              <div style={cardStyle}>
                <div style={cardTitleStyle}>🕹️ 기본 조작 & 물리 버튼</div>
                <div>• <b>평상시:</b> 바탕화면 하단을 자유롭게 배회 (드래그로 위치 이동)</div>
                <div>• <b>마우스 올리기:</b> 다마고치 본체(LCD + 버튼) 호출</div>
                <div>• <b>우클릭 / 📖:</b> 35종 방사형 진화 도감 열기</div>
                <div>• <b>A / B / C 버튼:</b> 메뉴 순환 / 선택 실행 / 홈 복귀</div>
              </div>

              <div style={cardStyle}>
                <div style={cardTitleStyle}>🍖 식사 · 🧹 청소 · 💻 시스템 연동</div>
                <div>• <b>🍙 주먹밥:</b> 포만감 +25, 체력 +15 (15분 소화 쿨타임)</div>
                <div>• <b>🍰 케이크:</b> 행복 +15, 하늘 속성 +1 (하루 최대 3회)</div>
                <div>• <b>🧹 청소:</b> 배설물(💩) 1개당 <b>+10🪙</b> 및 바다 속성 +1</div>
                <div>• <b>💻 PC 연동:</b> CPU 75%↑ 또는 RAM 85%↑ 시 땀을 흘리며 알림</div>
              </div>

              <div style={cardStyle}>
                <div style={cardTitleStyle}>🎾 미니게임 3종 (체력 -20 소모)</div>
                <div>• <b>가위바위보 / 방향 맞추기:</b> 승리 시 <b>+15🪙</b>, 행복 +25</div>
                <div>• <b>타이밍 캐치 (3단계 판정):</b></div>
                <div style={{ paddingLeft: '8px', color: '#334155' }}>
                  - <b>빨간 코어(PERFECT):</b> <b>+15🪙</b> · 행복 +25 (승리 인정)
                  <br />- <b>초록 구간(NICE):</b> <b>+10🪙</b> · 행복 +20 (승리 인정)
                  <br />- <b>검정 외곽(GOOD):</b> <b>+5🪙</b> · 행복 +10
                </div>
              </div>
            </>
          )}

          {tab === 'EVO' && (
            <>
              <div style={cardStyle}>
                <div style={cardTitleStyle}>⏳ 5단계 성장 타임라인</div>
                <div>1. <b>신비한 알(EGG):</b> 5분 경과 시 자동 부화</div>
                <div>2. <b>몽글 베이비(BABY):</b> 1시간 + 포만/행복 50 이상</div>
                <div>3. <b>키드(KID · 3종):</b> 6시간 + 미니게임 2승 이상</div>
                <div>4. <b>청소년(TEEN · 6종):</b> 24시간 + 배설물 0개 & 포만 40↑</div>
                <div>5. <b>최종 성체(ADULT · 24종):</b> 일반 18종 + 전설·시크릿 6종</div>
              </div>

              <div style={cardStyle}>
                <div style={cardTitleStyle}>🌟 35종 도감 & 전설·환생 규칙</div>
                <div>• <b>속성 분기:</b> 놀이(하늘/코즈믹), 식사(대지/숲), 청소(바다/얼음) 비율에 따라 주력 70% + 보조 30% 확률 분기</div>
                <div>• <b>★ 전설·시크릿 6종:</b> 루비 드래곤, 오션 머메이드, 실버 유니콘, 에메랄드 청룡, 오로라 일각고래, 시크릿 스페이스 (3대 속성 모두 4↑ + 5승 + 컨디션 80↑)</div>
                <div>• <b>🔄 세대 독립 & 환생:</b> 성체 24시간 후 <b>2세대 알 물려받기</b>(+50🪙 보너스) 또는 상점 <b>환생구슬</b>로 다른 성체 즉시 변신</div>
              </div>
            </>
          )}

          {tab === 'SKIN' && (
            <>
              <div style={cardStyle}>
                <div style={cardTitleStyle}>🎨 기기 스킨 8종 라인업</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '4px' }}>
                  {Object.values(SHELL_SKINS).map((s) => (
                    <div
                      key={s.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '4px 6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <b>{s.name}</b>
                      <span style={{ color: '#0284c7', fontWeight: '800' }}>
                        {s.price === 0 ? '기본' : `${s.price}🪙`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={cardStyle}>
                <div style={cardTitleStyle}>🏪 상점 전용 아이템 5종</div>
                <div>• <b>⚡ 에너지 드링크 (15🪙):</b> 체력 즉시 +50 회복</div>
                <div>• <b>🍑 하늘 / 🍏 대지 / 🫐 바다 열매 (각 30🪙):</b> 해당 속성 +3 부스트</div>
                <div>• <b>🔮 성체 환생구슬 (1,000🪙):</b> 최종 성체 상태에서 미해금 다른 성체 종족으로 즉시 환생</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  padding: '8px 10px',
};

const cardTitleStyle = {
  fontWeight: '900',
  color: '#0369a1',
  marginBottom: '4px',
  fontSize: '11.5px',
};