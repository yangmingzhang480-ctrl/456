import { createContext, useContext } from 'react';
import type { AppSettings, ChatPreset, Lorebook, ChatSession, ChatMessage } from '../../sillytavern/types';

export interface XianxiaContextValue {
  settings: AppSettings | null;
  presets: ChatPreset[];
  lorebooks: Lorebook[];
  chats: ChatSession[];
  activeChat: ChatSession | null;
  activePreset: ChatPreset | null;
  initialized: boolean;
  createChat: (name: string, options?: { presetId?: string; lorebookIds?: string[] }) => Promise<string>;
  selectChat: (id: string) => void;
  removeChat: (id: string) => Promise<void>;
  sendMessage: (text: string, role?: ChatMessage['role']) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  editMessage: (id: string, newContent: string) => Promise<void>;
  rollbackTo: (id: string) => Promise<void>;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  addPreset: (preset: ChatPreset) => Promise<void>;
  addLorebook: (book: Lorebook) => Promise<void>;
  toggleLorebook: (id: string) => void;
  updateLorebook: (book: Lorebook) => Promise<void>;
  deleteLorebook: (id: string) => Promise<void>;
  addLorebookFromDefault: (name: string) => Promise<Lorebook>;
  updatePreset: (preset: ChatPreset) => Promise<void>;
  deletePreset: (id: string) => Promise<void>;
  addPresetFromDefault: (name: string) => Promise<ChatPreset>;
  sendGameMessage: (text: string) => Promise<void>;
  jumpToFloor: (messageId: string) => Promise<void>;
  regenerateLast: () => Promise<void>;
  streamState: { isStreaming: boolean; thinking: string; maintext: string; options: string[]; sum: string };
  abortStream: () => void;
  openSettings: () => void;
  openLorebooks: () => void;
  openPresets: () => void;
  openVariables: () => void;
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
  showLorebooks: boolean;
  setShowLorebooks: (v: boolean) => void;
  showPresets: boolean;
  setShowPresets: (v: boolean) => void;
  showVariables: boolean;
  setShowVariables: (v: boolean) => void;
  setChatVariables: (vars: Record<string, unknown>) => Promise<void>;
  toast: string | null;
  showToast: (msg: string) => void;
}

export const XianxiaContext = createContext<XianxiaContextValue | null>(null);

export function useXianxia(): XianxiaContextValue {
  const ctx = useContext(XianxiaContext);
  if (!ctx) {
    throw new Error('useXianxia must be used within a XianxiaContext.Provider');
  }
  return ctx;
}
