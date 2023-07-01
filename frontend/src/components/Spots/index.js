/*
✓ -On the landing page of the site, I should see a tile list of all 
  the spots.

✓ -Each spot tile in the tile list should have a thumbnail image, the city, 
  and the state of the spot.

-Each spot tile in the tile list should have a tooltip with the the 
  name of the spot as the tooltip's text.

✓ -Each spot tile in the tile list should have a star rating of "New"
  (if there are no review for that spot) or the average star rating 
  of the spot as a decimal.

✓ -Each spot tile in the tile list should have the price for the spot 
  followed by the label "night".

✓ -Clicking any part of the spot tile should navigate to that spot's detail page.
*/
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots } from "../../store/spots";
import "./Spots.css";
import { useHistory } from "react-router-dom";

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => Object.values(state.spot));
  const history = useHistory();

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
    <div>
      <ul>
        {spots.map((spot) => (
          <li key={spot.id}>
            <img
              className="spot-image"
              style={{ width: "500px" }}
              src={spot.previewImage}
              alt={spot.name}
              onClick={() => history.push(`/api/spots/${spot.id}`)}
            />

            <div className="landing-page-spot-text">
              <p>
                {spot.city}, {spot.state}
              </p>
              <p>${spot.price} / night</p>
              <p>
                <i className="fa-solid fa-star"></i>
                {Number(spot.avgRating) ? spot.avgRating : "New!"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LandingPage;
