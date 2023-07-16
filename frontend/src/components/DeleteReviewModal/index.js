/*
User Stories
As an authenticated user, I want to be able to delete a review I posted.

Acceptance Criteria
✓ On a review that the logged-in user has posted, there should be a "Delete"
    button below the review's comment.
✓ On a review that the logged-in user did NOT post, the "Delete" button should 
    be hidden.
Clicking the "Delete" button on a review will open a confirmation modal popup 
    window that should contain: a Title: "Confirm Delete", a Message: "Are you sure 
    you want to delete this review?", a Red button: "Yes (Delete Review)", and a 
    Dark grey button: "No (Keep Review)".
✓ Clicking the "Delete" button on a review should not delete the review. Clicking
    the "Yes (Delete Review)" button in the confirmation modal should delete the 
    review.
✓ After a review is deleted, it should be removed from the review list in the 
    review management page and in the spot's detail page. No refresh should be 
    necessary.
*/

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
