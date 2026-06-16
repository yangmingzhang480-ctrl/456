# Xuanling Game API And Database Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the tavern RPG prototype into a playable API-backed game loop with persistent JSON database files.

**Architecture:** Add an Express game route that owns world-state persistence, chat-session persistence, LLM proxy generation, and deterministic fallback generation. Update the tavern panel to call the route and render returned structured tags.

**Tech Stack:** React, Vite, Express, TypeScript, JSON file persistence under `data/`, existing SillyTavern prompt conventions.

---

### Task 1: Backend Game Route

**Files:**
- Create: `server/routes/game.ts`
- Modify: `server/index.ts`

- [x] Add `/api/game/world-state`, `/api/game/chats`, and `/api/game/generate`.
- [x] Save world state to `data/world-state.json` and sessions to `data/chats/<id>.json`.
- [x] Use configured LLM API when `data/settings.json` contains an API key; otherwise return a deterministic local RPG response.

### Task 2: Frontend Tavern Panel

**Files:**
- Modify: `src/prototype/XuanlingPrototype.tsx`
- Modify: `src/prototype/xuanling-prototype.css`

- [x] Add generate/loading/session state to `TavernPanel`.
- [x] Call `POST /api/game/generate` from the Generate button.
- [x] Render returned `thinking/maintext/option/sum/vars` content and show backend persistence status.

### Task 3: Verification

- [x] Run `npm run build:server`.
- [x] Run `npm run build`.
- [x] Run `npm test`.
