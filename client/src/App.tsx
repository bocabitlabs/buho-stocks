import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "Layout";
import routes from "routes";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        async lazy() {
          const { HomePage } = await import("pages/home/HomePage");
          return { Component: HomePage };
        },
      },
      {
        path: routes.benchmarksRoute,
        async lazy() {
          const { BenchmarksListPage } = await import(
            "pages/benchmarks/BenchmarksListPage/BenchmarksListPage"
          );
          return { Component: BenchmarksListPage };
        },
      },
      {
        path: routes.currenciesRoute,
        async lazy() {
          const { CurrenciesListPage } = await import(
            "pages/currencies/CurrenciesListPage/CurrenciesListPage"
          );
          return { Component: CurrenciesListPage };
        },
      },
      {
        path: routes.importCsvRoute,
        async lazy() {
          const { ImportFromBrokerPage } = await import(
            "pages/import/ImportFromBrokerPage"
          );
          return { Component: ImportFromBrokerPage };
        },
      },
      {
        path: routes.marketsRoute,
        async lazy() {
          const { MarketsListPage } = await import(
            "pages/markets/MarketsListPage/MarketsListPage"
          );
          return { Component: MarketsListPage };
        },
      },
      {
        path: routes.sectorsRoute,
        async lazy() {
          const { SectorsListPage } = await import(
            "pages/sectors/SectorsListPage/SectorsListPage"
          );
          return { Component: SectorsListPage };
        },
      },
      {
        path: routes.settingsRoute,
        async lazy() {
          const { SettingsPage } = await import(
            "pages/settings/SettingsPage/SettingsPage"
          );
          return { Component: SettingsPage };
        },
      },
      {
        path: "/portfolios/*",
        children: [
          {
            path: ":id",
            async lazy() {
              const { PortfolioDetailsPage } = await import(
                "pages/portfolios/PortfolioDetailPage/PortfolioDetailsPage"
              );
              return { Component: PortfolioDetailsPage };
            },
          },
          {
            path: routes.portfoliosChartsRoute,
            async lazy() {
              const { PortfolioChartsPage } = await import(
                "pages/portfolios/PorfolioChartsPage/PortfolioChartsPage"
              );
              return { Component: PortfolioChartsPage };
            },
          },
          {
            path: routes.portfoliosLogsRoute,
            async lazy() {
              const { PortfolioLogTransactionsPage } = await import(
                "pages/portfolios/PortfolioTransactionsLogPage/PortfolioTransactionsLogPage"
              );
              return { Component: PortfolioLogTransactionsPage };
            },
          },
          {
            path: routes.companiesDetailsRoute,
            async lazy() {
              const { CompanyDetailsPage } = await import(
                "pages/companies/CompanyDetailsPage/CompanyDetailsPage"
              );
              return { Component: CompanyDetailsPage };
            },
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
