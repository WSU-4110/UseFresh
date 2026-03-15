import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Authentication.css";
import axios from "axios"
import logo from "./Logo/Logo.png";
import RegisterCheck from "./Check/RegisterCheck";
import PasswordCheck from "./Check/PasswordCheck";
import Required from "./Check/RequiredCheck";
import EmailCheck from "./Check/EmailCheck";


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
 //runs when the form is submitted
  const handleSubmit = async (e) => {

    e.preventDefault();
//final check 
    const register = new RegisterCheck();
    //creates email check and connects check to register check
    const emailCheck = new EmailCheck(register);

    //creates password check and connects check to email check
     const passwordCheck = new PasswordCheck(emailCheck);
     //creates required check and connects check to password check
    const requiredCheck = new Required(passwordCheck);
//info is sent to required check to begin chain
    const output = await requiredCheck.handle({
      
      username, email, password

    }
  );
//if chain words message is shown and user is navigated to login page
    if(output.success) {

      alert(output.message)
      nav("/login");

    }
    //if error then it prints error message
    else{
      alert(output.message);
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
      <form onSubmit={handleSubmit}>
        <div className= "mb-3">
        <RequiredLabel> Username</RequiredLabel>
 
        <input

           type="text"
          placeholder=" Username"
          autoComplete = "off"
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
