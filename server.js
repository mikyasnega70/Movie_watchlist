const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);

mongoose.connect(DB).then((con) => console.log("DB connected successfully"));

// const DB_LOCAL = process.env.DATABASE_LOCAL;

// mongoose.connect(DB_LOCAL).then(con=> console.log('DB connected successfully'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
