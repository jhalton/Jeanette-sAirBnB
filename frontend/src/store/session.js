import { csrfFetch } from "./csrf";

const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";

//set the session user
export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

//remove the session user
export const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

//thunk action creator to set session user
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const res = await csrfFetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      credential,
      password,
    }),
  });

  const data = await res.json();
  dispatch(setUser(data.user));
  return res;
};

//thunk action creator retain the session user info across a refresh
export const restoreUser = () => async (dispatch) => {
  const res = await csrfFetch("/api/session");
  const data = await res.json();
  dispatch(setUser(data.user));
  return res;
};

export const signUpUser = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const res = await csrfFetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await res.json();
  dispatch(setUser(data.user));
  return res;
};

//log out user
export const logout = () => async (dispatch) => {
  const res = await csrfFetch("/api/session", {
    method: "DELETE",
  });

  dispatch(removeUser());
  return res;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;
