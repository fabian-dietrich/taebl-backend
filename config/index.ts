import express, { Application } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

const FRONTEND_URL = process.env.ORIGIN;

// Middleware configuration
export default (app: Application): void => {
  app.set("trust proxy", 1);


  const allowedOrigins = [
    FRONTEND_URL,
    "http://localhost:5173",  // vite
    "http://localhost:3000",  // backup
    "https://taebl.netlify.app",  // production frontend
  ].filter((origin): origin is string => origin !== undefined);

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
