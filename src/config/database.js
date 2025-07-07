const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://nodejslearn:F8pRRkJiwWkRi7jl@nodelearning.qpvnvbj.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
