import Fastify from 'fastify';
import { AppDataSource } from './data-source.js';
import { authRoutes } from './routes/auth.routes.js';
import fastifyJwt from '@fastify/jwt';
import fs from "fs";
import path from 'path';
import { createClient, type RedisClientType } from "redis";


const waitForDB = async () => {
  for (let i = 0; i < 10; i++) {
    try {
      await AppDataSource.initialize();
      console.log('Database connected');
      return;
    } catch (err) {
      console.log('Waiting for DB...', (err as Error).message);
      await new Promise(res => setTimeout(res, 3000));
    }
  }
  throw new Error('DB not ready after retries');
};


const initLogs = () => {
		const logsDir = path.resolve('../logs');

    const logPath = path.join(logsDir, `app.log`);
		if (!fs.existsSync(logsDir)) {
			fs.mkdirSync(logsDir, { recursive: true });
		}
    console.log(logPath);
    const logStream = fs.createWriteStream(logPath, { flags: 'a' });
    return logStream;
}

	const startServer = async () => {

		const logStream = initLogs()

		const fastify = Fastify({ 
			logger: {
    		level: 'info',
    		stream: logStream
  		},
			https: {
				key: fs.readFileSync("./certs/server.key"),
				cert: fs.readFileSync("./certs/server.crt"),
				},
		});

		await waitForDB();
		fastify.register(fastifyJwt, {
			secret: process.env.JWT_KEY || '',
		});

	const redisClient: RedisClientType<Record<string, never>> = createClient({ url: process.env.REDIS_URL || '' });
	await redisClient.connect();
	
	authRoutes(fastify, redisClient);

  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server running on https://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
