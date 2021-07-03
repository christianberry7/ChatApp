import React from "react";
import { useMutation, gql } from "@apollo/client";

const ADD_FRIEND = gql`
  mutation AddFriendship($id: String!, $friends: [String]!) {
    addFriendship(id: $id, friends: $friends) {
      friends
    }
  }
`;

function Added(props) {
  let { id } = props.match.params;
  const myid = sessionStorage.getItem("id");
  const myfriends = sessionStorage.getItem("friends");
  const friends = myfriends.split(",");
  if (!friends.includes(id)) {
    friends.push(id);
  }

  const [addfriend] = useMutation(ADD_FRIEND);

  return (
    <React.Fragment>
      <div>
        <br></br>
        <h1>Send friend request to user id: {id}!</h1>
        <br></br>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addfriend({
            variables: {
              id: myid,
              friends,
            },
          });
          window.alert("Request sent!");
          window.location.replace("/friends/add");
        }}
      >
        <button className="btn btn-success" type="submit">
          SEND REQUEST
        </button>
      </form>
      <a href="/friends/add" className="btn btn-secondary">
        Back
      </a>
    </React.Fragment>
  );
}

export default Added;
