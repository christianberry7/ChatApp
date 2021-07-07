import React from "react";
import { useQuery, gql } from "@apollo/client";
import DeleteButton from "./DeleteButton";

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
  const myid = sessionStorage.getItem("id");
  const { loading, error, data } = useQuery(FRIEND_QUERY, {
    variables: { a: id, b: myid },
    pollInterval: 600, // ^ change b later
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message} Error :(</p>;
  // console.log(data);
  let convos = [...data.myConvos];
  convos.reverse();
  return (
    <div className={convos.length ? "scrollable" : ""}>
      {convos.length ? (
        convos.map((chat) => (
          <div
            key={chat.id}
            className={
              chat.from === props.match.params.id ? "theirchat" : "mychat"
            }
          >
            <h3>{chat.content}</h3>
            <h4>{chat.createdAt}</h4>
            {chat.from !== props.match.params.id ? (
              <DeleteButton id={chat.id} />
            ) : (
              <div />
            )}
          </div>
        ))
      ) : (
        <h1 className="noMessages">Send a message!</h1>
      )}
    </div>
  );
}
export default Messages;
