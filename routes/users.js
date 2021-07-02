const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      password: newPassword,
      email: req.body.email
    });
    const user = await newUser.save();

    const { password, ...other } = user._doc;

    res.status(200).json(other);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username
    });

    !user && res.status(400).json("Wrong credential");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    !validPassword && res.status(400).json("Wrong credential!!");

    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.put("/:id", async (req, res) => {
  //Not using JWT now, so just formally checking
  try {
    if (req.body.id == req.params.id) {
      if (req.body.password) {
        req.body.password = await bcrypt.hash(
          req.body.password,
          await bcrypt.genSalt(10)
        );
      }

      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      const { password, ...user } = updateUser._doc;
      res.status(200).json(user);
    } else {
      res.status(401).json("Cannot edit this user!");
    }
  } catch (e) {}
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found");
    }

    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User deleted successfully");
    } catch (e) {
      res.status(500).json(e);
    }
  } catch (e) {
    res.status(404).json(e.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    // const { password, ...other } = users._doc;
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get("/:id/posts", async (req, res) => {
  try {
    const userPosts = await User.findOne({ _id: req.params.id }).populate(
      "posts"
    );
    res.status(200).json(userPosts);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

module.exports = router;
