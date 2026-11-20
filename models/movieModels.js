const mongoose = require("mongoose");
const Slugiffy = require("slugify");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "a move must have title"],
      trim: true,
      unique: true,
      maxlength: [20, "a title must be at most 20"],
    },
    slug: String,
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
      validate: {
        validator: function (val) {
          return val >= 1 && val <= 5;
        },
        message: "rating must be between 0 and 5",
      },
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
    secretMovie: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

movieSchema.virtual("durationInHour").get(function () {
  return this.duration / 60;
});

movieSchema.pre("save", function () {
  this.slug = Slugiffy(this.title, { lower: true });
});

movieSchema.pre(/^find/, function () {
  this.find({ secretMovie: { $ne: true } });
});

movieSchema.pre("aggregate", function () {
  this.pipeline().unshift({ $match: { secretMovie: { $ne: true } } });
});

const Movie = mongoose.model("Movies", movieSchema);

module.exports = Movie;
