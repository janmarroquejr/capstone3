import React, { useState } from "react";
import { Container, Columns, Heading } from "react-bulma-components";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import {
  getRoomsQuery,
  getBookingsQuery,
  getUsersQuery
} from "../queries/queries";

import {
  createBookingMutation,
  changeRoomAvailabilityMutation
} from "../queries/mutations";

import { flowRight as compose } from "lodash";
import { graphql } from "react-apollo";
import { Redirect } from "react-router-dom";
import { useAlert } from "react-alert";

const Reservation = props => {
  const alert = useAlert();
  let bookingsArray = [];
  let unavailableRooms = [];
  let data = props.data;
  let roomList;
  const [roomId, setRoomId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  if (localStorage.getItem("role") === "admin") {
    alert.error("Admin accounts cannot book");
    return <Redirect to="/home" />;
  }

  if (data.getRooms === undefined) {
    roomList = <option>Select room</option>;
  } else {
    roomList = data.getRooms.map(room => {
      return <option value={room.id}>{room.name}</option>;
    });
    unavailableRooms = data.getRooms.map(room => {
      if (room.isAvailable === false) {
        return room.id;
      }
      return null;
    });
  }

  if (props.getBookings.getBookings === undefined) {
    return null;
  } else {
    bookingsArray = props.getBookings.getBookings.map(booking => {
      if (booking.isActive === true) {
        return booking.user.username;
      }
      return null;
    });
  }

  const { RangePicker } = DatePicker;
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  }

  const dateHandler = (_, dateString) => {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  };

  const roomHandler = e => {
    setRoomId(e.target.value);
  };

  const submitHandler = e => {
    e.preventDefault();
    let newBooking = {
      roomId: roomId,
      userId: localStorage.getItem("id"),
      startDate: startDate,
      endDate: endDate
    };
    let changeAvailability = {
      id: roomId,
      isAvailable: false
    };
    if (roomId === "") {
      alert.error("Please select a room");
    } else {
      if (bookingsArray.includes(localStorage.getItem("username"))) {
        alert.error("You already have an active reservation!");
      } else if (unavailableRooms.includes(roomId)) {
        alert.error("The room you have selected is unavailable!");
      } else {
        props.createBooking({
          variables: newBooking
        });
        props.changeRoomAvailability({
          variables: changeAvailability,
          refetchQueries: [
            { query: getBookingsQuery },
            { query: getRoomsQuery },
            { query: getUsersQuery }
          ]
        });

        alert.success("Reserved successfully!");
      }
    }
  };

  return (
    <Container>
      <Columns>
        <Columns.Column
          size="half"
          offset="one-quarter"
          className="reserve animated fadeIn"
        >
          <Heading className="has-text-light">Book a room</Heading>
          <div className="textbox">
            <input
              disabled
              value={localStorage.getItem("firstname")}
              placeholder="First name"
              id="firstname"
            />
          </div>
          <div className="textbox">
            <input
              disabled
              value={localStorage.getItem("lastname")}
              placeholder="Last name"
              id="lastname"
            />
          </div>
          <div className="textbox">
            <input
              disabled
              value={localStorage.getItem("email")}
              type="email"
              placeholder="E-mail"
              id="email"
            />
          </div>
          <div className="textbox">
            <input
              type="tel"
              pattern="[0-9]{4}-[0-9]{3}-[0-9]{4}"
              placeholder="09XX-XXX-XXXX"
              id="contact"
              value={localStorage.getItem("contact")}
              disabled
            />
          </div>
          <form>
            <div className="">
              <label>Room type</label>
              <div className="select is-fullwidth">
                <select onChange={roomHandler}>
                  <option value="" selected disabled>
                    Select a room
                  </option>
                  {roomList}
                </select>
              </div>
            </div>
            <div className="date-picker">
              <label htmlFor="date-picker">
                Select check-in and check-out date:{" "}
              </label>
              <div>
                <RangePicker
                  id="date-picker"
                  onChange={dateHandler}
                  disabledDate={disabledDate}
                  format="YYYY-MM-DD"
                  style={{ display: "block" }}
                />
              </div>
            </div>
            <span id="booking-warning">Check-in time: 2:00 PM</span>
            <br />
            <span id="booking-warning">Check-out time: 12:00 PM</span>
            <button
              className="login-btn"
              onClick={submitHandler}
              type="submit"
              block
              dark
            >
              Reserve
            </button>
          </form>
        </Columns.Column>
      </Columns>
    </Container>
  );
};

export default compose(
  graphql(getBookingsQuery, { name: "getBookings" }),
  graphql(getRoomsQuery),
  graphql(createBookingMutation, { name: "createBooking" }),
  graphql(changeRoomAvailabilityMutation, { name: "changeRoomAvailability" })
)(Reservation);
