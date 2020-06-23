import React, { useState } from "react";
import { Container } from "react-bulma-components";
import { Redirect } from "react-router-dom";
import { useAlert } from "react-alert";
import { Table, Spinner, Modal, Button } from "react-bootstrap";
import {
  getUserQuery,
  getUsersQuery,
  getBookingsQuery,
  getRoomsQuery
} from "../queries/queries";
import {
  deleteBookingMutation,
  makeRoomAvailableMutation
} from "../queries/mutations";
import { flowRight as compose } from "lodash";
import { graphql } from "react-apollo";

const MyBookings = props => {
  const alert = useAlert();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cancelId, setCancelId] = useState("");
  const [roomId, setRoomId] = useState("");

  if (localStorage.getItem("role") === "admin") {
    alert.error("You can't have bookings");
    return <Redirect to="/home" />;
  }
  let data = props.data;
  const closeModalOnly = () => setShowDeleteModal(false);

  const cancelModal = e => {
    setShowDeleteModal(true);
    setCancelId(e.target.value);
    setRoomId(e.target.id);
  };

  const closeDeleteModal = () => {
    props.deleteBooking({
      variables: { id: cancelId }
    });
    props.makeRoomAvailable({
      variables: { id: roomId, isAvailable: true },
      refetchQueries: [
        { query: getUsersQuery },
        { query: getBookingsQuery },
        { query: getRoomsQuery }
      ]
    });
    setShowDeleteModal(false);
  };

  let tableData;
  if (data.getUser === undefined) {
    tableData = (
      <tr>
        <td colSpan={4}>
          <Spinner animation="border" />
        </td>
      </tr>
    );
  } else if(data.getUser.bookings === null){
    tableData = (
      <tr>
        <td colspan={5}>Nothing to show</td>
      </tr>
    )
  }

  else {
    tableData = data.getUser.bookings.map(book => {
      return (
        <tr>
          <td>{book.room.name}</td>
          <td>{book.startDate}</td>
          <td>{book.endDate}</td>
          <td>{book.isActive ? "Pending" : "Completed"}</td>
          <td>
            {book.isActive ? (
              <button
                onClick={cancelModal}
                value={book.id}
                id={book.room.id}
                className="btn btn-danger"
              >
                Cancel
              </button>
            ) : null}
          </td>
        </tr>
      );
    });
  }

  let deleteBooking = (
    <Modal show={showDeleteModal} onHide={closeModalOnly}>
      <Modal.Header closeButton>
        <Modal.Title>Cancel Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>This action is irreversible. Are you sure?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModalOnly}>
          No
        </Button>
        <Button variant="danger" onClick={closeDeleteModal}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <Container>
      <Table striped bordered hover variant="dark">
        {deleteBooking}
        <thead>
          <tr>
            <th className="text-white">Room</th>
            <th className="text-white">Start Date</th>
            <th className="text-white">End Date</th>
            <th className="text-white">Status</th>
            <th className="text-white">Action</th>
          </tr>
        </thead>
        <tbody>{tableData}</tbody>
      </Table>
    </Container>
  );
};

export default compose(
  graphql(deleteBookingMutation, { name: "deleteBooking" }),
  graphql(makeRoomAvailableMutation, { name: "makeRoomAvailable" }),
  graphql(getUserQuery, {
    options: props => {
      return {
        variables: { id: props.match.params.id }
      };
    }
  })
)(MyBookings);
