import React, { useState } from "react";
import { Container, Columns, Heading } from "react-bulma-components";
import { useAlert } from "react-alert";
import { createUserMutation } from "../queries/mutations";
import { getUsersQuery } from "../queries/queries"
import { flowRight as compose } from "lodash";
import { graphql } from "react-apollo";
import { Redirect } from "react-router-dom"

const Register = props => {
  let data = props.data
  let usersArray = []
  let emailsArray = []
  
  const alert = useAlert();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [contact, setContact] = useState("");
  const [success, setSuccess] = useState(false)

  if(data.getUsers === undefined){
    return null
  }else{
    usersArray = data.getUsers.map(user=>{
      return user.username
    });
    emailsArray = data.getUsers.map(user=>{
      return user.email
    });
  }

  const redirectToHome = () => {
    return <Redirect to="/home"/>
  }

  const submitHandler = e => {
    e.preventDefault();
    let newUser = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      username: username,
      password: password,
      contact: contact
    };

    if (firstname === "") {
      alert.error("What is your first name?");
    } else if (lastname === "") {
      alert.error("What is your last name?");
    } else if (email === "") {
      alert.error("What is your email address?");
    } else if (username === "") {
      alert.error("What username would you want to use?");
    } else if(usersArray.includes(username)){
      alert.error("Username is already taken!")
    } else if(emailsArray.includes(email)){
      alert.error("Someone else is already using this e-mail.")
    } else if (password === "") {
      alert.error("You need a password.");
    } else if (confPassword === "") {
      alert.error("You need to confirm your password.");
    } else if (password !== confPassword) {
      alert.error("Passwords don't match");
    } else if (contact === "") {
      alert.error("What is your contact number?");
    } else {
      props.createUser({
        variables: newUser,
        refetchQueries: [{query: getUsersQuery}]
      })

      setFirstname("");
      setLastname("");
      setEmail("");
      setUsername("");
      setPassword("");
      setConfPassword("");
      setContact("");
      setSuccess(true)
      alert.success("Registered Successfully!");
    }
  };

  if(success){
    redirectToHome()
  }

  const firstnameHandler = e => {
    setFirstname(e.target.value);
  };

  const lastnameHandler = e => {
    setLastname(e.target.value);
  };

  const emailHandler = e => {
    setEmail(e.target.value);
  };

  const usernameHandler = e => {
    setUsername(e.target.value);
  };

  const passwordHandler = e => {
    setPassword(e.target.value);
  };

  const confPasswordHandler = e => {
    setConfPassword(e.target.value);
  };

  const contactHandler = e => {
    setContact(e.target.value);
  };

  return (
    <Container>
      <Columns>
        <Columns.Column
          size="half"
          offset="one-quarter"
          className="reserve animated fadeIn"
        >
          <Heading className="has-text-light">Register</Heading>
          <form>
            <div className="textbox">
              <input
                placeholder="First name"
                id="firstname"
                value={firstname}
                onChange={firstnameHandler}
              />
            </div>
            <div className="textbox">
              <input
                value={lastname}
                onChange={lastnameHandler}
                placeholder="Last name"
                id="lastname"
              />
            </div>
            <div className="textbox">
              <input
                type="email"
                placeholder="E-mail"
                id="email"
                value={email}
                onChange={emailHandler}
              />
            </div>
            <div className="textbox">
              <input
                type="text"
                placeholder="Username"
                id="username"
                value={username}
                onChange={usernameHandler}
              />
            </div>
            <div className="textbox">
              <input
                type="password"
                placeholder="Password"
                id="password"
                value={password}
                onChange={passwordHandler}
              />
            </div>
            <div className="textbox">
              <input
                type="password"
                placeholder="Confirm Password"
                id="confPassword"
                value={confPassword}
                onChange={confPasswordHandler}
              />
            </div>
            <div className="textbox">
              <input
                type="number"
                pattern="[0-9]{4}-[0-9]{3}-[0-9]{4}"
                placeholder="09XX-XXX-XXXX"
                id="contact"
                value={contact}
                onChange={contactHandler}
              />
            </div>

            <button
              onClick={submitHandler}
              className="login-btn"
              type="submit"
              block
              dark
            >
              Register
            </button>
          </form>
        </Columns.Column>
      </Columns>
    </Container>
  );
};

export default compose(
  graphql(createUserMutation, { name: "createUser" }),
  graphql(getUsersQuery)
  )
  (Register);
