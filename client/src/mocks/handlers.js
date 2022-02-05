/* eslint-disable import/no-extraneous-dependencies */
import { rest } from "msw";
import currenciesList from "./responses/currencies";
import settingsMock from "./responses/settings";

export const handlers = [
  rest.get("/api/v1/currencies/", (req, res, ctx) => {
    // If authenticated, return a mocked user details
    return res(ctx.status(200), ctx.json(currenciesList));
  }),
  rest.get("/api/v1/settings/", (req, res, ctx) => {
    // If authenticated, return a mocked user details
    return res(ctx.status(200), ctx.json(settingsMock));
  }),
];

export default handlers;
