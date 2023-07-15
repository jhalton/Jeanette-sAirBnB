import { csrfFetch } from "./csrf";

const LOAD_USER_SPOTS = "sessionUserSpots/LOAD_USER_SPOTS";
const ADD_SPOT = "sessionUserSpots/ADD_SPOT";
const REMOVE_SPOT = "sessionUserSpots/REMOVE_SPOT";

export const loadUserSpots = (payload = null) => {
  return {
    type: LOAD_USER_SPOTS,
    payload,
  };
};

export const addSpot = (data) => {
  return {
    type: ADD_SPOT,
    payload: data,
  };
};

export const removeSpot = (id) => {
  return {
    type: REMOVE_SPOT,
    payload: id,
  };
};
//----------------------------------------------------------------
//get spots of current user
export const getCurrentUserSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/me/spots");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadUserSpots(data));
    return data;
  }
  return res;
};
//----------------------------------------------------------------
//create new spot
export const createSpot = (data) => async (dispatch) => {
  const { country, address, city, state, lat, lng, description, name, price } =
    data;

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
    }),
  });

  if (res.ok) {
    const newSpot = await res.json();
    dispatch(addSpot(newSpot));

    return newSpot;
  }
  return res;
};
//----------------------------------------------------------------
//remove a spot
export const deleteSpot = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`, {
    method: "DELETE",
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(removeSpot(id));
    return data;
  }
  return res;
};
//----------------------------------------------------------------
//edit a spot
export const updateSpot = (id, data) => async (dispatch) => {
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

  const res = await csrfFetch(`/api/spots/${id}/update`, {
    method: "PUT",
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

  if (res.ok) {
    const newSpot = await res.json();
    dispatch(addSpot(newSpot));
    return newSpot;
  }
  return res;
};

//----------------------------------------------------------------
//reducer
const initialState = {};
const sessionUserSpotsReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case LOAD_USER_SPOTS:
      console.log("userSpotsReducer", action.payload.Spots);
      action.payload.Spots?.forEach((spot) => {
        newState = {
          ...newState,
          [spot.id]: spot,
        };
      });
      return newState;
    case ADD_SPOT:
      newState[action.payload.id] = action.payload;
      return newState;
    case REMOVE_SPOT:
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
};

export default sessionUserSpotsReducer;
