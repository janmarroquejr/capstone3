import React from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";

const SideBar = props => {
  let adminLinks;

  if (localStorage.getItem("role") === "admin") {
    adminLinks = (
      <Nav className="ml-auto">
        <Nav.Link>
          <Link className="links" to="/userlist">
            User List (Admin Only)
          </Link>
        </Nav.Link>
        <Nav.Link>
          <Link className="links" to="/roomlist">
            Room List (Admin Only)
          </Link>
        </Nav.Link>
        <Nav.Link>
          <Link className="links" to="/bookinglist">
            Booking List (Admin Only)
          </Link>
        </Nav.Link>
      </Nav>
    );
  }

  let userLink;
  let displayRegLink;
  let displayBookLink;

  if (localStorage.getItem("firstname") === null) {
    userLink = (
      <Nav.Link>
        <Link className="links" to="/login">
          Login
        </Link>
      </Nav.Link>
    );
    displayRegLink = (
      <Nav.Link>
        <Link className="links" to="/register">
          Register
        </Link>
      </Nav.Link>
    );
  } else {
    userLink = (
      <NavDropdown className="username-dropdown" title={props.name}>
        <NavDropdown.Item>
          <Link to={"/mybookings/" + localStorage.getItem("id")}>
            My Bookings
          </Link>
        </NavDropdown.Item>

        <NavDropdown.Item>
          <Link to={"/editaccount/" + localStorage.getItem("id")}>
            Edit Account Details
          </Link>
        </NavDropdown.Item>

        <NavDropdown.Item>
          <Link to="/logout">Logout</Link>
        </NavDropdown.Item>
      </NavDropdown>
    );
    displayBookLink = (
      <Nav.Link>
        <Link className="links" to="/reservation">
          Book
        </Link>
      </Nav.Link>
    );
  }

  return (
    <Navbar sticky="top" expand="lg" id="navbar">
      <Navbar.Brand id="brand">Bed&Breakfast++</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="">
          <Nav.Link>
            <Link className="links" to="/home">
              Home
            </Link>
          </Nav.Link>
          {displayBookLink}
          <Nav.Link>
            <Link className="links" to="/rooms">
              Rooms
            </Link>
          </Nav.Link>
        </Nav>

        <Nav>
          {userLink}
          {displayRegLink}
        </Nav>
        {adminLinks}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default SideBar;
