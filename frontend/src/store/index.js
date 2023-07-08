import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import spotReducer from "./spots";
import reviewsReducer from "./reviews";
import singleSpotReducer from "./singleSpot";
import sessionUserSpotsReducer from "./sessionUserSpots";
import imageReducer from "./images";

const rootReducer = combineReducers({
  // add reducer functions here
  session: sessionReducer,
  allSpots: spotReducer,
  singleSpot: singleSpotReducer,
  userSpots: sessionUserSpotsReducer,
  images: imageReducer,
  reviews: reviewsReducer,
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
