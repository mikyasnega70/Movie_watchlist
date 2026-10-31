const fs = require("fs");
const Movie = require("../models/movieModels");
const { match, throws } = require("assert");

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
      message: "you don not enterd title, watched values",
    });
  }
  next();
};

exports.aliastop3 = async (req, res, next) => {
  req.aliasQuery = {
    limit: 3,
    sort: "-ratingAvg",
  };
  next();
};

exports.getAllMovies = async (req, res) => {
  try {
    const reqQuery = { ...req.query, ...req.aliasQuery };
    const queryObj = { ...req.query };
    excludeField = ["sort", "fields", "page", "limit"];
    excludeField.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(queryStr);

    let query = Movie.find(JSON.parse(queryStr));

    // SORT
    if (reqQuery.sort) {
      const sortBy = reqQuery.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-created_at _id");
    }

    // fields
    if (reqQuery.fields) {
      const fields = reqQuery.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination
    const page = reqQuery.page * 1 || 1;
    const limit = reqQuery.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (reqQuery.page) {
      if (skip >= (await Movie.countDocuments()))
        throw new Error("page doesn't exist");
    }

    const movies = await query;

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
      message: err.message,
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
