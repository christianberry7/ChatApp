import React from "react";
import DM from "./DM";
import Messages from "./Messages";
import Name from "./Name";
import { useMutation, gql } from "@apollo/client";
// import DeleteUnreads from "./DeleteUnreads";

// const GET_UNREADS = gql`
//   query MyUnreads($to: String!, $from: String!) {
//     myUnreads(to: $to, from: $from) {
//       to
//       from
//       id
//     }
//   }
// `;

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

  // const { loading, error, data } = useQuery(GET_UNREADS, {
  //   variables: { to: sessionStorage.getItem("id"), from: id },
  // });
  // //delete unread messages right at the beginning
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error.message} Error :(</p>;
  // console.log(data); //we got our unreads, now let's delete them if they have the id of the other person
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
