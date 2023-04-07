/* eslint-disable import/no-extraneous-dependencies */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
// eslint-disable-next-line import/no-extraneous-dependencies
import "@testing-library/jest-dom";
import { server } from "./mocks/server";
// src/setupTests.js
import "./i18n";
import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import "vitest-canvas-mock";
// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

/**
 * Added to avoid matchMedia error
 * on Jest when testing an Antd Form
 */
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    };
  };

window.ResizeObserver = function () {
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };
};
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
// Establish API mocking before all tests.
beforeAll(() => server.listen());

afterEach(() => {
  // runs a cleanup after each test case (e.g. clearing jsdom)
  cleanup();
  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  server.resetHandlers();
});
// Clean up after the tests are finished.
afterAll(() => server.close());
