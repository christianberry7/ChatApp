import React from "react";

function Account() {
  return (
    <div className="login-wrapper">
      <br />
      <h1>Create Account</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          //addCustomer();
          // back to login page
          window.alert("Account Created!");
          console.log("wtf");
          window.location.replace("/login");
        }}
      >
        <label>
          <p>Full Name</p>
          <input type="text" autoComplete="current-password" />
        </label>
        <label>
          <p>Email</p>
          <input type="text" autoComplete="current-password" />
        </label>
        <label>
          <p>Password</p>
          <input type="password" autoComplete="current-password" />
        </label>
        <label>
          <p>Age</p>
          <input type="number" autoComplete="current-password" />
        </label>
        <div>
          <hr />
          <button className="btn btn-info" type="submit">
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}

export default Account;
