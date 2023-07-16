import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";
import SpotDetail from "./components/Spots/SpotDetail";
import CreateNewSpot from "./components/Spots/CreateNewSpot";
import ManageSpots from "./components/Spots/ManageSpots";
import UpdateSpot from "./components/Spots/UpdateSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  return (
    <>
      {/* <div id="navigation"> */}
      <Navigation isLoaded={isLoaded} />
      {/* </div> */}
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <Spots />
          </Route>
          <Route path="/spots/:spotId/update">
            <UpdateSpot />
          </Route>
          <Route path="/spots/:spotId">
            <SpotDetail />
          </Route>
          <Route exact path="/spots">
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
