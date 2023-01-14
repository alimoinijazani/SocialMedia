import User from '../models/userModel.js';
import express from 'express';

const userRouter = express.Router();

//update user
userRouter.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        res.status(500).send(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).send('Account updated');
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(403).send('you can update only your account');
  }
});
//delete user
userRouter.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).send('Account has been deleted');
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(403).send('you can delete only your account');
  }
});
//get user
userRouter.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).send(other);
  } catch (err) {
    res.status(500).send(err);
  }
});
//follow user
userRouter.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).send('user has been followed');
      } else {
        res.status(403).send('you already follow');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(403).send('you cant follow yourself');
  }
});
//unfollow user
userRouter.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).send('user has been unfollowed');
      } else {
        res.status(403).send('you dont follow');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(403).send('you cant unfollow yourself');
  }
});
export default userRouter;
