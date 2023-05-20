const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
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

module.exports = router;
