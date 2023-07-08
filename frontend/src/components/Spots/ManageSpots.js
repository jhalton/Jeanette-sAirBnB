/*
User Stories:
As an authenticated user, I want to be able to view the spots I have posted in one place.
As an authenticated user, I want to be able to update a spot I posted.
As an authenticated user, I want to be able to delete a spot I posted.
As an authenticated user, if I have not posted any spots, I want to see a friendly message.

Acceptance Criteria:
✓ When opening the user drop down menu and selecting "Manage Spots", it should navigate the user to 
    the spot management page which shows the the list of all the spots created by the user.
✓ The spot management page should contain a heading with the text "Manage Spots".
✓If no spots have been posted yet by the user, show a "Create a New Spot" link, which links to the 
    new spot form page, instead of the spot list.
The spot management page should contain a spot tile list similar to the one in the landing page 
    (thumbnail image, location, rating, price).
Each spot in the spot tile list on the spot management page should contain an additional two buttons,
    "Update" and "Delete" buttons, below the city and state.
✓ Clicking any part of the spot tile should navigate to that spot's detail page.
*/

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserSpots } from "../../store/sessionUserSpots";
import { useHistory, NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";

const ManageSpots = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  // const userSpots = useSelector((state) =>
  //   Object.values(state.userSpots)
  // ).filter((spot) => spot?.ownerId === user.id);
  const userSpots = useSelector((state) => Object.values(state.userSpots));
  console.log("MANAGE SPOTS", userSpots);

  useEffect(() => {
    dispatch(getCurrentUserSpots(user.id));
  }, [dispatch, user]);

  if (!userSpots.length) {
    return (
      <div>
        <h1>Manage Spots</h1>
        <p>It looks like you don't have any spots yet!</p>
        <NavLink to="/api/spots">Create a Spot</NavLink>
      </div>
    );
  }

  return (
    <div className="manage-spots-div">
      <h1>Manage Spots</h1>
      <ul className="manage-spots-ul">
        {userSpots.map((spot) => (
          <li key={spot.id} className="manage-spots-li">
            <img
              className="spot-image"
              src={spot.previewImage}
              alt={spot.name}
              onClick={() => history.push(`/api/spots/${spot.id}`)}
            />

            <div className="manage-spots-text">
              <p className="manage-spots-location">
                {spot.city}, {spot.state}
              </p>
              <p className="manage-spots-price">${spot.price} / night</p>
              <p className="manage-spots-rating">
                <i className="fa-solid fa-star"></i>
                {Number(spot.avgRating) ? spot.avgRating : "New!"}
              </p>
              <div className="management-buttons">
                <button
                  className="update-button"
                  onClick={() => history.push(`/api/spots/${spot.id}/update`)}
                >
                  Update
                </button>
                {/* <button>Delete</button> */}
                <OpenModalButton
                  className="delete-button"
                  buttonText="Delete"
                  modalComponent={<DeleteSpotModal spot={spot} />}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageSpots;
