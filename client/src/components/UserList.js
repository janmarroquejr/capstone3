import React, { useState } from "react";
import { MDBDataTable } from "mdbreact";
import { Container } from "react-bulma-components";
import { getUsersQuery } from "../queries/queries";
import { updateUserMutation, deleteUserMutation } from "../queries/mutations";
import { flowRight as compose } from "lodash";
import { graphql } from "react-apollo";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useAlert } from "react-alert";
import { Redirect } from "react-router-dom";

const UserList = props => {
  const alert = useAlert();
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  let dataList = props.data;

  if (
    localStorage.getItem("role") === "user" ||
    localStorage.getItem("role") === null
  ) {
    return <Redirect to="/restricted" />;
  }

  //update modal functions
  const roleChangeHandler = e => {
    setRole(e.target.value);
  };

  const changeRole = () => {
    if (role === "") {
      alert.error("Please select a role for this user");
    } else {
      props.updateUser({
        variables: {
          id: userId,
          role: role
        },
        refetchQueries: [{ query: getUsersQuery }]
      });
    }
    setShow(false);
    setRole("");
  };

  const handleClose = () => setShow(false);

  const handleShow = e => {
    setShow(true);
    setUserId(e.target.value);
  };
  //end of update modal functions

  //delete modal functions
  const showDelete = e => {
    setShowDeleteModal(true);
    setDeleteId(e.target.value);
  };

  const closeDeleteModal = () => {
    props.deleteUser({
      variables: { id: deleteId },
      refetchQueries: [{ query: getUsersQuery }]
    });
    setShowDeleteModal(false);
    setDeleteId("");
    alert.success("User deleted!");
  };

  const closeModalOnly = () => {
    setShowDeleteModal(false);
  };
  //end of delete modal functions

  let userList;
  if (dataList.getUsers === undefined) {
    userList = [
      {
        firstname: <Spinner animation="border" />
      }
    ];
  } else {
    userList = dataList.getUsers.map(user => {
      return {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        username: user.username,
        contact: user.contact,
        role: user.role,
        createdAt: user.createdAt.toString(),
        updatedAt: user.updatedAt,
        action: [
          <div>
            <button
              className="btn btn-primary"
              onClick={handleShow}
              value={user.id}
            >
              Change role
            </button>
            <button
              className="btn btn-danger"
              onClick={showDelete}
              value={user.id}
            >
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
        label: "First Name",
        field: "firstname",
        sort: "asc",
        width: 150
      },
      {
        label: "Last Name",
        field: "lastname",
        sort: "asc",
        width: 270
      },
      {
        label: "E-mail",
        field: "email",
        sort: "asc",
        width: 200
      },
      {
        label: "Username",
        field: "username",
        sort: "asc",
        width: 200
      },
      {
        label: "Contact",
        field: "contact",
        sort: "asc",
        width: 100
      },
      {
        label: "Role",
        field: "role",
        sort: "asc",
        width: 150
      },
      {
        label: "Created at",
        field: "createdAt",
        sort: "asc",
        width: 100
      },
      {
        label: "Updated At",
        field: "updatedAt",
        sort: "asc",
        width: 100
      },
      {
        label: "Action",
        field: "action",
        sort: "asc",
        width: 180
      }
    ],
    rows: userList
  };

  return (
    <Container id="user-list">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="select is-fullwidth">
            <select onChange={roleChangeHandler}>
              <option selected disabled value="">
                Select a role
              </option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={changeRole}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={closeModalOnly}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModalOnly}>
            Close
          </Button>
          <Button variant="danger" onClick={closeDeleteModal}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <MDBDataTable id="user-table" striped bordered hover data={data} />
    </Container>
  );
};

export default compose(
  graphql(getUsersQuery),
  graphql(updateUserMutation, { name: "updateUser" }),
  graphql(deleteUserMutation, { name: "deleteUser" })
)(UserList);
