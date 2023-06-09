/*
User Stories
As an authenticated user, when viewing a spot's details, I want 
    to leave a review about that spot.
As an authenticated user, when posting a review, I want to set a
     star rating from 1 to 5.
As an authenticated user, when posting a review, if I forgot to 
    enter text or a rating for the message, I want to see a friendly error.

Acceptance Criteria
✓ If the current user is logged-in and they are viewing a spot's 
    detail page for a spot that they HAVE NOT posted a review yet,
    a "Post Your Review" button shows between the rating/reviews 
    heading and the list of reviews.
✓ If the current user is logged-in and they are viewing a spot's 
    detail page for a spot that they are an owner of, the "Post 
    Your Review" button should be hidden.
✓ If the current user is logged-in and they are viewing a spot's 
    detail page for a spot that they HAVE posted a review for, 
    the "Post Your Review" button should be hidden.
✓ If the current user is NOT logged-in and they are viewing a spot's 
    detail page for a spot, the "Post Your Review" button should 
    be hidden.
✓ Clicking "Post Your Review", opens a modal popup window containing 
    the new review form.
✓ On the new review form, there should be a title at the top with the
    text "How was your stay?".
✓ There should be a comment text area with a placeholder of "Leave 
    your review here...".
✓ There should be a star rating input ranging from 1 to 5 stars 
    followed by a label of "Stars".
✓The submit button should have the text of "Submit Your Review".
✓ The "Submit Your Review" button is disabled when there are fewer 
    than 10 characters in the comment text area and when the star 
    rating input has no stars selected.
If a server error occurs, show it below the title. (But that 
    shouldn't happen under normal circumstances).
✓ When the review is successfully created, the newly created review 
    should show up at the top of the reviews list.
✓ When the review is successfully created, the average star rating 
    and review summary info should be updated in both places.
✓ Closing the model resets any errors and clears all data entered. 
    Once it reopens, it must be in the default state (no errors, 
    empty inputs, button disabled).
*/

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./PostReviewModal.css";
import { createReview, getReviews } from "../../store/reviews";
import { getSpotDetails } from "../../store/singleSpot";

const PostReviewModal = ({ spot }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState("");
  const { closeModal } = useModal();

  const submitReview = (e) => {
    e.preventDefault();
    dispatch(createReview(spot?.id, review, rating));

    setReview("");
    setRating(0);
    setErrors("");

    closeModal();
    dispatch(getSpotDetails(spot?.id)).then(dispatch(getReviews(spot?.id)));
  };
  return (
    <div className="post-review-modal-container">
      <h1>How was your stay?</h1>
      <form onSubmit={submitReview} className="post-review-modal-form">
        <textarea
          rows="5"
          cols="40"
          type="text"
          className="post-review-textarea"
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <div className="rating-input">
          <div className={rating >= 1 ? "filled" : "empty"}>
            <i
              className="fa-solid fa-star"
              value={rating}
              onClick={() => setRating(1)}
            ></i>
          </div>
          <div className={rating >= 2 ? "filled" : "empty"}>
            <i
              className="fa-solid fa-star"
              value={rating}
              onClick={() => setRating(2)}
            ></i>
          </div>
          <div className={rating >= 3 ? "filled" : "empty"}>
            <i
              className="fa-solid fa-star"
              value={rating}
              onClick={() => setRating(3)}
            ></i>
          </div>
          <div className={rating >= 4 ? "filled" : "empty"}>
            <i
              className="fa-solid fa-star"
              value={rating}
              onClick={() => setRating(4)}
            ></i>
          </div>
          <div className={rating >= 5 ? "filled" : "empty"}>
            <i
              className="fa-solid fa-star"
              value={rating}
              onClick={() => setRating(5)}
            ></i>
          </div>
          <span> Stars</span>
        </div>
        <button disabled={review?.length < 10 || rating < 1}>
          Submit Your Review
        </button>
      </form>
    </div>
  );
};

export default PostReviewModal;
