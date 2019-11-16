const express = require("express");
const router = express.Router();
const Spot = require("../models/Spot");

router.get("/", (req, res, next) => {
  res.render("index");
  Spot.find();
});

router.get("/comofunciona", (req, res, next) => {
  res.render("how-works");
});

router.get("/termosecondicoes", (req, res, next) => {
  res.render("termsandconditions");
});

router.get("/search", (req, res) => {
  let googlekey = process.env.API_KEY;
  const { capacity, format } = req.query;
  if (capacity == "" && format == "Tipo de Espaço") {
    Spot.find()
      .then(allSpots => {
        res.render("search", { spots: allSpots, googlekey: googlekey });
      })
      .catch(error => {
        throw new Error(error);
      });
  } else if (capacity === "" && format) {
    Spot.find({ format })
      .then(allSpots => {
        res.render("search", { spots: allSpots, googlekey: googlekey });
      })
      .catch(error => {
        throw new Error(error);
      });
  } else if (capacity && format === "Tipo de Espaço") {
    Spot.find({ capacity: { $gte: capacity } })
      .then(allSpots => {
        res.render("search", { spots: allSpots, googlekey: googlekey });
      })
      .catch(error => {
        throw new Error(error);
      });
  } else if (capacity && format) {
    Spot.find({ format, capacity: { $gte: capacity } })
      .then(allSpots => {
        res.render("search", { spots: allSpots, googlekey: googlekey });
      })
      .catch(error => {
        throw new Error(error);
      });
  }
});

router.get("/spots/:Id", (req, res) => {
  const Id = req.params.Id;
  Spot.findById(Id)
    .then(allSpots => {
      res.render("spotslist", { spot: allSpots });
    })
    .catch(error => {
      throw new Error(error);
    });
});

module.exports = router;
