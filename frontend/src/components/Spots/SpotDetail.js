/*
As a site visitor or authenticated user, I want to see
 a minimum of 1 image (preview image) on the spot's details
page with:
The location, with the country
1-5 spot images
The host's name
A description
The price
NOTE: Ratings and reviews will be covered in a separate feature.

Acceptance Criteria

✓ -On the spot's detail page, the following information should be present:
 a Heading , Location: , , , Images (1 large image and 4 small images), 
 Text: Hosted by , , Paragraph: , and the callout information box on the
right, below the images.
✓ -The callout information box on the right of the spot's detail page should 
state the price for the spot followed by the label "night", and have a "Reserve" button.
✓-When the "Reserve" button on the spot's detail page is clicked, it should open an 
alert with the text "Feature coming soon".
*/
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSpotDetails } from "../../store/spots";

const SpotDetail = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spot[+spotId]);

  const handleReserve = (e) => {
    e.preventDefault();
    window.alert("Feature coming soon!");
  };

  useEffect(() => {
    dispatch(getSpotDetails(spotId));
  }, [dispatch, spotId]);

  if (!spot) return;
  const spotPreviewImage = spot.SpotImages?.find((img) => img.preview === true);
  const spotImages = spot.SpotImages?.filter((img) => img.preview === false);
  return (
    <div>
      <h1>{spot?.name}</h1>
      <img
        className="spot-image"
        style={{ width: "500px" }}
        src={spotPreviewImage?.url}
        alt={spot?.name}
      />
      {spotImages?.map((image) => {
        return (
          <img
            key={image.id}
            className="spot-image"
            style={{ width: "250px" }}
            src={image.url}
            alt={image.id}
          />
        );
      })}
      <p>
        {spot?.address}, {spot?.city}, {spot?.state}
      </p>
      <p>
        Hosted by: {spot.Owner?.firstName} {spot.Owner?.lastName}
      </p>
      <p>{spot.description}</p>
      <div className="spot-detail-info-box">
        <ul>
          <li className="spot-detail-info-item">${spot.price} / night</li>
          <li className="spot-detail-info-item">
            <i className="fa-solid fa-star"></i>
            {spot.avgRating ? spot.avgRating : "New!"}
          </li>
          <li className="spot-detail-info-item">
            <button className="info-box-button" onClick={handleReserve}>
              Reserve
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SpotDetail;
