import { gql } from "apollo-boost";

const getUsersQuery = gql`
  {
    getUsers {
      id
      firstname
      lastname
      role
      email
      username
      password
      contact
      createdAt
      updatedAt
      bookings {
        id
        roomId
        startDate
        endDate
        isActive
        room {
          id
          name
        }
      }
    }
  }
`;

const getUserQuery = gql`
  query($id: String!) {
    getUser(id: $id) {
      id
      firstname
      lastname
      role
      email
      username
      password
      contact
      createdAt
      updatedAt
      bookings {
        id
        roomId
        startDate
        endDate
        isActive
        room {
          id
          name
        }
      }
    }
  }
`;

const getRoomsQuery = gql`
  {
    getRooms {
      id
      name
      description
      price
      isAvailable
      image
    }
  }
`;

const getRoomQuery = gql`
  query($id: String!) {
    getRoom(id: $id) {
      id
      name
      description
      price
      isAvailable
      image
    }
  }
`;

const getBookingsQuery = gql`
  {
    getBookings {
      id
      roomId
      userId
      startDate
      endDate
      isActive
      room {
        id
        name
        isAvailable
      }
      user {
        id
        firstname
        lastname
        username
        email
        contact
      }
    }
  }
`;

export {
  getUsersQuery,
  getRoomsQuery,
  getUserQuery,
  getRoomQuery,
  getBookingsQuery
};
