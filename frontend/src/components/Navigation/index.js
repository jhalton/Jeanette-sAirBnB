import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import * as sessionActions from "../../store/session";
import "./Navigation.css";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li className="nav-button">
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <>
        <li>
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
        </li>
        <li>
          <NavLink to="/signup" className="nav-button">
            Sign Up
          </NavLink>
        </li>
      </>
    );
  }

  return (
    <div className="nav-link-div">
      <ul className="nav-link-ul">
        <li>
          <NavLink exact to="/" className="nav-button">
            Home
          </NavLink>
        </li>
        {isLoaded && sessionLinks}
      </ul>
    </div>
  );
}

export default Navigation;
