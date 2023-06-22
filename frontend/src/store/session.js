const SET_USER = "user/SET_USER";
const REMOVE_USER = "user/REMOVE_USER";

//set the session user
export const setUser = (user) => {
  return {
    type: SET_USER,
    user,
  };
};

//remove the session user
export const removeUser = (user) => {
  return {
    type: REMOVE_USER,
    user,
  };
};

const initialState = {};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default sessionReducer;
