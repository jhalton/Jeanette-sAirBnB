import { csrfFetch } from "./csrf";

//--------------------------------------------------------------------

const LOAD_SPOTS = "spot/LOAD_SPOT";
const RESET_ALL_SPOTS = "spot/RESET_ALL_SPOTS";
const DELETE_FROM_ALL_SPOTS = "spots/DELETE_FROM_ALL_SPOTS";

export const loadSpot = (payload) => {
  return {
    type: LOAD_SPOTS,
    payload,
  };
};

export const resetSpots = () => {
  return {
    type: RESET_ALL_SPOTS,
  };
};

export const deleteSpot = (id) => {
  return {
    type: DELETE_FROM_ALL_SPOTS,
    payload: id,
  };
};

//--------------------------------------------------------------------
//get all spots
export const getAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");

  if (res.ok) {
    const data = await res.json();
    dispatch(loadSpot(data));
    return data;
  }

  return res;
};

//reset spots state
export const resetAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");

  if (res.ok) {
    const data = await res.json();
    dispatch(resetAllSpots());
    return data;
  }
  return res;
};

//delete spot from state
export const deleteFromAllSpots = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`, { method: "DELETE" });
  if (res.ok) {
    const data = await res.json();
    dispatch(deleteFromAllSpots(id));
    return data;
  }
  return res;
};

//--------------------------------------------------------------------

//reducer
const initialState = {};
const spotReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case LOAD_SPOTS:
      const el = {};
      action.payload.Spots.forEach((spot) => {
        el[spot.id] = spot;
      });
      return el;
    case RESET_ALL_SPOTS:
      newState = {};
      return newState;
    case DELETE_FROM_ALL_SPOTS:
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
};

export default spotReducer;
