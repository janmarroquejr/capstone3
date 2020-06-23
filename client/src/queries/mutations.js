import { gql } from "apollo-boost";

const createUserMutation = gql`
  mutation(
    $firstname: String!
    $lastname: String!
    $email: String!
    $username: String!
    $password: String!
    $contact: String!
  ) {
    createUser(
      firstname: $firstname
      lastname: $lastname
      email: $email
      username: $username
      password: $password
      contact: $contact
    ) {
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
    }
  }
`;

const loginUserMutation = gql`
  mutation($username: String, $password: String) {
    loginUser(username: $username, password: $password) {
      id
      firstname
      lastname
      email
      username
      contact
      role
    }
  }
`;

const updateUserMutation = gql`
  mutation($id: ID!, $role: String!) {
    updateUser(id: $id, role: $role) {
      role
    }
  }
`;

const deleteUserMutation = gql`
  mutation($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const createRoomMutation = gql`
  mutation($name: String, $description: String, $price: Int, $image: String) {
    createRoom(
      name: $name
      description: $description
      price: $price
      image: $image
    ) {
      name
      description
      price
      image
    }
  }
`;

const updateRoomMutation = gql`
  mutation($id: ID!, $name: String, $description: String, $price: Int) {
    updateRoom(id: $id, name: $name, description: $description, price: $price) {
      id
      name
      description
      price
    }
  }
`;

const editUserMutation = gql`
  mutation(
    $id: ID!
    $firstname: String
    $lastname: String
    $email: String
    $username: String
    $contact: String
  ) {
    editUser(
      id: $id
      firstname: $firstname
      lastname: $lastname
      email: $email
      username: $username
      contact: $contact
    ) {
      id
      firstname
      lastname
      email
      username
      contact
    }
  }
`;

const deleteRoomMutation = gql`
  mutation($id: ID!) {
    deleteRoom(id: $id) {
      id
    }
  }
`;

const createBookingMutation = gql`
  mutation(
    $roomId: String
    $userId: String
    $startDate: String
    $endDate: String
  ) {
    createBooking(
      roomId: $roomId
      userId: $userId
      startDate: $startDate
      endDate: $endDate
    ) {
      roomId
      userId
      startDate
      endDate
    }
  }
`;

const changeRoomAvailabilityMutation = gql`
  mutation($id: ID!, $isAvailable: Boolean) {
    changeRoomAvailability(id: $id, isAvailable: $isAvailable) {
      id
      isAvailable
    }
  }
`;

const makeRoomAvailableMutation = gql`
  mutation($id: ID!, $isAvailable: Boolean) {
    makeRoomAvailable(id: $id, isAvailable: $isAvailable) {
      id
      isAvailable
    }
  }
`;

const completeBookingMutation = gql`
  mutation($id: ID!, $isActive: Boolean) {
    completeBooking(id: $id, isActive: $isActive) {
      id
      isActive
    }
  }
`;

const deleteBookingMutation = gql`
  mutation($id: ID!) {
    deleteBooking(id: $id) {
      id
    }
  }
`;

export {
  createUserMutation,
  loginUserMutation,
  updateUserMutation,
  deleteUserMutation,
  createRoomMutation,
  updateRoomMutation,
  deleteRoomMutation,
  createBookingMutation,
  changeRoomAvailabilityMutation,
  makeRoomAvailableMutation,
  completeBookingMutation,
  deleteBookingMutation,
  editUserMutation
};
