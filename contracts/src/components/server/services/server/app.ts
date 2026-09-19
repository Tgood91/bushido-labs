import express, { Express, Request, Response } from 'express';
import { handleAgentRequest } from './services/agentService';
import { getVirtueMetrics } from './services/virtueService';
import { runCronJob } from './services/cronService';

const app: Express = express();

app.use(express.json());

// API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/virtues', async (_req: Request, res: Response) => {
  try {
    const metrics = await getVirtueMetrics();
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/agent/action', async (req: Request, res: Response) => {
  try {
    const result = await handleAgentRequest(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cron/trigger', async (req: Request, res: Response) => {
  try {
    const status = await runCronJob();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
