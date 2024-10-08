import { http, HttpResponse } from "msw";
import currenciesList from "./responses/currencies";
import allMarkets from "./responses/markets/allMarkets";
import {
  page1Markets,
  page2Markets,
} from "./responses/markets/paginatedMarkets";
import timezonesResponse from "./responses/markets-timezones";
import settingsMock from "./responses/settings";
import allYears from "./responses/stats-1-year-all";

export const handlers = [
  http.get("http://127.0.0.1:8001/api/v1/currencies/", () => {
    return HttpResponse.json(currenciesList);
  }),
  http.get("http://127.0.0.1:8001/api/v1/markets/", ({ request }) => {
    const url = new URL(request.url);
    // Read the "id" URL query parameter using the "URLSearchParams" API.
    // Given "/product?id=1", "productId" will equal "1".
    const offset = url.searchParams.get("offset");
    const limit = url.searchParams.get("limit");

    if (offset === "0" && limit === "4") {
      return HttpResponse.json(page1Markets);
    }
    if (offset === "4" && limit === "4") {
      return HttpResponse.json(page2Markets);
    }

    return HttpResponse.json(allMarkets);
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
