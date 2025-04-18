import mongoose from "mongoose";
import Logger from "bunyan";
import { config } from "./config";

const log: Logger = config.createLogger("database");

export default () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URL!)
      .then(() => log.info("Connected to MongoDB"))
      .catch((error) => {
        log.error(error);
        return process.exit(1);
      });
  };

  connect();

  mongoose.connection.on("disconnected", () => {
    log.info("Disconnected from MongoDB");
    connect();
  });
};
