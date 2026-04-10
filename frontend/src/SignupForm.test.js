import SignupForm from "./SignupForm";

describe("SignupForm", () => {

  test("Checks required fields ", () => {

    const form = new SignupForm("", "", "");
     expect(form.hasTheRequiredFields()).toBe(false);
    console.log("Unit Test Case: Checks to see if all required fields are filled in");
  });

  test("Checks the password length", () => {
    const form = new SignupForm("Beky", "Beky@gmail.com", "Passwd");

    expect(form.isPasswordLongEnough()).toBe(false);
    console.log("Unit Test Case: Checks to see if the validation of password length works (making sure each password is greater than eight characters).");

  });

  test("Checks the email format",  () => {

    const form = new SignupForm("Beky", "invalidemail", "P@ssword");
    expect(form.validEmail()).toBe(false);
     console.log("Unit test Case: Checks to see if validation of email works.")
  });


  test("Checks required fields and sees if user input is valid", () => {

    const form = new SignupForm("Beky", "Beky@gmail.com", "P@ssword");
    expect(form.hasTheRequiredFields()).toBe(true );
    console.log("Unit Test Case: Validates that all the required fields that the user inputted are accepted") ;


  });


});