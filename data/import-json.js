const fs = require("fs");
const Movie = require("../models/movieModels");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: `${__dirname}/../config.env` });

const movies = JSON.parse(fs.readFileSync(`${__dirname}/movies.json`, "utf-8"));

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);

mongoose.connect(DB).then((con) => console.log("DB connected successfully"));

// const DB_LOCAL = process.env.DATABASE_LOCAL;

// mongoose.connect(DB_LOCAL).then(con=> console.log('DB connected successfully'));

const importData = async () => {
  try {
    await Movie.create(movies);
    console.log("DB import successfully");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Movie.deleteMany();
    console.log("DB delete successfully");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
