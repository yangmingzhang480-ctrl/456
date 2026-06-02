/**
 * Lorebook / World Info API
 */
import { Router, type Request, type Response } from 'express';
import { readJSON, writeJSON, listJSONFiles } from './data.js';

export const lorebookRouter = Router();

const LOREBOOK_DIR = 'lorebooks';

// GET /api/lorebooks — list all lorebooks
lorebookRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const files = await listJSONFiles(LOREBOOK_DIR);
    const books = await Promise.all(files.map(async f => {
      const data = await readJSON(LOREBOOK_DIR, f);
      return { id: f.replace('.json',''), name: (data as Record<string,unknown>).name || f, entries: Object.keys((data as Record<string,unknown>).entries || {}).length };
    }));
    res.json(books);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
});

// GET /api/lorebooks/:id — get single lorebook
lorebookRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const data = await readJSON(LOREBOOK_DIR, `${req.params.id}.json`);
    res.json(data);
  } catch { res.status(404).json({ error: '世界书未找到' }); }
});

// POST /api/lorebooks — save a lorebook
lorebookRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { id, ...bookData } = req.body;
    if (!id) return res.status(400).json({ error: '需要提供 id' });
    await writeJSON(LOREBOOK_DIR, `${id}.json`, { id, ...bookData });
    res.json({ ok: true, id });
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
});

// DELETE /api/lorebooks/:id
lorebookRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const fs = await import('fs/promises');
    const { getDataPath } = await import('./data.js');
    await fs.unlink(getDataPath(LOREBOOK_DIR, `${req.params.id}.json`));
    res.json({ ok: true });
  } catch { res.status(404).json({ error: '世界书未找到' }); }
});
