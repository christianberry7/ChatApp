import React from "react";
import { useQuery, gql } from "@apollo/client";
import FriendItem from "./FriendItem";

// we have to grab more than just the friends because we display the friends' names and emails etc.
const FRIENDS_QUERY = gql`
  query CustomersQuery {
    customers {
      id
      name
      email
      age
      friends
    }
  }
`;

function Friends() {
  function getFriends(customers, friends) {
    const orderedFriends = [];
    for (let i = 0; i < friends.length; i++) {
      for (let j = 0; j < customers.length; j++) {
        if (friends[i] === customers[j].id) {
          orderedFriends.push(customers[j]);
          break;
        }
      }
    }
    return orderedFriends;
  }
  const myid = sessionStorage.getItem("id");
  const myname = sessionStorage.getItem("name");
  sessionStorage.setItem("unreads", new Set());

  const { loading, error, data } = useQuery(FRIENDS_QUERY, {
    pollInterval: 2000,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message} Error :(</p>;
  let myfriends = [];
  let orderedFriends;
  for (let i = 0; i < data.customers.length; i++) {
    if (data.customers[i].id === myid) {
      myfriends = data.customers[i].friends; // grabbing my friends list
      sessionStorage.setItem("friends", myfriends);
      orderedFriends = getFriends(data.customers, myfriends);
      break;
    }
  }

  return (
    <React.Fragment>
      <h2 className="mb-5 mt-5">Hi, {myname}!</h2>
      <a href="/friends/add" className="btn btn-info">
        Add Friends!
      </a>
      <h2 className="mb-5 mt-5">Friends:</h2>
      <hr></hr>
      {orderedFriends.map((friend) =>
        friend.id !== myid ? (
          <FriendItem key={friend.id} friend={friend} />
        ) : (
          <div key={friend.id} />
        )
      )}
      <br />
    </React.Fragment>
  );
}

export default Friends;
