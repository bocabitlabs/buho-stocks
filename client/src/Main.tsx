import React, { ReactElement } from "react";
import { QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "react-query/devtools";
import queryClient from "api/query-client";
import App from "App";
import RequireAuth from "components/RequireAuth/RequireAuth";
import ScrollToTop from "components/ScrollToTop/ScrollToTop";
import { AuthContext } from "contexts/auth";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import { LoginPage } from "pages/authentication/LoginPage/LoginPage";
import RegisterPage from "pages/authentication/RegisterPage/RegisterPage";
import CompanyDetailsPage from "pages/companies/CompanyDetailsPage/CompanyDetailsPage";
import CurrenciesPage from "pages/currencies/CurrenciesPage/CurrenciesPage";
import ImportExportPage from "pages/ImportExportPage/ImportExportPage";
import ImportFromBrokerPage from "pages/ImportFromBrokerPage/ImportFromBrokerPage";
import MarketsListPage from "pages/markets/MarketsListPage/MarketsListPage";
import PortfolioChartsPage from "pages/portfolios/PorfolioChartsPage/PortfolioChartsPage";
import PortfolioDetailsPage from "pages/portfolios/PortfolioDetailPage/PortfolioDetailsPage";
import PortfoliosListPage from "pages/portfolios/PortfoliosListPage/PortfoliosListPage";
import PortfolioTransactionsLogPage from "pages/portfolios/PortfolioTransactionsLogPage/PortfolioTransactionsLogPage";
import SectorsListPage from "pages/sectors/SectorsListPage/SectorsListPage";
import SettingsPage from "pages/settings/SettingsPage/SettingsPage";
import getRoute, { HOME_ROUTE } from "routes";

export default function Main(): ReactElement {
  const authContext = useAuthContext();

  return (
    <AuthContext.Provider value={authContext}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="app-login" element={<LoginPage />} />
            <Route path="app-register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to={getRoute(HOME_ROUTE)} />} />
            <Route
              path="app"
              element={
                <RequireAuth>
                  <App />
                </RequireAuth>
              }
            >
              <Route path="" element={<Navigate to={getRoute(HOME_ROUTE)} />} />
              <Route path="currencies" element={<CurrenciesPage />} />
              <Route path="home" element={<PortfoliosListPage />} />
              <Route path="import-export" element={<ImportExportPage />} />
              <Route
                path="import/:brokerId"
                element={<ImportFromBrokerPage />}
              />
              <Route path="markets" element={<MarketsListPage />} />
              <Route path="portfolios/:id" element={<PortfolioDetailsPage />} />
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
      </QueryClientProvider>
      <ToastContainer position="top-center" theme="colored" newestOnTop />
    </AuthContext.Provider>
  );
}
