import React, { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "App";
import RequireAuth from "components/RequireAuth/RequireAuth";
import ScrollToTop from "components/ScrollToTop/ScrollToTop";
import { AlertMessagesContext } from "contexts/alert-messages";
import { AuthContext } from "contexts/auth";
import { useAlertMessagesContext } from "hooks/use-alert-messages/use-alert-messages-context";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import { LoginPage } from "pages/authentication/LoginPage/LoginPage";
import RegisterPage from "pages/authentication/RegisterPage/RegisterPage";
import CompaniesAddPage from "pages/companies/CompaniesAddPage/CompaniesAddPage";
import CompanyDetailsPage from "pages/companies/CompanyDetailsPage/CompanyDetailsPage";
import CompanyEditPage from "pages/companies/CompanyEditPage/CompanyEditPage";
import CurrenciesPage from "pages/currencies/CurrenciesPage/CurrenciesPage";
import DividendsTransactionsAddPage from "pages/dividends/DividendsTransactionsAddPage/DividendsTransactionsAddPage";
import DividendsTransactionsEditPage from "pages/dividends/DividendsTransactionsEditPage/DividendsTransactionsEditPage";
import ImportExportPage from "pages/ImportExportPage/ImportExportPage";
import ImportFromBrokerPage from "pages/ImportFromBrokerPage/ImportFromBrokerPage";
import MarketsAddPage from "pages/markets/MarketsAddPage/MarketsAddPage";
import MarketsEditPage from "pages/markets/MarketsEditPage/MarketsEditPage";
import MarketsListPage from "pages/markets/MarketsListPage/MarketsListPage";
import MarketsPages from "pages/markets/MarketsPages/MarketsPages";
import PortfolioChartsPage from "pages/portfolios/PorfolioChartsPage/PortfolioChartsPage";
import PortfolioDetailsPage from "pages/portfolios/PortfolioDetailPage/PortfolioDetailsPage";
import PortfoliosAddPage from "pages/portfolios/PortfoliosAddPage/PortfoliosAddPage";
import PortfoliosListPage from "pages/portfolios/PortfoliosListPage/PortfoliosListPage";
import PortfolioTransactionsLogPage from "pages/portfolios/PortfolioTransactionsLogPage/PortfolioTransactionsLogPage";
import RightsTransactionsAddPage from "pages/rights/RightsTransactionsAddPage/RightsTransactionsAddPage";
import RightsTransactionsEditPage from "pages/rights/RightsTransactionsEditPage/RightsTransactionsEditPage";
import SectorsAddPage from "pages/sectors/SectorsAddPage/SectorsAddpage";
import SectorsEditPage from "pages/sectors/SectorsEditPage/SectorsEditPage";
import SectorsListPage from "pages/sectors/SectorsListPage/SectorsListPage";
import SectorsPages from "pages/sectors/SectorsPages/SectorsPages";
import SuperSectorsAddPage from "pages/sectors/SuperSectorsAddPage/SuperSectorsAddpage";
import SuperSectorsEditPage from "pages/sectors/SuperSectorsEditPage/SuperSectorsEditPage";
import SettingsPage from "pages/settings/SettingsPage/SettingsPage";
import SharesTransactionsAddPage from "pages/shares/SharesTransactionsAddPage/SharesTransactionsAddPage";
import SharesTransactionsEditPage from "pages/shares/SharesTransactionsEditPage/SharesTransactionsEditPage";
import getRoute, { HOME_ROUTE } from "routes";

export default function Main(): ReactElement {
  const authContext = useAuthContext();
  const messagesContext = useAlertMessagesContext();

  return (
    <AuthContext.Provider value={authContext}>
      <AlertMessagesContext.Provider value={messagesContext}>
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
              <Route path="markets" element={<MarketsPages />}>
                <Route path="" element={<MarketsListPage />} />
                <Route path="add/*" element={<MarketsAddPage />} />
                <Route path=":id" element={<MarketsEditPage />} />
              </Route>
              <Route path="portfolios/add/*" element={<PortfoliosAddPage />} />
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
                path="portfolios/:id/companies/add/*"
                element={<CompaniesAddPage />}
              />
              <Route
                path="portfolios/:id/companies/:companyId"
                element={<CompanyDetailsPage />}
              />
              <Route
                path="portfolios/:id/companies/:companyId/edit"
                element={<CompanyEditPage />}
              />
              <Route
                path="portfolios/:id/companies/:companyId/shares/add/*"
                element={<SharesTransactionsAddPage />}
              />
              <Route
                path="portfolios/:id/companies/:companyId/shares/:transactionId"
                element={<SharesTransactionsEditPage />}
              />
              <Route
                path="portfolios/:id/companies/:companyId/rights/add/*"
                element={<RightsTransactionsAddPage />}
              />
              <Route
                path="portfolios/:id/companies/:companyId/rights/:transactionId"
                element={<RightsTransactionsEditPage />}
              />
              <Route
                path="portfolios/:id/companies/:companyId/dividends/add/*"
                element={<DividendsTransactionsAddPage />}
              />
              <Route
                path="portfolios/:id/companies/:companyId/dividends/:transactionId"
                element={<DividendsTransactionsEditPage />}
              />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="sectors" element={<SectorsPages />}>
                <Route path="" element={<SectorsListPage />} />
                <Route path="add/*" element={<SectorsAddPage />} />
                <Route path=":id" element={<SectorsEditPage />} />
                <Route path="super/add/*" element={<SuperSectorsAddPage />} />
                <Route path="super/:id" element={<SuperSectorsEditPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AlertMessagesContext.Provider>
    </AuthContext.Provider>
  );
}
