const mongoose = require("mongoose");
//User Model
require("../models/User");
const User = mongoose.model("User");

export function getAllUsers(req, res) {
  User.find()
    .sort({ date: -1 })
    .then((users) => res.json(users))
    .catch((err) => res.status(404).json({ nousersfound: "No users found" }));
}
