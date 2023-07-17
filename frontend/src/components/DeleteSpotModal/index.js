import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { deleteSpot, getCurrentUserSpots } from "../../store/sessionUserSpots";
import "./DeleteSpotModal.css";
import { deleteFromAllSpots, getAllSpots } from "../../store/spots";

const DeleteSpotModal = ({ spot }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  const { closeModal } = useModal();

  const confirmDelete = (e) => {
    e.preventDefault();

    dispatch(deleteSpot(spot.id));
    dispatch(getCurrentUserSpots(user.id));

    dispatch(getAllSpots());
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
