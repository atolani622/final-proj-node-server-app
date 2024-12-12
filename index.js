import express from "express";
import cors from "cors";
import session from "express-session";
import "dotenv/config";

import UserRoutes from "./Users/routes.js"
import RecipeRoutes from "./Recipes/routes.js"
import ReviewRoutes from "./Reviews/routes.js"

import mongoose from "mongoose";
const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/project"
mongoose.connect(CONNECTION_STRING);

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:3000",
  })
 );
 const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kanbas",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}
app.use(session(sessionOptions));


app.use(express.json());

UserRoutes(app);
RecipeRoutes(app);
ReviewRoutes(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
