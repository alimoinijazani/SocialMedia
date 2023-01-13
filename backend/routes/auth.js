import express from 'express';
import User from '../models/userModel.js';

const authRouter = express.Router();
//register

authRouter.post('/register', async (req, res) => {
  const newUser = await new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

export default authRouter;
