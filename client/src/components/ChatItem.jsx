import React from "react";
import DM from "./DM";
import Messages from "./Messages";
import Name from "./Name";
import { useMutation, gql } from "@apollo/client";

const REMOVE_ONE_UNREAD = gql`
  mutation DeleteOneUnread($to: String!, $from: String!) {
    deleteOneUnread(to: $to, from: $from) {
      id
    }
  }
`;

function ChatItem(props) {
  let { id } = props.match.params;
  const [removeoneunread] = useMutation(REMOVE_ONE_UNREAD);

  return (
    <React.Fragment>
      {sessionStorage.getItem("friends").includes(id) ? (
        <div>
          <Name match={props.match} />
          <Messages match={props.match} />
          <hr />
          <DM match={props.match} />
          <a
            href="/friends"
            className="btn btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              removeoneunread({
                variables: {
                  to: sessionStorage.getItem("id"),
                  from: id,
                },
              });
              window.location.replace("/friends");
            }}
          >
            Back
          </a>
        </div>
      ) : (
        <div>
          <h1>404: page not found :(</h1>
          <hr />
          <a href="/friends" className="btn btn-secondary">
            Back
          </a>
        </div>
      )}
    </React.Fragment>
  );
}

export default ChatItem;
