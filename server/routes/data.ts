/**
 * Data utilities — JSON file-based persistence (like ST's data/ directory)
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { Router, type Request, type Response } from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_ROOT = path.join(__dirname, '..', '..', 'data');

export function getDataPath(...segments: string[]): string {
  return path.join(DATA_ROOT, ...segments);
}

export async function readJSON(dir: string, filename: string): Promise<unknown> {
  const filePath = getDataPath(dir, filename);
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

export async function writeJSON(dir: string, filename: string, data: unknown): Promise<void> {
  const dirPath = getDataPath(dir);
  await mkdir(dirPath, { recursive: true });
  await writeFile(path.join(dirPath, filename), JSON.stringify(data, null, 2), 'utf-8');
}

export async function listJSONFiles(dir: string): Promise<string[]> {
  try {
    const dirPath = getDataPath(dir);
    const files = await readdir(dirPath);
    return files.filter(f => f.endsWith('.json'));
  } catch { return []; }
}

// ---- Data API routes (import/export/bundled presets) ----
export const dataRouter = Router();

// GET /api/data/presets — list bundled ST presets
dataRouter.get('/presets', async (_req: Request, res: Response) => {
  try {
    const presetsDir = path.join(__dirname, '..', '..', 'public', 'assets', 'presets');
    const categories = ['openai', 'context', 'instruct', 'sysprompt', 'reasoning', 'quick-replies'];
    const result: Record<string, string[]> = {};
    for (const cat of categories) {
      try {
        const files = await readdir(path.join(presetsDir, cat));
        result[cat] = files.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
      } catch { result[cat] = []; }
    }
    res.json(result);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
});

// GET /api/data/worlds — list bundled ST worlds
dataRouter.get('/worlds', async (_req: Request, res: Response) => {
  try {
    const worldsDir = path.join(__dirname, '..', '..', 'public', 'assets', 'worlds');
    const files = await readdir(worldsDir);
    const worlds = files.filter(f => f.endsWith('.json')).map(f => ({
      name: f.replace('.json', ''),
      path: `/assets/worlds/${f}`,
    }));
    res.json(worlds);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
});

// GET /api/data/preset-content/:category/:name — load a specific preset
dataRouter.get('/preset-content/:category/:name', async (req: Request, res: Response) => {
  try {
    const cat = req.params.category as string;
    const nm = req.params.name as string;
    const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'presets', cat, `${nm}.json`);
    const raw = await readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);
    res.json(data);
  } catch { res.status(404).json({ error: '预设未找到' }); }
});
