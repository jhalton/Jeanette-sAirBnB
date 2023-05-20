const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const {
  setTokenCookie,
  requireAuth,
  restoreUser,
} = require("../../utils/auth");
const { User, Spot, Review, sequelize } = require("../../db/models");

const router = express.Router();

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage(`Review text is required.`),
  check("stars")
    .isInt({ min: 1, max: 5 })
    .withMessage(`Stars must be an integer from 1 to 5`),
  handleValidationErrors,
];

//Edit a Review
//
router.put(
  "/:reviewId",
  restoreUser,
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const foundReview = await Review.findByPk(req.params.reviewId);
    if (!foundReview) {
      res.status(404);
      res.json({ message: `Review couldn't be found` });
      return;
    }
    const { review, stars } = req.body;
    if (foundReview.userId === req.user.id) {
      const updatedReview = await foundReview.update({
        review,
        stars,
      });
      res.status(200);
      res.json(updatedReview);
    } else {
      res.status(403);
      res.json({ message: "Forbidden" });
    }
  }
);

module.exports = router;
