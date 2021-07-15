import React from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { useState, useEffect } from "react";

const UNREAD_QUERY = gql`
  query UnreadListQuery($to: String!) {
    myUnreadList(to: $to) {
      id
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
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
    return () => setDidMount(false);
  }, []);

  const [removeunread] = useMutation(REMOVE_UNREAD);
  const myid = sessionStorage.getItem("id");
  const { loading, error, data } = useQuery(UNREAD_QUERY, {
    variables: { to: myid, from: id },
    pollInterval: 2000,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message} Error :(</p>;
  if (!didMount) {
    return null;
  }
  let unreadId = null;
  let unreads = 0;
  if (data.myUnreadList.length !== 0) {
    const { myUnreadList } = data;
    const unreadPositions = [];
    for (let i = myUnreadList.length - 1; i >= 0; i--) {
      unreadPositions.push(myUnreadList[i].from);
    }

    for (let i = 0; i < myUnreadList.length; i++) {
      if (myUnreadList[i].from === id) {
        unreadId = myUnreadList[i].id;
        unreads = myUnreadList[i].count;
        break;
      }
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
            <span
              className="btn btn-danger btn-circle btn-sm"
              style={{ pointerEvents: "none" }}
            >
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
              if (unreadId !== null) {
                removeunread({
                  variables: {
                    id: unreadId,
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
