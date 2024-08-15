import { http, HttpResponse } from "msw";
import currenciesList from "./responses/currencies";
import marketsResponse from "./responses/markets";
import timezonesResponse from "./responses/markets-timezones";
import settingsMock from "./responses/settings";
import allYears from "./responses/stats-1-year-all";

export const handlers = [
  http.get("http://127.0.0.1:8001/api/v1/currencies/", () => {
    return HttpResponse.json(currenciesList);
  }),
  http.get("http://127.0.0.1:8001/api/v1/markets/", () => {
    return HttpResponse.json(marketsResponse);
  }),
  http.get("http://127.0.0.1:8001/api/v1/timezones/", () => {
    return HttpResponse.json(timezonesResponse);
  }),
  http.get("http://127.0.0.1:8001/api/v1/settings/", () => {
    return HttpResponse.json(settingsMock);
  }),
  http.get("http://127.0.0.1:8001/api/v1/portfolios/1/", () => {
    return HttpResponse.json(allYears);
  }),
  http.get("http://127.0.0.1:8001/api/v1/stats/portfolio/1/", () => {
    return HttpResponse.json(allYears);
  }),
];

export default handlers;
