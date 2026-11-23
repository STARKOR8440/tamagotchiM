// Firebase Realtime Database URL을 여기에 입력하세요 (끝에 슬래시 '/' 제외)
// 예: 'https://tamagotchi-plaza-default-rtdb.firebaseio.com'
export const FIREBASE_DB_URL = '';

export const isFirebaseConfigured = () =>
  typeof FIREBASE_DB_URL === 'string' && FIREBASE_DB_URL.startsWith('https://tamagotchim-8b6b8-default-rtdb.firebaseio.com');