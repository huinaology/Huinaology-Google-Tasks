// api/tasks.js
// Google Tasks REST API를 직접 호출한다. (googleapis 패키지 없이 fetch만 사용 → 배포 용량/속도 최소화)
const Config = require('../lib/config');

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const TASKS_BASE = 'https://tasks.googleapis.com/tasks/v1';

async function getAccessToken() {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = Config.ENV;
    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            refresh_token: GOOGLE_REFRESH_TOKEN,
            grant_type: 'refresh_token'
        })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || data.error || `token ${res.status}`);
    return data.access_token;
}

async function tasksRequest(accessToken, method, path, body) {
    const res = await fetch(`${TASKS_BASE}${path}`, {
        method,
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
    });
    const data = res.status === 204 ? {} : await res.json();
    if (!res.ok) throw new Error((data.error && data.error.message) || `tasks ${res.status}`);
    return data;
}

module.exports = async (req, res) => {
    const { key, mode, title, taskId } = req.query;

    if (!process.env.WIDGET_SECRET || key !== process.env.WIDGET_SECRET) {
        return res.status(401).json({ success: false, error: "⛔ 접근 권한이 없습니다." });
    }

    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = Config.ENV;
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
        return res.status(500).json({ success: false, error: "Google API 환경변수가 설정되지 않았습니다. (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN 확인)" });
    }

    const listPath = `/lists/${encodeURIComponent(Config.TASKLIST)}/tasks`;

    try {
        const accessToken = await getAccessToken();

        // ============================
        // mode: list
        // ============================
        if (mode === 'list') {
            const qs = new URLSearchParams({ showCompleted: 'true', showHidden: 'false', maxResults: String(Config.MAX_RESULTS) });
            const data = await tasksRequest(accessToken, 'GET', `${listPath}?${qs}`);

            const tasks = data.items || [];
            // 미완료 우선, 그다음 완료 순으로 정렬
            tasks.sort((a, b) => {
                if (a.status === 'completed' && b.status !== 'completed') return 1;
                if (a.status !== 'completed' && b.status === 'completed') return -1;
                return new Date(b.updated || 0).getTime() - new Date(a.updated || 0).getTime();
            });

            return res.status(200).json({ success: true, tasks });
        }

        // ============================
        // mode: create
        // ============================
        if (mode === 'create') {
            if (!title) return res.status(400).json({ success: false, error: "title 파라미터 필요" });
            const created = await tasksRequest(accessToken, 'POST', listPath, { title });
            return res.status(200).json({ success: true, taskId: created.id });
        }

        // ============================
        // mode: complete / uncomplete
        // ============================
        if (mode === 'complete' || mode === 'uncomplete') {
            if (!taskId) return res.status(400).json({ success: false, error: "taskId 파라미터 필요" });
            const body = mode === 'complete'
                ? { status: 'completed' }
                : { status: 'needsAction', completed: null };
            await tasksRequest(accessToken, 'PATCH', `${listPath}/${encodeURIComponent(taskId)}`, body);
            return res.status(200).json({ success: true });
        }

        return res.status(400).json({ success: false, error: "알 수 없는 mode: " + mode });

    } catch (error) {
        console.error("Tasks API Error:", error.message);
        let userMsg = error.message;
        if (/unauthorized_client|invalid_grant/.test(error.message)) {
            userMsg = "Google 인증 실패. GOOGLE_REFRESH_TOKEN이 만료되었거나 잘못되었습니다. README의 'Refresh Token 발급' 단계를 다시 진행해주세요. (OAuth 동의 화면이 '테스트' 상태면 7일마다 만료됩니다)";
        } else if (/has not been used|is disabled|accessNotConfigured/i.test(error.message)) {
            userMsg = "Google Tasks API가 활성화되지 않았습니다. Google Cloud Console → API 및 서비스 → 라이브러리 → 'Tasks API' → 사용 설정이 필요합니다.";
        }
        return res.status(500).json({ success: false, error: userMsg });
    }
};
