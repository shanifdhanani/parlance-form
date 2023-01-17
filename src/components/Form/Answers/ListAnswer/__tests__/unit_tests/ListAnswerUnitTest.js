import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {clickOkButton, invalidWarningShouldNotBeShowing, lastNameQuestionShouldBeLoaded, loadFormWithSubsetOfQuestions, enterValueIntoTextBox, clickPrevButton, clickNextButton, invalidWarningShouldBeShowing} from "../../../../../../utility/TestUtils/FormNavigationUtils";
import {Steps} from "../../../../../../data/steps";
import Form from "../../../../Form";

let user = null;
let firstName = "John";

beforeEach(() => {
  fetch.resetMocks();
  user = userEvent.setup();
})

describe("List Answer", () => {
    it("should render all options", async () => {
        await loadFormWithSubsetOfQuestions(7, 8);
        expect(screen.getByText("employed", {exact: false})).toBeInTheDocument();
        expect(screen.getByText("retired", {exact: false})).toBeInTheDocument();
    });

    it("should have a default answer selected if one exists and not move on to the next question automatically", async () => {
        await loadFormWithSubsetOfQuestions(7, 9);
        const checkbox = await screen.findByRole('checkbox', {name: "Employed"});
        await waitFor(() => {expect(checkbox).toBeChecked();})
        await screen.findByText("1 / 2");
    });

    it("should not have a default answer selected if none exists", async () => {
        let questionsCopy = JSON.parse(JSON.stringify(Steps))
        let questions = questionsCopy.slice(7, 8);
        delete questions[0].defaultOption;
        await render(<Form steps={questions} />);
        const checkbox = await screen.findByRole('checkbox', {name: "Retired"});
        expect(checkbox).not.toBeChecked();
    });

    it("should not show a warning when the screen is first loaded", async () => {
        let questions = Steps.slice(7, 8);
        await render(<Form steps={questions} />);
        expect(screen.queryByRole("alert")).toBeNull();
    });

    it("should move on to the next question when a user selects an answer", async() => {
        let questions = Steps.slice(7, 9);
        await render(<Form steps={questions} />);
        const checkbox = await screen.findByRole('checkbox', {name: "Retired"});
        await user.click(checkbox);
        await waitFor(() => {expect(checkbox).not.toBeInTheDocument()})
    });

    it("should not move on to the next question when the screen first loads and a default answer is set", async() => {
        let questions = Steps.slice(7, 9);
        await render(<Form steps={questions} />);
        const checkbox = await screen.findByRole('checkbox', {name: "Retired"});
        expect(checkbox).toBeInTheDocument();
        await new Promise((r) => setTimeout(r, 900));
        expect(screen.getByText("current employment", {exact: false})).toBeInTheDocument();
    })

    it("should not show an error when all options are deselected and it's a required field until they try to submit the answer", async () => {
        let questions = Steps.slice(7, 8);
        await render(<Form steps={questions} />);
        const checkbox = await screen.findByRole('checkbox', {name: "Employed"});
        await waitFor(() => {expect(checkbox).toBeChecked();})
        await user.click(checkbox);
        await waitFor(() => {expect(checkbox).not.toBeChecked();});
        await invalidWarningShouldNotBeShowing();
        await clickOkButton(user);
        await invalidWarningShouldBeShowing();
        const retiredCheckbox = await screen.findByRole('checkbox', {name: "Retired"});
        await user.click(retiredCheckbox);
        await invalidWarningShouldNotBeShowing();
    });

    it("should allow the user to submit an answer with additional details and remember that answer after navigating", async () => {
        let questions = Steps.slice(38, 40);
        await render(<Form steps={questions} />);
        let otherCheckbox = await screen.findByRole('checkbox', {name: "Other (enter details below)"});
        let asapCheckbox = await screen.findByRole('checkbox', {name: "ASAP!"});
        await user.click(otherCheckbox);
        let textbox = await screen.findByRole("textbox")
        await user.type(textbox, "ABC")
        fireEvent.keyUp(textbox, { key: 'Enter', keyCode: 13 }); // Test for enter
        await clickPrevButton(user);
        textbox = await screen.findByRole("textbox");
        expect(otherCheckbox).toBeChecked();
        expect(asapCheckbox).not.toBeChecked();
        expect(textbox.value).toBe("ABC");

        textbox = await screen.findByRole("textbox");
        await user.clear(textbox);
        await user.type(textbox, "de");
        await clickNextButton(user);    // Test for next button
        await clickPrevButton(user);
        otherCheckbox = await screen.findByRole('checkbox', {name: "Other (enter details below)"});
        asapCheckbox = await screen.findByRole('checkbox', {name: "ASAP!"});
        textbox = await screen.findByRole("textbox");
        expect(otherCheckbox).toBeChecked();
        expect(asapCheckbox).not.toBeChecked();
        expect(textbox.value).toBe("de");

        textbox = await screen.findByRole("textbox");
        await user.clear(textbox);
        await user.type(textbox, "fg");
        await clickOkButton(user);    // Test for OK button
        await clickPrevButton(user);
        otherCheckbox = await screen.findByRole('checkbox', {name: "Other (enter details below)"});
        asapCheckbox = await screen.findByRole('checkbox', {name: "ASAP!"});
        textbox = await screen.findByRole("textbox");
        expect(otherCheckbox).toBeChecked();
        expect(asapCheckbox).not.toBeChecked();
        expect(textbox.value).toBe("fg");
    });
});