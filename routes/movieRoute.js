const express = require("express");
const movieController = require("../controller/movieController");

const router = express.Router();

// router.param('id', movieController.checkID)
router
  .route("/top-3-movies")
  .get(movieController.aliastop3, movieController.getAllMovies);

router.route("/getStat").get(movieController.getYourStat);

router
  .route("/")
  .get(movieController.getAllMovies)
  .post(movieController.checkBody, movieController.createMovie);

router
  .route("/:id")
  .get(movieController.getMovie)
  .patch(movieController.updateMovie)
  .delete(movieController.deleteMovie);

module.exports = router;
