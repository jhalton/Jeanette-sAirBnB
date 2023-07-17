import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

const LoginFormModal = () => {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  const loginDemo = (e) => {
    e.preventDefault();

    dispatch(
      sessionActions.login({ credential: "demo@demo.io", password: "password" })
    ).then(closeModal);
  };

  return (
    <div className="login-form-div">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          className="login-form-input"
          type="text"
          placeholder="Username or Email"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />

        <input
          className="login-form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errors.credential && <p className="error">{errors.credential}</p>}
        <button
          type="submit"
          className="login-button"
          disabled={password.length < 6 || credential.length < 4}
        >
          Log In
        </button>
      </form>
      <button className="demo-user-login-button" onClick={loginDemo}>
        Log in as Demo User
      </button>
    </div>
  );
};

export default LoginFormModal;
