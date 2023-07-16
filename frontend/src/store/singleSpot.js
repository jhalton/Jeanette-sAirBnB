import { csrfFetch } from "./csrf";

const LOAD_ONE_SPOT = "spot/LOAD_ONE_SPOT";

export const loadOneSpot = (id) => {
  return {
    type: LOAD_ONE_SPOT,
    payload: id,
  };
};

//------------------------------------------------------

//get spot details
export const getSpotDetails = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(loadOneSpot(data));
    return data;
  }
  return res;
};

//------------------------------------------------------

const initialState = {};
const singleSpotReducer = (state = initialState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case LOAD_ONE_SPOT:
      newState[action.payload.id] = action.payload;
      return newState;
    default:
      return state;
  }
};

export default singleSpotReducer;
