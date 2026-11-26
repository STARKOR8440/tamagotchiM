# 🐣 다마고치 커넥션 PWA (Tamagotchi Connection PWA)

React + Vite 기반으로 제작된 모바일 친화적 다마고치 육성 및 실시간 광장·1:1 IR 통신 대전 웹 애플리케이션입니다. 화면 크기에 맞춘 본체 자동 확대(`shellScale` 최대 `1.62배`), 표준시(`KST` / 로컬 표준시) 기준 날짜·24시간 계산, 3종 1:1 IR 대전 및 실시간 광장 선물·채팅 기능을 포함합니다.

---

## ✨ 주요 기능

### 1. 다마고치 본체 및 반응형 디스플레이 (`src/App.jsx`, `src/TamagotchiShell.jsx`)
* **최대 `1.62배` 자동 스케일링:** `calcOptimalScale`로 가로·세로 가용 영역을 계산해 모바일과 데스크톱 화면에서 여백과 잘림을 최소화합니다.
* **상단 네온 LED 전광판:** 광장 신규 채팅 및 시스템 알림을 좌→우 마키 애니메이션으로 실시간 송출하며, 터치 시 광장 모달로 바로 이동합니다.
* **표준시(`getStandardDateStr`) 기준 시간·24시간 판정:**
  * 일일 간식 횟수(`snackDate`), 일일 IR 대전 보상 카운트(`irBattleMeta`)가 로컬 표준시 자정(`00:00`) 기준으로 리셋됩니다.
  * 성체(`ADULT`) 진입 후 표준시 기준 24시간(`hasPassedStandard24h`) 경과 시 2세대 계승(`startNextGeneration`)이 활성화됩니다.
* **오프라인 경과 시간 및 배변·청소 밸런스:** 접속 종료 후 경과 시간(`elapsed`)을 반영해 포만·행복·청결·체력을 복구하고, 청결도 및 경과 시간에 따라 배변(`poopCount`, 최대 3개)이 생성됩니다. 청소 시 코인 보상을 획득합니다.

### 2. 식사·간식·상점·미니게임 (`src/App.jsx`, `src/MiniGame.jsx`)
* **식사 & 간식(`FOOD`):**
  * 식사류(`MEAL`): 포만감 `95` 이상 시 제한되며, 섭취 후 **3분 소화 쿨타임**이 적용되고 탭에 실시간 `MM:SS` 카운트다운이 표시됩니다.
  * 간식류(`SNACK`): 일일 `6회` 제한 내에서 행복도·청결도 등을 보충합니다.
* **상점(`SHOP`):** 셸 스킨 구매/장착, 파워 드링크, 하늘·대지·바다 속성 열매, 성체 전용 환생구슬 아이템을 제공합니다.
* **미니게임(`MiniGame.jsx`):** 연승(`winStreak`) 및 승패에 따른 코인 보상과 속성 스탯을 제공합니다.

### 3. 진화 도감 (`src/EvolutionDexModal.jsx`, `src/evolutionTree.js`)
* 단계별 캐릭터 수집 현황(`EGG`, `BABY`, `KID`, `TEEN`, `ADULT`)과 하늘·대지·바다 육성 속성 게이지를 확인할 수 있습니다.
* 미발견 캐릭터 선택 시 `hint` 또는 속성·단계 기반 폴백 힌트(`buildFallbackHint`)를 안내합니다.
* 시크릿 에디션(`SECRET_SPACE_VARIANTS`) 해금 이력(`secretHistory`)을 별도 추적합니다.

### 4. 실시간 커넥션 광장 & 1:1 IR 대전 (`src/PlazaModal.jsx`)
* **실시간 접속자 & 채팅:** Firebase Realtime Database(`/plaza/users`, `/plaza/messages`)와 연동되며, 미설정 시 로컬 체험 모드로 동작합니다.
* **코인 선물 금액 지정:** 퀵 금액 버튼(`10🪙`, `30🪙`, `50🪙`, `100🪙`) 및 직접 금액 입력(`1~999999🪙`)으로 상대에게 코인·하트·케이크를 선물할 수 있습니다.
* **1:1 IR 통신 대전 3종:**
  1. **가위바위보 (`RPS`)**: 승리 시 `+50🪙`
  2. **2D6 주사위 (`DICE`)**: 주사위 2개 합산 대결, 더블 승리 시 2배 `+100🪙`
  3. **창·방패·필살 (`DUEL`)**: 상성 심리전 대결, 승리 시 `+60🪙`
* **일일 IR 대전 보상 제한:** 코인 보상은 **하루 최대 5회**까지 지급되며, 한도 달성 이후에는 친선전 모드로 전환됩니다.

---

## 🗂️ 프로젝트 구조

```text
src/
├── App.jsx                # 메인 상태 루프, 표준시/24시간 로직, 스케일 계산, 모달 오케스트레이션
├── TamagotchiShell.jsx    # 다마고치 외형 셸 및 스킨 정의 (SHELL_SKINS)
├── PetSprite.jsx          # 캐릭터 스프라이트 및 애니메이션 렌더링
├── MiniGame.jsx           # 미니게임 모듈
├── PlazaModal.jsx         # 실시간 광장 채팅, 코인 선물, 3종 1:1 IR 대전 모달
├── EvolutionDexModal.jsx  # 진화 도감 및 육성 속성 시각화 모달
├── GuideModal.jsx         # 조작 및 육성 가이드 모달
├── ShareCardModal.jsx     # 인증샷 카드 저장/공유 모달
├── evolutionTree.js       # 종 데이터(SPECIES) 및 진화·환생 판정 로직
├── firebaseConfig.js      # Firebase Realtime Database URL 및 설정 여부 헬퍼
└── sound.js               # 효과음(sfx) 재생 유틸리티
