class SignupCheck{
    //parent class for the other validation checks for creating user account
    //when new object is made the nextVal holds the next validation check that will occur
    constructor( nextVal = null) {
        this.nextVal = nextVal;

    }
    //info goes to the next validation check
    handle(info) {
         if(this.nextVal) {
//
            return this.nextVal.handle(info);
        }
        return {
///if there isn't another check it ends succesffuly, and prints account successfully creates
            success: true,
            message:  "Account sucessfully created!"
        };
    }
}
export default SignupCheck;