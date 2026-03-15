import SignupCheck from "./SignupCheck"; //imports the SignupCheck class
class Required extends SignupCheck {
//looks for any empty fields
    handle(info) {
        //if nothing is entered for the username, email, password
        if(!info.username ||  !info.password || !info.email) {
            return {
                //prints message that user needs to fill out required fields
            success: false,
            message : "Please fill in all of the required fields! "
        }; 
            
        }
        //if passsword, email, and username fields are filled in it passes info and goes to the next check. 
        return super.handle(info);

     }
 
}


export default Required;