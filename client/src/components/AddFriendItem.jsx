import React from "react";
import { Link } from "react-router-dom";

const AddFriendItem = ({ friend: { id, email, name, age }, added }) => {
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
          {added ? (
            <button className="btn btn-info disabled">Friend Added!</button>
          ) : (
            <Link to={`/friends/add/${id}`} className="btn btn-success">
              Add friend!
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFriendItem;
