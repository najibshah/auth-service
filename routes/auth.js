const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  updateUserRoles,
  getUser,
  getAllUsers,
} = require("../functions");

// @route   GET /test
// @desc    Tests auth get route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Auth get Works" }));

// @route   POST /test
// @desc    Tests auth post route
// @access  Public
router.post("/test", (req, res) => res.json({ msg: "Auth Post Works" }));

// @route   GET /users
// @desc    Get all users
// @access  Public
router.get("/users", (req, res) => getAllUsers(req, res));

// @route   GET /user/:email
// @desc    Get user by email
// @access  Public
router.get("/:email", (req, res) => getUser(req, res));

// @route   POST api/Profile
// @desc    edit user roles
// @access  Private
router.post("/editUser", (req, res) => updateUserRoles(req, res));

// @route   Post /register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => registerUser(req, res));

// @route   POST /login
// @desc    Login User -> Return JWT token
// @access  Public
router.post("/login", (req, res) => loginUser(req, res));

module.exports = router;
