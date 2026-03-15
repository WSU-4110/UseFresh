//imports the SignupCheck class
import SignupCheck from "./SignupCheck";
class EmailCheck extends SignupCheck {
//looks to see if the email is valid
    handle(info) {
        //if the email doesnt have "@" error message is displayed and error obj is returned
        if(!info.email.includes("@")) {
            return {

                 success: false,
                 message: "Invalid email. Please try again!"
             };
        }
        //if email has @ then it sends info to the next check 
        return super.handle(info);

    }
}


export default EmailCheck;