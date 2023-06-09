import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navigation.css";
import DropDownMenu from "./DropDownMenu";

// import CreateNewSpot from "../Spots/CreateNewSpot";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  return (
    <div className="nav-link-div">
      <ul className="nav-link-ul">
        <li>
          <NavLink exact to="/" className="nav-button">
            <i className="fa-brands fa-airbnb"></i>
          </NavLink>
        </li>

        <li>
          <div className="nav-right-side">
            <div className="new-spot-navlink-container">
              {sessionUser ? (
                <NavLink to="/api/spots" className="create-new-spot-link">
                  Create a New Spot
                </NavLink>
              ) : null}
            </div>
            <DropDownMenu />
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Navigation;
