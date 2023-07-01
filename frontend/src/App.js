import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";
import SpotDetail from "./components/Spots/SpotDetail";
import CreateNewSpot from "./components/Spots/CreateNewSpot";
import ManageSpots from "./components/Spots/ManageSpots";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <Spots />
          </Route>
          <Route path="/api/spots/:spotId">
            <SpotDetail />
          </Route>
          <Route path="/api/spots">
            <CreateNewSpot />
          </Route>
          <Route path="/api/users/me/spots">
            <ManageSpots />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
