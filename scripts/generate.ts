#!/usr/bin/env npx ts-node

/**
 * Calendar Crew App 생성기
 * 템플릿 파일을 기반으로 새로운 캘린더 참여 앱을 생성합니다.
 */

import * as fs from 'fs';
import * as path from 'path';

// 설정 타입 정의
interface AppConfig {
  // 기본 정보
  appName: string;          // "점심 모임"
  appNameKebab: string;     // "lunch-crew"
  appShortName: string;     // "점심모임"
  appDescription: string;   // "매일 점심 함께할 동료 모집"
  eventName: string;        // "점심 모임"
  eventEmoji: string;       // "🍽️"

  // 테마
  themeColor: string;       // "#4CAF50"
  appIcon: string;          // "lunch" (lucide icon name)

  // 기능 플래그
  featureComments: boolean;
  featureNotifications: boolean;
  featureSlack: boolean;

  // 백엔드 설정
  backendPlatform: 'cloudflare' | 'vercel' | 'aws';
  cronSchedule: string;     // "0 1 * * 1-5" (UTC, 평일 10:00 KST)

  // Slack 설정 (선택)
  slackChannel?: string;
  emojiPositive?: string;   // "coffee"
  emojiNegative?: string;   // "x"

  // 경로
  outputPath: string;

  // Firebase
  firebaseProjectId?: string;
}

// 색상 팔레트 생성 (간단한 버전)
function generateColorPalette(hexColor: string): Record<string, string> {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const lighten = (value: number, percent: number) =>
    Math.min(255, Math.round(value + (255 - value) * percent));
  const darken = (value: number, percent: number) =>
    Math.round(value * (1 - percent));

  const toHex = (r: number, g: number, b: number) =>
    `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;

  return {
    '50': toHex(lighten(r, 0.9), lighten(g, 0.9), lighten(b, 0.9)),
    '100': toHex(lighten(r, 0.8), lighten(g, 0.8), lighten(b, 0.8)),
    '200': toHex(lighten(r, 0.6), lighten(g, 0.6), lighten(b, 0.6)),
    '300': toHex(lighten(r, 0.4), lighten(g, 0.4), lighten(b, 0.4)),
    '400': toHex(lighten(r, 0.2), lighten(g, 0.2), lighten(b, 0.2)),
    '500': hexColor,
    '600': toHex(darken(r, 0.1), darken(g, 0.1), darken(b, 0.1)),
    '700': toHex(darken(r, 0.2), darken(g, 0.2), darken(b, 0.2)),
    '800': toHex(darken(r, 0.3), darken(g, 0.3), darken(b, 0.3)),
    '900': toHex(darken(r, 0.4), darken(g, 0.4), darken(b, 0.4)),
  };
}

// 템플릿 변수 치환
function processTemplate(content: string, config: AppConfig): string {
  const palette = generateColorPalette(config.themeColor);

  const replacements: Record<string, string> = {
    '{{APP_NAME}}': config.appName,
    '{{APP_NAME_KEBAB}}': config.appNameKebab,
    '{{APP_SHORT_NAME}}': config.appShortName,
    '{{APP_DESCRIPTION}}': config.appDescription,
    '{{EVENT_NAME}}': config.eventName,
    '{{EVENT_EMOJI}}': config.eventEmoji,
    '{{THEME_COLOR}}': config.themeColor,
    '{{APP_ICON}}': config.appIcon,
    '{{BOT_NAME}}': `${config.appNameKebab}-bot`,
    '{{CRON_SCHEDULE}}': config.cronSchedule,
    '{{SLACK_CHANNEL}}': config.slackChannel || '',
    '{{EMOJI_POSITIVE}}': config.emojiPositive || 'thumbsup',
    '{{EMOJI_NEGATIVE}}': config.emojiNegative || 'x',
    '{{WEB_APP_URL}}': `https://${config.appNameKebab}.web.app`,
    '{{FIREBASE_PROJECT_ID}}': config.firebaseProjectId || 'your-firebase-project',

    // 색상 팔레트
    '{{PRIMARY_50}}': palette['50'],
    '{{PRIMARY_100}}': palette['100'],
    '{{PRIMARY_200}}': palette['200'],
    '{{PRIMARY_300}}': palette['300'],
    '{{PRIMARY_400}}': palette['400'],
    '{{PRIMARY_500}}': palette['500'],
    '{{PRIMARY_600}}': palette['600'],
    '{{PRIMARY_700}}': palette['700'],
    '{{PRIMARY_800}}': palette['800'],
    '{{PRIMARY_900}}': palette['900'],
  };

  let result = content;

  // 기본 변수 치환
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(escapeRegex(key), 'g'), value);
  }

  // 조건부 블록 처리
  result = processConditionalBlocks(result, {
    'FEATURE_COMMENTS': config.featureComments,
    'FEATURE_NOTIFICATIONS': config.featureNotifications,
    'ENABLE_SLACK': config.featureSlack,
  });

  return result;
}

// 조건부 블록 처리
function processConditionalBlocks(content: string, flags: Record<string, boolean>): string {
  let result = content;

  for (const [flag, enabled] of Object.entries(flags)) {
    const startTag = `{{#${flag}}}`;
    const endTag = `{{/${flag}}}`;

    if (enabled) {
      // 태그만 제거하고 내용은 유지
      result = result.replace(new RegExp(escapeRegex(startTag), 'g'), '');
      result = result.replace(new RegExp(escapeRegex(endTag), 'g'), '');
    } else {
      // 전체 블록 제거
      const regex = new RegExp(`${escapeRegex(startTag)}[\\s\\S]*?${escapeRegex(endTag)}`, 'g');
      result = result.replace(regex, '');
    }
  }

  return result;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 디렉토리 재귀 복사 및 템플릿 처리
function processDirectory(
  templateDir: string,
  outputDir: string,
  config: AppConfig
): void {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const items = fs.readdirSync(templateDir);

  for (const item of items) {
    const templatePath = path.join(templateDir, item);
    let outputPath = path.join(outputDir, item);

    // .template 확장자 제거
    if (outputPath.endsWith('.template')) {
      outputPath = outputPath.slice(0, -9);
    }

    const stat = fs.statSync(templatePath);

    if (stat.isDirectory()) {
      processDirectory(templatePath, outputPath, config);
    } else {
      const content = fs.readFileSync(templatePath, 'utf-8');
      const processed = processTemplate(content, config);
      fs.writeFileSync(outputPath, processed);
      console.log(`✓ Created: ${outputPath}`);
    }
  }
}

// 메인 생성 함수
export function generateApp(config: AppConfig): void {
  const scriptDir = path.dirname(__filename);
  const projectRoot = path.dirname(scriptDir);
  const templatesDir = path.join(projectRoot, 'templates');

  console.log(`\n🚀 Generating ${config.appName}...\n`);

  // 프론트엔드 생성
  console.log('📱 Creating frontend...');
  const frontendTemplateDir = path.join(templatesDir, 'frontend');
  const frontendOutputDir = path.join(config.outputPath, 'frontend');
  processDirectory(frontendTemplateDir, frontendOutputDir, config);

  // 백엔드 생성 (알림 또는 Slack 기능 선택 시)
  if (config.featureNotifications || config.featureSlack) {
    console.log('\n⚙️ Creating worker...');
    const workerTemplateDir = path.join(templatesDir, 'worker');
    const workerOutputDir = path.join(config.outputPath, 'worker');
    processDirectory(workerTemplateDir, workerOutputDir, config);
  }

  console.log(`\n✅ Project created at: ${config.outputPath}`);
  console.log('\n📋 Next steps:');
  console.log('1. cd ' + config.outputPath + '/frontend');
  console.log('2. npm install');
  console.log('3. Copy .env.example to .env and fill in your Firebase config');
  console.log('4. npm run dev');

  if (config.featureNotifications || config.featureSlack) {
    console.log('\n⚙️ Worker setup:');
    console.log('1. cd ' + config.outputPath + '/worker');
    console.log('2. npm install');
    console.log('3. Configure wrangler.toml with your secrets');
    console.log('4. npx wrangler deploy');
  }
}

// CLI 실행
if (require.main === module) {
  // 예시 설정으로 테스트
  const testConfig: AppConfig = {
    appName: '점심 모임',
    appNameKebab: 'lunch-crew',
    appShortName: '점심모임',
    appDescription: '매일 점심 함께할 동료 모집',
    eventName: '점심 모임',
    eventEmoji: '🍽️',
    themeColor: '#4CAF50',
    appIcon: 'utensils',
    featureComments: true,
    featureNotifications: true,
    featureSlack: false,
    backendPlatform: 'cloudflare',
    cronSchedule: '0 2 * * 1-5',
    outputPath: './test-output',
  };

  generateApp(testConfig);
}
