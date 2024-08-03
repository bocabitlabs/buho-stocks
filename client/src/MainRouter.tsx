import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "App";
import ScrollToTop from "components/ScrollToTop/ScrollToTop";
import BenchmarksListPage from "pages/benchmarks/BenchmarksListPage/BenchmarksListPage";
import CompanyDetailsPage from "pages/companies/CompanyDetailsPage/CompanyDetailsPage";
import CurrenciesListPage from "pages/currencies/CurrenciesListPage/CurrenciesListPage";
import HomePage from "pages/home/HomePage";
import ImportFromBrokerPage from "pages/import/ImportFromBrokerPage";
import MarketsListPage from "pages/markets/MarketsListPage/MarketsListPage";
import PortfolioChartsPage from "pages/portfolios/PorfolioChartsPage/PortfolioChartsPage";
import PortfolioDetailsPage from "pages/portfolios/PortfolioDetailPage/PortfolioDetailsPage";
import PortfolioTransactionsLogPage from "pages/portfolios/PortfolioTransactionsLogPage/PortfolioTransactionsLogPage";
import SectorsListPage from "pages/sectors/SectorsListPage/SectorsListPage";
import SettingsPage from "pages/settings/SettingsPage/SettingsPage";
import routes from "routes";

export default function Main() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />}>
          <Route path={routes.homeRoute} element={<HomePage />} />
          <Route
            path={routes.benchmarksRoute}
            element={<BenchmarksListPage />}
          />
          <Route
            path={routes.importCsvRoute}
            element={<ImportFromBrokerPage />}
          />
          <Route
            path={routes.portfoliosDetailsRoute}
            element={<PortfolioDetailsPage />}
          />
          <Route
            path={routes.portfoliosLogsRoute}
            element={<PortfolioTransactionsLogPage />}
          />
          <Route
            path={routes.portfoliosChartsRoute}
            element={<PortfolioChartsPage />}
          />
          <Route
            path={routes.companiesDetailsRoute}
            element={<CompanyDetailsPage />}
          />
          <Route
            path={routes.currenciesRoute}
            element={<CurrenciesListPage />}
          />
          <Route path={routes.settingsRoute} element={<SettingsPage />} />
          <Route path={routes.sectorsRoute} element={<SectorsListPage />} />
          <Route path={routes.marketsRoute} element={<MarketsListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
