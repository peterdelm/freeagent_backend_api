const db = require("../models");
const Review = db.reviews;
const dbConfig = require("../config/db.config.js");

// Create and Save a new Review
exports.create = async (req, res) => {
  try {
    console.log("A create user review request has arrived");

    //FIND THE ID of the User
    console.log("Auth token is " + req.headers.authorization);
    const userId = req.user.userID;
    console.log("userId in review.create is", userId);

    // Create a Review
    const review = {
      review: req.body.review,
      userId: userId,
    };

    // Log review properties
    Object.keys(review).forEach((key) => {
      console.log(`${key}: ${review[key]}`);
    });

    if (review.review) {
      // Save Review in the database
      const newReview = await Review.create(review);

      const response = {
        success: true, // Set the success property to true
        review: newReview,
        message: "Review Added",
      };
      res.status(200).send(response);
      console.log("Review Added");
    } else {
      const response = {
        success: false, // Set the success property to true
        message: "Review not posted. Blank Text Input",
      };
      res.status(400).send(response);
    }
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      // Handle validation errors
      const validationErrors = err.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    } else {
      console.log(err);
    }
  }
};
