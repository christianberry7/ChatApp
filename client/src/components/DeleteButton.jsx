import React from "react";
import { useMutation, gql } from "@apollo/client";
import swal from "sweetalert";

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
          swal({ title: "Message Deleted!" }).then((deleted) => {});
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
