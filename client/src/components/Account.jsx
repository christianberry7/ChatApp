import React from "react";
import { useMutation, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import swal from "sweetalert";

const ADD_CUSTOMER = gql`
  mutation AddCustomer(
    $name: String!
    $email: String!
    $password: String!
    $age: Int!
  ) {
    addCustomer(name: $name, email: $email, password: $password, age: $age) {
      id
      email
      password
    }
  }
`;

function Account() {
  const [addcustomer] = useMutation(ADD_CUSTOMER);

  return (
    <div className="login-wrapper">
      <br />
      <h1>Create Account</h1>
      <br />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name =
            document.getElementById("fn").value +
            " " +
            document.getElementById("ln").value;
          const email = document.getElementById("email").value;
          const password = document.getElementById("pass").value;
          const age = Number(document.getElementById("age").value);
          addcustomer({
            variables: {
              name,
              email,
              password,
              age,
            },
          });
          swal({
            title: "Account Created!",
            text: `Welcome, ${document.getElementById("fn").value}!`,
          }).then((made) => {
            window.location.replace("/login");
          });
        }}
      >
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            id="fn"
            placeholder="First name"
            autoComplete="given-name"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            id="ln"
            placeholder="Last name"
            autoComplete="family-name"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            id="email"
            placeholder="Email"
            autoComplete="email"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="form-control"
            id="pass"
            placeholder="Password"
            autoComplete="current-password"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            className="form-control"
            id="age"
            placeholder="Age"
            required
          />
        </div>
        <div className="form-group">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="check"
              required
            />
            <label className="form-check-label" htmlFor="check">
              Agree to terms and conditions
            </label>
          </div>
        </div>
        <br></br>
        <button className="btn btn-primary" type="submit">
          Create Account
        </button>
        <Link to="/login" className="btn btn-secondary">
          <span style={{ fontSize: "20px" }}>←</span> Back to login
        </Link>
      </form>
    </div>
  );
}

export default Account;
