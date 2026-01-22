# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-22

### Added
- Initial release as Claude Code Plugin
- `/create-calendar-crew` slash command for interactive app generation
- Frontend templates (React + Vite + Tailwind + PWA)
- Backend templates (Cloudflare Workers)
- Support for optional features:
  - Comments and reactions
  - Push notifications (FCM)
  - Slack integration
- Template variable substitution system
- Conditional block processing for feature flags
- Color palette auto-generation from theme color

### Changed
- Converted from local skill to distributable plugin format
- Updated template paths to use `${CLAUDE_PLUGIN_ROOT}` environment variable

### Technical Details
- Plugin manifest: `.claude-plugin/plugin.json`
- Skill location: `skills/create-calendar-crew.md`
- Templates location: `templates/frontend/` and `templates/worker/`
