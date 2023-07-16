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
  const userSpots = useSelector((state) => Object.values(state.userSpots));

  useEffect(() => {
    dispatch(getCurrentUserSpots(user.id));
  }, [dispatch, user]);

  if (!userSpots.length) {
    return (
      <div className="manage-spots-positioning-div">
        <div>
          <h1>Manage Spots</h1>
          <p>It looks like you don't have any spots yet!</p>
          <NavLink to="/spots">Create a Spot</NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-spots-positioning-div">
      <div className="manage-spots-div">
        <div className="manage-spots-top">
          <h1>Manage Spots</h1>
          <button
            className="create-a-spot-button"
            onClick={() => history.push("/spots")}
          >
            Create a Spot
          </button>
        </div>
        <ul className="manage-spots-ul">
          {userSpots.map((spot) => (
            <li key={spot.id} className="manage-spots-li">
              <img
                className="spot-image"
                src={spot.previewImage}
                alt={spot.name}
                onClick={() => history.push(`/spots/${spot.id}`)}
              />
              {console.log("MANAGE SPOT", spot)}
              <div className="manage-spots-text">
                <p className="manage-spots-location">
                  {spot.city}, {spot.state}
                </p>
                <p className="manage-spots-price">${spot.price} / night</p>
                <p className="manage-spots-rating">
                  <i className="fa-solid fa-star"></i>
                  {Number(spot.avgRating)
                    ? Number(spot.avgRating).toFixed(1)
                    : "New!"}
                </p>
                <div className="management-buttons">
                  <button
                    className="update-button"
                    onClick={() => history.push(`/spots/${spot.id}/update`)}
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
    </div>
  );
};

export default ManageSpots;
