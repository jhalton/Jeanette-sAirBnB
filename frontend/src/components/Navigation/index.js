import React from "react";
import { NavLink } from "react-router-dom";
// import { useSelector } from "react-redux";
// import ProfileButton from "./ProfileButton";
// import OpenModalButton from "../OpenModalButton";
// import LoginFormModal from "../LoginFormModal";
// import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
import DropDownMenu from "./DropDownMenu";

function Navigation({ isLoaded }) {
  // const sessionUser = useSelector((state) => state.session.user);

  // let sessionLinks;
  // if (sessionUser) {
  //   sessionLinks = (
  //     <li className={"nav-button profile-button"}>
  //       <ProfileButton user={sessionUser} />
  //     </li>
  //   );
  // } else {
  //   sessionLinks = (
  //     <>
  //       <li className="modal-button">
  //         <OpenModalButton
  //           buttonText="Log In"
  //           modalComponent={<LoginFormModal />}
  //         />

  //         <OpenModalButton
  //           buttonText="Sign Up"
  //           modalComponent={<SignupFormModal />}
  //         />
  //       </li>
  //     </>
  //   );
  // }

  return (
    <div className="nav-link-div">
      <ul className="nav-link-ul">
        <li>
          <NavLink exact to="/" className="nav-button">
            Home
          </NavLink>
        </li>
        <li>
          <DropDownMenu />
        </li>
        {/* {isLoaded && sessionLinks} */}
      </ul>
    </div>
  );
}

export default Navigation;
