/**
 * ST Preset Loader — loads presets and worlds from the bundled ST assets
 */
export interface AvailablePreset {
  name: string;
  path: string;
  size: string;
}

export interface PresetCatalog {
  worlds: AvailablePreset[];
  openai: AvailablePreset[];
  context: AvailablePreset[];
  instruct: AvailablePreset[];
  sysprompt: AvailablePreset[];
  reasoning: AvailablePreset[];
  quickReplies: AvailablePreset[];
}

// Static catalog of bundled ST presets
const CATALOG: PresetCatalog = {
  worlds: [
    { name:'玄灵修仙传', path:'/assets/worlds/玄灵修仙传.json', size:'107 KB' },
    { name:'道渊开局创建人物', path:'/assets/worlds/道渊开局创建人物.json', size:'3 KB' },
    { name:'凡人修仙传', path:'/assets/worlds/凡人.json', size:'4 KB' },
    { name:'Eldoria', path:'/assets/worlds/Eldoria.json', size:'9 KB' },
    { name:'道友先上我断后', path:'/assets/worlds/道友先上我断后.json', size:'2 MB' },
  ],
  openai: [
    { name:'Default', path:'/assets/presets/openai/Default.json', size:'3 KB' },
  ],
  context: [
    { name:'Default', path:'/assets/presets/context/Default.json', size:'-' },
    { name:'DeepSeek-V2.5', path:'/assets/presets/context/DeepSeek-V2.5.json', size:'-' },
    { name:'ChatML', path:'/assets/presets/context/ChatML.json', size:'-' },
    { name:'Llama 3 Instruct', path:'/assets/presets/context/Llama 3 Instruct.json', size:'-' },
    { name:'OpenAI Harmony', path:'/assets/presets/context/OpenAI Harmony.json', size:'-' },
  ],
  instruct: [
    { name:'Default', path:'/assets/presets/instruct/Default.json', size:'-' },
    { name:'DeepSeek-V2.5', path:'/assets/presets/instruct/DeepSeek-V2.5.json', size:'-' },
    { name:'ChatML', path:'/assets/presets/instruct/ChatML.json', size:'-' },
    { name:'OpenAI Harmony', path:'/assets/presets/instruct/OpenAI Harmony.json', size:'-' },
    { name:'Roleplay', path:'/assets/presets/instruct/Roleplay - Immersive.json', size:'-' },
  ],
  sysprompt: [
    { name:'Roleplay - Immersive', path:'/assets/presets/sysprompt/Roleplay - Immersive.json', size:'-' },
    { name:'Roleplay - Detailed', path:'/assets/presets/sysprompt/Roleplay - Detailed.json', size:'-' },
    { name:'Text Adventure', path:'/assets/presets/sysprompt/Text Adventure.json', size:'-' },
    { name:'Writer - Creative', path:'/assets/presets/sysprompt/Writer - Creative.json', size:'-' },
    { name:'Neutral - Chat', path:'/assets/presets/sysprompt/Neutral - Chat.json', size:'-' },
  ],
  reasoning: [
    { name:'DeepSeek', path:'/assets/presets/reasoning/DeepSeek.json', size:'-' },
    { name:'OpenAI Harmony', path:'/assets/presets/reasoning/OpenAI Harmony.json', size:'-' },
    { name:'Blank', path:'/assets/presets/reasoning/Blank.json', size:'-' },
  ],
  quickReplies: [
    { name:'Default', path:'/assets/presets/quick-replies/Default.json', size:'-' },
  ],
};

export function getPresetCatalog(): PresetCatalog { return CATALOG; }

/**
 * Fetch and parse a preset JSON file from the public directory.
 */
export async function loadPresetFile(path: string): Promise<Record<string, unknown>> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load preset: ${res.status}`);
  return res.json();
}

/**
 * Load a world/lorebook JSON and return its entries array.
 * Compatible with both ST v2 (array) and v3 (object with entries key) formats.
 */
export async function loadWorldFile(path: string): Promise<{ name: string; entryCount: number }> {
  const data = await loadPresetFile(path);
  const name = (data.name as string) || path.split('/').pop()?.replace('.json','') || 'Unknown';
  let count = 0;

  if (data.entries) {
    count = typeof data.entries === 'object' && !Array.isArray(data.entries)
      ? Object.keys(data.entries as Record<string, unknown>).length
      : Array.isArray(data.entries) ? (data.entries as unknown[]).length : 0;
  }

  return { name, entryCount: count };
}
