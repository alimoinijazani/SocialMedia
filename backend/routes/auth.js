import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
const authRouter = express.Router();
//register

authRouter.post('/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});
//login
authRouter.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).send('user not found');
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).send('wrong pass');
    }
    res.status(200).send('200');
  } catch (err) {
    res.status(500).send(err);
  }
});

export default authRouter;
