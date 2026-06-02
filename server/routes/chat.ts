import { Router, type Request, type Response } from 'express';

export const chatRouter = Router();

interface ApiSettings {
  baseUrl: string;
  apiKey: string;
  model: string;
}

interface AppSettings {
  api?: ApiSettings;
  secondaryApi?: { enabled: boolean; baseUrl: string; apiKey: string; model: string };
  characterName?: string;
  userName?: string;
  activePresetId?: string | null;
  activeLorebookIds?: string[];
  uiMode?: string;
  customTags?: string[];
  formatPromptTemplate?: string;
  theme?: string;
}

interface ChatRequest {
  messages: Array<{ role: string; content: string }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

const DEFAULT_API: ApiSettings = { baseUrl: 'https://api.openai.com/v1', apiKey: '', model: 'gpt-4o-mini' };

// POST /api/chat/completions
chatRouter.post('/completions', async (req: Request, res: Response) => {
  try {
    const settings = await loadSettings();
    const api = settings.api || DEFAULT_API;

    if (!api.apiKey) {
      res.status(400).json({ error: 'API 密钥未配置。请在「天道法则」中设置。' });
      return;
    }

    const body: ChatRequest = req.body;
    const url = `${api.baseUrl.replace(/\/$/, '')}/chat/completions`;

    const fetchBody: Record<string, unknown> = {
      model: body.model || api.model,
      messages: body.messages,
    };
    if (body.temperature !== undefined) fetchBody.temperature = body.temperature;
    if (body.max_tokens !== undefined) fetchBody.max_tokens = body.max_tokens;
    if (body.top_p !== undefined) fetchBody.top_p = body.top_p;
    if (body.frequency_penalty !== undefined) fetchBody.frequency_penalty = body.frequency_penalty;
    if (body.presence_penalty !== undefined) fetchBody.presence_penalty = body.presence_penalty;

    if (body.stream) {
      fetchBody.stream = true;
      const llmRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${api.apiKey}` },
        body: JSON.stringify(fetchBody),
      });

      if (!llmRes.ok) {
        const errText = await llmRes.text();
        res.status(llmRes.status).json({ error: `LLM API 错误: ${llmRes.status} — ${errText}` });
        return;
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = llmRes.body?.getReader();
      if (!reader) { res.status(500).json({ error: '无法读取流式响应' }); return; }

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
      res.end();
    } else {
      const llmRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${api.apiKey}` },
        body: JSON.stringify(fetchBody),
      });

      const data = await llmRes.json();
      if (!llmRes.ok) {
        res.status(llmRes.status).json({ error: `LLM API 错误: ${llmRes.status}`, detail: data });
        return;
      }
      res.json(data);
    }
  } catch (err) {
    console.error('[Chat API] Error:', err);
    res.status(500).json({ error: '天道连接失败', detail: (err as Error).message });
  }
});

// POST /api/chat/test
chatRouter.post('/test', async (_req: Request, res: Response) => {
  try {
    const settings = await loadSettings();
    const api = settings.api || DEFAULT_API;
    if (!api.apiKey) { res.json({ ok: false, error: 'API 密钥未配置' }); return; }

    const llmRes = await fetch(`${api.baseUrl.replace(/\/$/, '')}/models`, {
      headers: { 'Authorization': `Bearer ${api.apiKey}` },
    });
    res.json({ ok: llmRes.ok, status: llmRes.status });
  } catch (err) {
    res.json({ ok: false, error: (err as Error).message });
  }
});

// Settings cache
let _cache: AppSettings | null = null;

async function loadSettings(): Promise<AppSettings> {
  if (_cache) return _cache;
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const p = path.join(__dirname, '..', '..', 'data', 'settings.json');
    const raw = await fs.readFile(p, 'utf-8');
    _cache = JSON.parse(raw) as AppSettings;
    return _cache!;
  } catch { return {}; }
}

export function clearSettingsCache() { _cache = null; }
