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
const { ResultWithContextImpl } = require("express-validator/src/chain");

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
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const foundReview = await Review.findByPk(req.params.reviewId);
    if (!foundReview) {
      const err = new Error(`Review couldn't be found`);
      err.status = 404;
      return next(err);
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
      const err = new Error(`Forbidden`);
      err.status = 403;
      return next(err);
    }
  }
);

//Delete a Review
//
router.delete(
  "/:reviewId",

  requireAuth,
  async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    //if there is no review that matches params
    if (!review) {
      const err = new Error(`Review couldn't be found`);
      err.status = 404;
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
      err.status = 403;
      return next(err);
    }
  }
);

//------------------------------------------------------------------------
//Add an Image to a Review based on the Review's id
router.post(
  "/:reviewId/images",

  requireAuth,
  async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    const { url } = req.body;

    //Review does not exist
    if (!review) {
      const err = new Error(`Review couldn't be found`);
      err.status = 404;
      return next(err);
    }
    //If review does not belong to the user
    if (review.userId !== req.user.id) {
      const err = new Error(`Forbidden`);
      err.status = 403;
      return next(err);
    }

    //If review has reached max limit of 10 images
    const reviewImages = await Image.findAll({
      where: {
        imageableId: review.id,
        imageableType: "Review",
      },
    });
    if (reviewImages.length >= 10) {
      const err = new Error(
        `Maximum number of images for this resource was reached`
      );
      err.status = 403;
      return next(err);
    }

    //Create new image for review
    const newReviewImage = await review.createReviewImage({
      url,
      imageableId: review.id,
      imageableType: "Review",
    });

    const safeReviewImage = {
      id: newReviewImage.id,
      url: newReviewImage.url,
    };

    res.status(200);
    res.json(safeReviewImage);
  }
);

module.exports = router;
