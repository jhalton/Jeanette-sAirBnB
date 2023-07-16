/*
User Stories
As an authenticated user, I want to delete a spot I created.
As an authenticated user, I want to be prompted to confirm deleting
 a spot before it happens.

Acceptance Criteria
✓ Clicking "Delete" on one of the spot tiles on the spot management 
    page opens a confirmation modal popup that should contain: a Title:
    "Confirm Delete", a Message: "Are you sure you want to remove this
     spot?", a Red button: "Yes (Delete Spot)", and a Dark grey button:
     "No (Keep Spot)".
✓ After a spot is deleted, it should be removed from the spot list in 
    the spot management page and in the landing page. No refresh should 
    be necessary.
*/
import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { deleteSpot, getCurrentUserSpots } from "../../store/sessionUserSpots";
import "./DeleteSpotModal.css";

const DeleteSpotModal = ({ spot }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  const { closeModal } = useModal();

  const confirmDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteSpot(spot.id));
    await dispatch(getCurrentUserSpots(user.id));
    closeModal();
  };

  const rejectDelete = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className="delete-spot-div">
      <h1 className="delete-spot-title">Confirm Delete</h1>
      <p className="delete-spot-prompt">
        Are you sure you want to delete this spot?
      </p>
      <div className="delete-spot-buttons-div">
        <button className="delete-spot-button" onClick={confirmDelete}>
          Yes (Delete Spot)
        </button>
        <button className="keep-spot-button" onClick={rejectDelete}>
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
};

export default DeleteSpotModal;
