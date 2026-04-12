import { Link} from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Authentication.css";
import logo from "./Logo/Logo.png";


function RequiredLabel({children, required}) {
  return (
  <label>  
  {children}
  {<span style = {{color : 'red', fontWeight : "bold" }}> * </span>}

  </label>
  );
}

function Login() {

  useEffect(() => {
  document.title = "Login - UseFresh";
  }, []);

  //state variables are created to store for instance the password and is able to update the password
  const [usernameOrEmail, setusernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  //used to navigate to other pages
  const nav = useNavigate();


//used to create functions which run when a form is entered.
  const handleLogin = async (e) => { 
    //prevents browser refresh (reacts is the one that deals will it)
    e.preventDefault();

    //if user inputs additional spaces before/after their credentials it will be removed. 
    const trimmedUsernameOrEmail = usernameOrEmail.trim();
    
    //checks if user entered both fields if not alter then with message
    if (!password || !trimmedUsernameOrEmail ) {

      alert("Please enter email/username and password");
      return;

    }

    try {
      //sends post request to backend (login), sends either username or email and password that the user inputted
      const result = await axios.post("http://localhost:3001/api/user/login", {
        username: trimmedUsernameOrEmail, 
        email: trimmedUsernameOrEmail, 
        password: password
      });

   

      //if the backend has received the request successfully
      if(result.data.message === "Success" && result.data.user?._id) {
        //stores the userID so that the user can stay logged in and essentially allows system to know who the user is. 
        localStorage.setItem("userId", result.data.user._id) ;
        // then navigate
        nav("/home");
      } else {
        alert(result.data.message || "Login failed");
      }
    } catch (err) {
      alert(err?.response?.data?.error || "Login failed. Please try again.");
    }
  };

return (
    //connects with authentication.css file and create background for the page
      <div className= "authentication-page">
      <div className="text-center">
        <img src = {logo}
        style = {{height: "220px", width : "220px", objectFit: "contain", display: "block", margin: "0 auto 12px"}} />
        <h1>Login</h1>
      </div>
      <p className="subtitle">Welcome to UseFresh!</p>
      <div className="authentication-card">

      <form onSubmit={handleLogin}>
        <div className = " mb-3">
      
        <RequiredLabel required={true}> Enter Email or Username</RequiredLabel>
        <input
          type="text"
          placeholder="Email or Username"
          className = "form-control rounded-0"

          autoComplete = "off "
          //gets what the user types for usernameOrEmail and saves it
          onChange={(e) => setusernameOrEmail(e.target.value)}
          required
        />
        </div>
       
      <div className = "mb-3">
        <RequiredLabel required={true}> Enter Password</RequiredLabel>
        <input

          type="password"
          placeholder="Password"
          autoComplete = "off"
          className = "form-control rounded-0"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
       <div className="mb-3 text-end">
      
      <Link to="/forgot_password">Forgot Password?</Link>
      </div>
        <button type="submit" className = "btn btn-success w-100">
          Login</button>
      </form>
    <div className="authentication-footer">
      <p className = "mt-3"> Don’t have an account?</p>
      <Link to="/register">Create an Account</Link>
      </div>
      </div>

</div>
  )
}  

export default Login
