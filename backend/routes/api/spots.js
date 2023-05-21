const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

const {
  setTokenCookie,
  requireAuth,
  restoreUser,
} = require("../../utils/auth");
const {
  Spot,
  Review,
  Booking,
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
//---------------------------------------------------------------------------------
//Get all spots

const validateQuery = [
  check("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage(`Page must be greater than or equal to 1`),
  check("size")
    .optional()
    .isInt({ min: 1 })
    .withMessage(`Size must be greater than or equal to 1`),
  check("maxLat")
    .optional()
    .isDecimal({ checkFalsy: true })
    .withMessage(`Maximum latitude is invalid`),
  check("minLat")
    .optional()
    .isDecimal({ checkFalsy: true })
    .withMessage(`Maximum latitude is invalid`),
  check("maxLng")
    .optional()
    .isDecimal({ checkFalsy: true })
    .withMessage(`Maximum longitude is invalid`),
  check("minLng")
    .optional()
    .isDecimal({ checkFalsy: true })
    .withMessage(`Maximum longitude is invalid`),
  check("minPrice")
    .optional()
    .isDecimal({ min: 0 })
    .withMessage(`Minimum price must be greater than or equal to 0`),
  check("maxPrice")
    .optional()
    .isDecimal({ min: 0 })
    .withMessage(`Maximum price must be greater than or equal to 0`),
  handleValidationErrors,
];

router.get("/", validateQuery, async (req, res, next) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  let limit;
  let offset;

  page = parseInt(page);
  size = parseInt(size);

  if (isNaN(page) || !page) page = 1;
  if (page > 10) page = 10;
  if (isNaN(size) || !size) size = 20;

  const where = {};
  if (minLat !== undefined) {
    where.lat = { [Op.gte]: parseInt(minLat) };
  }

  if (maxLat !== undefined) {
    where.lat = { [Op.lte]: parseInt(maxLat) };
  }

  if (minLng !== undefined) {
    where.lng = { [Op.gte]: parseInt(minLng) };
  }

  if (maxLng !== undefined) {
    where.lng = { [Op.lte]: parseInt(maxLng) };
  }

  if (minPrice !== undefined) {
    where.price = { [Op.gte]: parseInt(minPrice) };
    console.log(minPrice);
  }

  if (maxPrice !== undefined) {
    where.price = { [Op.lte]: parseInt(maxPrice) };
  }

  const allSpots = await Spot.findAll({
    where, //pass in our query
    limit: size,
    offset: size * (page - 1),
  });

  const payload = [];
  for (let i = 0; i < allSpots.length; i++) {
    const spot = allSpots[i];
    //get avgRating
    const reviewsPromise = Review.findAll({
      where: {
        spotId: spot.id,
      },
      attributes: ["stars"],
    });

    //get previewImage
    const previewImagePromise = Image.findOne({
      where: {
        imageableId: spot.id,
        imageableType: "Spot",
        preview: true,
      },
    });

    const [reviews, previewImage] = await Promise.all([
      reviewsPromise,
      previewImagePromise,
    ]);

    const sumRating = reviews.reduce(
      (accum, num) => accum + parseInt(num.stars),
      0
    );
    const avgRating = sumRating / reviews.length;

    const spotData = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: avgRating,
      previewImage: previewImage?.url,
    };
    payload.push(spotData);
  }

  res.status(200);
  res.json({ Spots: payload, page, size });
});

//--------------------------------------------------------------------------
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
    err.status = 404;
    return next(err);
  }

  res.status(200);
  res.json(spot);
});
//--------------------------------------------------------------------------
//Create a Spot

router.post("/", requireAuth, validateSpot, async (req, res, next) => {
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
//--------------------------------------------------------------------------
//Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    const err = new Error(`Spot couldn't be found`);
    err.status = 404;
    return next(err);
  }

  if (parseInt(spot.ownerId) === parseInt(req.user.id)) {
    const { url, preview } = req.body;

    const newImage = await spot.createSpotImage({
      url,
      preview,
      imageableId: req.params.spotId,
      imageableType: "Spot",
    });

    const safeImage = {
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    };

    res.status(200);
    res.json(safeImage);
  } else {
    const err = new Error(`Authorization required.`);
    err.status = 401;
    return next(err);
  }
});
//----------------------------------------------------------------------------
//Edit a Spot
router.put("/:spotId", requireAuth, validateSpot, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    const err = new Error(`Spot couldn't be found`);
    err.status = 404;
    return next(err);
  }

  if (spot.ownerId !== req.user.id) {
    const err = new Error(`Forbidden`);
    err.status = 403;
    return next(err);
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
//-----------------------------------------------------------------------
//Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    const err = new Error(`Spot couldn't be found`);
    err.status = 404;
    return next(err);
  }

  if (spot.ownerId !== req.user.id) {
    const err = new Error(`Forbidden`);
    err.status = 403;
    return next(err);
  }

  await spot.destroy();
  res.status(200);
  res.json({ message: "Successfully deleted" });
});
//---------------------------------------------------------------------
//Get all reviews by a Spot's id
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
//----------------------------------------------------------------
//Create a Review for a Spot based on the Spot's id

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
      const err = new Error(`User already has a review for this spot`);
      err.status = 500;
      return next(err);
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
//----------------------------------------------------------------
//Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  //if there isn't a spot for the given id
  if (!spot) {
    const err = new Error(`Spot couldn't be found`);
    err.status = 404;
    res.status(err.status);
    res.json({ message: err.message });
    return next(err);
  }

  //if user IS NOT the owner
  if (spot.ownerId !== req.user.id) {
    const bookings = await Booking.findAll({
      where: {
        spotId: spot.id,
      },
      attributes: ["spotId", "startDate", "endDate"],
    });
    res.status(200);
    res.json({ Bookings: bookings });
  }
  //if user IS the owner
  if (spot.ownerId === req.user.id) {
    const bookings = await Booking.findAll({
      where: {
        spotId: spot.id,
      },
    });

    const bookedUsersById = bookings.map((booking) => booking.userId);

    const visitors = await User.findAll({
      where: {
        id: bookedUsersById,
      },
      attributes: ["id", "firstName", "lastName"],
    });

    const ownerBookings = bookings.map((booking) => {
      const visitor = visitors.find((visitor) => visitor.id === booking.userId);

      return {
        User: visitor,
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      };
    });
    res.status(200);
    res.json({ Bookings: ownerBookings });
  }
});
//----------------------------------------------------------------------

//custom validators
const validateEndDate = (endDate, { req }) => {
  const { startDate } = req.body;
  if (endDate <= startDate) {
    throw new Error(`endDate cannot be on or before startDate`);
  }
  return true;
};

//validator array
const validateBooking = [
  check("endDate").custom(validateEndDate),
  handleValidationErrors,
];

//Create a Booking from a Spot based on the Spot's id
router.post(
  "/:spotId/bookings",
  requireAuth,
  validateBooking,
  async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    const { startDate, endDate } = req.body;
    //spot doesn't exist
    if (!spot) {
      const err = new Error(`Spot couldn't be found`);
      err.status = 404;
      return next(err);
    }

    //startDate conflicts with an existing booking
    const bookedStartDates = await Booking.findAll({
      where: {
        startDate,
      },
    });
    let isBookedStart = false;
    bookedStartDates.forEach((bookedDate) => {
      if (bookedDate.spotId === spot.id) {
        isBookedStart = true;
      }
    });

    //endDate conflicts with an existing booking
    const bookedEndDates = await Booking.findAll({
      where: {
        endDate,
      },
    });
    let isBookedEnd = false;
    bookedEndDates.forEach((bookedDate) => {
      if (bookedDate.spotId === spot.id) {
        isBookedEnd = true;
      }
    });

    //to return an errors object with all the different errors
    const errors = {};
    if (isBookedStart)
      errors.startDate = `Start date conflicts with an existing booking`;
    if (isBookedEnd)
      errors.endDate = `End date conflicts with an existing booking`;
    if (isBookedStart || isBookedEnd) {
      const err = new Error(
        `Sorry, this spot is already booked for the specified dates`
      );
      err.status = 403;
      return next(err);
    }

    //if the user owns the spot
    if (spot.ownerId === req.user.id) {
      const err = new Error(`Cannot create booking for your own spot`);
      err.status = 403;
      res.status(err.status);
      res.json({ message: err.message });
      return next(err);
    }
    //spot does not belong to current user
    else {
      const newBooking = await spot.createBooking({
        startDate,
        endDate,
        userId: req.user.id,
      });
      console.log("Loooooook hheeeeeeere", startDate, endDate);
      res.status(200);
      res.json(newBooking);
    }
  }
);

//-----------------------------------------------------------------------
//
module.exports = router;
