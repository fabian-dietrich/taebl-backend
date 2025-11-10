// Gets access to environment variables/settings
import dotenv from "dotenv";
dotenv.config();

// Handles http requests (express is node js framework)
import express, { Application } from "express";

const app: Application = express();

// This function runs most pieces of middleware
import configureMiddleware from "./config";
configureMiddleware(app);

// Start handling routes here
import indexRoutes from "./routes/index.routes";
app.use("/api", indexRoutes);

// To handle errors
import errorHandling from "./error-handling";
errorHandling(app);

export default app;