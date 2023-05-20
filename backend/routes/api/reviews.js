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

//Delete a Review
//
router.delete(
  "/:reviewId",
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    //if there is no review that matches params
    if (!review) {
      const err = new Error(`Review couldn't be found`);
      err.title = `Review couldn't be found`;
      err.errors = { message: `Review couldn't be found` };
      err.status = 404;
      res.status(404);
      res.json({ message: `Review couldn't be found` });
      return next(err);
    }
    //if the review belongs to the user
    if (review.userId === req.user.id) {
      review.destroy();
      res.status(200);
      res.json({ message: "Successfully deleted" });
    } else {
      //if the review does NOT belong to the user
      const err = new Error(`Forbidden`);
      err.title = `Authorization error`;
      err.error = { message: "Forbidden" };
      err.status = 403;
      res.status(403);
      res.json({ message: `Forbidden` });
      return next(err);
    }
  }
);

module.exports = router;
