import React from "react";
import { useMutation, gql } from "@apollo/client";
import swal from "sweetalert";

const ADD_FRIEND = gql`
  mutation AddFriendship($id: String!, $friends: [String]!) {
    addFriendship(id: $id, friends: $friends) {
      friends
    }
  }
`;

const ADD_REQUEST = gql`
  mutation AddRequest($to: String!, $from: String!) {
    addRequest(to: $to, from: $from) {
      id
    }
  }
`;

const DELETE_REQUEST = gql`
  mutation DeleteRequest($id: Int!) {
    deleteRequest(id: $id) {
      id
    }
  }
`;

function Added(props) {
  let { id } = props.match.params;
  const myid = sessionStorage.getItem("id");
  const myfriends = sessionStorage.getItem("friends");
  const friends = myfriends.split(",");
  const index = id.lastIndexOf("_");
  const their_id = id.substr(0, index);
  const option = id.substr(index + 1);
  if (!friends.includes(their_id)) {
    friends.push(their_id);
  }

  const [addfriend] = useMutation(ADD_FRIEND);
  const [addrequest] = useMutation(ADD_REQUEST);
  const [deleterequest] = useMutation(DELETE_REQUEST);

  return (
    <React.Fragment>
      <div>
        <br></br>
        <h1>Send friend request to User Id: {their_id}!</h1>
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
          if (option === "addNew") {
            console.log("adding request");
            addrequest({
              variables: {
                to: their_id,
                from: myid,
              },
            });
            swal({
              title: "Friend Request Sent!",
              text: "Your friend must add you back before you can message them!",
            }).then((accept) => {
              window.location.replace("/friends/add");
            });
          } else {
            console.log("deleting request with id of " + option);
            deleterequest({
              variables: {
                id: parseInt(option),
              },
            });
            swal({
              title: "Friend Request Accepted!",
              text: "Go say hi to your new friend!",
            }).then((accept) => {
              window.location.replace("/friends/add");
            });
          }
        }}
      >
        {option === "addNew" ? (
          <button className="btn btn-success" type="submit">
            SEND REQUEST
          </button>
        ) : (
          <button className="btn btn-warning" type="submit">
            ACCEPT REQUEST
          </button>
        )}
      </form>
      <a href="/friends/add" className="btn btn-secondary">
        Back
      </a>
    </React.Fragment>
  );
}

export default Added;
