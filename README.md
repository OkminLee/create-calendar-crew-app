# Create Calendar Crew App

범용 캘린더 기반 참여 신청 웹앱을 생성하는 Claude Code Plugin입니다.

## 설치 방법

### 옵션 1: settings.json에 추가 (권장)

`~/.claude/settings.json` 파일에 다음을 추가하세요:

```json
{
  "plugins": {
    "create-calendar-crew-app@github:okminlee/create-calendar-crew-app": "enabled"
  }
}
```

### 옵션 2: /plugin 명령어로 설치

Claude Code에서 다음 명령어를 실행하세요:

```
/plugin install create-calendar-crew-app@github:okminlee/create-calendar-crew-app
```

### 옵션 3: 로컬 설치 (개발/테스트용)

```bash
git clone https://github.com/okminlee/create-calendar-crew-app.git ~/.claude/plugins/create-calendar-crew-app
```

그 다음 `~/.claude/settings.json`에 추가:

```json
{
  "plugins": [
    { "type": "local", "path": "~/.claude/plugins/create-calendar-crew-app" }
  ]
}
```

---

## 개요

"방탄커피 크루" 프로젝트를 일반화하여 다양한 용도의 캘린더 참여 앱을 쉽게 생성할 수 있습니다.

**사용 예시:**
- 점심 모임 참여 앱
- 스터디 그룹 출석 관리
- 독서 모임 참여 신청
- 운동 크루 모집
- 커피챗 예약 시스템

## 기능

### 핵심 기능 (항상 포함)
- 📅 캘린더 기반 날짜별 참여 신청/취소
- 👤 이름 저장 (LocalStorage)
- 📱 PWA 지원 (홈 화면 추가, 오프라인)

### 선택적 기능
- 💬 **댓글/리액션**: 날짜별 댓글, 대댓글, 이모지 리액션
- 🔔 **푸시 알림**: FCM 기반 알림 (댓글 멘션, 리액션)
- 💼 **Slack 연동**: 정기 메시지, 참여 현황 공유

## 사용 방법

### 1. Claude Code에서 Skill 실행

```
/create-calendar-crew
```

### 2. 설정 입력

대화형으로 다음 정보를 입력합니다:

| 항목 | 예시 | 설명 |
|------|------|------|
| 앱 이름 | 점심 모임 | 앱 헤더에 표시될 이름 |
| 앱 설명 | 매일 점심 함께할 동료 모집 | 앱 부제목 |
| 이벤트 이모지 | 🍽️ | 대표 이모지 |
| 테마 색상 | #4CAF50 | 앱 전반에 사용될 색상 |
| 기능 선택 | 댓글, 알림, Slack | 포함할 기능 체크 |
| 백엔드 플랫폼 | Cloudflare | Worker 호스팅 위치 |

### 3. 생성된 프로젝트 구조

```
{project-name}/
├── frontend/                 # React PWA
│   ├── src/
│   │   ├── components/       # UI 컴포넌트
│   │   ├── hooks/           # 커스텀 훅
│   │   ├── services/        # Firebase 서비스
│   │   ├── stores/          # Zustand 상태관리
│   │   ├── config/          # 앱 설정
│   │   └── App.tsx
│   ├── .env.example         # 환경변수 템플릿
│   └── package.json
│
├── worker/                   # Cloudflare Worker (선택)
│   ├── src/
│   │   ├── index.ts         # API 핸들러
│   │   ├── messages.ts      # 메시지 템플릿
│   │   └── fcm.ts           # FCM 발송
│   └── wrangler.toml
│
└── README.md                 # 프로젝트별 가이드
```

## 기술 스택

### 프론트엔드
- **React 18** + TypeScript
- **Vite** (빌드, HMR)
- **Tailwind CSS** (스타일링)
- **Zustand** (상태관리)
- **Firebase SDK** (Firestore, FCM)
- **Lucide React** (아이콘)
- **Vite PWA Plugin** (PWA 지원)

### 백엔드 (선택적)
- **Cloudflare Workers** (기본 권장)
- Firebase Admin SDK
- Slack Web API

## 배포 가이드

### Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com)에서 프로젝트 생성
2. **Firestore Database** 생성 (production mode)
3. **웹 앱** 추가하여 config 값 획득
4. (알림 기능 시) **Cloud Messaging** 설정
   - Web Push 인증서 생성 (VAPID Key)

### 프론트엔드 배포

```bash
cd frontend
npm install
npm run build

# Firebase Hosting
firebase deploy --only hosting

# 또는 Vercel
vercel
```

### Worker 배포 (알림/Slack 선택 시)

```bash
cd worker
npm install

# Secrets 설정
npx wrangler secret put SLACK_BOT_TOKEN
npx wrangler secret put FIREBASE_PRIVATE_KEY
npx wrangler secret put FIREBASE_CLIENT_EMAIL

# 배포
npx wrangler deploy
```

## MCP 요구사항

이 Skill은 기본 Claude Code 도구만으로 동작합니다:
- **Write**: 파일 생성
- **Bash**: 디렉토리 생성
- **AskUserQuestion**: 설정 수집

선택적 MCP:
- **GitHub MCP**: 자동 repo 생성 (있으면 활용)

## 환경변수

### 프론트엔드 (.env)

```env
# Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_VAPID_KEY=...        # FCM용

# Worker (알림 기능 시)
VITE_WORKER_URL=https://your-worker.workers.dev
```

### Worker (wrangler.toml secrets)

```
SLACK_BOT_TOKEN          # Slack Bot 토큰
FIREBASE_PROJECT_ID      # Firebase 프로젝트 ID
FIREBASE_PRIVATE_KEY     # 서비스 계정 비공개 키
FIREBASE_CLIENT_EMAIL    # 서비스 계정 이메일
```

## 커스터마이징

### 메시지 템플릿 수정

`worker/src/messages.ts`에서 알림 메시지를 커스터마이즈할 수 있습니다:

```typescript
const MESSAGES = [
  '{{EVENT_EMOJI}} 오늘 {{EVENT_NAME}} 참여하실 분?',
  '{{EVENT_NAME}} 타임입니다! 함께해요 {{EVENT_EMOJI}}',
  // 추가 메시지...
];
```

### 테마 색상 변경

`frontend/tailwind.config.js`에서 색상 팔레트를 수정합니다.

### 공휴일 설정

`worker/src/holidays.ts`에서 휴일을 커스터마이즈합니다.
현재 한국 공휴일이 기본 설정되어 있습니다.

## 라이선스

MIT License

## 기여

이슈 및 PR 환영합니다.
