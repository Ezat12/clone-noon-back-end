const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose
    .connect(process.env.DB_UIR)
    .then((conn) => {
      console.log(`Connected Database ${conn.connection.host}`);
    })
    .catch((error) => {
      console.log("Database Error");
      process.exit(1);
    });
};

module.exports = dbConnect;
