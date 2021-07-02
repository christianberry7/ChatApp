import "./App.css";
import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Friends from "./components/Friends";
import ChatItem from "./components/ChatItem";
import Login from "./components/Login";
import useToken from "./components/useToken";

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
        <Login setToken={setToken} />
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
            <Route exact path="/friends" component={Friends} />
            <Route exact path="/friends/:id" component={ChatItem} />
            <Redirect from="/" to="/friends"></Redirect>
          </Switch>
        </div>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
