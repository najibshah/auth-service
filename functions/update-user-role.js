const mongoose = require("mongoose");

//User Model
require("../models/User");
const User = mongoose.model("User");

export function updateUserRoles(req, res) {
  const profileFields = {};

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
}
