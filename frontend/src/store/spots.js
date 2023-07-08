import { csrfFetch } from "./csrf";

//--------------------------------------------------------------------

const LOAD_SPOTS = "spot/LOAD_SPOT";

export const loadSpot = (payload = null) => {
  return {
    type: LOAD_SPOTS,
    payload,
  };
};

//--------------------------------------------------------------------
//get all spots
export const getAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const data = await res.json();
  dispatch(loadSpot(data));
  return res;
};

//--------------------------------------------------------------------

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
    default:
      return state;
  }
};

export default spotReducer;
