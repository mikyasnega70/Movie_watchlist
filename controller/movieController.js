const fs = require("fs");
const Movie = require("../models/movieModels");
const { match, throws } = require("assert");
const ApiFeature = require("../utils/apiFeature");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const reqQuery = { ...req.query, ...req.aliasQuery };

  const features = new ApiFeature(Movie.find(), reqQuery)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const movies = await features.query;

  if (reqQuery.page && movies.length === 0) {
    throw new Error("Page doesn't exist");
  }

  // if (reqQuery.page) {
  //   if (skip >= (await Movie.countDocuments()))
  //     throw new Error("page doesn't exist");
  // }

  res.status(200).json({
    status: "success",
    result: movies.length,
    data: {
      movies,
    },
  });
});

exports.getMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    throw new AppError(`can't find movie with this id`, 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.createMovie = catchAsync(async (req, res, next) => {
  const newMovie = await Movie.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      movie: newMovie,
    },
  });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!movie) {
    return next(new AppError(`can't find movie with this id`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      movie,
    },
  });
  // const id = req.params.id * 1;
  // const movie = movies.find((el) => el.id === id);

  // for (let key in req.body) {
  //   movie[key] = req.body.key;
  // }
});

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const tour = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) {
    return next(new AppError(`can't find movie with this id`, 404));
  }

  res.status(204).json({
    status: "success",
    data: {
      movie: null,
    },
  });
  // const id = req.params.id * 1;
  // const index = movies.findIndex((el) => el.id === id);

  // movies.splice(index, 1);
  // res.status(204).json({
  //   status: "success",
  //   data: {
  //     movie: null,
  //   },
  // });
});

exports.getYourStat = catchAsync(async (req, res, next) => {
  const stat = await Movie.aggregate([
    {
      $match: { ratingAvg: { $gte: 4.0 } },
    },
    {
      $group: {
        _id: { $toUpper: { $toString: "$watched" } },
        numMovies: { $sum: 1 },
        avgRating: { $avg: "$ratingAvg" },
        totalPrice: { $sum: "$price" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stat,
    },
  });
});

exports.yearlyStat = catchAsync(async (req, res, next) => {
  const Year = req.params.year * 1;
  const stat = await Movie.aggregate([
    { $unwind: "$watched_date" },
    {
      $match: {
        watched_date: {
          $gte: new Date(`${Year}-01-01`),
          $lte: new Date(`${Year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$watched_date" },
        numofmovies: { $sum: 1 },
        movies: { $push: "$title" },
        totalPrice: { $sum: "$price" },
        avgRating: { $avg: "$ratingAvg" },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numofmovies: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stat,
    },
  });
});
