import React, { useState } from "react";
import PropTypes from "prop-types";
import { useQuery, gql } from "@apollo/client";
import swal from "sweetalert";

const LOGIN_QUERY = gql`
  query CustomersQuery {
    customers {
      email
      password
      id
      name
      friends
    }
  }
`;

async function loginUser(credentials) {
  return fetch("http://localhost:4000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const { loading, error, data } = useQuery(LOGIN_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message} Error :(</p>;

  function validate(data, { username, password }) {
    for (let i = 0; i < data.customers.length; i++) {
      if (typeof username === "undefined") {
        return -1;
      }
      if (
        data.customers[i].email.toLowerCase() === username.toLowerCase() &&
        data.customers[i].password === password
      ) {
        return i;
      }
    }
    return -1;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = validate(data, { username, password });
    if (valid !== -1) {
      const token = await loginUser({
        username,
        password,
      });
      const id = data.customers[valid].id;
      const name = data.customers[valid].name;
      const friends = data.customers[valid].friends;
      sessionStorage.setItem("id", id);
      sessionStorage.setItem("name", name);
      sessionStorage.setItem("friends", friends);
      setToken(token);
    } else {
      swal({
        title: "Invalid Login Credentials!",
        text: "Please try logging in again.",
      }).then(() => {
        document.getElementById("pass").value = "";
        document.getElementById("pass").focus();
        document.getElementById("pass").select();
      });
    }
  };

  return (
    <div className="login-wrapper">
      <h1 className="login">Login to ChatMe!</h1>
      <br></br>
      <br></br>
      <form onSubmit={handleSubmit}>
        {/* handle submit ^ */}
        <label>
          <p>Email</p>
          <input
            type="text"
            autoComplete="email"
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            id="pass"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          <button className="btn btn-secondary" type="submit">
            Submit
          </button>
          <hr />
          <a className="btn btn-primary" href="/account">
            Create Account
          </a>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
