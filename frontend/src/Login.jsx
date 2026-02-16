import { Link} from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Authentication.css";
import logo from "./Logo/Logo.png";

function Login() {

  //state variables are created to store for instance the password and is able to update the password
  const [usernameOrEmail, setusernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  //used to navigate to other pages
  const nav = useNavigate();
//used to create functions which run when a form is entered.
  const handleLogin = async (e) => { 
    //prevents browser refresh (reacts is the one that deals will it)
    e.preventDefault();
    //checks if user entered both fields if not alter then with message
    if (!password || !usernameOrEmail ) {

      alert("Please enter email/username and password");
      return;

    }

        //sends post request to backend (login), sends either username or email and password that the user inputted
        axios.post("http://localhost:3001/api/user/login", {username: usernameOrEmail, email: usernameOrEmail, password: password, })
        //if the backend has recieved the request sucessfully
        .then((result) => {
            //if the backend confirms that the login works
            if(result.data.message === "Success" ) {
            //will go to the home page
            nav("/")
            }
            else {
                //if there is an error it shows it on backend
                alert(result.data.message)
            }
        })
            //if there is error shows message 
        .catch((err) => { alert("Login Failed") });
    
    
  };

return (
    //connects with authentication.css file and create background for the page
      <div className= "authentication-page">
     <div className = "d-flex justify-content-center gap-3">
        <img src = {logo}
        style = {{height: "170px", width : "170px", objectFit: "contain"}} />
      <h1 className = "m-3">Login</h1>
      </div>
      <p className="subtitle">Welcome to UseFresh!</p>
      <div className="authentication-card">

      <form onSubmit={handleLogin}>
        <div className = " mb-3">
      
        <label className="form-label"> Enter Email or Username</label>
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
        <label className="form-label"> Enter Password</label>
      
      
        <input

          type="password"
          placeholder="Password"
          autoComplete = "off"
          className = "form-control rounded-0"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
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
