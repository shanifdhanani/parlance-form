import React from 'react';
import {render, waitFor, waitForElementToBeRemoved, screen, fireEvent} from '@testing-library/react';
import Form from "../Form";
import {Steps} from "../../../data/steps";

beforeEach(() => {
  fetch.resetMocks();
})

describe("form", () => {
    it("should render a welcome screen", () => {
        render(<Form steps={Steps} />);
        expect(screen.getByRole("heading")).toBeInTheDocument();
    });
})