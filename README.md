# Create Calendar Crew App

캘린더 기반 참여 신청 웹앱을 생성하는 Claude Code Plugin.

## 개요

날짜별 참여 신청 기능이 필요한 웹앱을 대화형으로 생성합니다.

**활용 예시:** 점심 모임, 스터디 그룹, 독서 모임, 운동 크루, 커피챗 예약

## 설치

Claude Code에서 실행:

```bash
# Step 1: 마켓플레이스 등록
/plugin marketplace add OkminLee/create-calendar-crew-app

# Step 2: 플러그인 설치
/plugin install create-calendar-crew-app@create-calendar-app
```

## 사용법

Claude Code에서 `/create-calendar-crew` 실행 후 설정을 입력합니다.

### 설정 항목

| 항목 | 예시 |
|------|------|
| 앱 이름 | 점심 모임 |
| 앱 설명 | 매일 점심 함께할 동료 모집 |
| 이벤트 이모지 | 🍽️ |
| 테마 색상 | #4CAF50 |
| 기능 선택 | 댓글, 알림, Slack |
| 백엔드 플랫폼 | Cloudflare Workers |

### 기능

**기본 제공:**
- 캘린더 기반 참여 신청/취소
- 이름 저장 (LocalStorage)
- PWA 지원

**선택적:**
- 댓글/리액션
- 푸시 알림 (FCM)
- Slack 연동

## 생성되는 프로젝트

```
{project-name}/
├── frontend/           # React PWA
│   ├── src/
│   ├── .env.example
│   └── package.json
├── worker/             # Cloudflare Worker (선택)
│   ├── src/
│   └── wrangler.toml
└── README.md
```

### 기술 스택

**프론트엔드:** React 18, TypeScript, Vite, Tailwind CSS, Zustand, Firebase SDK

**백엔드:** Cloudflare Workers, Firebase Admin SDK, Slack Web API

## 배포

### 프론트엔드

```bash
cd frontend
npm install && npm run build
firebase deploy --only hosting  # 또는 vercel
```

### Worker (선택)

```bash
cd worker
npm install
npx wrangler secret put SLACK_BOT_TOKEN
npx wrangler secret put FIREBASE_PRIVATE_KEY
npx wrangler secret put FIREBASE_CLIENT_EMAIL
npx wrangler deploy
```

## 환경변수

### 프론트엔드 (.env)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_VAPID_KEY=...
VITE_WORKER_URL=https://your-worker.workers.dev
```

### Worker (wrangler secrets)

```
SLACK_BOT_TOKEN
FIREBASE_PROJECT_ID
FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL
```

## 라이선스

MIT
