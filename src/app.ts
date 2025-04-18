import express from 'express';
import { Server } from './setupServer';
import databaseConnection from './setupDB';
import { config } from './config';

class Application {
  public initialize(): void {
    this.loadConfig();

    databaseConnection();

    const app: express.Express = express();
    const server: Server = new Server(app);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
  }
}

const application = new Application();
application.initialize();
