const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//import the instantiation of the apollo server
const server = require("./queries/queries.js");

let databaseURL =
  "mongodb+srv://janmar:merngpassword@project1-ykfrf.mongodb.net/capstone3?retryWrites=true&w=majority";

mongoose.connect(databaseURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.use(bodyParser.json({ limit: "15mb" }));
app.use("/images", express.static("images"));

mongoose.connection.once("open", () => {
  console.log("now connected to the online mongodb");
});

//make the express app be served by ApolloServer
server.applyMiddleware({ app, path: "/cs3" });

let port = 4000;
//initialize the server
app.listen(port, () => {
  console.log(`🚀  Server ready at ${port}${server.graphqlPath}`);
});
