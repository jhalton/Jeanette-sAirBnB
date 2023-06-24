import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileButton from "./ProfileButton";
import * as sessionActions from "../../store/session";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li className="nav-button">
        <ProfileButton user={sessionUser} />
        <button onClick={logout}>Log Out</button>
      </li>
    );
  } else {
    sessionLinks = (
      <>
        <li>
          <NavLink to="/login" className="nav-button">
            Log In
          </NavLink>
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
