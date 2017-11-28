// require('dotenv').config();

// db

// nats
import * as Nats from 'nats';
import * as Hemera from 'nats-hemera';
// logger
import * as Logger from 'pino';

// controllers
import * as controllers from './controllers';

const logger = Logger();

class User {
  private model;
  private nats;
  private hemera;
  async start() {
    this.model = await this.dbConnect();
    this.natsConnect(this.model);
  }
  dbConnect() {
    return new Promise((resolve, reject) => resolve({}));
  }
  natsConnect(model) {
    this.nats = Nats.connect(process.env.NATS || '');
    this.hemera = new Hemera(this.nats, { logLevel: 'info' });
    this.hemera.ready(() => {
      this.hemera.add({ topic: 'test', cmd: 'test' }, (req, res) => {
        controllers.test(req.payload, res, model, this.hemera);
      });
    });
  }
}

try {
  const user = new User();
  user.start();
} catch (error) {
  logger.error(error);
}
