import express from 'express';
import Post from '../models/postModel.js';
const postRouter = express.Router();

//create post
postRouter.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).send(savedPost);
  } catch (err) {
    res.status(500).send(err);
  }
});
//update post
postRouter.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).send('the post has been updated');
    } else {
      res.status(403).send('you can update only your post');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
//delete post
postRouter.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).send('the post has been deleted');
    } else {
      res.status(403).send('you can delete only your post');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//like post
postRouter.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).send('the post has been liked');
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).send('the post has been unliked');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//get a post
postRouter.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).send(post);
  } catch (err) {
    res.status(500).send(err);
  }
});

//get timeline posts
postRouter.get('/timeline/all', async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.send(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).send(err);
  }
});

export default postRouter;
