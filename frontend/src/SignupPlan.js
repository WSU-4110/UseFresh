import axios from "axios";

class SignupPart {

  async registerUser(form) {
    return axios.post("http://localhost:3001/api/user/register", {
      username:form.username,
      email: form.email,
      password: form.password,
    })

  }
  getSuccessMessage() {

        return "Account Created! Please Login.";
    }

     getErrorMessage(err) {
    return err?.response?.data?.error || "Signup failed";

  }
}
export default SignupPart;