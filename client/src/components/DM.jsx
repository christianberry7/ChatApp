import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

const ADD_CHAT = gql`
  mutation AddChat($to: String!, $from: String!, $content: String!) {
    addChat(to: $to, from: $from, content: $content) {
      id
      to
      from
      content
      createdAt
    }
  }
`;

const ADD_UNREAD = gql`
  mutation AddUnread($to: String!, $from: String!) {
    addUnread(to: $to, from: $from) {
      id
    }
  }
`;

const CHANGE_FRIENDSHIP = gql`
  mutation ChangeFriendship($to: String!, $from: String!) {
    changeFriendship(to: $to, from: $from) {
      id
    }
  }
`;

const GET_REQUESTS = gql`
  query OurRequests($a: String!, $b: String!) {
    ourRequests(a: $a, b: $b) {
      to
      from
      id
    }
  }
`;

function DM(props) {
  let { id } = props.match.params;

  const [addchat] = useMutation(ADD_CHAT);
  const [addunread] = useMutation(ADD_UNREAD);
  const [changefriendship] = useMutation(CHANGE_FRIENDSHIP);
  const { loading, error, data } = useQuery(GET_REQUESTS, {
    variables: { a: sessionStorage.getItem("id"), b: id },
  });
  //delete unread messages right at the beginning
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message} Error :(</p>;
  const { ourRequests } = data;
  let input;

  if (ourRequests) {
    return (
      <React.Fragment>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.value === "") {
                return;
              }
              addchat({
                variables: {
                  to: id,
                  from: sessionStorage.getItem("id"),
                  content: input.value,
                },
              });
              input.value = "";
            }}
          >
            <input
              disabled
              className="form-control"
              ref={(node) => {
                input = node;
              }}
            />
            <button className="btn btn-danger disabled" type="submit">
              MESSAGES CANNOT BE SENT UNTIL YOUR FRIEND ADDS YOU BACK
            </button>
          </form>
        </div>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.value === "") {
              return;
            }
            addchat({
              variables: {
                to: id,
                from: sessionStorage.getItem("id"),
                content: input.value,
              },
            });
            addunread({
              variables: {
                to: id,
                from: sessionStorage.getItem("id"),
              },
            });
            changefriendship({
              variables: {
                to: id,
                from: sessionStorage.getItem("id"),
              },
            });
            input.value = "";
          }}
        >
          <input
            className="form-control"
            ref={(node) => {
              input = node;
            }}
          />
          <button className="btn btn-primary" type="submit">
            SEND MESSAGE
          </button>
        </form>
      </div>
    </React.Fragment>
  );
}
export default DM;
