//Create drop down menu to hold modals for login and signup
//This will have the profile icon plus hamburger menu
//When logged in, this will contain info about the user
import React, { useState } from "react";
import OpenModalButton from "../OpenModalButton";
import { useSelector } from "react-redux";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import ProfileButton from "./ProfileButton";

const DropDownMenu = ({ isLoaded }) => {
  const [dropDown, setDropDown] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className={"nav-button profile-button"}>
        <ProfileButton user={sessionUser} />
      </div>
    );
  } else {
    sessionLinks = (
      <>
        <ul>
          <li className="modal-button">
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />

            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
          </li>
        </ul>
      </>
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
      {isLoaded && sessionLinks}
    </div>
  );
};

export default DropDownMenu;
