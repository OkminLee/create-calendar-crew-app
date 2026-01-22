# Create Calendar Crew App

범용 캘린더 기반 참여 신청 웹앱을 생성하는 스킬입니다.

## 실행 방법

`/create-calendar-crew` 또는 `/새-캘린더-앱-생성`으로 실행

## 주요 기능

이 스킬은 다음 기능을 포함한 PWA 웹앱을 생성합니다:

1. **캘린더 참여 신청**: 날짜별로 참여자 등록/취소
2. **댓글/리액션** (선택적): 날짜별 댓글과 이모지 리액션
3. **알림** (선택적): FCM 기반 푸시 알림, Slack 연동

## 설정 항목

생성 시 다음 정보를 수집합니다:

### 필수 설정
- **앱 이름**: 예) "점심 모임", "스터디 그룹", "독서 모임"
- **앱 설명**: 간단한 앱 설명
- **이벤트 이모지**: 예) ☕, 🍽️, 📚, 🏃
- **테마 색상**: 예) #FFC107 (amber), #4CAF50 (green)

### 기능 선택
- [ ] 댓글/리액션 기능 포함
- [ ] 푸시 알림 기능 포함
- [ ] Slack 연동 포함

### 백엔드 설정 (알림 기능 선택 시)
- **호스팅 플랫폼**: Cloudflare Workers (기본), Vercel, AWS Lambda
- **알림 스케줄**: Cron 표현식 (예: 0 1 * * 1-5 = 평일 10:00 KST)

### 외부 서비스 설정
- **Firebase 프로젝트**: Firestore + FCM용
- **Slack 워크스페이스** (선택): 알림 채널

## 워크플로우

```
1. 사용자에게 설정 수집 (AskUserQuestion)
2. 프로젝트 디렉토리 생성
3. 프론트엔드 코드 생성 (React + Vite + Tailwind + PWA)
4. 백엔드 코드 생성 (선택된 플랫폼용)
5. 환경변수 파일 생성 (.env.example)
6. 배포 가이드 제공
```

## 생성되는 프로젝트 구조

```
{app-name}/
├── frontend/                 # React PWA
│   ├── src/
│   │   ├── components/       # UI 컴포넌트
│   │   ├── hooks/           # 커스텀 훅
│   │   ├── services/        # Firebase, API 서비스
│   │   ├── stores/          # Zustand 상태관리
│   │   ├── types/           # TypeScript 타입
│   │   ├── config/          # 앱 설정
│   │   └── App.tsx
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── worker/                   # Cloudflare Worker (선택)
│   ├── src/
│   │   ├── index.ts         # 메인 핸들러
│   │   ├── messages.ts      # 메시지 템플릿
│   │   ├── slack.ts         # Slack API
│   │   ├── fcm.ts           # FCM 발송
│   │   └── notifications.ts # 알림 핸들러
│   ├── wrangler.toml
│   └── package.json
│
└── README.md                 # 설정 및 배포 가이드
```

## 기술 스택

### 프론트엔드
- React 18 + TypeScript
- Vite (빌드)
- Tailwind CSS
- Zustand (상태관리)
- Firebase SDK (Firestore, FCM)
- Lucide React (아이콘)
- PWA (Vite PWA 플러그인)

### 백엔드 (선택적)
- Cloudflare Workers (기본)
- Firebase Admin SDK
- Slack Web API

## MCP 요구사항 확인

이 스킬은 다음 MCP 서버가 필요할 수 있습니다:

- **filesystem**: 파일 생성 (기본 제공)
- **github**: GitHub repo 생성 (선택적)

MCP 설치 여부는 스킬 실행 시 자동으로 확인됩니다.

## 실행 예시

```
User: /create-calendar-crew

Claude: 새로운 캘린더 참여 앱을 생성합니다. 몇 가지 설정이 필요합니다.

[AskUserQuestion으로 설정 수집]

앱 이름: 점심 모임
설명: 매일 점심 함께할 동료 모집
이모지: 🍽️
테마 색상: #4CAF50

기능:
- [x] 댓글/리액션
- [x] 푸시 알림
- [ ] Slack 연동

백엔드: Cloudflare Workers

[프로젝트 생성 진행...]
```

---

## Instructions

<instructions>

### Plugin 템플릿 경로

**중요**: 이 스킬은 Plugin으로 설치되어 있습니다. 템플릿 파일은 다음 경로에 있습니다:
- 프론트엔드 템플릿: `${CLAUDE_PLUGIN_ROOT}/templates/frontend/`
- Worker 템플릿: `${CLAUDE_PLUGIN_ROOT}/templates/worker/`

템플릿 파일을 읽을 때 `${CLAUDE_PLUGIN_ROOT}` 환경 변수를 사용하여 절대 경로를 구성하세요.

### Phase 1: 설정 수집

AskUserQuestion 도구를 사용하여 다음 정보를 순차적으로 수집합니다:

**1단계: 기본 정보**
```
질문: 앱의 기본 정보를 알려주세요.
- 앱 이름 (예: 점심 모임, 스터디 그룹)
- 앱 설명 (한 줄)
- 이벤트 이모지 (예: ☕, 🍽️, 📚)
- 테마 색상 (예: amber, green, blue 또는 hex)
```

**2단계: 기능 선택**
```
질문: 포함할 기능을 선택해주세요.
옵션:
- 댓글/리액션 기능
- 푸시 알림 (FCM)
- Slack 연동
```

**3단계: 백엔드 선택** (알림/Slack 선택 시)
```
질문: 백엔드 호스팅 플랫폼을 선택해주세요.
옵션:
- Cloudflare Workers (추천)
- Vercel Edge Functions
- AWS Lambda
```

**4단계: 프로젝트 경로**
```
질문: 프로젝트를 생성할 경로를 지정해주세요.
기본값: ~/Work/{app-name-kebab}
```

### Phase 2: MCP 확인

MCP 서버 가용성을 확인합니다:
- filesystem MCP가 없으면 기본 도구(Write, Bash)를 사용
- github MCP가 있으면 자동 repo 생성 옵션 제공

### Phase 3: 프로젝트 생성

수집된 설정을 기반으로 프로젝트를 생성합니다.

#### 3.1 템플릿 파일 읽기

먼저 `${CLAUDE_PLUGIN_ROOT}/templates/` 디렉토리에서 필요한 템플릿 파일들을 읽습니다:
- `templates/frontend/src/App.tsx.template`
- `templates/frontend/src/config/app.config.ts.template`
- `templates/frontend/package.json.template`
- `templates/frontend/vite.config.ts.template`
- `templates/frontend/tailwind.config.js.template`
- 기타 필요한 템플릿 파일들

#### 3.2 디렉토리 구조 생성

```bash
mkdir -p {project-path}/{frontend,worker}/src
```

#### 3.3 프론트엔드 생성

템플릿 파일을 읽고 다음 변수들을 치환하여 파일을 생성합니다:

**템플릿 변수 목록:**
- `{{APP_NAME}}` - 앱 이름
- `{{APP_NAME_KEBAB}}` - 앱 이름 (kebab-case)
- `{{APP_DESCRIPTION}}` - 앱 설명
- `{{APP_SHORT_NAME}}` - 짧은 앱 이름
- `{{EVENT_NAME}}` - 이벤트 이름
- `{{EVENT_EMOJI}}` - 이벤트 이모지
- `{{THEME_COLOR}}` - 테마 색상 (hex)
- `{{PRIMARY_50}}` ~ `{{PRIMARY_900}}` - 색상 팔레트
- `{{FEATURE_COMMENTS}}` - 댓글 기능 (true/false)
- `{{FEATURE_NOTIFICATIONS}}` - 알림 기능 (true/false)
- `{{FEATURE_SLACK}}` - Slack 기능 (true/false)

**조건부 블록:**
- `{{#FEATURE_COMMENTS}}...{{/FEATURE_COMMENTS}}` - 댓글 기능 선택 시만 포함
- `{{#FEATURE_NOTIFICATIONS}}...{{/FEATURE_NOTIFICATIONS}}` - 알림 선택 시만 포함
- `{{#ENABLE_SLACK}}...{{/ENABLE_SLACK}}` - Slack 선택 시만 포함

주요 파일 생성:
1. `package.json` - 의존성 (선택된 기능에 따라 조정)
2. `vite.config.ts` - Vite + PWA 설정
3. `tailwind.config.js` - 테마 색상 적용
4. `src/App.tsx` - 메인 컴포넌트 (설정 기반)
5. `src/types/index.ts` - 타입 정의
6. `src/stores/` - Zustand 스토어
7. `src/hooks/` - 커스텀 훅
8. `src/services/` - Firebase 서비스
9. `src/components/` - UI 컴포넌트
10. `.env.example` - 환경변수 템플릿

#### 3.4 백엔드 생성 (선택 시)

**Cloudflare Workers**:
1. `wrangler.toml` - Worker 설정
2. `src/index.ts` - 메인 핸들러
3. `src/messages.ts` - 커스텀 메시지 템플릿
4. `src/notifications.ts` - FCM 알림
5. `src/slack.ts` - Slack 연동 (선택 시)
6. `package.json` - Worker 의존성

#### 3.5 README.md 생성

- 프로젝트 설명
- 환경 설정 가이드
- Firebase 프로젝트 설정 방법
- 배포 방법 (선택된 플랫폼별)
- 환경변수 설명

### Phase 4: 완료 안내

생성 완료 후 다음 단계를 안내합니다:

1. **Firebase 프로젝트 설정**
   - Firebase Console에서 프로젝트 생성
   - Firestore 데이터베이스 생성
   - FCM 설정 (알림 선택 시)
   - 서비스 계정 키 다운로드

2. **환경변수 설정**
   - `.env.example`을 `.env`로 복사
   - Firebase 설정값 입력

3. **로컬 개발**
   ```bash
   cd {project-path}/frontend
   npm install
   npm run dev
   ```

4. **배포**
   - 프론트엔드: Firebase Hosting 또는 Vercel
   - 백엔드: 선택된 플랫폼에 따른 배포 명령어

</instructions>

## 템플릿 파일 참조

이 스킬은 Plugin 디렉토리 내 `templates/` 폴더의 템플릿 파일을 사용합니다:
- `${CLAUDE_PLUGIN_ROOT}/templates/frontend/` - 프론트엔드 템플릿
- `${CLAUDE_PLUGIN_ROOT}/templates/worker/` - Worker 템플릿

템플릿 변수 형식: `{{VARIABLE_NAME}}`
