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
    }
  }
`;

function Friends() {
  const myid = sessionStorage.getItem("id");
  const myname = sessionStorage.getItem("name");
  const { loading, error, data } = useQuery(FRIENDS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message} Error :(</p>;
  return (
    <React.Fragment>
      <h2 className="mb-5 mt-5">Hi, {myname}!</h2>
      <h2 className="mb-5 mt-5">Friends:</h2>
      <hr></hr>
      {data.customers.map((friend) =>
        friend.id !== myid ? (
          <FriendItem key={friend.id} friend={friend} />
        ) : (
          <div key={friend.id} />
        )
      )}
    </React.Fragment>
  );
}

export default Friends;
