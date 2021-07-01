import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";

const FRIEND_QUERY = gql`
  query FriendQuery($a: String!, $b: String!) {
    myConvos(a: $a, b: $b) {
      id
      to
      from
      content
      createdAt
    }
  }
`;

function DM(props) {
  let { id } = props.match.params;
  const { loading, error, data } = useQuery(FRIEND_QUERY, {
    variables: { a: id, b: "3" }, // later b will be me specifically
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message} Error :(</p>;
  console.log(data);
  return (
    <React.Fragment>
      {data.myConvos.length ? (
        data.myConvos.map((chat) => (
          <div
            key={chat.id}
            className={chat.from === id ? "theirchat" : "mychat"}
          >
            <h3>{chat.content}</h3>
            <h4>{chat.createdAt}</h4>
          </div>
        ))
      ) : (
        <h1>No messages!</h1>
      )}
      <hr />
      <Link to={`/`} className="btn btn-secondary">
        Back
      </Link>
    </React.Fragment>
  );
}
export default DM;
