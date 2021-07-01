import "./App.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter, Route } from "react-router-dom";
import Friends from "./components/Friends";
import DM from "./components/DM";
//import DM from "./components/DM";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <div className="container">
          <h1 className="title">ChatMe!</h1>
          <hr />
          <Route exact path="/" component={Friends} />
          <Route exact path="/:id" component={DM} />
        </div>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
