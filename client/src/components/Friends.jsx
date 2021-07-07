import React from "react";
import { useQuery, gql } from "@apollo/client";
import FriendItem from "./FriendItem";
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
  const myid = sessionStorage.getItem("id");
  const myname = sessionStorage.getItem("name");
  const { loading, error, data } = useQuery(FRIENDS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message} Error :(</p>;
  let myfriends = [];
  for (let i = 0; i < data.customers.length; i++) {
    if (data.customers[i].id === myid) {
      myfriends = data.customers[i].friends;
    }
  }
  sessionStorage.setItem("friends", myfriends);
  return (
    <React.Fragment>
      <h2 className="mb-5 mt-5">Hi, {myname}!</h2>
      <a href="/friends/add" className="btn btn-info">
        Add Friends!
      </a>
      <h2 className="mb-5 mt-5">Friends:</h2>
      <hr></hr>
      {data.customers.map((friend) =>
        friend.id !== myid ? (
          myfriends.includes(friend.id) ? (
            <FriendItem key={friend.id} friend={friend} />
          ) : (
            <div key={friend.id} />
          )
        ) : (
          <div key={friend.id} />
        )
      )}
    </React.Fragment>
  );
}

export default Friends;
