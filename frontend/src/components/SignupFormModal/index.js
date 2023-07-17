import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import "./SignupForm.css";

const SignupFormModal = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  console.log("ERRORS", errors);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signUpUser({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Password and Confirm Password fields must be the same",
    });
  };

  return (
    <div className="signup-form">
      <h1 className={"signup-form signup-header"}>Sign Up</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          className="signup-input"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {errors.email && <p className="error">{errors.email}</p>}

        <input
          className="signup-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {errors.username && <p className="error">{errors.username}</p>}

        <input
          className="signup-input"
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        {errors.firstName && <p className="error">{errors.firstName}</p>}

        <input
          className="signup-input"
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        {errors.lastName && <p className="error">{errors.lastName}</p>}

        <input
          className="signup-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errors.password && <p className="error">{errors.password}</p>}

        <input
          className="signup-input"
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}
        <button
          className="signup-button"
          type="submit"
          disabled={
            username.length < 4 ||
            password.length < 6 ||
            confirmPassword.length < 6
          }
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupFormModal;
