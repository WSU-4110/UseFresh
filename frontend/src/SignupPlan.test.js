import axios from "axios";
import SignupForm from "./SignupForm";
import SignupPart from "./SignupPlan";

jest.mock("axios");

describe("SignupService",  () => {

  beforeEach( ()  => {
    jest.clearAllMocks();
  });

  test.skip("Successful account creation", async () => {
    axios.post.mockResolvedValue({ data: {} });
    const form = new SignupForm("Beky", "Beky@gmail.com", "P@ssword");
    const part = new SignupPart();

    await part.registerUser(form);

    expect(axios.post).toHaveBeenCalledWith( "http://localhost:3001/api/user/register", {
        username: "Beky",

        email: "Beky@gmail.com",
        password: "P@ssword",
      }

    ) ;

    console.log("Unit Test Case: Checks to make sure a successful account creation request works");
  });
  test.only("Failed signup request", () => {
    const part = new SignupPart();
    const err = {

      response: {
         data: {

          error: "Signup failed",
        }, },
    };

     expect(part.getErrorMessage(err)).toBe("Signup failed");
    console.log(" Unit  Test Case: The failed Signup request is correctly handeled")
  });
});