import express from 'express';
import mongoose from 'mongoose';
import Helmet from 'Helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
const app = express();
dotenv.config();
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('mongo db connected...'));

const Port = 8800 | process.env.PORT;
app.listen(Port, () => {
  console.log(`port ${Port}`);
});
