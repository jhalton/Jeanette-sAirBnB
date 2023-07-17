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
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const submitReview = async (e) => {
    e.preventDefault();

    await dispatch(createReview(spot?.id, review, rating));

    setReview("");
    setRating(0);
    setErrors("");

    closeModal();
    await dispatch(getSpotDetails(spot?.id));
    await dispatch(getReviews(spot?.id));
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
        <button
          className="submit-review-button"
          disabled={review?.length < 10 || rating < 1}
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );
};

export default PostReviewModal;
