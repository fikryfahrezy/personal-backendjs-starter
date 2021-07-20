import pino from 'pino';

export const dest = pino.destination({ dest: './logs/app.log', sync: false });
export const logger = pino({ level: 'trace' }, dest);
