const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

const app = express();

const movieRouter = require("./routes/movieRoute");

app.use(morgan("dev"));

app.use(express.json());
app.set("query parser", "extended");

app.use("/api/v1/movies", movieRouter);

app.all("/{*splat}", (req, res, next) => {
  //   res.status(404).json({
  //     status: "fail",
  //     message: `can't find ${req.originalUrl}`,
  //   });
  next(new AppError(`can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
