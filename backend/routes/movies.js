const router = require("express").Router();
let Movie = require("../models/movie.model");

router.route("/all").get((req, res) => {
  Movie.find()
    .then(movies => res.json(movies))
    .catch(err => res.status(400).json("Could not return all movies: " + err));
});

router.route("/save").post((req, res) => {
  const title = req.body.title;
  const year = Number(req.body.year);
  const rated = req.body.rated;
  const runtime = req.body.runtime;
  const director = req.body.director;
  const plot = req.body.plot;
  const poster = req.body.poster;
  const tagFormat = req.body.tagFormat;

  const newMovie = new Movie({
    title,
    year,
    rated,
    runtime,
    director,
    plot,
    poster,
    tagFormat
  });

  newMovie
    .save()
    .then(() => res.json("New movie added!"))
    .catch(err => res.status(400).json("Could not save new movie: " + err));
});

router.route("/:id").delete((req, res) => {
  Movie.findByIdAndDelete(req.params.id)
    .then(() => res.json("movie deleted!"))
    .catch(err =>
      res.status(400).json("Could not delete movie from given id: " + err)
    );
});

router.route("/update/:id").put((req, res) => {
  User.findById(req.params.id)
    .then(movie => {
      movie.title = req.body.title;
      movie.year = Number(req.body.year);
      movie.rated = req.body.rated;
      movie.runtime = req.body.runtime;
      movie.director = req.body.director;
      movie.plot = req.body.plot;
      movie.poster = req.body.poster;
      movietagFormat = req.body.tagFormat;

      movie
        .save()
        .then(() => res.json("movie updated!"))
        .catch(err => res.status(400).json("Could not update movie: " + err));
    })
    .catch(err =>
      res.status(400).json("Could not find movie with given id: " + err)
    );
});

module.exports = router;
