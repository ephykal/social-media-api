const verifyToken = require('../middlewares/verifyToken')
const Post = require('../models/post')
const User = require('../models/user')
const postController = require('express').Router()

// get all
postController.get('/getAll', async (req, res) => {
  try {
    const posts = await Post.find({})
    return res.status(200).json(posts)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

// get one
postController.get('/find/:postId', async (req, res) => {
  try {
    const posts = await Post.findById(req.params.postId)
    if (!posts) {
      console.log('No such post, wrong id')
      return res.status(500).json({ msg: "No such post, wrong id" })
    }
    return res.status(200).json(posts)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
// create
postController.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const newPost = await Post.create({ ...req.body, userId });

    return res.status(200).json(newPost);
  } catch (error) {
    console.log(error)
    return res.status(500).json(error.message);
  }
});

// update
postController.put('/update/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      console.log('No such post, wrong id')
      return res.status(500).json({ msg: "No such post, wrong id" })
    }

    if (post.userId === req.user.id) {
      const updatePost = await Post.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      return res.status(200).json({ msg: "Post successfully updated", updatePost })
    } else {
      return res.status(403).json({ msg: "You can update only your own post" })
    }
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
// delete
postController.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      console.log('No such post, wrong id')
      return res.status(500).json({ msg: "No such post, wrong id" })
    }

    if (post.userId === req.user.id) {
      await Post.findByIdAndDelete(req.params.id)
      return res.status(200).json({ msg: "post successfully deleted" })
    } else {
      return res.status(403).json({ msg: "You can delete only your own post" })
    }
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

postController.put('/likeDislike/:id', verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "No such post, wrong id" });
    }

    // If user already liked, remove like
    if (post.likes.includes(currentUserId)) {
      post.likes = post.likes.filter(id => id != currentUserId);
      await post.save();
      return res.status(200).json({ msg: "Successfully unliked the post" });
    }

    // If not liked, like post
    post.likes.push(currentUserId);
    await post.save();
    return res.status(200).json({ msg: "Successfully liked the post" });

  } catch (error) {
    return res.status(500).json(error.message);
  }
});


module.exports = postController
