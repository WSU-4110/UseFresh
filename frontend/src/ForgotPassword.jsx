import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Authentication.css";
import axios from "axios"
import logo from "./Logo/Logo.png";


//required function is used to create a label where a red star is added to show that the email in the forgot password is a required field. 

function RequiredLabel({children, required}) {
  return (

  <label>  
  {children}
  {<span style = {{color : 'red', fontWeight : "bold" }}> * </span>}

  </label>
  );
}


function ForgotPassword() {
//email state variable is created and holds the emails that the user enters, and updates it when the user types in the field. 
const[email, setEmail] = useState("");
const handleSubmit = async (e) => {
    e.preventDefault();
    //if there is no email entered then an error message is displayed asking user to enter a valid email.
    if(!email) {
        alert("Please enter a valid email");

        return;

    }
    //if the email the user enters does not have an @ then an error message is displayed asking user to enter a valid email.
    if(!email.includes("@")) {
        alert("Please enter a valid email.");
        return;
    }
    //if the email the user enters does not have a . then an error message is displayed asking user to enter a valid email.
    if(!email.includes(".")) {
        alert("Please enter a valid email.");
        return;
    }

    //try catch block is used to catch any potential errors that occur when sending the post request to the backend.
    //if there is an error then an error message is displayed. If request is successful then message saying " A reset link for your password has been sent to your email. " is displayed.
    try {
        const result = await axios.post("http://localhost:3001/api/user/forgot-password", { email });
        alert(result.data.message || "A reset link for your password has been sent to your email.");
    } catch (err) {
        alert(err?.response?.data?.error || "An error occurred, please try again later!");
    }
}
//the ForgotPassword compontnet returns the page layout for the forgot password page. 
//user is asked to "Please enter your email to reset your password. "
//user enters email in the field and seelcts "Reset password" button to submit the form.
return(
    <div className = "authentication-page">
            <div className = "d-flex justify-content-center gap-3">
            <img src = {logo}
            style = {{height: "220px", width : "220px", objectFit: "contain"}} />
          <h1 className = "m-3">Forgot Password</h1>
          </div>
          <p className="subtitle">Please enter your email to reset yor password.</p>
    
         <div className="authentication-card" >
          <form onSubmit={handleSubmit}>
            <div className= "mb-3">
            <RequiredLabel> Email</RequiredLabel>
             <input
          type ="email"
          placeholder =" Email"
          autoComplete = "off"
          className = "form-control rounded-0"
          onChange= {(e) => setEmail(e.target.value )}
        />
        </div>
           <button type="submit" className = "btn btn-success w-100"> Reset Password</button>
      </form>
    <div className="authentication-footer" >
      <p className = "mt-3"> Remember your password?</p>
      <Link to="/login">Back to Login</Link>
      </div>
    </div>
    </div>
     
)

}

export default ForgotPassword;