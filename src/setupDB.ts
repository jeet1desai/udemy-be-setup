import mongoose from "mongoose";

export default () => {
  const connect = () => {
    mongoose
      .connect("mongodb://127.0.0.1:27017/chatty")
      .then(() => {
        console.log("Connected to MongoDB");
      })
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
