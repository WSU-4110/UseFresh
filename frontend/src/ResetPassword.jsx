import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./Authentication.css";
import axios from "axios";
import logo from "./Logo/Logo.png";

//creates label with a red star that shows that the password and confirm password fields are required.

function RequiredLabel({children}) {
  return (
    <label>
      {children}
      <span style={{ color: "red", fontWeight: "bold" }}> *</span>
    </label>
  );
}

function ResetPassword() {

  //holds new password and confirm password that the user enters.
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  //gets the reset token from the URL that the user gets in their email.

  const { token } = useParams() ;
  //functions to navigate to other pages.
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //makes sure that the fields are not empty, if they are error message displayed.
    if (!password || !confirm) {
      alert("Please fill in all of the required fields");
      return;

    }
    //checks to see if password is at least 8 characters long if not error message displayed.
    if (password.length < 8) {

      alert("Password must be at least 8 characters long");
      return;
    }

    //if the new password and confirmed password do not match error message is displayed.

    if (password !== confirm) {
      alert("The passwords do not match.");
      return;
    }

    //post request sends the backend the new password and the token that was in the URL.
    //if no error the  message says reset was successful and user is then taken to login page.

    try {
      const result = await axios.post(
        `http://localhost:3001/api/user/reset-password/${token}`,
        { password }
      );

      alert(result.data.message || "Password has been successfully reset");
      nav("/login");
    } catch (err) {
      //if there is an error then an error message is displayed.
      alert(err?.response?.data?.error || "An error occurred. Please try again!");
    }
  };

  return (
    <div className="authentication-page">
        <div className="d-flex justify-content-center gap-3">
        <img
          src={logo}
          style={{ height: "220px", width: "220px", objectFit: "contain" }}
        />
        <h1 className="m-3">Reset Password</h1>
        </div>

      <p className="subtitle">Please enter your new password.</p>

        <div className="authentication-card">
        <form onSubmit={handleSubmit}>

         <div className="mb-3">
            <RequiredLabel>New Password</RequiredLabel>

            <input
              type="password"
              placeholder="New Password"
              autoComplete="off"
              className="form-control rounded-0"

              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <RequiredLabel>Confirm Password</RequiredLabel>

            <input
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              className="form-control rounded-0"
              onChange={(e) => setConfirm(e.target.value) }
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Reset Password
          </button>

        </form>

         <div className="authentication-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
