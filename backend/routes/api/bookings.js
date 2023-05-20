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

//Edit a Booking

router.put("/:bookingId", restoreUser, requireAuth, async (req, res, next) => {
  const { startDate, endDate } = req.body;

  const updatedBooking = await Booking.findByPk(req.params.bookingId);

  //Booking doesn't exist
  if (!updatedBooking) {
    res.status(404);
    res.json({ message: `Booking couldn't be found` });
  }

  //Can't edit a booking that is past its endDate
  /*
  If the CURRENT date is past the endDate of the booking, throw Error
  */
  const currentDate = new Date();
  if (updatedBooking.endDate < currentDate) {
    res.status(403);
    res.json({ message: `Past bookings can't be modified` });
  }

  //Deal with conflicting end and start dates
  const bookedStartDates = await Booking.findAll({
    where: {
      startDate,
    },
  });
  let isBookedStart = false;
  bookedStartDates.forEach((bookedDate) => {
    if (bookedDate.spotId === updatedBooking.spotId) {
      isBookedStart = true;
    }
  });

  //endDate conflicts with an existing booking
  const bookedEndDates = await Booking.findAll({
    where: {
      endDate,
    },
  });
  let isBookedEnd = false;
  bookedEndDates.forEach((bookedDate) => {
    if (bookedDate.spotId === updatedBooking.spotId) {
      isBookedEnd = true;
    }
  });

  //to return an errors object with all the different errors
  const errors = {};
  if (isBookedStart)
    errors.startDate = `Start date conflicts with an existing booking`;
  if (isBookedEnd)
    errors.endDate = `End date conflicts with an existing booking`;
  if (isBookedStart || isBookedEnd) {
    const errorMessage =
      "Sorry, this spot is already booked for the specified dates";
    const err = new Error(errorMessage);
    err.status = 403;
    err.errors = errors;
    return next(err);
  }

  updatedBooking.update({
    startDate,
    endDate,
  });
  res.status(200);
  res.json(updatedBooking);
});

module.exports = router;
