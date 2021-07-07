import "./App.css";
import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Friends from "./components/Friends";
import ChatItem from "./components/ChatItem";
import Login from "./components/Login";
import useToken from "./components/useToken";
import AddFriends from "./components/AddFriends";
import Added from "./components/Added";
import Account from "./components/Account";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

// function setToken(userToken) {
//   sessionStorage.setItem("token", JSON.stringify(userToken));
// }

// function getToken() {
//   const tokenString = sessionStorage.getItem("token");
//   const userToken = JSON.parse(tokenString);
//   return userToken?.token;
// }

function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/account" component={Account} />
            <Route
              exact
              path="/login"
              component={() => <Login setToken={setToken} />}
            />
            <Redirect to="/login"></Redirect>
          </Switch>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <div className="container">
          <h1 className="title">ChatMe!</h1>
          <hr />
          <Switch>
            <Route exact path="/friends/add/:id" component={Added} />
            <Route exact path="/friends" component={Friends} />
            <Route exact path="/friends/add" component={AddFriends} />
            <Route exact path="/friends/:id" component={ChatItem} />
            <Redirect from="/" to="/friends"></Redirect>
          </Switch>
        </div>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
