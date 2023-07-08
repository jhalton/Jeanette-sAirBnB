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
import { getSpotDetails } from "../../store/singleSpot";
import { getReviews } from "../../store/reviews";

const SpotDetail = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  // const spot = useSelector((state) => state.allSpots[+spotId]);
  const spot = useSelector((state) => state.singleSpot[spotId]);
  const reviews = useSelector((state) => state.reviews);
  const sessionUser = useSelector((state) => state.session.user);

  const handleReserve = (e) => {
    e.preventDefault();
    window.alert("Feature coming soon!");
  };

  useEffect(() => {
    dispatch(getSpotDetails(spotId));
    dispatch(getReviews(spotId));
  }, [dispatch, spotId]);

  // if (!reviews) {
  //   return;
  // }

  if (!spot) return;

  const spotPreviewImage = spot.SpotImages?.find((img) => img.preview === true);
  const spotImages = spot.SpotImages?.filter((img) => img.preview === false);

  return (
    <div className="spot-detail-container">
      <h1>{spot?.name}</h1>
      <div className="spot-detail-images">
        <img
          className={`spot-detail-preview-image grid-item-0`}
          src={spotPreviewImage?.url}
          alt={spot?.name}
        />
        {spotImages?.map((image, idx) => {
          return (
            <img
              key={image.id}
              className={`spot-detail-additional-image grid-item-${idx + 1}`}
              src={image.url}
              alt={image.id}
            />
          );
        })}
      </div>
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
      <br />
      <div className="reviews-div">
        <div className="ratings-num-reviews">
          <i className="fa-solid fa-star"></i>
          {spot?.avgRating ? spot.avgRating : "New!"}
          {spot.numReviews > 0
            ? spot.numReviews !== 1
              ? ` · ${spot.numReviews} reviews`
              : ` · ${spot.numReviews} review`
            : null}
          {/*If logged in and not the owner of the spot, and if there
            are no reviews, display 'Be the first to post a review!' */}
          {sessionUser ? (
            sessionUser.id !== spot.ownerId ? (
              spot.numReviews === 0 ? (
                <p>Be the first to post a review!</p>
              ) : null
            ) : null
          ) : null}
        </div>
        <ul className="reviews-ul">
          {Object.values(reviews)?.map((review) => {
            const createdAtDate = new Date(review.createdAt);
            const month = createdAtDate.toLocaleString("en-US", {
              month: "long",
            });
            const year = createdAtDate.getFullYear();
            const formattedDate = `${month} ${year}`;

            return (
              <li key={review.id}>
                <p>{review.User.firstName}</p>
                <p>{formattedDate}</p>
                <p>{review.review}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SpotDetail;
