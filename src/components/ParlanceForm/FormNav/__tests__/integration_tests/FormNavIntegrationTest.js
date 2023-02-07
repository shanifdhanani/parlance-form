import userEvent from "@testing-library/user-event";
import {clickHomeButton, clickNextButton, clickOkButton, clickPrevButton, firstNameQuestionShouldBeLoaded, invalidWarningShouldNotBeShowing, lastNameQuestionShouldBeLoaded, loadForm, loadFormWithSubsetOfQuestions, enterValueIntoTextBox} from "../../../../../utility/TestUtils/FormNavigationUtils";
import {screen, waitFor} from "@testing-library/react";

let user = null;
let firstName = "John";

beforeEach(() => {
    fetch.resetMocks();
    user = userEvent.setup();
})

describe("Form Nav", () => {
   it("should submit a valid answer when hitting the next button", async () => {
       await loadFormWithSubsetOfQuestions(1, 3);
       await enterValueIntoTextBox(user, firstName);
       await clickNextButton(user);
       await invalidWarningShouldNotBeShowing();
       await lastNameQuestionShouldBeLoaded();
   });

   it("should have a disabled previous button on the home screen", async () => {
       await loadForm();
       const prevButton = screen.getByRole("button", {name: "Prev"});
       expect(prevButton).toBeDisabled();
   });

   it("should go to the next screen when pushing the Next button", async () => {
       await loadForm();
       await clickNextButton(user);
       await firstNameQuestionShouldBeLoaded();
       const progressIndicator = await screen.findByText("2 / 3", {exact: false})
       expect(progressIndicator).toBeInTheDocument();
   });

   it("should go to the previous screen when pushing the Prev button without showing a warning if no input has previously been entered", async () => {
       await loadForm();
       await clickNextButton(user);
       await clickPrevButton(user);
       const homeScreen = await screen.findByText("Welcome", {exact: false});
       expect(homeScreen).toBeInTheDocument()
   });

   it("should go to the previous screen when pushing the Home button without showing a warning if no input has previously been entered", async () => {
       await loadForm();
       await clickNextButton(user);
       await clickHomeButton(user);
       const homeScreen = await screen.findByText("Welcome", {exact: false});
       expect(homeScreen).toBeInTheDocument();
   });

   it("should skip steps that are only for setting variables when clicking the next and previous buttons", async () => {
       await loadFormWithSubsetOfQuestions(10, 39);

       // Set service computation date to 1/15/1990
       const datePicker = screen.getByLabelText("Choose date", {exact: false});
       await user.click(datePicker);
       await screen.findByRole("grid");
       await (user.click(screen.getByLabelText("calendar view is open, switch to year view", {exact: false})))
       await (user.click(screen.getByRole("button", {name: "1990"})));
       const dayOfMonth = await screen.findByText("15")
       await user.click(dayOfMonth);
       await clickOkButton(user);

       // Set date of birth to 1/23/1979
       const dateOfBirthPicker = screen.getByLabelText("Choose date", {exact: false});
       await user.click(dateOfBirthPicker);
       await screen.findByRole("grid");
       await (user.click(screen.getByLabelText("calendar view is open, switch to year view", {exact: false})))
       await (user.click(screen.getByRole("button", {name: "1979"})));
       const dateOfBirthDay = await screen.findByText("23")
       await user.click(dateOfBirthDay);
       await clickOkButton(user);

       // Set retirement system to FERS
       await clickOkButton(user);

       // Make sure the right values are shown
       await screen.findByText("Great", {exact: false});
       await screen.findByText("Your first fully eligible retirement date is 01/23/2036", {exact: false});
       await clickPrevButton(user);
       expect(screen.getByText("It looks like you're a FERS employee", {exact: false})).toBeInTheDocument();
   });

   it("shouldn't count a conditionally displayed question after a user has gone back and changed an answer that makes the condition false", async () => {
       await loadFormWithSubsetOfQuestions(50, 53);
       expect(screen.getByText("1 / 3")).toBeInTheDocument();
       let yesOption = await screen.findByRole('checkbox', {name: "Yes"});
       expect(yesOption).toBeChecked();
       await clickOkButton(user);
       expect(screen.getByText("2 / 3")).toBeInTheDocument();
       expect(screen.getByText("percentage", {exact: false})).toBeInTheDocument();
       await clickPrevButton(user);
       expect(screen.getByText("1 / 3")).toBeInTheDocument();
       let noOption = await screen.findByRole('checkbox', {name: "No"});
       expect(noOption).not.toBeChecked();
       await user.click(noOption);
       await new Promise((r) => setTimeout(r, 300));
       await waitFor(() => {expect(screen.getByText("2 / 2")).toBeInTheDocument()})
   });

   it("should enable the Next button on the last question and have the Prev button work on the end screen", async () => {
       await loadFormWithSubsetOfQuestions(50, 52);
       await clickOkButton(user);
       const nextButton = screen.getByRole("button", {name: "Next"});
       expect(nextButton).toBeEnabled();
       const textBox = screen.getByRole("textbox");
       await user.type(textBox, "212");
       await clickOkButton(user);
       const prevButton = screen.getByRole("button", {name: "Prev"});
       await user.click(prevButton);
       expect(screen.getByText("percentage", {exact: false})).toBeInTheDocument();
   });

   it("shouldn't show the progress indicator if the user wants to hide it", async () => {
        await loadFormWithSubsetOfQuestions(50, 52, null, true);
        const progressIndicator = screen.queryByText("1 /");
        expect(progressIndicator).toBeNull();
   })
});