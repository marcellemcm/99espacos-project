const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const User = require("../models/User");
const Spot = require("../models/Spot");

const checkAdmin = checkRoles("admin");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect("/area");
    }
  };
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

router.get("/area", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    User.find()
      .then(() => {
        res.render("admin/admin", { user: req.user });
      })
      .catch(error => {
        throw new Error(error);
      });
  } else if (req.user.role === "host") {
    User.find()
      .then(() => {
        res.render("host/area-host", { user: req.user });
      })
      .catch(error => {
        throw new Error(error);
      });
  }
});

router.get("/area/hosts", checkAdmin, (req, res) => {
  User.find({ role: "host" })
    .then(allUser => {
      res.render("admin/profiles", { users: allUser });
    })
    .catch(error => {
      throw new Error(error);
    });
});

router.get("/area/hosts/:userId", checkAdmin, (req, res) => {
  const Id = req.params.userId;
  User.findById(Id)
    .then(allUser => {
      res.render("admin/user", { user: allUser });
    })
    .catch(error => {
      throw new Error(error);
    });
});

router.post("/area/hosts/:id/delete", checkAdmin, (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/area/hosts");
    })
    .catch(error => {
      throw new Error(error);
    });
});

router.get("/area/spots", checkAdmin, (req, res) => {
  Spot.find()
    .then(allSpots => {
      res.render("admin/spots", { spots: allSpots });
    })
    .catch(error => {
      throw new Error(error);
    });
});

router.get("/area/spots/:spotId", checkAdmin, (req, res) => {
  const Id = req.params.spotId;
  Spot.findById(Id)
    .then(allSpots => {
      res.render("admin/spotprofile", { spot: allSpots });
    })
    .catch(error => {
      throw new Error(error);
    });
});

router.post("/area/spots/:id/delete", checkAdmin, (req, res, next) => {
  Spot.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/area/spots");
    })
    .catch(error => {
      throw new Error(error);
    });
});

router.get("/area/spots/:id/edit", checkAdmin, (req, res, next) => {
  const editId = req.params.id;
  Spot.findById(editId)
    .then(spotEdit => {
      res.render("admin/spotedit", { spotEdit });
    })
    .catch(error => {
      throw new Error(error);
    });
});

router.post("/area/spots/:id/edit", checkAdmin, (req, res, next) => {
  const nId = req.params.id;
  Spot.findByIdAndUpdate(nId, req.body)
    .then(() => {
      res.redirect("/area/spots");
    })
    .catch(error => {
      throw new Error(error);
    });
});

module.exports = router;
