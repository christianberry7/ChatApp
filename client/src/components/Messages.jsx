import React from "react";
import { useQuery, gql } from "@apollo/client";

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
function Messages(props) {
  let { id } = props.match.params;
  const { loading, error, data } = useQuery(FRIEND_QUERY, {
    variables: { a: id, b: "3" }, // later b will be me specifically
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message} Error :(</p>;
  // console.log(data);
  return (
    <React.Fragment>
      {data.myConvos.map((chat) => (
        <div
          key={chat.id}
          className={
            chat.from === props.match.params.id ? "theirchat" : "mychat"
          }
        >
          <h3>{chat.content}</h3>
          <h4>{chat.createdAt}</h4>
        </div>
      ))}
    </React.Fragment>
  );
}
export default Messages;
