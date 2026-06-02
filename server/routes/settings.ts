/**
 * Settings API — application configuration
 */
import { Router, type Request, type Response } from 'express';
import { readJSON, writeJSON } from './data.js';
import { clearSettingsCache } from './chat.js';

export const settingsRouter = Router();
const SETTINGS_FILE = 'settings.json';

// Default settings
const DEFAULT_SETTINGS = {
  api: { baseUrl: 'https://api.openai.com/v1', apiKey: '', model: 'gpt-4o-mini' },
  secondaryApi: { enabled: false, baseUrl: '', apiKey: '', model: '' },
  characterName: '陆星遥',
  userName: '轮回者',
  activePresetId: null,
  activeLorebookIds: [],
  uiMode: 'game' as const,
  customTags: ['maintext', 'option', 'sum', 'vars', 'thinking', 'think'],
  formatPromptTemplate: '',
  theme: 'abyss-gold',
};

// GET /api/settings
settingsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const data = await readJSON('', SETTINGS_FILE).catch(() => DEFAULT_SETTINGS);
    res.json(data);
  } catch { res.json(DEFAULT_SETTINGS); }
});

// PUT /api/settings
settingsRouter.put('/', async (req: Request, res: Response) => {
  try {
    await writeJSON('', SETTINGS_FILE, req.body);
    clearSettingsCache();
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
});

// PATCH /api/settings
settingsRouter.patch('/', async (req: Request, res: Response) => {
  try {
    const current = await readJSON('', SETTINGS_FILE).catch(() => DEFAULT_SETTINGS);
    const merged = { ...(current as Record<string,unknown>), ...req.body };
    await writeJSON('', SETTINGS_FILE, merged);
    clearSettingsCache();
    res.json(merged);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
});
