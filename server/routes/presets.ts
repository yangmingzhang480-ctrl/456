/**
 * Presets API — manage chat completion presets
 */
import { Router, type Request, type Response } from 'express';
import { readJSON, writeJSON, listJSONFiles } from './data.js';

export const presetRouter = Router();
const PRESET_DIR = 'presets';

presetRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const files = await listJSONFiles(PRESET_DIR);
    const presets = await Promise.all(files.map(async f => {
      const data = await readJSON(PRESET_DIR, f) as Record<string, unknown>;
      return { id: f.replace('.json',''), name: data.name || f, model: data.model || '-' };
    }));
    res.json(presets);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
});

presetRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const data = await readJSON(PRESET_DIR, `${req.params.id}.json`);
    res.json(data);
  } catch { res.status(404).json({ error: '预设未找到' }); }
});

presetRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { id, ...presetData } = req.body;
    if (!id) return res.status(400).json({ error: '需要提供 id' });
    await writeJSON(PRESET_DIR, `${id}.json`, { id, ...presetData });
    res.json({ ok: true, id });
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
});

presetRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const fs = await import('fs/promises');
    const { getDataPath } = await import('./data.js');
    await fs.unlink(getDataPath(PRESET_DIR, `${req.params.id}.json`));
    res.json({ ok: true });
  } catch { res.status(404).json({ error: '预设未找到' }); }
});
