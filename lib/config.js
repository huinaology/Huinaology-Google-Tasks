// lib/config.js
// Huinaology Google Tasks (Public) 전용 설정.
// Notion 연동 없이 Google Tasks 기본 목록(@default)만 다룬다.
const Config = {
    // 1. 환경 변수 매핑
    ENV: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    },

    // 2. Google Tasks 설정
    TASKLIST: '@default',
    MAX_RESULTS: 100,
};

module.exports = Config;
