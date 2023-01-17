import App from "./App";
import React from 'react';

/**
 * render: lets us render the component as React would
 * screen: a utility for finding elements the same way the user does
 */
import {render, screen} from '@testing-library/react'

describe("App", () => {
    it("Should render the app without crashing", () => {
        render(<App />);
        expect(screen.getByRole("application")).toBeInTheDocument();
    })
})