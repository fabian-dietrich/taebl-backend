import express, { Application } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:5173";

// Middleware configuration
export default (app: Application): void => {
  app.set("trust proxy", 1);

  // Allow multiple origins for development and production
  const allowedOrigins = [
    FRONTEND_URL,
    "http://localhost:5173",  // Vite default port
    "http://localhost:3000",  // React default port (backup)
  ];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true
    })
  );

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};
