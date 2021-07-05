import React from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

const GET_REQUESTS = gql`
  query OurRequests($a: String!, $b: String!) {
    ourRequests(a: $a, b: $b) {
      to
      from
      id
    }
  }
`;

function AddFriendItem({ friend: { id, email, name, age }, added }) {
  const myid = sessionStorage.getItem("id");
  const { loading, error, data } = useQuery(GET_REQUESTS, {
    variables: { a: myid, b: id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message} Error :(</p>;
  const { ourRequests } = data;
  return (
    <div className="card card-body mb-3">
      <div className="row">
        <div className="col-md-9">
          <h4>Name: {name}</h4>
          <p>Email:{email}</p>
          <p>Age:{age}</p>
        </div>
        <div className="col-md-3">
          <br></br>
          {added ? (
            ourRequests !== null && ourRequests.from === myid ? (
              <button className="btn btn-primary disabled">
                Friend Requested!
              </button>
            ) : (
              <button className="btn btn-info disabled">Friend Added!</button>
            )
          ) : ourRequests !== null && ourRequests.to === myid ? (
            <Link
              to={`/friends/add/${id}_${ourRequests.id}`}
              className="btn btn-warning"
            >
              Add them back!
            </Link>
          ) : (
            <Link to={`/friends/add/${id}_addNew`} className="btn btn-success">
              Add friend!
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddFriendItem;
