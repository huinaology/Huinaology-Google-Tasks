# ✅ Huinaology Google Tasks Widget

Huinaology 노션 템플릿용 **Google Tasks 부가기능**입니다. 노션 페이지 안에서 Google Tasks의 할 일을 보고, 추가하고, 완료 체크할 수 있습니다. (Notion 연동은 필요 없습니다.)

프로그래밍 지식이 전혀 없어도, 아래 순서를 그대로 따라오시면 10분 안에 설치할 수 있습니다.

## 🚀 준비물
1. Google 계정 (Google Tasks를 쓰는 계정)
2. Github 계정 (https://github.com/) — 없으면 이메일로 무료 가입
3. Vercel 계정 (https://vercel.com/) — **Github 계정으로 바로 가입 가능**

## 🛠️ 설치 가이드 (No-Code)

### STEP 1. Google Cloud에서 Tasks API 켜기
1. https://console.cloud.google.com/ 접속 → 상단 프로젝트 선택 → **[새 프로젝트]** (이름 예: `Tasks Widget`) → 만들기
2. 왼쪽 메뉴 **[API 및 서비스] → [라이브러리]** → `Tasks API` 검색 → **[사용]** 클릭

### STEP 2. OAuth 동의 화면 만들기
1. **[API 및 서비스] → [OAuth 동의 화면]** (Google 인증 플랫폼) → **[시작하기]**
2. 앱 이름(예: `Tasks Widget`), 사용자 지원 이메일(본인 이메일) 입력 → 대상(Audience)은 **외부(External)** 선택 → 연락처 이메일 입력 → 완료
3. **[대상(Audience)]** 메뉴 → 게시 상태에서 **[앱 게시(Publish app)]** → 확인

    > ⚠️ 이 단계를 빼먹고 "테스트" 상태로 두면 **7일마다 위젯이 인증 오류로 멈춥니다.** 본인만 쓰는 용도라 Google 검토(인증) 절차는 필요 없습니다.

### STEP 3. OAuth 클라이언트 만들기
1. **[클라이언트(Clients)] → [+ 클라이언트 만들기]**
2. 애플리케이션 유형: **웹 애플리케이션**
3. **승인된 리디렉션 URI**에 아래 주소를 그대로 추가합니다.
    ```
    https://developers.google.com/oauthplayground
    ```
4. 만들기 → 표시되는 **클라이언트 ID**(`GOOGLE_CLIENT_ID`)와 **클라이언트 보안 비밀번호**(`GOOGLE_CLIENT_SECRET`)를 복사해둡니다.

### STEP 4. Refresh Token 발급받기
1. https://developers.google.com/oauthplayground 접속
2. 우측 상단 ⚙️(톱니바퀴) → **Use your own OAuth credentials** 체크 → STEP 3의 Client ID / Client secret 붙여넣기
3. 왼쪽 **Step 1** 아래 입력칸에 아래 주소를 입력하고 **[Authorize APIs]** 클릭
    ```
    https://www.googleapis.com/auth/tasks
    ```
4. Google 로그인 → "Google에서 확인하지 않은 앱" 화면이 나오면 **[고급] → [(앱 이름)(으)로 이동]** → 허용
5. **Step 2** 화면에서 **[Exchange authorization code for tokens]** 클릭 → 나타나는 **Refresh token** 값(`1//`로 시작)을 복사해둡니다. 이게 `GOOGLE_REFRESH_TOKEN`입니다.

### STEP 5. Vercel로 1초 배포하기
아래 버튼을 누르면 Vercel이 자동으로 **① 이 저장소를 여러분의 Github 계정으로 복사하고 → ② 필요한 값을 입력하는 화면을 띄운 뒤 → ③ 자동으로 배포**까지 해줍니다.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/huinaology/Huinaology-Google-Tasks&env=WIDGET_SECRET,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,GOOGLE_REFRESH_TOKEN)

1. **Github 로그인/연결** → 저장소 이름을 정하고 다음으로 넘어갑니다.
2. **환경 변수 입력 화면**에서 아래 값을 입력합니다.

    | 환경 변수 | 설명 |
    |---|---|
    | `WIDGET_SECRET` | 위젯 접근 비밀번호. 아무 문자열이나 직접 정해서 입력 (예: `mytasks123`) |
    | `GOOGLE_CLIENT_ID` | STEP 3의 클라이언트 ID |
    | `GOOGLE_CLIENT_SECRET` | STEP 3의 클라이언트 보안 비밀번호 |
    | `GOOGLE_REFRESH_TOKEN` | STEP 4의 Refresh token |

3. **Deploy** 버튼을 누르면 1분 이내로 배포가 끝나고, 발급된 주소(`https://내프로젝트이름.vercel.app`)가 나옵니다.

### STEP 6. 노션에 임베드하기
발급받은 주소 뒤에 `?key=STEP 5에서 정한 WIDGET_SECRET값` 을 붙여서 노션 페이지에 **임베드(Embed) 블록**으로 붙여넣으면 끝입니다.

```
https://내프로젝트이름.vercel.app?key=mytasks123
```

위젯 우측 상단 🎨 버튼으로 색상을 바꿀 수 있습니다. 주소에 `&color=` 를 붙이면 해당 색으로 고정됩니다.

```
https://내프로젝트이름.vercel.app?key=mytasks123&color=lavender
```

| `color` 값 | 색상 |
|---|---|
| `blue` (기본) | 노션 블루 |
| `lavender` | 라벤더 |
| `rose` | 로즈 |
| `peach` | 피치 |
| `lemon` | 레몬 |
| `mint` | 민트 |
| `aqua` | 아쿠아 |
| `powder` | 파우더블루 |
| `sage` | 세이지 |
| `creme` | 크렘브륄레 |
| `slate` | 슬레이트 |

## 🛠️ 업데이트 방법
1. 이 저장소(https://github.com/huinaology/Huinaology-Google-Tasks)에서 변경된 파일을 열어 전체 코드를 복사합니다.
2. STEP 5에서 만들어진 내 Github 저장소로 이동해 동일한 파일을 열고, 우측 상단 연필 아이콘(Edit this file)으로 기존 코드를 지운 뒤 새 코드를 붙여넣습니다.
3. 페이지 하단 **[Commit changes...]** 로 저장합니다.
4. [Vercel 대시보드](https://vercel.com/dashboard)에서 해당 프로젝트의 **[Deployments] → [...] → [Redeploy]** 를 누르면 끝입니다.

## ❓문제가 생겼을 때
- **"Google 인증 실패"** 오류: STEP 2의 **[앱 게시]** 를 했는지 확인한 뒤, STEP 4를 다시 진행해 새 Refresh token을 받고 Vercel의 **[Settings] → [Environment Variables]** 에서 `GOOGLE_REFRESH_TOKEN` 값을 교체 → **[Redeploy]** 해주세요.
- **"Tasks API가 활성화되지 않았습니다"** 오류: STEP 1-2를 다시 확인해주세요.
- **"⛔ 접근 권한이 없습니다"** 오류: 임베드 주소의 `?key=` 값이 `WIDGET_SECRET`과 같은지 확인해주세요.
