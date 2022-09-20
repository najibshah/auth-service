const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: accessEnv } = require("../src/helpers/accessEnv");
//Api key for jwt token generation
const key = accessEnv("SECRET_OR_KEY");
//User Model
require("../models/User");
const User = mongoose.model("User");
//Input Validation
const validateLoginInput = require("../validation/login");

export function loginUser(req, res) {
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
}
