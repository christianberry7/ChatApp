import React from "react";
import { useMutation, gql } from "@apollo/client";

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

function DM(props) {
  let { id } = props.match.params;
  // const { loading, error, data } = useQuery(FRIEND_QUERY, {
  //   variables: { a: id, b: "3" }, // later b will be me specifically
  // });
  const [addchat] = useMutation(ADD_CHAT);
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error.message} Error :(</p>;
  let input;
  // console.log(data);
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
