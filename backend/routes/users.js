const router = require("express").Router();
const bcrypt = require("bcrypt");
let User = require("../models/user.model");

// get all users
router.route("/all").get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Could not return all users: " + err));
});

// create user
router.route("/create").post((req, res) => {
  const username = req.body.username;
  const password = bcrypt.hashSync(req.body.password, 10);
  const tags = req.body.tags;

  const newUser = new User({ username, password, tags });

  newUser
    .save()
    .then(() => res.json("New user added!"))
    .catch(err => res.status(400).json("Could not create new user: " + err));
});

/*
// get user by id
router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err =>
      res.status(400).json("Could not get user by given id: " + err)
    );
});
*/

router.route("/:username").get((req, res) => {
  User.findOne({ username: req.params.username })
    .then(user => res.json(user))
    .catch(err =>
      res.status(400).json("Could not get user by given username: " + err)
    );
});

// delete user by id
router.route("/:id").delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(user => res.json("User deleted!"))
    .catch(err =>
      res.status(400).json("Could not delete user from given id: " + err)
    );
});

// update user by id
router.route("/update/:id").put((req, res) => {
  User.findById(req.params.id)
    .then(user => {
      user.username = req.body.username;
      user.password = bcrypt.hashSync(req.body.password, 10);

      user
        .save()
        .then(() => res.json("User updated!"))
        .catch(err => res.status(400).json("Could not update user: " + err));
    })
    .catch(err =>
      res.status(400).json("Could not find user with given username: " + err)
    );
});

// login with username and password - authentification
router.route("/login").post((req, res) => {
  User.findOne({ username: req.body.username })
    .exec()
    .then(function(user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.json(user);
      } else {
        res.status(400).json("Login Unsuccessful!");
      }
    })
    .catch(err => res.status(400).json("Username does not exist: " + err));
});

// get all movies from a user
router.route("/:id/movies").get((req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user.movies))
    .catch(err =>
      res
        .status(400)
        .json(
          "could not retrieve user's movie collection from given id: " + err
        )
    );
});

// get all tags from a user
router.route("/:id/tags").get((req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user.tags))
    .catch(err =>
      res
        .status(400)
        .json("could not retrieve user's format tags from given id: " + err)
    );
});

// add movie to user's collection
router.route("/:id/movies/create").put((req, res) => {
  User.findById(req.params.id)
    .then(user => {
      const title = req.body.title;
      const year = Number(req.body.year);
      const rated = req.body.rated;
      const runtime = req.body.runtime;
      const director = req.body.director;
      const plot = req.body.plot;
      const poster = req.body.poster;
      const tagFormat = req.body.tagFormat;

      const newMovie = {
        title,
        year,
        rated,
        runtime,
        director,
        plot,
        poster,
        tagFormat
      };
      user.movies.push(newMovie);

      user
        .save()
        .then((resp) => res.json(resp))
        .catch(err =>
          res.status(400).json("Could not update user's movies: " + err)
        );
    })
    .catch(err => res.status(400).json("Could not find user with id: " + err));
});

// add tag to user's tag collection
router.route("/:id/tags/create").put((req, res) => {
  User.findById(req.params.id)
    .then(user => {
      user.tags.push({ format: req.body.format });

      user
        .save()
        .then(() => res.json("tags updated!"))
        .catch(err =>
          res.status(400).json("Could not update user's tags: " + err)
        );
    })
    .catch(err => res.status(400).json("Could not find user with id: " + err));
});

router.route("/:user_id/movies/:movie_id").get((req, res) => {
  User.findById(req.params.user_id)
    .then(user => {
      const movie = user.movies.id(req.params.movie_id);
      res.json(movie);
    })
    .catch(err =>
      res.status(400).json("Could not get movie by given id: " + err)
    );
});

router.route("/:user_id/tags/:tag_id").get((req, res) => {
  User.findById(req.params.user_id)
    .then(user => {
      const tag = user.tags.id(req.params.tag_id);
      res.json(tag);
    })
    .catch(err =>
      res.status(400).json("Could not get tag by given id: " + err)
    );
});

router.route("/:user_id/movies/:movie_id").delete((req, res) => {
  User.findById(req.params.user_id)
    .then(user => {
      user.movies.id(req.params.movie_id).remove();
      res.json("movie deleted!");

      user
        .save()
        .then(() => res.json("user updated!"))
        .catch(err => res.status(400).json("Could not update user: " + err));
    })
    .catch(err => res.status(400).json("Could not delete movie: " + err));
});

router.route("/:user_id/tags/:tag_id").delete((req, res) => {
  User.findById(req.params.user_id)
    .then(user => {
      user.tags.id(req.params.tag_id).remove();
      res.json("tag deleted!");

      user
        .save()
        .then(() => res.json("user updated!"))
        .catch(err => res.status(400).json("Could not update user: " + err));
    })
    .catch(err => res.status(400).json("Could not delete tag: " + err));
});

module.exports = router;
