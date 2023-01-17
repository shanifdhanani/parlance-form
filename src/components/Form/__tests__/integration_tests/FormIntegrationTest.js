import {clickOkButton, clickPrevButton, firstNameQuestionShouldBeLoaded, invalidWarningShouldBeShowing, invalidWarningShouldNotBeShowing, lastNameQuestionShouldBeLoaded, loadFormWithSubsetOfQuestions, navigateToFirstQuestion, enterValueIntoTextBox, clickNextButton} from "../../../../utility/TestUtils/FormNavigationUtils";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {Steps} from "../../../../data/steps";
import Form from "../../Form";

let user = null;
let firstName = "John";

beforeEach(() => {
  fetch.resetMocks();
  user = userEvent.setup();
})

describe("Form", () => {
    it("shouldn't navigate to the next question if the user entered an invalid value and then started typing a valid value", async () => {
        await loadFormWithSubsetOfQuestions(1, 3);
        await clickOkButton(user);
        await invalidWarningShouldBeShowing();
        await enterValueIntoTextBox(user, firstName);
        await new Promise((r) => setTimeout(r, 300));
        expect(screen.queryByText(/Great/i)).not.toBeInTheDocument();
    });

    it("remembers answers as navigating", async () => {
        await loadFormWithSubsetOfQuestions(1, 3);
        await clickOkButton(user);
        await invalidWarningShouldBeShowing();
        await enterValueIntoTextBox(user, firstName);
        await screen.findByRole("button", {name: "OK"});
        await clickOkButton(user);
        await lastNameQuestionShouldBeLoaded();
        await clickPrevButton(user);
        const firstNameInput = await screen.findByRole("textbox");
        expect(firstNameInput.value).toBe(firstName)
    });

    it("should show the warning if the user erases a required answer after already having submitted one and navigating around", async () => {
        await loadFormWithSubsetOfQuestions(1, 3);
        await enterValueIntoTextBox(user, firstName, true);
        await lastNameQuestionShouldBeLoaded();
        await clickPrevButton(user);
        const firstNameInput = await screen.findByRole("textbox");
        await user.clear(firstNameInput)
        await user.type(firstNameInput, "{Delete}");   // We need to add this because the "clear" function doesn't throw the proper keys
        await clickOkButton(user)
        await invalidWarningShouldBeShowing();
        await firstNameQuestionShouldBeLoaded();
    });

    it("should not show a warning if the same answer was submitted twice for a required field", async () => {
        await loadFormWithSubsetOfQuestions(1, 3);
        await enterValueIntoTextBox(user, firstName, true);
        await lastNameQuestionShouldBeLoaded();
        await clickPrevButton(user);
        await clickOkButton(user);
        await invalidWarningShouldNotBeShowing();
        await lastNameQuestionShouldBeLoaded();
    });

    it("should not show a warning if the user doesn't try to move forward", async () => {
        await loadFormWithSubsetOfQuestions(1, 3);
        const firstNameInput = screen.getByRole("textbox");
        await user.click(firstNameInput);
        expect(firstNameInput).toHaveFocus();
        await user.click(screen.getByText("get to know", {exact: false}));
        expect(firstNameInput).not.toHaveFocus();
        await invalidWarningShouldNotBeShowing();
    });

    it("should not show a warning if the user starts typing after submitting an invalid email address", async () => {
        await loadFormWithSubsetOfQuestions(3, 4);
        const emailInput = screen.getByRole("textbox");
        await user.type(emailInput, "abc")
        fireEvent.keyUp(emailInput, { key: 'enter', keyCode: 13 });
        await invalidWarningShouldBeShowing();
        await user.type(emailInput, "john")
        await invalidWarningShouldNotBeShowing();
    });

    it("shouldn't go to an empty screen after the user enters their final answer", async () => {
        await loadFormWithSubsetOfQuestions(1, 3);
        await enterValueIntoTextBox(user, firstName, true);
        await lastNameQuestionShouldBeLoaded();
        const lastNameInput = screen.getByRole("textbox");
        await user.type(lastNameInput, "Doe");
        fireEvent.keyUp(lastNameInput, { key: 'enter', keyCode: 13 });
        await invalidWarningShouldNotBeShowing();
        expect(screen.getByText("2 / 2")).toBeInTheDocument();
        expect(screen.queryByText("3 / 2")).toBeNull();
    });

    it("should remember the answer to a list answer after having set it", async () => {
        await loadFormWithSubsetOfQuestions(6, 8);
        await enterValueIntoTextBox(user, "12345", true)
        const retiredOption = await screen.findByText("Retired")
        userEvent.click(retiredOption);
        await clickPrevButton(user);
        await clickNextButton(user);
        const checkbox = screen.getByRole('checkbox', {name: "Retired"});
        expect(checkbox).toBeChecked();
    });

    it("should remember the answer to a select answer after having set it", async () => {
        let agency = "Bureau of International Labor Affairs";
        await loadFormWithSubsetOfQuestions(8, 10);
        const selectionList = await screen.findByRole("combobox");
        await user.click(selectionList);
        const bilaOption = screen.getByText(agency, {exact: false});
        expect(bilaOption).toBeInTheDocument();
        await user.click(bilaOption);
        await clickNextButton(user);
        await clickPrevButton(user);
        const comboBox = await screen.findByRole("combobox");
        expect(comboBox.value).toBe(agency);
    });

    it("should move to the next screen when selecting from a selection list", async () => {
        let agency = "Bureau of International Labor Affairs";
        await loadFormWithSubsetOfQuestions(8, 10);
        const selectionList = await screen.findByRole("combobox");
        await user.click(selectionList);
        const bilaOption = screen.getByText(agency, {exact: false});
        expect(bilaOption).toBeInTheDocument();
        await user.click(bilaOption);
        await waitFor(() => {expect(selectionList).not.toBeInTheDocument()});
    });

    it("should save the value of a date and move to the next screen when selecting a date from the date picker", async () => {
        await loadFormWithSubsetOfQuestions(10, 12);
        const datePicker = screen.getByLabelText("Choose date", {exact: false});
        await user.click(datePicker);
        await screen.findByRole("grid");
        const dayOfMonth = await screen.findByText("15")
        await user.click(dayOfMonth);
        await clickOkButton(user);
        await waitFor(() => {expect(datePicker).not.toBeInTheDocument()});
        await clickPrevButton(user);
        const inputBox = screen.getByRole("textbox");
        expect(inputBox.value.indexOf("15/20") >= 0).toBe(true);
    });

    it("should save currencies", async () => {
        await loadFormWithSubsetOfQuestions(41, 44);
        const salaryInput = screen.getByRole("textbox");
        await user.type(salaryInput, "120000");
        await clickOkButton(user);
        await invalidWarningShouldNotBeShowing();
        await clickPrevButton(user);
        expect(screen.getByRole("textbox").value).toBe("120,000");
    });

    it("should allow a user to submit an answer in a currency question with the default value", async () => {
        await loadFormWithSubsetOfQuestions(40, 44);
        const salaryInput = screen.getByRole("textbox");
        await user.type(salaryInput, "120000");
        await clickOkButton(user);
        const h3Input = screen.getByRole("textbox");
        expect(h3Input.value).not.toBeNull();
        await clickOkButton(user);
        await invalidWarningShouldNotBeShowing();
    });

    it("should not show conditionally displayed questions if they shouldn't show up", async () => {
        await loadFormWithSubsetOfQuestions(50, 52);
        await clickOkButton(user);
        expect(screen.getByText("What percentage or how much per pay period?", {exact: false})).toBeInTheDocument();
        await clickPrevButton(user);
        let noOption = await screen.findByRole('checkbox', {name: "No"});
        await user.click(noOption);
        expect(screen.queryByText("What percentage or how much per pay period?", {exact: false})).not.toBeInTheDocument();
    });

    it("should take user to the end screen on their last question", async () => {
        await loadFormWithSubsetOfQuestions(50, 52);
        await clickOkButton(user);
        const textBox = screen.getByRole("textbox");
        await user.type(textBox, "212");
        await clickOkButton(user);
        await waitFor(() => {expect(screen.getByText("Thanks for the answers", {exact: false})).toBeInTheDocument()});
    });

    it("should call the submit function and hide the form nav when the user submits the form", async () => {
        const submitAnswersMock = jest.fn(() => {});
        await loadFormWithSubsetOfQuestions(50, 52, submitAnswersMock);
        await clickOkButton(user);
        const textBox = screen.getByRole("textbox");
        await user.type(textBox, "212");
        await clickOkButton(user);
        const submitButton = await screen.findByRole("button", {name: "Submit"});
        const homeButton = await screen.findByRole("button", {name: "Home"});
        expect(homeButton).toBeInTheDocument();
        await user.click(submitButton);
        expect(submitAnswersMock).toBeCalled();
        await new Promise((r) => setTimeout(r, 1000));
        await waitFor(() => {expect(screen.getByText("Thanks for the answers", {exact: false})).toBeInTheDocument()});
    });

    it("should return answers by name when instructed to do so", async () => {
        const submitAnswersMock = jest.fn();
        await loadFormWithSubsetOfQuestions(112, 116, submitAnswersMock);
        await clickOkButton(user);
        await clickOkButton(user);
        await clickOkButton(user);
        const submitButton = await screen.findByRole("button", {name: "Submit"});
        await user.click(submitButton);
        const answersByName = submitAnswersMock.mock.calls[0][0]
        expect(answersByName.get('Risk Tolerance')).toBeDefined();
    })

    it("should filter out interstitial answers and calculated variables from the submitted form", async () => {
        const submitAnswersMock = jest.fn();
        await loadFormWithSubsetOfQuestions(112, 116, submitAnswersMock);
        await clickOkButton(user);
        await clickOkButton(user);
        await clickOkButton(user);
        const submitButton = await screen.findByRole("button", {name: "Submit"});
        await user.click(submitButton);
        const answersByName = submitAnswersMock.mock.calls[0][0];
        expect(answersByName.get('Interstitial - Just A Few More Questions')).toBeUndefined();
        expect(answersByName.get('Estimated Social Security')).toBeUndefined();
        expect(answersByName.get('Tax Rate')).toBe("20%");
    })
});