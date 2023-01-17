import {clickHomeButton, clickNextButton, clickOkButton, clickPrevButton, firstNameQuestionShouldBeLoaded, invalidWarningShouldNotBeShowing, lastNameQuestionShouldBeLoaded, loadForm, loadFormWithSubsetOfQuestions, enterValueIntoTextBox} from "../../../../../utility/TestUtils/FormNavigationUtils";
import {fireEvent, screen} from "@testing-library/react";

beforeEach(() => {
  fetch.resetMocks();
})

describe("Continue Button", () => {
    it("should have a message to press the enter button if the answer type is Text", async () => {
        await loadFormWithSubsetOfQuestions(1, 2);
        expect(screen.getByText("press Enter", {exact: false})).toBeInTheDocument();
    });

    it("should not have a message to press the enter button if the answer type is List", async () => {
        await loadFormWithSubsetOfQuestions(7, 8);
        expect(screen.queryByText("press Enter", {exact: false})).not.toBeInTheDocument();
    });
});