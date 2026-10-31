const express = require("express");
const morgan = require("morgan");

const app = express();

const movieRouter = require("./routes/movieRoute");

app.use(morgan("dev"));

app.use(express.json());
app.set("query parser", "extended");

app.use("/api/v1/movies", movieRouter);

module.exports = app;
