import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'socket.io';
import config from './config/index.js';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { ensureDb } from './middleware/ensureDb.js';
import { initSocket } from './sockets/index.js';
import { setSocketIO } from './services/notificationService.js';
import { startDeadlineCron } from './jobs/deadlineCron.js';

const app = express();
const isVercel = Boolean(process.env.VERCEL);

app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ success: true, message: 'OK', data: null }));

// Wait for MongoDB before any API route (critical on Vercel serverless cold starts)
app.use('/api', ensureDb, routes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDB();
  startDeadlineCron();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: config.clientUrl, credentials: true },
    transports: ['websocket', 'polling'],
  });

  setSocketIO(io);
  initSocket(io);

  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

if (!isVercel) {
  start();
}

export default app;
