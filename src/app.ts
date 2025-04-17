import express from "express";
import { Server } from "./setupServer";
import databaseConnection from "./setupDB";

class Application {
  public initialize(): void {
    databaseConnection();

    const app: express.Express = express();
    const server: Server = new Server(app);
    server.start();
  }
}

const application = new Application();
application.initialize();
