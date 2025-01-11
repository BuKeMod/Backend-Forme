import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

const app = express();

dotenv.config();
const { PORT } = process.env;

import authRouter from "./routes/auth.js";
import userRoutes from "./routes/users.js";


app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:8889"],
    }),
  );



app.use('/auth', authRouter);
app.use('/api/users', userRoutes)


app.listen(PORT, () => {
    console.log(`server start PORT ${PORT}`);

})
