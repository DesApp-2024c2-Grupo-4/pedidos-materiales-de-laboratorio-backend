const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const clientDb = mongoose
  .connect(process.env.URI_MONGO)
  .then(async (mongo) => {
    mongo.connection;
    console.log("Database Connected");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = clientDb;
