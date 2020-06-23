import React, { useState } from "react";
import "./App.css";
import "./Animate.css";
import "react-bulma-components/dist/react-bulma-components.min.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import SideBar from "./components/SideBar";
import Home from "./components/Home";
import Reservation from "./components/Reservation";
import Register from "./components/Register";
import Background from "./components/Background";
import Login from "./components/Login";
import Rooms from "./components/Rooms";
import UserList from "./components/UserList";
import RoomList from "./components/RoomList";
import Restricted from "./components/Restricted";
import EditRoom from "./components/EditRoom";
import BookingList from "./components/BookingList";
import MyBookings from "./components/MyBookings";
import EditAccount from "./components/EditAccount";

function App() {
  const [name, setName] = useState(localStorage.getItem("firstname"));
  const [lastname, setLastname] = useState(localStorage.getItem('lastname'))
  
  const options = {
    timeout: 3000,
    position: positions.BOTTOM_CENTER
  };

  const client = new ApolloClient({
    uri: "https://murmuring-journey-00582.herokuapp.com/cs3"
  });


  const Logout = () => {
    localStorage.clear();
    updateSession();
    return <Redirect to="/login" />;
  };

  const updateSession = () => {
    setName(localStorage.getItem("firstname"));
    setLastname(localStorage.getItem("lastname"));
  };

  const loggedUser = props => {
    return <Login {...props} updateSession={updateSession} />;
  };

  const editedAccount = props => {
    return <EditAccount {...props} updateSession={updateSession} />
  }

  return (
    <ApolloProvider client={client}>
      <Background />
      <BrowserRouter>
        <SideBar name={name + " " + lastname} />
        <Switch>
          <Provider template={AlertTemplate} {...options}>
            <Route exact path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/reservation" component={Reservation} />
            <Route path="/register" component={Register} />
            <Route path="/login" render={loggedUser} />
            <Route path="/rooms" component={Rooms} />
            <Route path="/userlist" component={UserList} />
            <Route exact path="/roomlist" component={RoomList} />
            <Route path="/logout" component={Logout} />
            <Route path="/restricted" component={Restricted} />
            <Route exact path="/roomlist/edit/:id" component={EditRoom} />
            <Route exact path="/bookinglist" component={BookingList} />
            <Route exact path="/mybookings/:id" component={MyBookings} />
            <Route exact path="/editaccount/:id" render={editedAccount} />
          </Provider>
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
