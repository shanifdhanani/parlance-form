import React from 'react';
import {render, waitFor, waitForElementToBeRemoved, screen, fireEvent} from '@testing-library/react';
import ParlanceForm from "../ParlanceForm";
import {Steps} from "../../../data/steps";

beforeEach(() => {
  fetch.resetMocks();
})

describe("form", () => {
    it("should render a welcome screen", () => {
        render(<ParlanceForm steps={Steps} />);
        expect(screen.getByRole("heading")).toBeInTheDocument();
    });
})