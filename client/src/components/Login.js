import React, { useState } from "react";
import { loginUserMutation } from "../queries/mutations";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { useAlert } from "react-alert";
import { Redirect } from "react-router-dom";

const Login = props => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const alert = useAlert();
  if (localStorage.getItem("id") != null) {
    alert.error("You are already logged in!");
    return <Redirect to="/home" />;
  }

  const usernameHandler = e => {
    setUsername(e.target.value);
  };

  const passwordHandler = e => {
    setPassword(e.target.value);
  };

  const loginHandler = e => {
    e.preventDefault();
    props
      .loginUser({
        variables: { username: username, password: password }
      })
      .then(res => {
        let data = res.data.loginUser;
        if (data === null) {
          alert.error("Username/password is incorrect.");
        } else {
          setLoginSuccess(true);
          localStorage.setItem("id", data.id);
          localStorage.setItem("username", data.username);
          localStorage.setItem("firstname", data.firstname);
          localStorage.setItem("lastname", data.lastname);
          localStorage.setItem("email", data.email);
          localStorage.setItem("contact", data.contact);
          localStorage.setItem("role", data.role);
          props.updateSession();
        }
      });
  };

  if (loginSuccess) {
    return <Redirect to="/home" />;
  }

  return (
    <div className="login-box animated fadeIn">
      <h1>Login</h1>
      <form onSubmit={loginHandler}>
        <div className="textbox">
          <i class="fas fa-user"></i>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={usernameHandler}
          />
        </div>
        <div className="textbox">
          <i class="fas fa-lock"></i>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={passwordHandler}
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
        <span className="admin-details">Admin username: "admin"</span>
        <br />
        <span className="admin-details">Admin password: "password123</span>
      </form>
    </div>
  );
};

export default compose(graphql(loginUserMutation, { name: "loginUser" }))(
  Login
);
