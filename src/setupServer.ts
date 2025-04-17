import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import cookieSession from "cookie-session";
import HTTP_STATUS from "http-status-codes";
import "express-async-errors";
import { config } from "./config";

const SERVER_PORT = 5000;

export class Server {
  private app: express.Application;

  constructor(app: express.Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: express.Application): void {
    app.use(
      cors({
        origin: "*",
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cookieSession({
        name: "session",
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        secure: config.NODE_ENV !== "development",
        maxAge: 24 * 60 * 60 * 1000 * 7,
      })
    );
  }

  private standardMiddleware(app: express.Application): void {
    app.use(compression());
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));
  }

  private routesMiddleware(app: express.Application): void {}

  private globalErrorHandler(app: express.Application): void {}

  private async startServer(app: express.Application): Promise<void> {
    try {
      const httpServer: http.Server = http.createServer(app);
      this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
    } catch (error) {
      console.log(error);
    }
  }

  private createSocketIO(httpServer: http.Server): void {}

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      console.log(`Server is running on port ${SERVER_PORT}`);
    });
  }
}
