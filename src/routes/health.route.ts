import { Router } from 'express';
import { register } from '../metrics/prometheus';
import path from "node:path";
import * as fs from "node:fs";
import logger from "../utils/logger";
import {getActiveUserIds} from "../utils/socket.helpers";
import {getIO} from "../utils/io";

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
    const logPath = path.resolve(process.env.HOME || '/root', '.pm2/logs/socket-server-out.log');

    fs.readFile(logPath, 'utf8', (err, content) => {
        if (err) {
            console.error('[LOG ERROR]', err.message);
            return res.status(500).send('Could not read logs');
        }

        const lines = content.trim().split('\n').slice(-500).join('\n');
        res.set('Content-Type', 'text/plain');
        res.set('Cache-Control', 'no-store');
        res.send(lines);
    });
});

router.get('/active-users', async (_req, res) => {
    try {
        const io = getIO(); // ✅ Grab the shared io instance
        const users = await getActiveUserIds(io);
        res.json({ count: users.length, users });
    } catch (err) {
        console.error('[Active Users Error]', err);
        res.status(500).send('Error fetching active users');
    }
});



export default router;
