import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory at server startup
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();

dotenv.config();
const { PORT } = process.env;

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-authorization', 'Accept'],
  })
);

// Add static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const routeFiles = readdirSync(path.join(__dirname, 'routes'));

await Promise.all(
  routeFiles.map(async (filename) => {
    try {
      const { default: route } = await import(`./routes/${filename}`);
      if (route) {
        app.use('/api', route);
      } else {
        console.error(`Route ${filename} did not export a default Router object.`);
      }
    } catch (error) {
      console.error(`Error loading route ${filename}:`, error);
    }
  })
);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});