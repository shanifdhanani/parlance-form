import {fireEvent, render, screen} from "@testing-library/react";
import {Steps} from "../../data/steps";
import ParlanceForm from "../../components/ParlanceForm/ParlanceForm";

export async function loadForm() {
    await render(<ParlanceForm steps={Steps} />)
    await screen.findByText("Welcome", {exact: false})
}

export async function clickOkButton(user) {
    const okButton = screen.getByRole("button", {name: "OK"});
    await user.click(okButton);
}

export async function clickNextButton(user) {
    const nextButton = screen.getByRole("button", {name: "Next"});
    await user.click(nextButton);
}

export async function clickPrevButton(user) {
    const prevButton = screen.getByRole("button", {name: "Prev"});
    await user.click(prevButton);
}

export async function clickHomeButton(user) {
    const homeButton = screen.getByRole("button", {name: "Home"});
    await user.click(homeButton);
}

export async function navigateToFirstQuestion() {
    await loadForm();
    const getStartedButton = screen.getByRole("button", {name: "Let's get started"});
    expect(getStartedButton).not.toBeDisabled();

    /* For some reason, when we used user.click(...) in this refactored method (rather than in the main test method), it stopped working. Some research online
     * that using fireEvent should work instead, which it does.
     */
    fireEvent.click(getStartedButton);
    expect(screen.getByText("get to know each other", {exact: false})).toBeInTheDocument();
}

export async function lastNameQuestionShouldBeLoaded() {
    const secondQuestion = await screen.findByText("Great! Nice to meet you", {exact: false})
    expect(secondQuestion).toBeInTheDocument();
}

export async function firstNameQuestionShouldBeLoaded() {
    expect(screen.queryByText(/get to know/i)).toBeInTheDocument();
}

export async function invalidWarningShouldNotBeShowing() {
    const invalidValueWarning = await screen.queryByRole("alert");
    expect(invalidValueWarning).toBeNull();
}

export async function enterValueIntoTextBox(user, valueToEnter = "John", hitEnter = false) {
    const input = screen.getByRole("textbox");
    await user.type(input, valueToEnter);
    if (hitEnter) {
        // Again, for some reason, user events are not working here so we have to go with fireEvent
        fireEvent.keyUp(input, { key: 'Enter', keyCode: 13 })
    }
}

export async function invalidWarningShouldBeShowing() {
    const invalidValueWarning = await screen.findByRole("alert");
    expect(invalidValueWarning).toBeInTheDocument();
}

export async function loadFormWithSubsetOfQuestions(start, end, submitFunction = null, hideProgress = false) {
    await render(<ParlanceForm
        steps={Steps.slice(start, end)}
        submitAnswers={submitFunction}
        returnAnswersByName={true}
        filterOutCalculatedVariables={true}
        hideProgress={hideProgress}
        endScreenPrompt={"Thanks for the answers! Once you submit your answers a member of our team will be in touch"} />)
}