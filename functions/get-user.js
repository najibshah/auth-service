const mongoose = require("mongoose");
//User Model
require("../models/User");
const User = mongoose.model("User");

export function getUser(req, res) {
  const errors = {};
  User.findOne({ email: req.params.email })
    .then((user) => {
      if (!user) {
        errors.nouser = "There is no user for this user";
        res.status(404).json(errors);
      }
      res.json(user);
    })
    .catch((err) => res.status(404).json(err));
}
