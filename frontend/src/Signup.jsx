import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Authentication.css";
import axios from "axios"
import logo from "./Logo/Logo.png";

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
  const handleSubmit = (e) => {

    e.preventDefault();
    if (!username ||!email || !password) {

      alert("Please fill in the required fields ");
      return;
    }
    //checks to see if password that the user enters is 8 characters and if it is not then it sends message to user. 
    if(password.length <8) {
        alert("Password must be at least 8 characters long.");
        return;
    }

//if email input doesnt havr @ gives error message asking user to input valid email.
    if (!email.includes("@")) {

      alert("This email does not exist. Please enter a valid email.");
      return;

    }


        //sends post request to backend (register), sends either username and email and password that the user inputted to server
       axios.post("http://localhost:3001/api/user/register", {username, email, password })
       //if the backend has recieved the request sucessfully it then it continues
        .then( (result) => {
        
           alert("Account Created! Please Login.");
            //it will then go to login page
            nav("/login")
        })
            //catches any error and sends message to backend
        .catch((err) => {
            alert("err.response.data.error");
            
        });



    
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
