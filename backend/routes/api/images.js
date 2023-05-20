const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const {
  setTokenCookie,
  requireAuth,
  restoreUser,
} = require("../../utils/auth");
const { User, Image, Spot, sequelize } = require("../../db/models");

const router = express.Router();

//Delete a Spot Image
//--> Require authentication AND authorization
router.delete("/:imageId", restoreUser, requireAuth, async (req, res, next) => {
  /*
    I: image id
    O: deletes a spot image (should i be checking the imageable type?)
        --> imageableId will === spotId

    0. get the spot by the imageableId/spotId to authorize that the current
        user matches the ownerId
        a. Get image by imageId
    1. If a match, get the image by the imageId and destroy. This should cascade
        to remove it from the spot.
      a. If        
    */
  const image = await Image.findByPk(req.params.imageId);
  const spot = await Spot.findOne({
    where: {
      id: image.imageableId,
    },
  });
  if (parseInt(spot.ownerId) === parseInt(req.user.id)) {
    image.destroy();
    res.status(200);
    res.json({ message: "Successfully deleted" });
  } else {
    res.status(404);
    res.json({ message: `Spot Image couldn't be found` });
  }
});

module.exports = router;
