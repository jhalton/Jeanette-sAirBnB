import React, { useEffect, useState, useRef } from "react";
import OpenModalButton from "../OpenModalButton";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

import { logout } from "../../store/session";
import { resetCurrentUserSpots } from "../../store/sessionUserSpots";

const DropDownMenu = ({ isLoaded }) => {
  const [dropDown, setDropDown] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();
  const ulRef = useRef();
  const dispatch = useDispatch();

  const logoutUser = async (e) => {
    e.preventDefault();
    dispatch(logout());
    dispatch(resetCurrentUserSpots());
    history.push("/");
  };

  const manageSpots = (e) => {
    e.preventDefault();
    history.push("/users/me/spots");
  };

  //-----------------------------------------------------

  useEffect(() => {
    if (!dropDown) return;

    const closeMenu = (e) => {
      if (!ulRef.current?.contains(e.target)) {
        setDropDown(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [dropDown]);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className=" profile-button session-links-container">
        <ul className="drop-down-ul">
          <li className="drop-down-li">Hello, {sessionUser.firstName}</li>
          <li className="drop-down-li drop-down-email">{sessionUser.email}</li>
          <li className="drop-down-li">
            <button className="drop-down-button" onClick={manageSpots}>
              Manage Spots
            </button>
          </li>
          <li className="drop-down-li">
            <button className="drop-down-button" onClick={logoutUser}>
              Log Out
            </button>
          </li>
        </ul>
      </div>
    );
  } else {
    sessionLinks = (
      <div className="session-links-container">
        <ul className="drop-down-modals-ul">
          <li className="drop-down-li">
            <OpenModalButton
              className="drop-down-button"
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
          </li>
          <li className="drop-down-li">
            <OpenModalButton
              className="drop-down-button"
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
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
