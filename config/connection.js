const { ServerApiVersion } = require("mongodb");
const { default: mongoose } = require("mongoose");

//URI for mongoDB database
const uri = process.env.MONGODB_URI;

module.exports = {
  connectToServer: () => {
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
      })
      .then(() =>
        console.log("Auth service successfully connected to MongoDB.")
      )
      .catch((err) => console.log(err));
  },
  getDb: function () {
    return database;
  },
};
