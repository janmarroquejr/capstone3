import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { flowRight as compose } from "lodash";
import { graphql } from "react-apollo";
import {
  getUserQuery,
  getUsersQuery,
  getRoomsQuery,
  getBookingsQuery
} from "../queries/queries";
import { editUserMutation } from "../queries/mutations";
import { useAlert } from "react-alert";

const EditAccount = props => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [id, setId] = useState("");
  const alert = useAlert();

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

  const contactHandler = e => {
    setContact(e.target.value);
  };

  let data = props.data;

  if (data.getUser === undefined) {
    console.log("fetching user...");
  } else {
    const setDefaultValues = () => {
      setId(props.match.params.id);
      setFirstname(data.getUser.firstname);
      setLastname(data.getUser.lastname);
      setEmail(data.getUser.email);
      setUsername(data.getUser.username);
      setContact(data.getUser.contact);
    };
    if (id === "") {
      setDefaultValues();
    }
  }

  const submitHandler = e => {
    e.preventDefault();
    let updatedUser = {
      id: props.match.params.id,
      firstname: firstname,
      lastname: lastname,
      email: email,
      username: username,
      contact: contact
    };
    props.editUser({
      variables: updatedUser,
      refetchQueries: [
        { query: getUsersQuery },
        { query: getBookingsQuery },
        { query: getRoomsQuery }
      ]
    });
    localStorage.setItem("firstname", firstname);
    localStorage.setItem("lastname", lastname);
    localStorage.setItem("email", email);
    localStorage.setItem("contact", contact);
    localStorage.setItem("username", username);
    alert.success("Updated account!");
    props.updateSession()
    props.history.goBack();
  };

  return (
    <Container>
      <div id="edit-form">
        <form>
          <div className="field">
            <label htmlFor="firstname">First Name</label>
            <input
              className="input"
              type="text"
              id="firstname"
              onChange={firstnameHandler}
              value={firstname}
            />
          </div>
          <div className="field">
            <label htmlFor="lastname">Last Name</label>
            <input
              className="input"
              id="lastname"
              type="text"
              onChange={lastnameHandler}
              value={lastname}
            />
          </div>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              className="input"
              type="email"
              id="email"
              onChange={emailHandler}
              value={email}
            />
          </div>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              className="input"
              type="text"
              id="username"
              value={username}
              onChange={usernameHandler}
            />
          </div>
          <div className="field">
            <label htmlFor="contact">Contact</label>
            <input
              className="input"
              type="number"
              id="contact"
              onChange={contactHandler}
              value={contact}
            />
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            onClick={submitHandler}
          >
            Update
          </button>
        </form>
      </div>
    </Container>
  );
};

export default compose(
  graphql(editUserMutation, { name: "editUser" }),
  graphql(getUserQuery, {
    options: props => {
      return {
        variables: { id: props.match.params.id }
      };
    }
  })
)(EditAccount);
