import React from "react";
import { useMutation, useQuery, gql } from "@apollo/client";

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

const REMOVE_UNREAD = gql`
  mutation DeleteUnread($id: Int!) {
    deleteUnread(id: $id) {
      id
    }
  }
`;

function FriendItem({ friend: { id, email, name, age } }) {
  const [removeunread] = useMutation(REMOVE_UNREAD);
  const myid = sessionStorage.getItem("id");
  const { loading, error, data } = useQuery(UNREAD_QUERY, {
    variables: { to: myid, from: id },
    pollInterval: 5000,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message} Error :(</p>;
  let unreads = 0;
  let unreadIds = null;
  if (data !== null) {
    if (data.myUnreads !== null) {
      unreads = data.myUnreads.count;
      unreadIds = data.myUnreads;
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
          <a
            href={`/friends/${id}`}
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              if (unreadIds !== null) {
                removeunread({
                  variables: {
                    id: unreadIds.id,
                  },
                });
              }
              window.location.replace(`/friends/${id}`);
            }}
          >
            Chat with friend!
          </a>
        </div>
      </div>
    </div>
  );
}

export default FriendItem;
