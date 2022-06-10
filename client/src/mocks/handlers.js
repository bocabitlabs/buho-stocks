/* eslint-disable import/no-extraneous-dependencies */
import { rest } from "msw";
import currenciesList from "./responses/currencies";
import marketsResponse from "./responses/markets";
import timezonesResponse from "./responses/markets-timezones";
import settingsMock from "./responses/settings";
import allYears from "./responses/stats-1-year-all";

export const handlers = [
  rest.get("/api/v1/currencies/", (req, res, ctx) => {
    // If authenticated, return a mocked user details
    return res(ctx.status(200), ctx.json(currenciesList));
  }),
  rest.get("/api/v1/markets/", (req, res, ctx) => {
    // If authenticated, return a mocked user details
    return res(ctx.status(200), ctx.json(marketsResponse));
  }),
  rest.get("/api/v1/markets/timezones/", (req, res, ctx) => {
    // If authenticated, return a mocked user details
    return res(ctx.status(200), ctx.json(timezonesResponse));
  }),
  rest.get("/api/v1/settings/", (req, res, ctx) => {
    // If authenticated, return a mocked user details
    return res(ctx.status(200), ctx.json(settingsMock));
  }),
  rest.get("/api/v1/portfolios/1/", (req, res, ctx) => {
    // If authenticated, return a mocked user details
    return res(ctx.status(200), ctx.json(allYears));
  }),
  rest.get("/api/v1/stats/portfolio/1/all-years/", (req, res, ctx) => {
    // If authenticated, return a mocked user details
    return res(ctx.status(200), ctx.json(allYears));
  }),
];

export default handlers;
