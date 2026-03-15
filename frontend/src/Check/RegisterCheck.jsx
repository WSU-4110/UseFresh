//imports the SignupCheck class
import SignupCheck from "./SignupCheck";
import axios from "axios";

class RegisterCheck extends SignupCheck {
    // sends signup info to the backedn
    handle(info) {
//axios is used to send post request call to backend, sends username, password, and email
        return axios
        .post("http://localhost:3001/api/user/register", {
            username: info.username, email: info.email, password: info.password
        })
        // if the backend signup works then user account is created and prints message 
        .then(() => {
            return{
                success: true, 
                message: "Account has been successfully creates!"
            };
        }
    
    )
    //if there is an issue with the backend signing up an error message is displayed
    .catch((err) => {
        return { 
            success: false, 
            message:"Unable to create user account. Try again!"
        };
    }
);
       
    }
 
}
    


export default RegisterCheck;