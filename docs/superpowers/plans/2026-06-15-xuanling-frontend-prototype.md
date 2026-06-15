# 玄灵界终端前端原型 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-fidelity pure frontend prototype for the Xuanling LLM xianxia RPG terminal.

**Architecture:** Replace the app entry with a focused React prototype shell that owns local UI state for navigation, modals, drawers, map mode, and toasts. Keep all game data in one frontend data module and all SVG icons in one icon module. Use CSS-only layered backgrounds and transform/opacity animations for performance.

**Tech Stack:** React 19, Vite, TypeScript, CSS, inline SVG, existing test/build scripts.

---

## File Structure

- Create `src/prototype/xuanlingData.ts`: static characters, map nodes, skills, inventory, records, settings options.
- Create `src/prototype/XuanlingIcons.tsx`: all inline SVG icons; no emoji.
- Create `src/prototype/XuanlingPrototype.tsx`: semantic React UI, local interactions, modals, drawers, toasts.
- Create `src/prototype/xuanling-prototype.css`: full visual system, background, layout, animations, responsive states.
- Modify `src/App.tsx`: render the prototype.
- Modify `src/index.css`: import prototype CSS after existing styles.

## Tasks

### Task 1: Frontend Data And SVG Icons

**Files:**
- Create: `src/prototype/xuanlingData.ts`
- Create: `src/prototype/XuanlingIcons.tsx`

- [ ] Create typed static data for four protagonists, macro map, micro map, skills, inventory, records, setting controls, and notifications.
- [ ] Create reusable inline SVG icons for navigation, character seals, city, rift, array, relic, inventory, skill tree, scroll, settings, warning, close, and chevrons.
- [ ] Ensure no emoji characters appear in icon labels or data-driven icon fields.

### Task 2: Prototype Shell And Interactions

**Files:**
- Create: `src/prototype/XuanlingPrototype.tsx`
- Modify: `src/App.tsx`

- [ ] Implement local state: active panel, map mode, active modal, active drawer, toasts.
- [ ] Implement semantic layout: `nav`, `main`, `section`, `article`, `aside`, `dialog`-like modal container.
- [ ] Add unique ids to every interactive control.
- [ ] Implement navigation panels: status, map, skills, inventory, records, settings.
- [ ] Implement click handlers for character cards, map nodes, skill nodes, inventory items, and warning chips.

### Task 3: Premium Visual System

**Files:**
- Create: `src/prototype/xuanling-prototype.css`
- Modify: `src/index.css`

- [ ] Add Noto Serif SC font import with font-display-friendly fallback.
- [ ] Add layered abyss background, black sea scale texture via CSS gradients, starfire particles via pseudo-elements.
- [ ] Add premium card, button, modal, drawer, toast, map node, token, and attribute bar styles.
- [ ] Add hover, focus, pressed, entrance, shimmer, warning pulse, and reduced-motion rules.
- [ ] Add responsive layout for desktop/tablet/mobile without horizontal scroll.

### Task 4: Verification And Delivery

**Files:**
- All touched frontend files.

- [ ] Run `npm test` and expect existing tests to pass.
- [ ] Run `npm run build` and expect TypeScript + Vite build to pass.
- [ ] Search source for emoji-prone Unicode symbols in new prototype files and remove any structural emoji.
- [ ] Commit implementation.
- [ ] Push commits to GitHub using available credentials or report authentication blocker with exact status.
