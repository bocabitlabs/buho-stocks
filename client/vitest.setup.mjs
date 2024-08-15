import "@testing-library/jest-dom/vitest";
import { QueryCache } from "@tanstack/react-query"
import { cleanup } from "@testing-library/react";

import { vi } from "vitest";
import { server } from "./src/mocks/server";
import "vitest-canvas-mock";
import "./src/i18n";

const queryCache = new QueryCache()
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
window.HTMLElement.prototype.scrollIntoView = () => {};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;


// import { server } from "./mocks/server";
// import "./i18n";
// import matchers from "@testing-library/jest-dom/matchers";
// import "vitest-canvas-mock";
// // extends Vitest's expect method with methods from react-testing-library
// expect.extend(matchers);

// /**
//  * Added to avoid matchMedia error
//  * on Jest when testing an Antd Form
//  */
// global.matchMedia =
//   global.matchMedia ||
//   function () {
//     return {
//       matches: false,
//       addListener: vi.fn(),
//       removeListener: vi.fn(),
//     };
//   };

// window.ResizeObserver = function () {
//   return {
//     observe: vi.fn(),
//     unobserve: vi.fn(),
//     disconnect: vi.fn(),
//   };
// };
// const { getComputedStyle } = window;
// window.getComputedStyle = (elt) => getComputedStyle(elt);
// Establish API mocking before all tests.

/**
 * MSW server setup
 */
beforeAll(() => server.listen());

afterEach(() => {
  // runs a cleanup after each test case (e.g. clearing jsdom)
  cleanup();
  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  server.resetHandlers();
  queryCache.clear()
});
// Clean up after the tests are finished.
afterAll(() => server.close());
