// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
require ("./utility/TestUtils/FormNavigationUtils")
global.fetch = require('jest-fetch-mock');

jest.setTimeout(120000);

function sleep() {
    return new Promise(r => setTimeout(r, 2000));
}

/* Test utils */
