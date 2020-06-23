import React, { useState } from "react";
import { MDBDataTable } from "mdbreact";
import { Container } from "react-bulma-components";
import { getRoomsQuery } from "../queries/queries";
import { flowRight as compose } from "lodash";
import { graphql } from "react-apollo";
import { Redirect, Link } from "react-router-dom";
import { Modal, Button, Spinner } from "react-bootstrap";
import { toBase64, nodeServer } from "../function.js";
import { createRoomMutation, deleteRoomMutation } from "../queries/mutations";

const RoomList = props => {
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const closeModalOnly = () => setShowDeleteModal(false);

  const showModal = e => {
    setDeleteId(e.target.value);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    props.deleteRoom({
      variables: { id: deleteId },
      refetchQueries: [{ query: getRoomsQuery }]
    });
    setShowDeleteModal(false);
    setDeleteId("");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const toEditPage = () => {
    return <Redirect to="/editroom" />;
  };

  const fileRef = React.createRef();
  let roomList;

  let dataList = props.data;

  if (
    localStorage.getItem("role") === "user" ||
    localStorage.getItem("role") === null
  ) {
    return <Redirect to="/restricted" />;
  }

  const nameHandler = e => {
    setName(e.target.value);
  };

  const descriptionHandler = e => {
    setDescription(e.target.value);
  };

  const priceHandler = e => {
    setPrice(e.target.value);
  };

  const addRoomHandler = e => {
    e.preventDefault();
    let newRoom = {
      name: name,
      description: description,
      price: parseInt(price, 10),
      image: imagePath
    };
    props.createRoom({
      variables: newRoom,
      refetchQueries: [{ query: getRoomsQuery }]
    });
    setName("");
    setDescription("");
    setPrice("");
    setImagePath("");
    setShow(false);
  };

  const imagePathHandler = () => {
    toBase64(fileRef.current.files[0]).then(encodedFile => {
      // use this as variable for addRoom mutation
      setImagePath(encodedFile);
    });
  };

  if (dataList.getRooms === undefined) {
    roomList = [
      {
        image: <Spinner animation="border" />
      }
    ];
  } else {
    roomList = dataList.getRooms.map(room => {
      return {
        image: <img id="room-img" src={nodeServer() + room.image} alt="" />,
        name: room.name,
        description: room.description,
        price: room.price,
        availability: room.isAvailable ? "Available" : "Not available",
        action: [
          <div>
            <Link className="btn btn-primary" to={"/roomlist/edit/" + room.id}>
              Edit
            </Link>
            <button onClick={showModal} value={room.id}>
              Delete
            </button>
          </div>
        ]
      };
    });
  }
  const data = {
    columns: [
      {
        label: "Image",
        field: "image",
        sort: "asc",
        width: 150
      },
      {
        label: "Name",
        field: "name",
        sort: "asc",
        width: 150
      },
      {
        label: "Description",
        field: "description",
        sort: "asc",
        width: 270
      },
      {
        label: "Price",
        field: "price",
        sort: "asc",
        width: 200
      },
      {
        label: "Availability",
        field: "availability",
        sort: "asc",
        width: 200
      },
      {
        label: "Action",
        field: "action",
        sort: "asc",
        width: 180
      }
    ],
    rows: roomList
  };

  let addRoom = (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>ADD ROOM??!?!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              className="input"
              type="text"
              id="name"
              onChange={nameHandler}
              value={name}
            />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              className="textarea"
              type="text"
              onChange={descriptionHandler}
              value={description}
            />
          </div>
          <div className="field">
            <label htmlFor="price">Price</label>
            <input
              className="input"
              type="number"
              id="price"
              onChange={priceHandler}
              value={price}
            />
          </div>
          <div className="field">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              accept="image/png"
              ref={fileRef}
              onChange={imagePathHandler}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={addRoomHandler}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );

  let deleteRoom = (
    <Modal show={showDeleteModal} onHide={closeModalOnly}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        This doesn't physically delete a room from your hotel. It only means
        users can't see it when they book. Are you sure?
      </Modal.Body>
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
    <Container id="user-list">
      <button className="btn btn-info" onClick={handleShow}>
        &#43;
      </button>
      {addRoom}
      {deleteRoom}
      <MDBDataTable id="user-table" striped bordered hover data={data} />
    </Container>
  );
};

export default compose(
  graphql(getRoomsQuery),
  graphql(createRoomMutation, { name: "createRoom" }),
  graphql(deleteRoomMutation, { name: "deleteRoom" })
)(RoomList);
