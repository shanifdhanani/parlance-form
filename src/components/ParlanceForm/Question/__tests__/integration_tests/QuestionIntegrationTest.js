import userEvent from "@testing-library/user-event";
import {clickNextButton, clickOkButton, invalidWarningShouldBeShowing, invalidWarningShouldNotBeShowing, lastNameQuestionShouldBeLoaded, loadFormWithSubsetOfQuestions, enterValueIntoTextBox, clickPrevButton} from "../../../../../utility/TestUtils/FormNavigationUtils";
import {fireEvent, render, screen} from "@testing-library/react";
import {Steps} from "../../../../../data/steps";
import ParlanceForm from "../../../../ParlanceForm/ParlanceForm";

let user = null;
let firstName = "John";

beforeEach(() => {
  fetch.resetMocks();
  user = userEvent.setup();
})

describe("Question", () => {
    it("should submit a valid answer when clicking the OK button", async () => {
        await loadFormWithSubsetOfQuestions(1, 3);
        await enterValueIntoTextBox(user, firstName);
        await clickOkButton(user);
        await invalidWarningShouldNotBeShowing();
        await lastNameQuestionShouldBeLoaded();
    });

    it("should submit a valid answer when hitting enter", async () => {
        await loadFormWithSubsetOfQuestions(1, 3);
        await enterValueIntoTextBox(user, firstName, true);
        await invalidWarningShouldNotBeShowing();
        await lastNameQuestionShouldBeLoaded();
    });

    it("should properly replace the placeholder for the first name", async () => {
        await loadFormWithSubsetOfQuestions(1, 3);
        await enterValueIntoTextBox(user, firstName);
        await clickOkButton(user);
        await lastNameQuestionShouldBeLoaded();
        expect(screen.getByText("Great! Nice to meet you " + firstName, {exact: false})).toBeInTheDocument();
    });

    it("should handle conditional prompts appropriately", async () => {
        await loadFormWithSubsetOfQuestions(7, 9);
        const retiredCheckbox = await screen.findByRole('checkbox', {name: "Retired"});
        await user.click(retiredCheckbox);
        await screen.findByText("Which agency did you work for? *", {exact: true});
        await clickPrevButton(user);
        const employedCheckbox = await screen.findByRole('checkbox', {name: "Employed"});
        await user.click(employedCheckbox);
        await screen.findByText("Which agency do you work for? *", {exact: true});
    })
});

describe("Invalid Warning", () => {
    it("should show up when no value is provided to a required text field and the OK button is pressed", async () => {
        await loadFormWithSubsetOfQuestions(1, 4);
        await clickOkButton(user);
        await invalidWarningShouldBeShowing();
    });

    it("should show up when no value is provided to a required text field and the Enter button is pressed", async () => {
        await loadFormWithSubsetOfQuestions(1, 4);
        const firstNameInput = screen.getByRole("textbox");
        fireEvent.keyUp(firstNameInput, { key: 'enter', keyCode: 13 })
        await invalidWarningShouldBeShowing();
    });

    it("should show up when no value is provided to a required text field and the Next button is pressed", async () => {
        await loadFormWithSubsetOfQuestions(1, 4);
        await clickNextButton(user);
        await invalidWarningShouldBeShowing();
    });

    it("should show the OK button after typing a valid answer following trying to submit an invalid answer", async () => {
        await loadFormWithSubsetOfQuestions(1, 4);
        await clickOkButton(user);
        await invalidWarningShouldBeShowing();
        await enterValueIntoTextBox(user, firstName);
        const okButton = await screen.findByRole("button", {name: "OK"});
        expect(okButton).toBeInTheDocument();
    });

    it("should submit a valid answer after trying to submit an invalid answer", async () => {
        await loadFormWithSubsetOfQuestions(1, 4);
        await clickOkButton(user);
        await invalidWarningShouldBeShowing();
        await enterValueIntoTextBox(user, firstName);
        await screen.findByRole("button", {name: "OK"});
        await clickOkButton(user);
        await lastNameQuestionShouldBeLoaded();
    });

    it("should show a warning if the user submits an empty email then types an invalid email and then hits enter", async () => {
        await loadFormWithSubsetOfQuestions(1, 4);
        await enterValueIntoTextBox(user, firstName, true);
        await lastNameQuestionShouldBeLoaded();
        const lastNameInput = screen.getByRole("textbox");
        await user.type(lastNameInput, "Doe");
        fireEvent.keyUp(lastNameInput, { key: 'enter', keyCode: 13 });
        await screen.findByText(/Email/i);
        const emailInput = screen.getByRole("textbox");
        fireEvent.keyUp(emailInput, { key: 'enter', keyCode: 13 });
        await invalidWarningShouldBeShowing();
        await user.type(emailInput, "john")
        await invalidWarningShouldNotBeShowing();
        fireEvent.keyUp(emailInput, { key: 'enter', keyCode: 13 });
        await invalidWarningShouldBeShowing();
    });

    it("should not show a warning if the user submits an empty phone number when it's not required", async () => {
        let questionsCopy = JSON.parse(JSON.stringify(Steps))
        let questions = questionsCopy.slice(4, 6);
        questions[0].required = false;
        await render(<ParlanceForm steps={questions} />);
        await clickOkButton(user);
        await invalidWarningShouldNotBeShowing();
        await screen.findByText("Thanks!", {exact: false});
    });
})