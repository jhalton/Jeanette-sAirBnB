import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots } from "../../store/spots";
import "./Spots.css";
import { useHistory } from "react-router-dom";
import Tooltip from "../../Tooltip/Tooltip";

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => Object.values(state.allSpots));
  const history = useHistory();
  const defaultPreview =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmhPnAShm7aN-oG4DPzlFYcN4EGNnNVjtyiQ&usqp=CAU";

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
    <div className="landing-page-positioning-div">
      <div className="landing-page-div">
        <ul className="landing-page-ul">
          {spots.map((spot) => (
            <li
              className="landing-page-li"
              key={spot.id}
              onClick={() => history.push(`/spots/${spot.id}`)}
            >
              <Tooltip text={spot.name}>
                <img
                  className="landing-page-spot-image spot-image"
                  src={spot.previewImage || defaultPreview}
                  alt={spot.name}
                />
              </Tooltip>
              <div className="landing-page-details">
                <span className="landing-page-location">
                  {spot.city}, {spot.state}
                </span>
                <span className="landing-page-rating">
                  <i className="fa-solid fa-star"></i>
                  {Number(spot.avgRating) ? spot.avgRating : "New!"}
                </span>
                <span className="landing-page-price">${spot.price}/night</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LandingPage;
