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
  User,
  Spot,
  Review,
  Image,
  Booking,
  sequelize,
} = require("../../db/models");

const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// Sign up
router.post("/", validateSignup, async (req, res, next) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  //if username or password already exists, throw error
  const existingUsername = await User.findAll({
    where: {
      username,
    },
  });

  const existingEmail = await User.findAll({
    where: {
      email,
    },
  });

  if (existingUsername.length) {
    const err = new Error(`Username already exists.`);
    err.statusCode = 500;
    next(err);
  }

  if (existingEmail.length) {
    const err = new Error(`Username already exists.`);
    err.statusCode = 500;
    next(err);
  }

  const user = await User.create({
    email,
    username,
    hashedPassword,
    firstName,
    lastName,
  });

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});
//-----------------------------------------------------------------------

//Get the Current User
router.get("/me", requireAuth, async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  if (user) {
    res.status(200);
    res.json({ user: user });
  } else {
    res.status(200);
    return res.json({ user: null });
  }
});

//---------------------------------------------------------------------

//Get all Spots owned by the Current User
router.get("/me/spots", requireAuth, async (req, res, next) => {
  const spots = await Spot.findAll({
    where: {
      ownerId: parseInt(req.user.id),
    },
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
  //

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

//---------------------------------------------------------------------

//Get all Reviews of the Current User
router.get(
  "/me/reviews",

  requireAuth,
  async (req, res, next) => {
    const reviews = await Review.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        {
          model: Spot,
          include: [
            {
              model: Image,
              as: "SpotImages",
              attributes: [["url", "previewImage"]],
            },
          ],
        },
        { model: Image, as: "ReviewImages", attributes: ["id", "url"] },
      ],
    });

    const betterReviews = reviews.map((review) => {
      const betterReview = review.toJSON();
      betterReview.Spot.SpotImages.forEach((image) => {
        betterReview.Spot.previewImage =
          betterReview.Spot.SpotImages[0]?.previewImage;
      });
      delete betterReview.Spot.SpotImages;
      return betterReview;
    });

    res.status(200);
    res.json({ Reviews: betterReviews });
  }
);

//----------------------------------------------------------------------

//Get all of the Current User's Bookings
router.get("/me/bookings", requireAuth, async (req, res, next) => {
  const bookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
  });

  //Lazy load. Eager loading messes with the order and doesn't allow to insert nested.
  const betterBookings = [];
  for (let booking of bookings) {
    const spot = await booking.getSpot({
      attributes: [
        "id",
        "ownerId",
        "address",
        "city",
        "state",
        "country",
        "lat",
        "lng",
        "name",
        "price",
      ],
      include: [
        {
          model: Image,
          as: "SpotImages",
          attributes: [["url", "previewImage"]],
        },
      ],
    });

    //To remove the SpotImages and return only the previewImage with the spot
    const betterSpot = spot.toJSON();
    betterSpot.previewImage = betterSpot.SpotImages?.[0]?.previewImage;
    delete betterSpot.SpotImages;

    const betterBooking = {
      id: booking.id,
      spotId: booking.spotId,
      Spot: betterSpot,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
    betterBookings.push(betterBooking);
  }

  res.status(200);
  res.json({ Bookings: betterBookings });
});

module.exports = router;
