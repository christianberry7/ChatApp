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
  const { loading, error, data } = useQuery(FRIENDS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message} Error :(</p>;
  console.log(data);
  return (
    <React.Fragment>
      <h2 className="mb-5 mt-5">Friends</h2>
      <hr></hr>
      {data.customers.map((friend) => (
        <FriendItem key={friend.id} friend={friend} />
      ))}
    </React.Fragment>
  );
}

export default Friends;
