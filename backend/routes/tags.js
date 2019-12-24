const router = require("express").Router();
let Tag = require("../models/tag.model");

router.route("/all").get((req, res) => {
  Tag.find()
    .then(tags => res.json(tags))
    .catch(err => res.status(400).json("Could not return all tags: " + err));
});

router.route("/:format").delete((req, res) => {
  Tag.findOneAndDelete({ format: req.params.format })
    .then(tag => res.json("tag deleted"))
    .catch(err =>
      res.status(400).json("could not delete tag from given name: " + err)
    );
});

router.route("/create").post((req, res) => {
  const format = req.body.format;
  const newTag = new Tag({ format });

  newTag
    .save()
    .then(() => res.json("New tag added!"))
    .catch(err => res.status(400).json("Could not create new tag: " + err));
});

module.exports = router;
