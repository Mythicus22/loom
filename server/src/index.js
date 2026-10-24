import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/connection.js';
import { MasterRoadmap } from './models/MasterRoadmap.js';
import { preloadedRoadmaps } from './seed/masterRoadmaps.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

// Serve client production bundle if built
app.use(express.static(clientDistPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'QuestPath API', timestamp: new Date() });
});

// Fallback to client index.html for frontend routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});

async function seedMasterRoadmapsIfEmpty() {
  try {
    const count = await MasterRoadmap.countDocuments();
    if (count === 0) {
      console.log(`[Seed] Database empty. Seeding ${preloadedRoadmaps.length} comprehensive master roadmaps...`);
      await MasterRoadmap.insertMany(preloadedRoadmaps);
      console.log('[Seed] Master roadmaps successfully preloaded:');
      preloadedRoadmaps.forEach(rm => console.log(`  ✓ ${rm.canonicalGoal} (${rm.domain}, ${rm.nodes.length} nodes)`));
    } else {
      console.log(`[Seed] Master roadmaps already populated (${count} present).`);
    }
  } catch (err) {
    console.error('[Seed] Error checking or seeding roadmaps:', err);
  }
}

async function startServer() {
  try {
    await connectDB();
    await seedMasterRoadmapsIfEmpty();

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(` ⚔️  QuestPath Backend Server is Running!`);
      console.log(` 🚀  API: http://localhost:${PORT}/api`);
      console.log(` 🎯  Database: MongoDB (Mongoose + Embedded Memory Server)`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Fatal: Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
