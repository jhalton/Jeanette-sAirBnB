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
router.delete("/:imageId", restoreUser, requireAuth, async (req, res, next) => {
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
});

//------------------------------------------------------------------------

module.exports = router;
