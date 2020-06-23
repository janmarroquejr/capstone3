import React from "react";
import { Container, Columns } from "react-bulma-components";
import { Link } from "react-router-dom";
import { getRoomsQuery } from "../queries/queries";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { nodeServer } from "../function.js";

const Rooms = props => {
  let data = props.data;
  let roomList;
  if (data.getRooms === undefined) {
    roomList = (
      <h1 id="loading-icon">
        <i className="fas fa-spinner fa-spin"></i>
      </h1>
    );
  } else {
    roomList = data.getRooms.map(room => {
      return (
        <Columns.Column size={12}>
          <div className="card mb-3" style={{ width: "100%" }}>
            <div className="row no-gutters">
              <div className="col-md-4">
                <img src={nodeServer() + room.image} alt="..." />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{room.name}</h5>
                  <p className="card-text">{room.description}</p>
                  <p className="card-text">
                    <p className="text-muted">
                      &#8369;
                      {room.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                  </p>
                  <div>
                    <span className="text-danger">
                      {room.isAvailable ? null : "ROOM NOT AVAILABLE"}
                    </span>
                  </div>
                  <Link className="btn btn-primary" to="/reservation">
                    Book
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Columns.Column>
      );
    });
  }
  return (
    <Container id="rooms" className="animated fadeIn">
      <Columns>{roomList}</Columns>
    </Container>
  );
};

export default compose(graphql(getRoomsQuery))(Rooms);
