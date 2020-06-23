import React, { useState } from "react";
import { Container, Columns, Heading } from "react-bulma-components";
import { getRoomQuery, getRoomsQuery } from "../queries/queries";
import { updateRoomMutation } from "../queries/mutations";
import { flowRight as compose } from "lodash";
import { graphql } from "react-apollo";

const EditRoom = props => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const nameHandler = e => {
    setName(e.target.value);
  };

  const descriptionHandler = e => {
    setDescription(e.target.value);
  };

  const priceHandler = e => {
    setPrice(e.target.value);
  };

  const submitHandler = e => {
    e.preventDefault();
    let updatedRoom = {
      id: props.match.params.id,
      name: name,
      description: description,
      price: parseInt(price, 10)
    };

    props.updateRoom({
      variables: updatedRoom,
      refetchQueries: [{ query: getRoomsQuery }]
    });

    props.history.goBack();
  };

  let data = props.data;

  if (data.getRoom === undefined) {
    console.log("fetching member...");
  } else {
    const setDefaultValues = () => {
      setName(data.getRoom.name);
      setDescription(data.getRoom.description);
      setPrice(data.getRoom.price);
    };
    if (name === "") {
      setDefaultValues();
    }
  }

  return (
    <Container>
      <Columns>
        <Columns.Column
          size="half"
          offset="one-quarter"
          className="reserve animated fadeIn"
        >
          <Heading className="has-text-light">Edit Room</Heading>
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

            <button
              onClick={submitHandler}
              className="login-btn"
              type="submit"
              block
              dark
            >
              Update
            </button>
          </form>
        </Columns.Column>
      </Columns>
    </Container>
  );
};

export default compose(
  graphql(getRoomsQuery),
  graphql(updateRoomMutation, { name: "updateRoom" }),
  graphql(getRoomQuery, {
    options: props => {
      return {
        variables: { id: props.match.params.id }
      };
    }
  })
)(EditRoom);
