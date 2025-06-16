import { Router } from 'express';
import { register } from '../metrics/prometheus';
import path from "node:path";
import * as fs from "node:fs";
import logger from "../utils/logger";

const router = Router();

router.get('/health', (_req, res) => {
  // res.json({ status: 'ok' });
  // return a html response
    logger.info(`Health check request received`);
    res.send('<h2>Health Check OK</h2>');
});

router.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// @ts-ignore
router.get('/logs', (_req, res) => {
    const logPath = path.resolve(process.env.HOME + '/.pm2/logs/socket-server-out.log');

    fs.readFile(logPath, 'utf8', (err, content) => {
        if (err) {
            return res.status(500).send('Could not read logs');
        }

        const lines = content.trim().split('\n').slice(-500);
        res.set('Content-Type', 'text/html');
        res.set('Cache-Control', 'no-store');
        res.render('logs', { logs: lines.join('\n') });
    });
});


export default router;
