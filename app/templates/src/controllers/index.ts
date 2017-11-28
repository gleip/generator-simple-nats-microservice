import * as Hemera from 'nats-hemera';
import * as Logger from 'pino';

const logger = Logger();

interface HemeraPath {
  topic: string;
  cmd: string;
  payload?: object;
  pubsub$?: boolean;
  timeout$?: number;
  queue$?: string;
}

class HemeraClient {
  hemera: any | null = null;
  path: HemeraPath;
  payload: any;

  constructor(hemera, path: HemeraPath, payload) {
    this.hemera = hemera;
    this.path = path;
    this.payload = payload;
  }

  public async act() {
    if (this.hemera === null) {
      throw new Error('Hemera not initialized');
    } else {
      if (this.payload.cmd || this.payload.topic) {
        throw new Error(`Can't use 'cmd' or 'topic' in hemera payload: ${this.payload}`);
      }
      this.path.payload = this.payload;
      return this.hemera.act(this.path);
    }
  }
}

export function test(payload, response, model, hemera) {
  try {
    response(null, { status: 'ok' });
  } catch (error) {
    response(error, null);
    logger.error(error);
  }
}