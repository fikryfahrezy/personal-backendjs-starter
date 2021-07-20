import 'make-promises-safe';
import './config/env-setup';
import pino from 'pino';
import { logger, dest } from './utils/logger';
import app from './config/app';
import validateEnv from './config/validateEnv';

const start = async function start() {
  const server = app({
    logger,
    frameworkErrors(error, _, res) {
      const data = {
        code: 500,
        success: false,
        message: error,
      };

      res.code(500).header('Content-Type', 'application/json; charset=utf-8').send(data);
    },
  });
  server.addHook('onClose', async () => {
    // do something when server close
  });

  try {
    const { error } = validateEnv(process.env);
    if (error) throw error;

    const { PORT } = process.env;

    await server.listen({ port: Number(PORT), host: '::' });
    const address = server.server.address();
    const port = typeof address === 'string' ? address : address?.port;
    console.log(address, port);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start().then(() => {
  // asynchronously flush every 10 seconds to keep the buffer empty
  // in periods of low activity
  setInterval(() => {
    logger.flush();
  }, 10000).unref();

  // use pino.final to create a special logger that
  // guarantees final tick writes
  const handler = pino.final(logger, (err, finalLogger, evt: string) => {
    finalLogger.info(`${evt} caught`);
    if (err) finalLogger.error(err, 'error caused exit');
    process.exit(err ? 1 : 0);
  });

  process.on('SIGHUP', () => dest.reopen());

  // catch all the ways node might exit
  process.on('beforeExit', () => handler(null, 'beforeExit'));
  process.on('exit', () => handler(null, 'exit'));
  process.on('uncaughtException', (err) => handler(err, 'uncaughtException'));
  process.on('SIGINT', () => handler(null, 'SIGINT'));
  process.on('SIGQUIT', () => handler(null, 'SIGQUIT'));
  process.on('SIGTERM', () => handler(null, 'SIGTERM'));
});
