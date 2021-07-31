const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");

// Auth

const { register, login, checkAuth } = require("../controllers/auth");

// User

const {
  getUsers,
  getUserByUsername,
  getProfileFeed,
  getUserById,
  getFollowers,
  getFollowing,
  editProfile,
  deleteUser,
  addFollowing,
} = require("../controllers/user");

// Feed

const {
  addFeed,
  feedByFollow,
  feeds,
  like,
  likeById,
  comments,
  addComment,
  deleteComment,
} = require("../controllers/feed");

// Message

const {
  sendMessage,
  messageWithId,
  messageUsers,
} = require("../controllers/message");

const { uploadFile } = require("../middleware/uploadFile");

// Auth

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

//Route User

router.get("/users", getUsers);
router.get("/user/:username", getUserByUsername);
router.get("/user/:id", getUserById);
router.get("/profile/:id", getProfileFeed);
router.get("/followers/:id", auth, getFollowers);
router.get("/following/:id", auth, getFollowing);
router.post("/follow", auth, addFollowing);
router.patch("/user", auth, uploadFile("imageFile"), editProfile);
router.delete("/user/:id", deleteUser);

// Route Feed

router.post("/feed", auth, uploadFile("imageFile"), addFeed);
router.post("/comments", auth, addComment);
router.post("/like", auth, like);
router.get("/like/:id", auth, likeById);
router.get("/feed", auth, feedByFollow);
router.get("/feeds", auth, feeds);
router.get("/comments/:id", auth, comments);
router.delete("/comments/:id", auth, deleteComment);

// Route Message

router.post("/message/:id", auth, sendMessage);
router.get("/messages", auth, messageUsers);
router.get("/message/:username", auth, messageWithId);

module.exports = router;
