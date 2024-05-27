import mongoose from "mongoose";

const ConnectToDatabse = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("mongodb is connected");
    })
    .catch((err) => {
      console.log(err);
    });
};
export default ConnectToDatabse;
