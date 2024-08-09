import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "Layout";
import BenchmarksListPage from "pages/benchmarks/BenchmarksListPage/BenchmarksListPage";
import CompanyDetailsPage from "pages/companies/CompanyDetailsPage/CompanyDetailsPage";
import CurrenciesListPage from "pages/currencies/CurrenciesListPage/CurrenciesListPage";
import HomePage from "pages/home/HomePage";
import ImportFromBrokerPage from "pages/import/ImportFromBrokerPage";
import MarketsListPage from "pages/markets/MarketsListPage/MarketsListPage";
import PortfolioChartsPage from "pages/portfolios/PorfolioChartsPage/PortfolioChartsPage";
import PortfolioDetailsPage from "pages/portfolios/PortfolioDetailPage/PortfolioDetailsPage";
import PortfolioLogTransactionsPage from "pages/portfolios/PortfolioTransactionsLogPage/PortfolioTransactionsLogPage";
import SectorsListPage from "pages/sectors/SectorsListPage/SectorsListPage";
import SettingsPage from "pages/settings/SettingsPage/SettingsPage";
import routes from "routes";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: routes.benchmarksRoute, element: <BenchmarksListPage /> },
      { path: routes.currenciesRoute, element: <CurrenciesListPage /> },
      { path: routes.importCsvRoute, element: <ImportFromBrokerPage /> },
      { path: routes.marketsRoute, element: <MarketsListPage /> },
      { path: routes.sectorsRoute, element: <SectorsListPage /> },
      { path: routes.settingsRoute, element: <SettingsPage /> },
      {
        path: "/portfolios/*",
        children: [
          { path: ":id", element: <PortfolioDetailsPage /> },
          {
            path: routes.portfoliosChartsRoute,
            element: <PortfolioChartsPage />,
          },
          {
            path: routes.portfoliosLogsRoute,
            element: <PortfolioLogTransactionsPage />,
          },
          {
            path: routes.companiesDetailsRoute,
            element: <CompanyDetailsPage />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
