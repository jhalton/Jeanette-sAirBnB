//Create drop down menu to hold modals for login and signup
//This will have the profile icon plus hamburger menu
//When logged in, this will contain info about the user
import React, { useState } from "react";
import OpenModalButton from "../OpenModalButton";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import ProfileButton from "./ProfileButton";
import { logout, login } from "../../store/session";

const DropDownMenu = ({ isLoaded }) => {
  const [dropDown, setDropDown] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();
  const dispatch = useDispatch();

  const logoutUser = (e) => {
    e.preventDefault();
    dispatch(logout());
    history.push("/");
  };

  const manageSpots = (e) => {
    e.preventDefault();
    history.push("/api/users/me/spots");
  };

  const loginDemo = (e) => {
    e.preventDefault();
    const demo = "Demo";
    const password = "password";
    dispatch(login(demo, password));
  };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className={"nav-button profile-button"}>
        <ul>
          <li>Hello, {sessionUser.firstName}</li>
          <li>{sessionUser.email}</li>
          <li>
            <button onClick={manageSpots}>Manage Spots</button>
          </li>
          <li>
            <button onClick={logoutUser}>Log Out</button>
          </li>
          {/* <li>
            <ProfileButton user={sessionUser} />
          </li> */}
        </ul>
      </div>
    );
  } else {
    sessionLinks = (
      <div>
        <ul>
          <li className="modal-button">
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
          </li>
          <li className="modal-button">
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
          </li>
          <li>
            <button onClick={loginDemo}>Log In as Demo User</button>
          </li>
        </ul>
      </div>
    );
  }

  const toggleMenu = () => {
    setDropDown(!dropDown);
  };
  return (
    <div className="dropdown">
      <button className="nav-button" onClick={toggleMenu}>
        <i className="fa-solid fa-bars"></i>
        <i className="fas fa-user-circle" />
      </button>

      {dropDown && sessionLinks}
      {/* {isLoaded && sessionLinks} */}
    </div>
  );
};

export default DropDownMenu;
