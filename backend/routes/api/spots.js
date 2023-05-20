const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const {
  setTokenCookie,
  requireAuth,
  restoreUser,
} = require("../../utils/auth");
const {
  Spot,
  Review,
  User,
  Image,
  sequelize,
  // validateReview,
} = require("../../db/models");
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
// --> Works locally. Could use some error middleware to handle null previewImage
// --> Render hates my grouping.
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
    group: ["Spot.id", "SpotImages.id"],
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
router.get("/:spotId", async (req, res, next) => {
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
    group: ["SpotImages.id", "Owner.id", "Spot.id"],
  });

  if (!spot) {
    const err = new Error(`Spot couldn't be found`);
    res.json({ message: err.message });
    return next(err);
  }

  res.status(200);
  res.json(spot);
});

//Create a Spot
//-->Need to authenticate
router.post("/", restoreUser, requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const newSpot = await Spot.create({
    ownerId: req.user.id,
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
    id: newSpot.id,
    ownerId: newSpot.ownerId,
    address: newSpot.address,
    city: newSpot.city,
    state: newSpot.state,
    country: newSpot.country,
    lat: newSpot.lat,
    lng: newSpot.lng,
    name: newSpot.name,
    description: newSpot.description,
    price: newSpot.price,
    createdAt: newSpot.createdAt,
    updatedAt: newSpot.updatedAt,
  };

  setTokenCookie(res, safeSpot);

  res.status(201);
  return res.json(safeSpot);
});

//Add an Image to a Spot based on the Spot's id
// --> Need to return the correct response body without createdAt and updatedAt
// --> It also isn't returning the id
// --> When I try to deploy this endpoint, I get an error saying "column \"commentableId\" does not exist"
router.post(
  "/:spotId/images",
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      const err = new Error(`Spot couldn't be found`);
      res.status(404);
      res.json({ message: err.message });
      return next(err);
    }

    if (parseInt(spot.ownerId) === parseInt(req.user.id)) {
      const { url, preview } = req.body;

      const newImage = await Image.create({
        url,
        preview,
        imageableId: req.params.spotId,
        imageableType: "Spot",
      });

      if (preview === true || preview === 1) {
        newImage.preview = true;
      } else {
        newImage.preview = false;
      }

      await newImage.save();

      const safeImage = {
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview,
      };

      await spot.addSpotImages(newImage);
      res.status(200);
      res.json(safeImage);
    } else {
      const err = new Error(`Authorization required.`);
      res.json({ message: err.message });
      return next(err);
    }
  }
);

//Edit a Spot
//--> DONE.
router.put(
  "/:spotId",
  restoreUser,
  requireAuth,
  validateSpot,
  async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      const err = new Error(`Spot couldn't be found`);
      res.json({ message: err.message });
      res.status(404);
      return next(err);
    }
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

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
  }
);

//Delete a Spot
//DONE.
router.delete("/:spotId", restoreUser, requireAuth, async (req, res) => {
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

//Get all reviews by a Spot's id
//--> DONE. ✓✓
router.get("/:spotId/reviews", async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404);
    return res.json({ message: "Spot couldn't be found" });
  }

  const reviews = await Review.findAll({
    where: {
      spotId: req.params.spotId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Image,
        as: "ReviewImages",
        attributes: ["id", "url"],
      },
    ],
  });
  res.status(200);
  res.json(reviews);
});

//Create a Review for a Spot based on the Spot's id
//Need to add validations to reviews

//validator to check reviews and stars
const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage(`Review text is required.`),
  check("stars")
    .isInt({ min: 1, max: 5 })
    .withMessage(`Stars must be an integer from 1 to 5`),
  handleValidationErrors,
];

router.post(
  "/:spotId/reviews",
  restoreUser,
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const { review, stars } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      res.status(404);
      return res.json({ message: `Spot couldn't be found` });
    }

    //Verify that the current user doesn't already have a review for this spot
    const existingUserReview = await Review.findAll({
      where: {
        userId: req.user.id,
        spotId: req.params.spotId,
      },
    });

    if (existingUserReview.length) {
      res.status(500);
      return res.json({ message: `User already has a review for this spot` });
    }

    const newReview = await spot.createReview({
      userId: req.user.id,
      spotId: spot.id,
      review,
      stars,
    });

    const safeReview = {
      id: newReview.id,
      userId: newReview.userId,
      spotId: newReview.spotId,
      review: newReview.review,
      stars: newReview.stars,
    };

    res.status(201);
    res.json(safeReview);
  }
);

//
module.exports = router;
