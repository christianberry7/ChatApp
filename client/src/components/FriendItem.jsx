import React from "react";
import { Link } from "react-router-dom";

const FriendItem = ({ friend: { id, email, name, age } }) => {
  return (
    <div className="card card-body mb-3">
      <div className="row">
        <div className="col-md-9">
          <h4>Name: {name}</h4>
          <p>Email:{email}</p>
          <p>Age:{age}</p>
        </div>
        <div className="col-md-3">
          <br></br>
          <Link to={`/friends/${id}`} className="btn btn-primary">
            Chat with friend!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FriendItem;
