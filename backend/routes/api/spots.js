const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, Review, User, Image, sequelize } = require("../../db/models");
const spot = require("../../db/models/spot");

const router = express.Router();

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required."),
  check("city").exists({ checkFalsy: true }).withMessage("City is required."),
  check("state").exists({ checkFalsy: true }).withMessage("State is required."),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .withMessage("Latitude is not valid."),
  check("lng")
    .exists({ checkFalsy: true })
    .withMessage("Longitude is not valid"),
  check("name")
    .isLength({ max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required."),
  handleValidationErrors,
];

//Get all spots
// --> DONE. Could use some error middleware to handle null previewImage
router.get("/", async (req, res) => {
  const spots = await Spot.findAll({
    attributes: {
      include: [
        [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [],
      },
      {
        model: Image,
        as: "SpotImages",
        attributes: [["url", "previewImage"]],
      },
    ],
    group: ["Spot.id"],
  });

  //To return the previewImage without the Images array
  const spotsList = spots.map((spot) => {
    const spotItem = spot.toJSON();
    spotItem.previewImage = spotItem.SpotImages[0]?.previewImage;
    delete spotItem.SpotImages;
    return spotItem;
  });

  res.status(200);
  res.json({ Spots: spotsList });
});

//Get details of a Spot from an id
//-->Could maybe use middleware so previewImage shows up if null
//DONE. Except for the above thought ^
router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    attributes: {
      include: [
        [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
        [sequelize.fn("COUNT", sequelize.col("Reviews.spotId")), "numReviews"],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [],
        where: {
          spotId: req.params.spotId,
        },
      },
      {
        model: Image,
        as: "SpotImages",
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
    group: ["SpotImages.id"],
  });

  if (!spot) {
    res.status(404);
    res.json({ message: "Spot couldn't be found" });
    return;
  }

  res.status(200);
  res.json(spot);
});

//Create a Spot
//-->Need to authenticate
router.post("/", requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const newSpot = await Spot.create({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  const safeSpot = {
    address: newSpot.address,
    city: newSpot.city,
    state: newSpot.state,
    country: newSpot.country,
    lat: newSpot.lat,
    lng: newSpot.lng,
    name: newSpot.name,
    description: newSpot.description,
    price: newSpot.price,
  };

  await setTokenCookie(res, safeSpot);

  res.status(201);
  res.json(safeSpot);
});

//Add an Image to a Spot based on the Spot's id
// --> Need authorization, authentication,
router.post("/:spotId/images", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  //Do the things

  if (!spot) {
    res.status(404);
    return res.json({ message: `Spot couldn't be found` });
  }
});

//Edit a Spot
// Needs authentication, proper authorization
router.put("/:spotId", validateSpot, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404);
    return res.json({ message: `Spot couldn't be found` });
  }
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const updatedSpot = await spot.update({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.status(200);
  res.json(updatedSpot);
});

//Delete a Spot
//Needs authorization(spot must belong to current user), authentication
router.delete("/:spotId", validateSpot, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404);
    return res.json({
      message: `Spot couldn't be found`,
    });
  }

  await spot.destroy();
  res.status(200);
  res.json({ message: "Successfully deleted" });
});

//
module.exports = router;
