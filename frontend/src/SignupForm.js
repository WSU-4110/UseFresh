
class SignupForm {
  constructor(username = "", email = "", password = "") {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  hasTheRequiredFields() {

    return !!(this.username && this.email  && this.password );
  }

  isPasswordLongEnough() {
    return this.password.length >= 8;

  }
  validEmail() {
    return this.email.includes("@") ;
  }

}

export default SignupForm;