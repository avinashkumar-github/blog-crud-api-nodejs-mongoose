const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const route = express.Router();

route.post("/", async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      userId: req.body.userId
    });

    const post = await newPost.save();

    //Update a push on the User collection.
    const user = await User.findById(req.body.userId);
    user.posts.push(post._id);
    await user.save();

    res.status(200).json(post);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

route.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (e) {
    res.status(500).json(e);
  }
});

route.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description
        }
      },
      {
        new: true
      }
    );

    res.status(200).json(updatedPost);
  } catch (e) {
    res.status(500).json(e);
  }
});

route.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    !post && res.status(404).json(`No Post found with Id ${id}`);

    await Post.findByIdAndDelete(id);
    res.status(200).json(`Post ${id} deleted successfully`);
  } catch (e) {}
});

module.exports = route;
