const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { default: accessEnv } = require("../src/helpers/accessEnv");

//Api key for jwt token generation
const key = accessEnv("SECRET_OR_KEY");

//User Model
require("../models/User");
const User = mongoose.model("User");
//Input Validation
const validateLoginInput = require("../validation/login");
const validateRegisterInput = require("../validation/register");

// @route   GET /test
// @desc    Tests auth get route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Auth get Works" }));

// @route   POST /test
// @desc    Tests auth post route
// @access  Public
router.post("/test", (req, res) => {
  res.json({ msg: "Auth Post Works" });
});

// @route   GET /users
// @desc    Get all users
// @access  Public
router.get("/users", (req, res) => {
  User.find()
    .sort({ date: -1 })
    .then((users) => res.json(users))
    .catch((err) => res.status(404).json({ nousersfound: "No users found" }));
});

// @route   GET /user/:email
// @desc    Get user by email
// @access  Public
router.get("/:email", (req, res) => {
  const errors = {};
  console.log(req.params.email);
  User.findOne({ email: req.params.email })

    .then((user) => {
      if (!user) {
        errors.nouser = "There is no user for this user";
        res.status(404).json(errors);
      }

      res.json(user);
    })
    .catch((err) => res.status(404).json(err));
});

// @route   POST api/Profile
// @desc    edit user roles
// @access  Private
router.post("/editUser", (req, res) => {
  const profileFields = {};
  console.log(req.body);

  //profileFields.user = req.user.email;
  if (req.body.role) profileFields.role = req.body.role;

  User.findOne({ user: req.body.email }).then((profile) => {
    if (profile) {
      //Update
      User.findOneAndUpdate(
        { email: req.body.email },
        { $set: profileFields },
        { new: true }
      ).then((profile) => res.json(profile));
    } else {
      //Save Profile
      new Profile(profileFields).save().then((profile) => res.json(profile));
    }
  });
});

// @route   Post /register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body.data);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.data.email }).then((user) => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        userID: req.body.data.userID,
        firstName: req.body.data.firstName,
        lastName: req.body.data.lastName,
        email: req.body.data.email,
        password: req.body.data.password,
        role: "user",
      });
      // password hashing from plaintext for security
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route   POST /login
// @desc    Login User -> Return JWT token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body.data);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.data.email;
  const password = req.body.data.password;

  //Find user by email
  User.findOne({ email }).then((user) => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(400).json(errors);
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // Create JWT payload if user matched
        const payload = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        };

        // Sign token
        jwt.sign(payload, key, { expiresIn: 7200 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token,
          });
        });
      } else {
        errors.password = "Password Incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET /current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
    });
  }
);
module.exports = router;
