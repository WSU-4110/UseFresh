import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Authentication.css";
import axios from "axios"
import logo from "./Logo/Logo.png";
import SignupForm from "./SignupForm";
import SignupService from "./SignupPlan";

function RequiredLabel({children, required}) {
  return (

  <label>  
  {children}
  {<span style = {{color : 'red', fontWeight : "bold" }}> * </span>}

  </label>
  );
}

function Signup() {
//state variables are created to store the password/username/email and is able to update them when user input is entered
  const [username, setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  //used to navigate to other pages
 const nav = useNavigate();
  const handleSubmit = async (e) => {

    e.preventDefault();

    const signupForm = new SignupForm(username, email, password);
    const signupService = new SignupService();

    if(!signupForm.hasRequiredFields()) {
      alert("Please fill in all of the required fields");
      return;

    }
    if(!signupForm.isPasswordLongEnough())
       {
      alert("The password must be at least 8 characters in length.");
      return;
    }


    if(!signupForm.validEmail()) {

      alert("This email is not valid. Please enter a valid email.");
      return;
    }
    try {
      await signupService.registerUser(signupForm);
       alert("Account has been successfully created! Please login!");
       nav("/login");

    }
    catch(err) {
      alert(signupService.getErrorMessage(err) );
    }
    };




return (
    
       <div className = "authentication-page">
        <div className = "d-flex justify-content-center gap-3">
        <img src = {logo}
        style = {{height: "170px", width : "170px", objectFit: "contain"}} />
      <h1 className = "m-3">Create Account</h1>
      </div>
      <p className="subtitle">Welcome to UseFresh!</p>

     <div className="authentication-card" >
      <form onSubmit={handleSubmit} noValidate>
        <div className= "mb-3">
        <RequiredLabel> Username</RequiredLabel>
 
        <input

           type="text"
          placeholder=" Username"
          autoComplete = "off"
          value = {username}
          className = "form-control rounded-0 "
          onChange={(e) => setUsername(e.target.value)}
        />

        </div>
        <div className = "mb-3">
        <RequiredLabel> Email</RequiredLabel>

        <input
          type ="email"
          placeholder =" Email"
          autoComplete = "off"
          value = {email}
          className = "form-control rounded-0"
          onChange= {(e) => setEmail(e.target.value )}
        />
        </div>

        <div className = "mb-3">

        <RequiredLabel required> Password </RequiredLabel>
        <input
          type="password"
          placeholder= " Password"
          className = "form-control rounded-0"
          autoComplete = "off"
          value = {password}
          onChange={(e) => setPassword(e.target.value )}
        /> 
        </div>
        <button type="submit" className = "btn btn-success w-100"> Create Account</button>
      </form>
    <div className="authentication-footer" >
      <p className = "mt-3"> Already have an account?</p>
      <Link to="/login">Back to Login</Link>
      </div>
    </div>
    </div>
    

  
  )


}

export default Signup
