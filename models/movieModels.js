const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "a move must have title"],
    trim: true,
  },
  releaseYear: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear(),
  },
  genre: {
    type: String,
    required: [true, "a movie must have genre"],
  },
  duration: {
    type: Number,
    min: [5, "duration must be at least 5 minute"],
  },
  ratingAvg: {
    type: Number,
    default: 4,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "a movie must have price"],
  },
  image: {
    type: String,
    required: [true, "a movie must have image"],
  },
  watched_date: [Date],
  created_at: {
    type: Date,
    default: Date.now,
  },
  summary: {
    type: String,
    trim: true,
  },
  watched: {
    type: Boolean,
    default: false,
  },
});

const Movie = mongoose.model("Movies", movieSchema);

module.exports = Movie;
