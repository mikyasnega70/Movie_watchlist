const fs = require("fs");
const Movie = require("../models/movieModels");

const movies = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/movies.json`, "utf-8"),
);

exports.checkID = (req, res, next, val) => {
  if (val > movies.length) {
    return res.status(404).json({
      status: "fail",
      message: "invalid ID",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.title || !req.body.watched) {
    return res.status(400).json({
      status: "fail",
      message: "you don not enterd name, title, watched values",
    });
  }
  next();
};

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({
      status: "success",
      result: movies.length,
      data: {
        movies,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
  //   const id = req.params.id * 1;
  //   const movie = movies.find((el) => el.id === id);
};

exports.createMovie = async (req, res) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        movie: newMovie,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
  // const id = req.params.id * 1;
  // const movie = movies.find((el) => el.id === id);

  // for (let key in req.body) {
  //   movie[key] = req.body.key;
  // }
};

exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: {
        movie: null,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
  const id = req.params.id * 1;
  const index = movies.findIndex((el) => el.id === id);

  movies.splice(index, 1);
  res.status(204).json({
    status: "success",
    data: {
      movie: null,
    },
  });
};
