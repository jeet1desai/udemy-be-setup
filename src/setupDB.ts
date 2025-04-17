import mongoose from "mongoose";
import { config } from "./config";

export default () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URL!)
      .then(() => console.log("Connected to MongoDB"))
      .catch((error) => {
        console.log(error);
        return process.exit(1);
      });
  };

  connect();

  mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
    connect();
  });
};
