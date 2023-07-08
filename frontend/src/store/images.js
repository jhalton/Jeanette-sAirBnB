import { csrfFetch } from "./csrf";

const ADD_IMAGE = "images/ADD_IMAGE";

export const addImage = (spotId, data) => {
  return {
    type: ADD_IMAGE,
    payload: { spotId, data },
  };
};
//--------------------------------------------------------------
//create preview image
export const createPreviewImage = (spotId, url) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      preview: true,
    }),
  });
  const imageData = await res.json();
  console.log("CHECKING THUNK PREVIEW IMAGE DATA", imageData);
  if (res.ok) {
    dispatch(addImage(spotId, imageData));
    return imageData;
  }
  return res;
};

//create additional non-preview image
export const createAdditionalImage = (spotId, url) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      preview: false,
    }),
  });
  const imageData = await res.json();
  console.log("CHECKING THUNK IMAGE DATA", imageData);
  if (res.ok) {
    dispatch(addImage(spotId, imageData));
    return imageData;
  }
  return res;
};
//--------------------------------------------------------------
//reducer
const initialState = {};
const imageReducer = (state = initialState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case ADD_IMAGE:
      newState[action.payload.id] = action.payload;
      return newState;
    default:
      return state;
  }
};

export default imageReducer;
