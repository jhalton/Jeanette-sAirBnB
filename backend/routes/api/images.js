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

module.exports = router;
