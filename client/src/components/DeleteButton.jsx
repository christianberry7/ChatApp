import React from "react";
import { useMutation, gql } from "@apollo/client";

const DEL_CHAT = gql`
  mutation DeleteChat($id: String!) {
    deleteChat(id: $id) {
      id
    }
  }
`;
function DeleteButton(props) {
  let { id } = props;
  const [delchat] = useMutation(DEL_CHAT);

  return (
    <React.Fragment>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          delchat({
            variables: { id },
          });
          window.alert("Message Deleted!");
        }}
      >
        <button className="btn btn-sm btn-primary deleteButton" type="submit">
          <span className="del">del</span>
        </button>
      </form>
    </React.Fragment>
  );
}
export default DeleteButton;
