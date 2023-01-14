import express from 'express';
import mongoose from 'mongoose';
import Helmet from 'Helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import postRouter from './routes/posts.js';
const app = express();
dotenv.config();
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('mongo db connected...'));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(Helmet());
app.use(morgan('common'));

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
const Port = 8800 | process.env.PORT;
app.listen(Port, () => {
  console.log(`port ${Port}`);
});
