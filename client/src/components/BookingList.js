import React, { useState } from "react";
import { Container } from "react-bulma-components";
import { Redirect } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import {
  getBookingsQuery,
  getUsersQuery,
  getRoomsQuery
} from "../queries/queries";
import {
  completeBookingMutation,
  makeRoomAvailableMutation
} from "../queries/mutations";
import { flowRight as compose } from "lodash";
import { graphql } from "react-apollo";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useAlert } from "react-alert";

const BookingList = props => {
  const [show, setShow] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isComplete, setIsCompleted] = useState(false);
  const alert = useAlert();
  let bookingList;
  if (
    localStorage.getItem("role") === "user" ||
    localStorage.getItem("role") === null
  ) {
    return <Redirect to="/restricted" />;
  }
  console.log();
  const showCompleteModal = e => {
    let button = document.querySelector(".complete-button");
    setShow(true);
    setBookingId(e.target.value);
    setRoomId(e.target.id);
    if (button.dataset.active === true) {
      setIsCompleted(true);
    }
  };
  const closeModalOnly = () => setShow(false);

  let data = props.data;

  const completeBooking = () => {
    let updateBooking = {
      id: bookingId,
      isActive: false
    };
    let updateRoom = {
      id: roomId,
      isAvailable: true
    };
    if (isComplete === true) {
      alert.error("This booking is already done!");
      setShow(false);
    } else {
      props.completeBooking({
        variables: updateBooking
      });
      props.makeRoomAvailable({
        variables: updateRoom,
        refetchQueries: [
          { query: getBookingsQuery },
          { query: getUsersQuery },
          { query: getRoomsQuery }
        ]
      });
      setShow(false);
      setIsCompleted(false);
      alert.success("Booking successfully completed!");
    }
  };

  if (data.getBookings === undefined) {
    bookingList = [{ name: <Spinner animation="border" /> }];
  } else {
    bookingList = data.getBookings.map(booking => {
      return {
        name: booking.user.firstname + " " + booking.user.lastname,
        contact: booking.user.contact,
        room: booking.room.name,
        status: booking.isActive ? "Pending" : "Done",
        duration: booking.startDate + " to " + booking.endDate,
        action: [
          <div>
            <button
              className="btn btn-primary complete-button"
              name="complete-button"
              value={booking.id}
              id={booking.room.id}
              data-active={booking.isActive}
              onClick={showCompleteModal}
              hidden={booking.isActive ? false : true}
            >
              Complete
            </button>
          </div>
        ]
      };
    });
  }
  const table = {
    columns: [
      {
        label: "Customer Name",
        field: "name",
        sort: "asc",
        width: 150
      },
      {
        label: "Customer Contact",
        field: "contact",
        sort: "asc",
        width: 150
      },
      {
        label: "Room",
        field: "room",
        sort: "asc",
        width: 150
      },
      {
        label: "Status",
        field: "status",
        sort: "asc",
        width: 270
      },
      {
        label: "Duration",
        field: "duration",
        sort: "asc",
        width: 150
      },
      {
        label: "Action",
        field: "action",
        sort: "asc",
        width: 180
      }
    ],
    rows: bookingList
  };

  let completeModal = (
    <Modal show={show} onHide={closeModalOnly}>
      <Modal.Header closeButton>
        <Modal.Title>Complete this booking?</Modal.Title>
      </Modal.Header>
      <Modal.Body>This action is irreversible. Are you sure?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModalOnly}>
          No
        </Button>
        <Button variant="info" onClick={completeBooking}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <Container>
      {completeModal}
      <MDBDataTable id="user-table" striped bordered hover data={table} />
    </Container>
  );
};

export default compose(
  graphql(getBookingsQuery),
  graphql(makeRoomAvailableMutation, { name: "makeRoomAvailable" }),
  graphql(completeBookingMutation, { name: "completeBooking" })
)(BookingList);
