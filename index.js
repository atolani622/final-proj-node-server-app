import "dotenv/config";
import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
import mongoose from "mongoose";
import session from "express-session";
const { json } = pkg;

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/project"
mongoose.connect(CONNECTION_STRING);

// Import routes
import recipesRoutes from './routes/recipes.js'
import UserRoutes from './Users/routes.js'

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

// Middleware to parse JSON requests
app.use(express.json());


const PORT = 4000;

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api/recipes', recipesRoutes);
UserRoutes(app)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

