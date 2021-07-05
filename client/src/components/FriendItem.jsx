import React from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

const UNREAD_QUERY = gql`
  query UnreadQuery($to: String!, $from: String!) {
    myUnreads(to: $to, from: $from) {
      id
      to
      from
      count
    }
  }
`;

function FriendItem({ friend: { id, email, name, age } }) {
  const myid = sessionStorage.getItem("id");
  const { loading, error, data } = useQuery(UNREAD_QUERY, {
    variables: { to: myid, from: id },
    pollInterval: 3000,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message} Error :(</p>;
  let unreads = 0;
  if (data !== null) {
    if (data.myUnreads !== null) {
      unreads = data.myUnreads.count;
    }
  }
  return (
    <div className="card card-body mb-3">
      <div className="row">
        <div className="col-md-6">
          <h4>Name: {name}</h4>
          <p>Email:{email}</p>
          <p>Age:{age}</p>
        </div>
        {unreads === 0 ? (
          <div className="col-md-3"></div>
        ) : (
          <div className="col-md-3">
            <br></br>
            <span className="btn btn-danger" style={{ pointerEvents: "none" }}>
              <h3 style={{ color: "white" }}>{unreads}</h3>
            </span>
          </div>
        )}
        <div className="col-md-3">
          <br></br>
          <Link to={`/friends/${id}`} className="btn btn-primary">
            Chat with friend!
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FriendItem;
