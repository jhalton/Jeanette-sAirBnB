const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const {
  setTokenCookie,
  requireAuth,
  restoreUser,
} = require("../../utils/auth");
const { User, Spot, Review, Image, sequelize } = require("../../db/models");

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
  const existingUser = await User.findAll({
    where: {
      username,
      email,
    },
  });

  if (existingUser.length) {
    const err = new Error(`Username or email already exists.`);
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

//Get the Current User
//--> This is working. Do I need to set another scope for this to allow email?
router.get("/:userId", restoreUser, requireAuth, async (req, res) => {
  if (parseInt(req.params.userId) === parseInt(req.user.id)) {
    const user = await User.findByPk(req.params.userId);
    res.status(200);
    res.json({ user: user });
  } else {
    res.status(200);
    return res.json({ user: null });
  }
});

//Get all Spots owned by the Current User
//--> DONE
router.get("/:userId/spots", restoreUser, requireAuth, async (req, res) => {
  if (parseInt(req.params.userId) === parseInt(req.user.id)) {
    const spots = await Spot.findAll({
      where: {
        ownerId: parseInt(req.params.userId),
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

    //To return the previewImage without the Images array
    const spotsList = spots.map((spot) => {
      const spotItem = spot.toJSON();
      spotItem.previewImage = spotItem.SpotImages[0]?.previewImage;
      delete spotItem.SpotImages;
      return spotItem;
    });

    res.status(200);
    res.json({ Spots: spotsList });
  } else {
    res.status(404);
    res.json({ message: "Authorization required." });
  }
});

//Get all Reviews of the Current User
// --> need to auth current user

router.get(
  "/:userId/reviews",
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    // if (parseInt(req.params.userId) === parseInt(req.user.id)) {
    const reviews = await Review.findAll({
      where: {
        userId: req.params.userId,
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
  // }
);
module.exports = router;
