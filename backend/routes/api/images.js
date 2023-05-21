const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const {
  setTokenCookie,
  requireAuth,
  restoreUser,
} = require("../../utils/auth");
const { User, Image, Spot, Review, sequelize } = require("../../db/models");

const router = express.Router();

//Delete a Spot Image
router.delete("/:imageId/spots", requireAuth, async (req, res, next) => {
  try {
    const image = await Image.findByPk(req.params.imageId, {
      where: {
        imageableType: "Spot",
      },
    });
    //If the image doesn't exist
    if (!image) {
      const err = new Error(`Spot Image couldn't be found`);
      err.status = 404;
      return next(err);
    }

    const spot = await Spot.findByPk(image.imageableId);

    //If not the owner of the spot
    if (spot.ownerId !== req.user.id) {
      const err = new Error(`Forbidden`);
      err.status = 403;
      return next(err);
    }

    await image.destroy();
    res.status(200);
    res.json({ message: `Successfully deleted` });
  } catch (error) {
    console.log(error);
  }
});

//------------------------------------------------------------------------

//Delete a Review Image
router.delete("/:imageId/reviews", requireAuth, async (req, res, next) => {
  try {
    const image = await Image.findByPk(req.params.imageId, {
      where: {
        imageableType: "Review",
      },
    });

    //Review Image does not exist
    if (!image) {
      const err = new Error(`Review Image couldn't be found`);
      err.status = 404;
      return next(err);
    }

    //Review does not belong to user
    const review = await Review.findByPk(image.imageableId);
    if (review.userId !== req.user.id) {
      const err = new Error(`Forbidden`);
      err.status = 403;
      return next(err);
    }

    //Delete the review image
    await image.destroy();
    res.status(200);
    res.json({ message: `Successfully deleted` });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
