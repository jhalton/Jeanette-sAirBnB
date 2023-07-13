/*
User Stories
✓  As a site visitor or authenticated user, when viewing the home 
    page, I want to see the rating of each spot (average rounded to
    1 decimal place).
As a site visitor or authenticated user, when viewing a spot's 
    details, I want to see the reviews posted for that spot. 
    Starting with the most recent.
As an authenticated user, if there are no reviews yet, I should 
    see a prompt encouraging me to leave the first review.
As a site visitor or authenticated user, I want to see the 
    average rating for the spot rounded to the nearest single 
    decimal place, followed by the number of reviews posted for 
    that spot.

Acceptance Criteria
When viewing the home page, each spot tile in the tile list must
    show the average star rating for that spot immediately below the
    thumbnail of the tile and to the right of the spot's name. The 
    average star rating should have a star icon followed by the 
    average star rating of all the reviews for that spot as a 
    decimal (e.g. 3.0 or 4.89, NOT 3 or 5).
✓When viewing a spot's detail page, the review summary info should
    be in two different places, the callout information box and the 
    heading before the list of reviews. The review summary info 
    should show the average star rating of all the reviews for that 
    spot and the review count for that spot.
The average star rating in the spot's detail page should have a 
    star icon followed by the average star rating of all the reviews 
    for that spot as a decimal (e.g. 3.0 or 4.89, NOT 3 or 5).
✓  If there are no reviews for the spot, the text, "New", should be
    next to the star icon instead.
✓  The review count on the spot's detail page should be an integer 
    representing the total number of reviews for that spot followed 
    by the text "Reviews" (e.g. "4 Reviews").
✓ If the review count is 1, it should show "1 Review" (not "1 Reviews").
✓ There should be a centered dot (·) between the star rating and the review count
✓ If the review count is zero (there are no reviews yet for this spot), it should 
    not show the centered dot or the review count (only the average
    star rating should be displayed)
✓ When viewing the spot's detail page, show a list of the reviews for the spot below
    the spot's information with the newest reviews at the top, and 
    the oldest reviews at the bottom.
✓ Each review in the review list must include: The reviewer's first name, the month   
    and the year that the review was posted (e.g. December 2022), 
    and the review comment text.
✓ If no reviews have been posted yet and the current user is logged-in and is
    NOT the owner of the spot, replace the reviews list with the 
    text "Be the first to post a review!"
*/
import { csrfFetch } from "./csrf";
//----------------------------------------------------------------------
const LOAD_REVIEWS = "reviews/LOAD_REVIEWS";
const ADD_REVIEW = "reviews/ADD_REVIEW";
const REMOVE_REVIEW = "reviews/REMOVE_REVIEW";
//-----------------------------------------------------------------------

//action creators
const loadReviews = (reviews) => {
  return {
    type: LOAD_REVIEWS,
    payload: reviews,
  };
};

const addReview = (payload) => {
  return {
    type: ADD_REVIEW,
    payload,
  };
};

const removeReview = (id) => {
  return {
    type: REMOVE_REVIEW,
    payload: id,
  };
};
//---------------------------------------------------------------
//thunk action creators

//get reviews for a spot
export const getReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const data = await res.json();
    dispatch(loadReviews(data));
    return data;
  }
  return res;
};

//create a review for a spot
export const createReview = (spotId, review, stars) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ review, stars }),
  });
  if (res.ok) {
    const data = await res.json();
    // dispatch(addReview(data));
    dispatch(loadReviews(spotId));
    return data;
  }
  return res;
};

//delete a review from a spot
export const deleteReview = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(removeReview(reviewId));
    return data;
  }
  return res;
};

//-----------------------------------------------------------------
//reviews reducer
const initialState = {};
const reviewsReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case LOAD_REVIEWS:
      return { ...action.payload };
    case ADD_REVIEW:
      newState[action.payload.id] = action.payload;
      return newState;
    case REMOVE_REVIEW:
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
};

export default reviewsReducer;
