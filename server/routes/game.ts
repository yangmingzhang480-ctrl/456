import { Router, type Request, type Response } from 'express';
import { randomUUID } from 'crypto';
import { readJSON, writeJSON, listJSONFiles } from './data.js';

export const gameRouter = Router();

type Tone = 'gold' | 'jade' | 'ice' | 'violet' | 'blood' | 'amber';

interface ApiSettings {
  baseUrl: string;
  apiKey: string;
  model: string;
}

interface AppSettings {
  api?: ApiSettings;
}

interface TavernOutput {
  thinking: string;
  maintext: string;
  options: string[];
  sum: string;
  vars: string[];
}

interface WorldVariable {
  id: string;
  name: string;
  value: string;
  tone: Tone;
}

interface WorldState {
  id: string;
  loop: string;
  location: string;
  corruption: number;
  variables: WorldVariable[];
  updatedAt: number;
}

interface GameMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface GameSession {
  id: string;
  name: string;
  messages: GameMessage[];
  variables: Record<string, string | number>;
  createdAt: number;
  updatedAt: number;
}

const SETTINGS_FILE = 'settings.json';
const WORLD_FILE = 'world-state.json';
const CHAT_DIR = 'chats';

const DEFAULT_API: ApiSettings = {
  baseUrl: 'https://api.openai.com/v1',
  apiKey: process.env.OPENAI_API_KEY || '',
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
};

const DEFAULT_WORLD: WorldState = {
  id: 'xuanling-yuanjitian',
  loop: '第九次',
  location: '元极天·荒骨城外城',
  corruption: 67,
  updatedAt: Date.now(),
  variables: [
    { id: 'var-corruption', name: '黑海侵蚀率', value: '67%', tone: 'blood' },
    { id: 'var-loop', name: '轮回序列', value: '第九次', tone: 'gold' },
    { id: 'var-anchor', name: '叶汐澜神识锚', value: '松动', tone: 'ice' },
    { id: 'var-fatewax', name: '楚凌霜命盘火漆', value: '半裂', tone: 'violet' },
    { id: 'var-bonecity', name: '荒骨城防线', value: '暂稳', tone: 'jade' },
    { id: 'var-tide', name: '下一次黑潮', value: '两刻后', tone: 'amber' },
  ],
};

async function loadSettings(): Promise<AppSettings> {
  const fileSettings = await readJSON('', SETTINGS_FILE).catch(() => ({}));
  const settings = fileSettings as AppSettings;
  return {
    ...settings,
    api: {
      ...DEFAULT_API,
      ...(settings.api || {}),
      apiKey: settings.api?.apiKey || process.env.OPENAI_API_KEY || '',
      model: settings.api?.model || process.env.OPENAI_MODEL || DEFAULT_API.model,
      baseUrl: settings.api?.baseUrl || process.env.OPENAI_BASE_URL || DEFAULT_API.baseUrl,
    },
  };
}

async function loadWorldState(): Promise<WorldState> {
  const data = await readJSON('', WORLD_FILE).catch(() => DEFAULT_WORLD);
  return { ...DEFAULT_WORLD, ...(data as Partial<WorldState>) };
}

async function saveWorldState(world: WorldState): Promise<WorldState> {
  const next = { ...world, updatedAt: Date.now() };
  await writeJSON('', WORLD_FILE, next);
  return next;
}

async function loadSession(id: string | undefined): Promise<GameSession> {
  if (id) {
    const existing = await readJSON(CHAT_DIR, `${id}.json`).catch(() => null);
    if (existing) return existing as GameSession;
  }
  const now = Date.now();
  return {
    id: id || randomUUID(),
    name: `玄灵推演 ${new Date(now).toLocaleString('zh-CN')}`,
    messages: [],
    variables: {},
    createdAt: now,
    updatedAt: now,
  };
}

async function saveSession(session: GameSession): Promise<GameSession> {
  const next = { ...session, updatedAt: Date.now() };
  await writeJSON(CHAT_DIR, `${next.id}.json`, next);
  return next;
}

function buildPrompt(input: string, world: WorldState, history: GameMessage[]) {
  const recent = history.slice(-8).map((m) => `${m.role}: ${m.content}`).join('\n');
  return [
    {
      role: 'system',
      content: [
        '你是《玄灵界·元极天》的酒馆 RPG 叙事引擎。',
        '必须使用中文，保持暗黑修仙、群像战略生存、SillyTavern GameView 风格。',
        '必须按标签输出：<thinking>、<maintext>、多个<option>、<sum>、<vars>。',
        'vars 内每行使用 key=value，例如 black_sea_corruption=68。',
        `当前世界：轮回序列 ${world.loop}，位置 ${world.location}，黑海侵蚀率 ${world.corruption}%。`,
        `世界变量：${world.variables.map((v) => `${v.name}=${v.value}`).join('；')}`,
      ].join('\n'),
    },
    ...(recent ? [{ role: 'system', content: `最近推演记录：\n${recent}` }] : []),
    { role: 'user', content: input },
  ];
}

function parseTaggedOutput(raw: string): TavernOutput {
  const tag = (name: string) => {
    const match = raw.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`, 'i'));
    return match?.[1]?.trim() || '';
  };
  const options = [...raw.matchAll(/<option>([\s\S]*?)<\/option>/gi)]
    .map((match) => match[1].trim())
    .filter(Boolean);
  const varsText = tag('vars');
  return {
    thinking: tag('thinking') || '天道未显露完整思路，仅返回了可见推演。',
    maintext: tag('maintext') || raw.trim(),
    options: options.length ? options : ['继续追踪黑海裂隙', '稳固荒骨城防线', '整理主角团状态'],
    sum: tag('sum') || '本轮推演已写入后端存档。',
    vars: varsText ? varsText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) : [],
  };
}

function fallbackOutput(input: string, world: WorldState): TavernOutput {
  const nextCorruption = Math.min(99, world.corruption + 1);
  return {
    thinking: `本地回退推演：玩家指令「${input}」触发黑海变量推进。未配置 API Key，因此由后端规则引擎生成。`,
    maintext: `荒骨城上空的墨蓝云墙忽然塌下一线。陆星遥将玩家的指令刻入星河残印，剑意沿着裂隙边缘向第三层探去。叶汐澜的神识锚传回一声冰裂般的回响，李明远立刻以山纹稳住太虚剑碑，楚凌霜则按住命盘火漆，血色细光在指缝间游走。黑海没有退却，只是短暂露出了下一道可被斩开的因果缝隙。`,
    options: [
      '让陆星遥消耗星河残印，强行固定叶汐澜的位置',
      '命令李明远启动太虚剑碑，暂时降低黑海侵蚀',
      '让楚凌霜解开命盘第一层封印，追索裂隙源头',
      '全员撤回荒骨城，改为防守并整理须弥纳戒',
    ],
    sum: `本轮根据「${input}」推进：黑海侵蚀率升至 ${nextCorruption}%，叶汐澜神识锚仍处于松动状态。`,
    vars: [
      `black_sea_corruption=${nextCorruption}`,
      'yexilan_anchor=loose',
      'bone_city_defense=stable',
      'last_backend=fallback',
    ],
  };
}

function applyVars(world: WorldState, output: TavernOutput): WorldState {
  const corruptionLine = output.vars.find((line) => line.startsWith('black_sea_corruption='));
  const corruption = corruptionLine ? Number(corruptionLine.split('=')[1]) : world.corruption;
  const variables = world.variables.map((item) => {
    if (item.id === 'var-corruption' && Number.isFinite(corruption)) return { ...item, value: `${corruption}%` };
    if (item.id === 'var-anchor' && output.vars.includes('yexilan_anchor=loose')) return { ...item, value: '松动' };
    if (item.id === 'var-bonecity' && output.vars.includes('bone_city_defense=stable')) return { ...item, value: '暂稳' };
    return item;
  });
  return { ...world, corruption: Number.isFinite(corruption) ? corruption : world.corruption, variables };
}

async function callLlm(api: ApiSettings, input: string, world: WorldState, history: GameMessage[]) {
  const response = await fetch(`${api.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${api.apiKey}`,
    },
    body: JSON.stringify({
      model: api.model,
      messages: buildPrompt(input, world, history),
      temperature: 0.82,
      max_tokens: 1200,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || `LLM API HTTP ${response.status}`);
  return String(data?.choices?.[0]?.message?.content || '');
}

gameRouter.get('/world-state', async (_req: Request, res: Response) => {
  const world = await loadWorldState();
  res.json(world);
});

gameRouter.put('/world-state', async (req: Request, res: Response) => {
  const world = await saveWorldState({ ...DEFAULT_WORLD, ...(req.body as Partial<WorldState>) });
  res.json(world);
});

gameRouter.get('/chats', async (_req: Request, res: Response) => {
  const files = await listJSONFiles(CHAT_DIR);
  const chats = await Promise.all(files.map(async (file) => {
    const chat = await readJSON(CHAT_DIR, file) as GameSession;
    return { id: chat.id, name: chat.name, messageCount: chat.messages.length, updatedAt: chat.updatedAt };
  }));
  res.json(chats.sort((a, b) => b.updatedAt - a.updatedAt));
});

gameRouter.get('/chats/:id', async (req: Request, res: Response) => {
  const chat = await readJSON(CHAT_DIR, `${req.params.id}.json`).catch(() => null);
  if (!chat) {
    res.status(404).json({ error: '推演存档未找到' });
    return;
  }
  res.json(chat);
});

gameRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const input = String(req.body?.input || '').trim();
    if (!input) {
      res.status(400).json({ error: '玩家指令不能为空' });
      return;
    }

    const [settings, world] = await Promise.all([loadSettings(), loadWorldState()]);
    const session = await loadSession(req.body?.sessionId);
    const userMessage: GameMessage = { id: randomUUID(), role: 'user', content: input, timestamp: Date.now() };
    const history = [...session.messages, userMessage];

    let source: 'llm' | 'fallback' = 'fallback';
    let raw = '';
    let output: TavernOutput;
    try {
      if (settings.api?.apiKey) {
        raw = await callLlm(settings.api, input, world, session.messages);
        output = parseTaggedOutput(raw);
        source = 'llm';
      } else {
        output = fallbackOutput(input, world);
        raw = [
          `<thinking>${output.thinking}</thinking>`,
          `<maintext>${output.maintext}</maintext>`,
          ...output.options.map((option) => `<option>${option}</option>`),
          `<sum>${output.sum}</sum>`,
          `<vars>${output.vars.join('\n')}</vars>`,
        ].join('\n');
      }
    } catch (error) {
      output = fallbackOutput(input, world);
      output.thinking = `API 调用失败，已切换本地回退推演：${(error as Error).message}`;
      raw = output.maintext;
    }

    const nextWorld = await saveWorldState(applyVars(world, output));
    const assistantMessage: GameMessage = { id: randomUUID(), role: 'assistant', content: raw, timestamp: Date.now() };
    const nextSession = await saveSession({
      ...session,
      messages: [...history, assistantMessage],
      variables: Object.fromEntries(output.vars.map((line) => {
        const [key, ...rest] = line.split('=');
        return [key, rest.join('=')];
      })),
    });

    res.json({ ok: true, source, output, worldState: nextWorld, session: nextSession });
  } catch (error) {
    res.status(500).json({ error: '推演失败', detail: (error as Error).message });
  }
});
