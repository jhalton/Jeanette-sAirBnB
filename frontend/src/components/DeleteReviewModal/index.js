import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteReviewModal.css";
import { deleteReview, getReviews } from "../../store/reviews";
import { getSpotDetails } from "../../store/singleSpot";

const DeleteReviewModal = ({ review }) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const confirmDelete = (e) => {
    e.preventDefault();
    dispatch(deleteReview(review.id));
    closeModal();
    dispatch(getSpotDetails(review.spotId));
    dispatch(getReviews(review.spotId));
  };

  const rejectDelete = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className="delete-review-container">
      <h1 className="delete-review-title">Confirm Delete</h1>
      <span className="delete-review-prompt">
        Are you sure you want to delete this review?
      </span>
      <div className="delete-review-button-div">
        <button className="delete-review-button" onClick={confirmDelete}>
          Yes (Delete Review)
        </button>
        <button className="keep-review-button" onClick={rejectDelete}>
          No (Keep Review)
        </button>
      </div>
    </div>
  );
};

export default DeleteReviewModal;
