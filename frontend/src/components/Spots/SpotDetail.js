import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSpotDetails } from "../../store/singleSpot";
import { getReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import PostReviewModal from "../PostReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";

const SpotDetail = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector((state) => state.singleSpot[spotId]);
  const reviews = useSelector((state) => state.reviews);
  const sessionUser = useSelector((state) => state.session.user);

  const reversedReviewsArr = Object.values(reviews).reverse();

  const handleReserve = (e) => {
    e.preventDefault();
    window.alert("Feature coming soon!");
  };

  useEffect(() => {
    dispatch(getSpotDetails(spotId));
    dispatch(getReviews(spotId));
  }, [dispatch, spotId]);

  if (!spot) return <div>Loading...</div>;

  const spotPreviewImage = spot.SpotImages?.find((img) => img.preview === true);
  const spotImages = spot.SpotImages?.filter((img) => img.preview === false);

  return (
    <div className="spot-detail-positioning-div">
      <div className="spot-detail-container">
        <h1 className="spot-detail-title">{spot?.name}</h1>
        <span>
          {spot?.city}, {spot?.state}, {spot?.country}
        </span>
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
        <div className="spot-detail-text">
          <h2 className="spot-detail-host">
            Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
          </h2>
          <span className="spot-detail-description">{spot.description}</span>
          <div className="spot-detail-info-box-container">
            <ul className="spot-detail-info-box-ul">
              <li className="info-box-price">${spot.price}/night</li>
              <li className="info-ratings-and-reviews">
                <i className="fa-solid fa-star"></i>
                {spot.avgRating ? spot.avgRating : "New!"}
                {Number(spot.numReviews) > 0
                  ? Number(spot.numReviews) !== 1
                    ? ` · ${spot.numReviews} reviews`
                    : ` · ${spot.numReviews} review`
                  : null}
              </li>
              <li className="info-box-button">
                <button
                  className="info-box-button info-reserve-button"
                  onClick={handleReserve}
                >
                  Reserve
                </button>
              </li>
            </ul>
          </div>
        </div>
        <br />
        <div className="reviews-div">
          <div className="ratings-num-reviews">
            <i className="fa-solid fa-star"></i>
            {spot?.avgRating ? spot.avgRating : "New!"}
            {Number(spot.numReviews) > 0
              ? Number(spot.numReviews) !== 1
                ? ` · ${spot.numReviews} reviews`
                : ` · ${spot.numReviews} review`
              : null}
            {sessionUser ? (
              sessionUser.id !== spot.ownerId ? (
                !Object.values(reviews).some(
                  (review) => review.userId === sessionUser.id
                ) ? (
                  <div>
                    <OpenModalButton
                      className="post-review-button open-modal-button"
                      buttonText="Post Your Review"
                      modalComponent={<PostReviewModal spot={spot} />}
                    />
                  </div>
                ) : null
              ) : null
            ) : null}

            {/*If logged in and not the owner of the spot, and if there
            are no reviews, display 'Be the first to post a review!' */}
            {sessionUser ? (
              sessionUser.id !== spot.ownerId ? (
                Number(spot.numReviews) === 0 ? (
                  <p>Be the first to post a review!</p>
                ) : null
              ) : null
            ) : null}
          </div>
          <ul className="reviews-ul">
            {reversedReviewsArr.map((review) => {
              const createdAtDate = new Date(review?.createdAt);
              const month = createdAtDate?.toLocaleString("en-US", {
                month: "long",
              });
              const year = createdAtDate?.getFullYear();
              const formattedDate = `${month} ${year}`;

              return (
                <li key={review?.id}>
                  <h3 className="review-first-name">
                    {review.User?.firstName}
                  </h3>
                  <p>{formattedDate}</p>
                  <p>{review?.review}</p>

                  {sessionUser ? (
                    sessionUser.id === review.User.id ? (
                      <OpenModalButton
                        className="delete-review-button open-modal-button"
                        buttonText="Delete"
                        modalComponent={<DeleteReviewModal review={review} />}
                      />
                    ) : null
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpotDetail;
