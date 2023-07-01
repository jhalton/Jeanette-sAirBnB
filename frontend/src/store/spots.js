/*
Spot store to handle all the spot things.
*/
import { csrfFetch } from "./csrf";

//variables for action creators
const LOAD_SPOTS = "spot/LOAD_SPOT";
const ADD_SPOT = "spot/ADD_SPOT";
const REMOVE_SPOT = "spot/REMOVE_SPOT";
const LOAD_ONE_SPOT = "spot/LOAD_ONE_SPOT";

//regular action creators
export const loadSpot = (payload = null) => {
  return {
    type: LOAD_SPOTS,
    payload,
  };
};

export const loadOneSpot = (id) => {
  return {
    type: LOAD_ONE_SPOT,
    payload: id,
  };
};

export const addSpot = (data) => {
  return {
    type: ADD_SPOT,
    payload: data,
  };
};

export const removeSpot = () => {
  return {
    type: REMOVE_SPOT,
    // payload,
  };
};

//thunk action creators

//get all spots
export const getAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const data = await res.json();
  dispatch(loadSpot(data));
  return res;
};

//get spot details
export const getSpotDetails = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`);

  const data = await res.json();

  dispatch(loadOneSpot(data));
  return data;
};

//create new spot
export const createSpot = (data) => async (dispatch) => {
  const {
    country,
    address,
    city,
    state,
    lat,
    lng,
    description,
    name,
    price,
    previewImage,
  } = data;
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
      previewImage,
    }),
  });

  const newSpot = await res.json();
  console.log("LOOOOK HEEEERE THUNK", newSpot);
  dispatch(addSpot(newSpot.data));
  return newSpot;
};

//get spots of current user
export const getCurrentUserSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/me/spots");
  const data = await res.json();
  console.log("THUNK DATA");
  dispatch(loadSpot(data));
  return res;
};

//reducer
const initialState = {};
const spotReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case LOAD_SPOTS:
      action.payload.Spots.forEach((spot) => {
        newState = {
          ...newState,
          [spot.id]: spot,
        };
      });
      return newState;
    case LOAD_ONE_SPOT:
      newState[action.payload.id] = action.payload;
      return newState;
    case ADD_SPOT:
      newState.data = action.payload;
      return newState;
    default:
      return state;
  }
};

export default spotReducer;
