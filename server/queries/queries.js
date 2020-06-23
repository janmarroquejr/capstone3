const { ApolloServer, gql } = require("apollo-server-express");
const bcrypt = require("bcryptjs");
const { GraphQLDateTime } = require("graphql-iso-date");

const User = require("../models/User");
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const uuid = require("uuid/v1");
const fs = require("fs");

const typeDefs = gql`
  scalar Date

  type UserType {
    id: ID!
    firstname: String
    lastname: String
    role: String
    email: String
    username: String
    password: String
    contact: String
    createdAt: Date
    updatedAt: Date
    bookings: [BookingType]
  }

  type RoomType {
    id: ID!
    name: String
    description: String
    price: Int
    isAvailable: Boolean
    image: String
    createdAt: Date
    updatedAt: Date
  }

  type BookingType {
    id: ID!
    userId: String
    roomId: String
    startDate: String
    endDate: String
    isActive: Boolean
    room: RoomType
    user: UserType
    createdAt: Date
    updatedAt: Date
  }

  type Query {
    getUsers: [UserType]
    getUser(id: String!): UserType
    getRooms: [RoomType]
    getRoom(id: String!): RoomType
    getBookings: [BookingType]
  }

  type Mutation {
    createUser(
      firstname: String
      lastname: String
      role: String
      email: String
      username: String
      password: String
      contact: String
    ): UserType

    updateUser(id: ID!, role: String): UserType

    deleteUser(id: ID!): UserType

    loginUser(username: String, password: String): UserType

    createRoom(
      name: String
      description: String
      price: Int
      isAvailable: Boolean
      image: String
    ): RoomType

    updateRoom(id: ID!, name: String, description: String, price: Int): RoomType

    editUser(
      id: ID!
      firstname: String
      lastname: String
      email: String
      username: String
      contact: String
    ): UserType

    changeRoomAvailability(id: ID!, isAvailable: Boolean): RoomType

    makeRoomAvailable(id: ID!, isAvailable: Boolean): RoomType

    completeBooking(id: ID!, isActive: Boolean): BookingType

    deleteRoom(id: ID!): RoomType

    createBooking(
      roomId: String
      userId: String
      startDate: String
      endDate: String
      isActive: Boolean
    ): BookingType

    deleteBooking(id: ID!): BookingType
  }
`;

const customScalarResolver = {
  Date: GraphQLDateTime
};

const resolvers = {
  Query: {
    getUsers: () => {
      return User.find({});
    },
    getUser: (_, args) => {
      return User.findById(args.id);
    },
    getRooms: () => {
      return Room.find({});
    },
    getRoom: (_, args) => {
      return Room.findById(args.id);
    },
    getBookings: () => {
      return Booking.find({});
    }
  },

  BookingType: {
    room: (parent, args) => {
      return Room.findOne({ _id: parent.roomId });
    },
    user: (parent, args) => {
      return User.findOne({ _id: parent.userId });
    }
  },

  UserType: {
    bookings: (parent, args) => {
      return Booking.find({ userId: parent.id });
    }
  },

  Mutation: {
    createUser: (_, args) => {
      let newUser = User({
        firstname: args.firstname,
        lastname: args.lastname,
        role: args.role,
        email: args.email,
        username: args.username,
        password: bcrypt.hashSync(args.password, 10),
        contact: args.contact
      });
      return newUser.save();
    },
    updateUser: (_, args) => {
      let condition = { _id: args.id };
      let updates = {
        role: args.role
      };
      return User.findOneAndUpdate(condition, updates);
    },
    editUser: (_, args) => {
      let condition = { _id: args.id };
      let updates = {
        firstname: args.firstname,
        lastname: args.lastname,
        email: args.email,
        username: args.username,
        contact: args.contact
      };
      return User.findOneAndUpdate(condition, updates);
    },
    deleteUser: (_, args) => {
      return User.findOneAndDelete({ _id: args.id });
    },
    deleteBooking: (_, args) => {
      return Booking.findOneAndDelete({ _id: args.id });
    },
    loginUser: (_, args) => {
      return User.findOne({ username: args.username }).then(user => {
        if (user === null) {
          return null;
        }
        let hashedPassword = bcrypt.compareSync(args.password, user.password);
        if (!hashedPassword) {
          return null;
        } else {
          return user;
        }
      });
    },
    createRoom: (_, args) => {
      let imageString = args.image;
      let imageBase = imageString.split(";base64,").pop();
      let imageLocation = "images/" + uuid() + ".png";

      fs.writeFile(imageLocation, imageBase, { encoding: "base64" }, err => {
        console.log(err);
      });

      let newRoom = Room({
        name: args.name,
        description: args.description,
        price: args.price,
        image: imageLocation,
        isAvailable: args.isAvailable
      });
      return newRoom.save();
    },
    updateRoom: (_, args) => {
      let condition = { _id: args.id };
      let updates = {
        name: args.name,
        description: args.description,
        price: args.price
      };
      return Room.findOneAndUpdate(condition, updates);
    },
    deleteRoom: (_, args) => {
      return Room.findOneAndDelete({ _id: args.id });
    },
    changeRoomAvailability: (_, args) => {
      let condition = { _id: args.id };
      let update = {
        isAvailable: args.isAvailable
      };
      return Room.findByIdAndUpdate(condition, update);
    },
    makeRoomAvailable: (_, args) => {
      let condition = { _id: args.id };
      let update = {
        isAvailable: args.isAvailable
      };
      return Room.findByIdAndUpdate(condition, update);
    },
    createBooking: (_, args) => {
      let newBooking = Booking({
        roomId: args.roomId,
        userId: args.userId,
        startDate: args.startDate,
        endDate: args.endDate,
        isActive: args.isActive
      });
      return newBooking.save();
    },
    completeBooking: (_, args) => {
      let condition = { _id: args.id };
      let update = {
        isActive: args.isActive
      };
      return Booking.findByIdAndUpdate(condition, update);
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

module.exports = server;
