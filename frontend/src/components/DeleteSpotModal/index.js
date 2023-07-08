/*
User Stories
As an authenticated user, I want to delete a spot I created.
As an authenticated user, I want to be prompted to confirm deleting
 a spot before it happens.

Acceptance Criteria
Clicking "Delete" on one of the spot tiles on the spot management 
    page opens a confirmation modal popup that should contain: a Title:
    "Confirm Delete", a Message: "Are you sure you want to remove this
     spot?", a Red button: "Yes (Delete Spot)", and a Dark grey button:
     "No (Keep Spot)".
After a spot is deleted, it should be removed from the spot list in 
    the spot management page and in the landing page. No refresh should 
    be necessary.
*/
import React, { useState, useEffect } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { deleteSpot, getCurrentUserSpots } from "../../store/sessionUserSpots";

const DeleteSpotModal = ({ spot }) => {
  const dispatch = useDispatch();
  const [isDeleted, setIsDeleted] = useState(false);
  const user = useSelector((state) => state.session.user);

  const { closeModal } = useModal();
  console.log(spot.id);

  const confirmDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteSpot(spot.id));
    setIsDeleted(true);
    closeModal();
  };

  const rejectDelete = (e) => {
    e.preventDefault();
    closeModal();
  };

  useEffect(() => {
    console.log("DELETE SPOT MODAL", isDeleted);
    if (isDeleted) {
      dispatch(getCurrentUserSpots(user.id));
    } else return;
  }, [dispatch, isDeleted, user]);

  return (
    <div>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this spot?</p>
      <button onClick={confirmDelete}>Yes (Delete Spot)</button>
      <button onClick={rejectDelete}>No (Keep Spot)</button>
    </div>
  );
};

export default DeleteSpotModal;
