/**
 * 玄灵界·元极天 — 全栈服务器入口
 * Express backend serving React frontend + API endpoints
 *
 * Dev:  npm run dev:server   → port 8000 (API only, frontend on Vite 5173)
 * Prod: npm start            → port 8000 (API + static frontend)
 */
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { chatRouter } from './routes/chat.js';
import { lorebookRouter } from './routes/lorebooks.js';
import { presetRouter } from './routes/presets.js';
import { settingsRouter } from './routes/settings.js';
import { dataRouter } from './routes/data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT || '8000', 10);
const IS_DEV = process.env.NODE_ENV !== 'production';

// ---- Middleware ----
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ---- API Routes ----
app.use('/api/chat', chatRouter);
app.use('/api/lorebooks', lorebookRouter);
app.use('/api/presets', presetRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/data', dataRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '3.0.0', name: '玄灵界·元极天' });
});

// ---- Serve Static Frontend ----
if (!IS_DEV) {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  // SPA fallback
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({ message: 'API server running. Use Vite dev server for frontend.', docs: '/api/health' });
  });
}

// ---- Start ----
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════╗');
  console.log('  ║   玄 灵 界 · 元 极 天           ║');
  console.log('  ║   众生皆在劫中                  ║');
  console.log('  ║                                ║');
  console.log(`  ║   服务器已启动: http://localhost:${PORT}  ║`);
  if (IS_DEV) console.log(`  ║   前端开发: http://localhost:5173    ║`);
  console.log('  ╚══════════════════════════════════╝');
  console.log('');
});

export default app;
