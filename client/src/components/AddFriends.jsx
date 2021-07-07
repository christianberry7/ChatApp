import React from "react";
import { useQuery, gql } from "@apollo/client";
import AddFriendItem from "./AddFriendItem";
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

function AddFriends() {
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
      <h2 className="mb-3 mt-5">Hi, {myname}! Add Friends Here!</h2>
      <a href="/friends" className="btn btn-dark mb-4">
        Back
      </a>
      {data.customers.map((friend) =>
        friend.id !== myid ? (
          !myfriends.includes(friend.id) ? (
            <AddFriendItem key={friend.id} friend={friend} added={false} />
          ) : (
            <div key={friend.id}>
              <AddFriendItem key={friend.id} friend={friend} added={true} />
            </div>
          )
        ) : (
          <div key={friend.id}></div>
        )
      )}
      <a href="/friends" className="btn btn-secondary">
        Back
      </a>
      <br />
      <br />
    </React.Fragment>
  );
}

export default AddFriends;
