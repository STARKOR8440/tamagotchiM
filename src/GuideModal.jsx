import React from 'react';

export default function GuideModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          maxHeight: '85dvh',
          background: '#ffffff',
          borderRadius: '22px',
          border: '3px solid #38bdf8',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#0f172a',
        }}
      >
        {/* 상단 헤더 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 18px',
            background: 'linear-gradient(90deg, #e0f2fe 0%, #f0f9ff 100%)',
            borderBottom: '2px solid #bae6fd',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>🐣</span>
            <strong style={{ fontSize: '15.5px', color: '#0369a1' }}>
              다마고치 커넥션 사용 가이드
            </strong>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '5px 11px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            ✕ 닫기
          </button>
        </div>

        {/* 스크롤 본문 */}
        <div
          style={{
            padding: '16px 18px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            fontSize: '12.5px',
            lineHeight: 1.6,
          }}
        >
          {/* 1. 앱 설치 및 데이터 보존 */}
          <section style={sectionBoxStyle}>
            <div style={sectionTitleStyle}>📱 1. 앱처럼 설치 & 데이터 유지</div>
            <ul style={listStyle}>
              <li>
                <b>홈 화면에 추가:</b> 사파리(공유 버튼 <code>□↑</code>) 또는 크롬(메뉴 <code>⋮</code>)에서{' '}
                <b>[홈 화면에 추가]</b>를 누르면 주소창 없이 단독 앱처럼 실행됩니다.
              </li>
              <li>
                <b>자동 저장 & 오프라인 반영:</b> 스마트폰을 껐다 켜도 모든 기록이 유지되며, <b>앱이 꺼져 있던 시간</b>까지 계산해 체력과 나이가 자동 반영됩니다.
              </li>
              <li>
                <b>주의:</b> 같은 브라우저(또는 추가한 홈 화면 앱)로 계속 접속해야 데이터가 이어집니다.
              </li>
            </ul>
          </section>

          {/* 2. 기본 조작법 */}
          <section style={sectionBoxStyle}>
            <div style={sectionTitleStyle}>🎮 2. 기기 버튼 조작법</div>
            <ul style={listStyle}>
              <li>
                <b>A 버튼 (왼쪽):</b> 상단 메뉴 이동 / 상점 탭 전환
              </li>
              <li>
                <b>B 버튼 (가운데):</b> 선택한 메뉴 실행 및 확인
              </li>
              <li>
                <b>C 버튼 (오른쪽):</b> 이전 화면으로 복귀 / 취소
              </li>
              <li>
                <b>직접 터치:</b> 액정 상단 6개 아이콘을 손가락으로 직접 눌러도 바로 실행됩니다.
              </li>
            </ul>
          </section>

          {/* 3. 6가지 메뉴 안내 */}
          <section style={sectionBoxStyle}>
            <div style={sectionTitleStyle}>🍖 3. 6가지 메뉴 및 코인 획득</div>
            <ul style={listStyle}>
              <li>
                <b>🍖 식사:</b>
                <br />• <b>🍙 주먹밥:</b> 포만감 +25, <b>체력 +15</b>, 대지 속성 +1 <i>(15분 소화 쿨타임)</i>
                <br />• <b>🍰 케이크:</b> 포만감 +10, 행복 +15, 하늘 속성 +1 <i>(하루 3회 제한)</i>
              </li>
              <li>
                <b>🎾 놀이 (미니게임):</b> 1판당 <b>체력 20 소모</b> · 승리 시 <b>+15 코인🪙</b>, 행복도 및 하늘 속성 상승
              </li>
              <li>
                <b>🧹 청소:</b> 화면의 배설물(<code>💩</code>)을 치우면 <b>개당 +10 코인🪙</b> 및 바다 속성 상승
              </li>
              <li>
                <b>🏪 상점:</b>
                <br />• <b>스킨(8종):</b> 소다 버블, 코믹 팝, 말차 라떼, 레인보우 팝, 스낵 팝콘, 1996 레트로, 오로라 엔젤, 엔젤 가든
                <br />• <b>아이템(5종):</b> ⚡에너지드링크(15🪙, 체력+50), 🍑🍏🫐속성 열매(30🪙, 속성+3), 🔮성체 환생구슬(1000🪙)
              </li>
              <li>
                <b>📊 상태 / 📖 도감:</b> 포만·행복·체력 게이지 및 총 <b>35종 진화 도감</b> 달성률 확인
              </li>
            </ul>
          </section>

          {/* 4. 체력 및 진화 규칙 */}
          <section style={sectionBoxStyle}>
            <div style={sectionTitleStyle}>⚡ 4. 체력 회복 & 35종 교차 진화</div>
            <ul style={listStyle}>
              <li>
                <b>체력 회복 3가지:</b> <b>30초마다 +1 자동 회복</b>(오프라인 포함) / 주먹밥(+15) / 상점 드링크(+50)
              </li>
              <li>
                <b>성장 타임라인:</b> 알(5분) → 베이비(1시간) → 키드(6시간) → 성장기(24시간) → <b>최종 성체</b>
                <br />
                <i>※ 배가 고프거나 배설물이 방치되어 있으면 조건을 채울 때까지 진화가 대기합니다.</i>
              </li>
              <li>
                <b>교차 랜덤 진화:</b> 많이 해준 행동(<b>놀이=하늘 / 식사=대지 / 청소=바다</b>) 비율에 따라 <b>주력(70%) + 보조(30%)</b> 확률로 진화하며, 3대 속성을 모두 높게 키우면 <b>히든 전설 성체(6종)</b>가 등장합니다.
              </li>
              <li>
                <b>2세대 독립:</b> 성체 달성 후 24시간이 지나면 <code>📊 상태</code> 창에서 기존 코인·스킨·도감을 유지한 채 새 알을 물려받을 수 있습니다.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

const sectionBoxStyle = {
  background: '#f8fafc',
  border: '1.5px solid #e2e8f0',
  borderRadius: '14px',
  padding: '11px 13px',
};

const sectionTitleStyle = {
  fontWeight: '800',
  fontSize: '13.5px',
  color: '#0369a1',
  marginBottom: '6px',
};

const listStyle = {
  margin: 0,
  paddingLeft: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  color: '#334155',
};