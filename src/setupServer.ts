import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import cookieSession from "cookie-session";
import { Server as SocketIOServer } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import HTTP_STATUS from "http-status-codes";
import "express-async-errors";
import { config } from "./config";
import applicationRoutes from "./routes";
import { CustomError, IErrorResponse } from "./shared/globals/helpers/error-handler";

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

  private routesMiddleware(app: express.Application): void {
    applicationRoutes(app);
  }

  private globalErrorHandler(app: express.Application): void {
    app.all("*", (req: express.Request, res: express.Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
    });

    app.use((error: IErrorResponse, _req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (error instanceof CustomError) {
        return res.status(error.code).json(error.serializeErrors());
      }
      next();
    });
  }

  private async startServer(app: express.Application): Promise<void> {
    try {
      const httpServer: http.Server = http.createServer(app);
      const socketIO = await this.createSocketIO(httpServer);

      this.startHttpServer(httpServer);
      this.socketIOConnections(socketIO);
    } catch (error) {
      console.log(error);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<SocketIOServer> {
    const io: SocketIOServer = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      },
    });

    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));

    return io;
  }

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      console.log(`Server is running on port ${SERVER_PORT}`);
    });
  }

  private socketIOConnections(io: SocketIOServer): void {}
}

export default Server;
