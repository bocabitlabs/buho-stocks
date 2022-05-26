import React, { ReactElement } from "react";
import { QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "react-query/devtools";
import queryClient from "api/query-client";
import App from "App";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import RequireAuth from "components/RequireAuth/RequireAuth";
import ScrollToTop from "components/ScrollToTop/ScrollToTop";
import SetupAxios from "components/SetupAxios/SetupAxios";
import { AuthContext } from "contexts/auth";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import getRoute, { HOME_ROUTE } from "routes";

const CompanyDetailsPage = React.lazy(
  () => import("pages/companies/CompanyDetailsPage/CompanyDetailsPage"),
);
const CurrenciesPage = React.lazy(
  () => import("pages/currencies/CurrenciesPage/CurrenciesPage"),
);
const ImportExportPage = React.lazy(
  () => import("pages/ImportExportPage/ImportExportPage"),
);
const ImportFromBrokerPage = React.lazy(
  () => import("pages/ImportFromBrokerPage/ImportFromBrokerPage"),
);
const LoginPage = React.lazy(
  () => import("pages/authentication/LoginPage/LoginPage"),
);
const MarketsListPage = React.lazy(
  () => import("pages/markets/MarketsListPage/MarketsListPage"),
);
const PortfolioDetailsPage = React.lazy(
  () => import("pages/portfolios/PortfolioDetailPage/PortfolioDetailsPage"),
);
const PortfolioChartsPage = React.lazy(
  () => import("pages/portfolios/PorfolioChartsPage/PortfolioChartsPage"),
);
const PortfoliosListPage = React.lazy(
  () => import("pages/portfolios/PortfoliosListPage/PortfoliosListPage"),
);
const PortfolioTransactionsLogPage = React.lazy(
  () =>
    import(
      "pages/portfolios/PortfolioTransactionsLogPage/PortfolioTransactionsLogPage"
    ),
);
const RegisterPage = React.lazy(
  () => import("pages/authentication/RegisterPage/RegisterPage"),
);
const SectorsListPage = React.lazy(
  () => import("pages/sectors/SectorsListPage/SectorsListPage"),
);
const SettingsPage = React.lazy(
  () => import("pages/settings/SettingsPage/SettingsPage"),
);

export default function Main(): ReactElement {
  const authContext = useAuthContext();

  return (
    <AuthContext.Provider value={authContext}>
      <QueryClientProvider client={queryClient}>
        <React.Suspense fallback={<LoadingSpin />}>
          <BrowserRouter>
            <SetupAxios />
            <ScrollToTop />
            <Routes>
              <Route path="app-login" element={<LoginPage />} />
              <Route path="app-register" element={<RegisterPage />} />
              <Route
                path="/"
                element={<Navigate to={getRoute(HOME_ROUTE)} />}
              />
              <Route
                path="app"
                element={
                  <RequireAuth>
                    <App />
                  </RequireAuth>
                }
              >
                <Route
                  path=""
                  element={<Navigate to={getRoute(HOME_ROUTE)} />}
                />
                <Route path="currencies" element={<CurrenciesPage />} />
                <Route path="home" element={<PortfoliosListPage />} />
                <Route path="import-export" element={<ImportExportPage />} />
                <Route
                  path="import/:brokerId"
                  element={<ImportFromBrokerPage />}
                />
                <Route path="markets" element={<MarketsListPage />} />
                <Route
                  path="portfolios/:id"
                  element={<PortfolioDetailsPage />}
                />
                <Route
                  path="portfolios/:id/log/*"
                  element={<PortfolioTransactionsLogPage />}
                />
                <Route
                  path="portfolios/:id/charts/*"
                  element={<PortfolioChartsPage />}
                />
                <Route
                  path="portfolios/:id/companies/:companyId"
                  element={<CompanyDetailsPage />}
                />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="sectors" element={<SectorsListPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </React.Suspense>
      </QueryClientProvider>
      <ToastContainer position="top-center" theme="colored" newestOnTop />
    </AuthContext.Provider>
  );
}
