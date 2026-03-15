import SignupCheck from "./SignupCheck"; //imports the SignupCheck class
class PasswordCheck extends SignupCheck {
//looks to see if password is at least 8 characters long
    handle(info) {
//if password is not at least 8 characters long it prints error message and returns error obj
        if(info.password.length <8 ) {
            return {

                  success: false,
                 message: "Password must be at least 8 characters long. Try again!"
            };

        }//if password is at least 8 characters long it passes info to the next validation check
        return super.handle(info);

    }
}


export default PasswordCheck;