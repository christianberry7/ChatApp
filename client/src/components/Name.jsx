import React from "react";
import { useQuery, gql } from "@apollo/client";
const FRIEND_QUERY = gql`
  query CustomerQuery($id: String!) {
    customer(id: $id) {
      name
    }
  }
`;

function Name(props) {
  let { id } = props.match.params;
  const { loading, error, data } = useQuery(FRIEND_QUERY, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message} Error :(</p>;
  return (
    <React.Fragment>
      <h2 className="mb-5 mt-5">TO: {data.customer.name}</h2>
      <hr></hr>
    </React.Fragment>
  );
}

export default Name;
