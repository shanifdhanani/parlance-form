import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {clickOkButton, invalidWarningShouldNotBeShowing, lastNameQuestionShouldBeLoaded, loadFormWithSubsetOfQuestions, enterValueIntoTextBox, clickPrevButton, clickNextButton, invalidWarningShouldBeShowing} from "../../../../../../utility/TestUtils/FormNavigationUtils";
import {Steps} from "../../../../../../data/steps";
import Form from "../../../../Form";

let user = null;
beforeEach(() => {
  fetch.resetMocks();
  user = userEvent.setup();
})

describe("Date Answer", () => {
    it("should not throw an error when clearing the value", async () => {
        await loadFormWithSubsetOfQuestions(10, 11);
        const datePicker = screen.getByLabelText("Choose date", {exact: false});
        await user.click(datePicker);
        await screen.findByRole("grid");
        const dayOfMonth = await screen.findByText("15")
        await user.click(dayOfMonth);
        await user.clear(screen.getByRole("textbox"));
        expect(datePicker).toBeInTheDocument();
    });
});