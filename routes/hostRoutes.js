const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const User = require("../models/User");
const Spot = require("../models/Spot");
const mongoose = require("mongoose");
const uploadCloud = require("../config/cloudinary");

const checkHost = checkRoles("host");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect("/area");
    }
  };
}

router.get("/area/espacos/add", checkHost, (req, res, next) => {
  let googlekey = process.env.API_KEY;
  res.render("host/spot-add", { user: req.user, googlekey: googlekey });
});

router.post(
  "/area/espacos/add",
  checkHost,
  uploadCloud.single("photo"),
  (req, res, next) => {
    const picture = req.file.url;

    const location = {
      type: "Point",
      coordinates: [req.body.lng, req.body.lat]
    };
    const {
      title,
      description,
      format,
      capacity,
      equipments,
      conveniences,
      businessHours,
      email,
      phone,
      address
    } = req.body;
    const newSpot = new Spot({
      owner: req.user._id,
      title,
      format,
      description,
      capacity,
      equipments,
      conveniences,
      address,
      businessHours,
      email,
      phone,
      location,
      picture: picture
    });

    newSpot
      .save()
      .then(() => {
        res.redirect("/area/espacos");
      })
      .catch(error => {
        throw new Error(error);
      });
  }
);

router.get("/area/user/:userId", checkHost, (req, res) => {
  const Id = req.params.userId;
  User.findById(Id)
    .then(allUser => {
      res.render("host/userprofile", { user: allUser });
    })
    .catch(error => {
      throw new Error(error);
    });
});

router.get("/area/espacos", checkHost, (req, res) => {
  Spot.find({
    owner: mongoose.Types.ObjectId(req.user._id)
  })
    .then(arrayOfSpotsFromTheDb => {
      res.render("host/user-spaces", {
        spots: arrayOfSpotsFromTheDb,
        user: req.user
      });
    })
    .catch(error => {
      throw new Error(error);
    });
});

router.get("/area/espacos/edit/:spotId", checkHost, (req, res, next) => {
  const spotId = req.params.spotId;
  Spot.findById(spotId)
    .then(spot => {
      res.render("host/spot-edit", { spot, user: req.user._id });
    })
    .catch(error => {
      throw new Error(error);
    });
});

router.post("/area/espacos/edit/:spotId", checkHost, (req, res, next) => {
  const { spotId } = req.params;
  const {
    title,
    format,
    description,
    capacity,
    equipments,
    address,
    conveniences,
    businessHours,
    phone,
    email
  } = req.body;
  Spot.findByIdAndUpdate(spotId, {
    title,
    format,
    description,
    capacity,
    equipments,
    conveniences,
    address,
    businessHours,
    phone,
    email
  })
    .then(() => {
      res.redirect("/area/espacos");
    })
    .catch(error => {
      throw new Error(error);
    });
});

router.post("/area/espacos/delete/:spotId", checkHost, (req, res) => {
  const { spotId } = req.params;
  Spot.findByIdAndDelete(spotId)
    .then(() => {
      res.redirect("/area/espacos");
    })
    .catch(error => {
      throw new Error(error);
    });
});

module.exports = router;
