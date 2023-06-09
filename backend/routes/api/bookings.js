const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

const {
  setTokenCookie,
  requireAuth,
  restoreUser,
} = require("../../utils/auth");
const {
  User,
  Spot,
  Booking,
  Review,
  Image,
  sequelize,
} = require("../../db/models");

const router = express.Router();

//Edit a Booking

router.put("/:bookingId", requireAuth, async (req, res, next) => {
  const { startDate, endDate } = req.body;

  const updatedBooking = await Booking.findByPk(req.params.bookingId);

  //Booking doesn't exist
  if (!updatedBooking) {
    const err = new Error(`Booking couldn't be found`);
    err.status = 404;
    return next(err);
  }

  //Handles if the booking does not belong to the current user
  if (parseInt(updatedBooking.userId) !== parseInt(req.user.id)) {
    const err = new Error(`Forbidden`);
    err.status = 404;
    return next(err);
  }

  //Can't edit a booking that is past its endDate
  /*
  If the CURRENT date is past the endDate of the booking, throw Error
  */
  let currentDate = new Date();
  currentDate = currentDate.toISOString().slice(0, 10);
  if (updatedBooking.endDate < currentDate) {
    const err = new Error(`Past bookings can't be modified`);
    err.status = 403;
    return next(err);
  }

  //Deal with conflicting end and start dates
  const bookedStartDates = await Booking.findAll({
    where: {
      startDate,
      id: { [Op.not]: updatedBooking.id },
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
      id: { [Op.not]: updatedBooking.id },
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
    const err = new Error(
      `Sorry, this spot is already booked for the specified dates`
    );
    err.status = 403;
    err.errors = errors;
    return next(err);
  }

  await updatedBooking.update({
    startDate,
    endDate,
  });
  res.status(200);
  res.json(updatedBooking);
});

//---------------------------------------------------------------------------
//Delete a Booking
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  const booking = await Booking.findByPk(req.params.bookingId);
  //Booking doesn't exist
  if (!booking) {
    const err = new Error(`Booking couldn't be found`);
    err.status = 404;
    return next(err);
  }

  //Not an authorized user
  if (booking.userId !== req.user.id) {
    const err = new Error(`Forbidden`);
    err.status = 403;
    return next(err);
  }

  //If current date is past start date
  let currentDate = new Date();
  currentDate = currentDate.toISOString().slice(0, 10);
  if (booking.startDate < currentDate) {
    const err = new Error(`Bookings that have been started can't be deleted`);
    err.status = 403;
    return next(err);
  }

  await booking.destroy();
  res.status(200);
  res.json({ message: `Successfully deleted` });
});
module.exports = router;
