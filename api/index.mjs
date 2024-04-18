import express from "express";
import path from "path";
import "dotenv/config";
import mongoose from "mongoose";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import { verifyToken } from "./utils/jwtToken.mjs";
import cors from "cors";
import { app, server } from "./socket/socket.io.mjs";

const db_url = process.env.DB_URL;
const port = process.env.PORT || 8080;

const __dirname = path.resolve();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(verifyToken);
app.use("/api", routes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  return res.sendFile(path.join(__dirname, "/client/dist", "index.html"));
});
// app.get("/", (req, res) => {
//   return res.status(200).send({ hello: "world" });
// });

mongoose
  .connect(db_url)
  .then(() => {
    console.log("Your application is successfully connected to database");
    server.listen(port, () => {
      console.log(`Your server is running on port : ${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });

// try {
//   const startServer = async () => {
//     const res = await mongoose.connect(db_url)
//     console.log("Your application is successfully connected to database");
//     app.listen(port, () => {
//       console.log(`Your server is running on port : ${port}`);
//     });
//   };
//   startServer();
// } catch (error) {
//   console.error(error);
// }
