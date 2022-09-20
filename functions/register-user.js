const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
//User Model
require("../models/User");
const User = mongoose.model("User");
//Input Validation
const validateRegisterInput = require("../validation/register");

export function registerUser(req, res) {
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
}
