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
    <div className="landing-page-div">
      <ul className="landing-page-ul">
        {spots.map((spot) => (
          <li className="landing-page-li" key={spot.id}>
            <Tooltip text={spot.name}>
              <img
                className="landing-page-spot-image spot-image"
                // data-tooltip="test text" //when this works, change to {spot.name}
                src={spot.previewImage || defaultPreview}
                alt={spot.name}
                onClick={() => history.push(`/api/spots/${spot.id}`)}
              />
            </Tooltip>
            <span className="landing-page-location">
              {spot.city}, {spot.state}
            </span>
            <span className="landing-page-rating">
              <i className="fa-solid fa-star"></i>
              {Number(spot.avgRating) ? spot.avgRating : "New!"}
            </span>
            <span className="landing-page-price">${spot.price} / night</span>
          </li>
        ))}
      </ul>

      <span className="test-tooltip" data-tooltip="testing 123">
        TEST TOOLTIP
      </span>
    </div>
  );
};

export default LandingPage;
