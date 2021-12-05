import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { pathToRegexp } from "path-to-regexp";
import { CompaniesContext } from "contexts/companies";
import { CurrenciesContext } from "contexts/currencies";
import { DividendsTransactionsContext } from "contexts/dividends-transactions";
import { MarketsContext } from "contexts/markets";
import { PortfoliosContext } from "contexts/portfolios";
import { RightsTransactionsContext } from "contexts/rights-transactions";
import { SectorsContext } from "contexts/secctors";
import { SharesTransactionsContext } from "contexts/shares-transactions";

interface IDict {
  [key: string]: string;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { market } = useContext(MarketsContext);
  const { portfolio } = useContext(PortfoliosContext);
  const { company } = useContext(CompaniesContext);
  const { sector } = useContext(SectorsContext);
  const { currency } = useContext(CurrenciesContext);
  const { transaction: sharesTransaction } = useContext(
    SharesTransactionsContext
  );
  const { transaction: rightsTransaction } = useContext(
    RightsTransactionsContext
  );
  const { transaction: dividendsTransaction } = useContext(
    DividendsTransactionsContext
  );
  const breadcrumbNameMap: IDict = {
    "/app/currencies": "Currencies",
    "/app/currencies/:id": `${currency?.name}`,
    "/app/home": "Home",
    "/app/import-export": "Import & Export",
    "/app/settings": "Settings",
    "/app/markets": "Markets",
    "/app/markets/:id": `${market?.name}`,
    "/app/markets/:id/edit": `Edit: ${market?.name}`,
    "/app/portfolios": "Portfolios",
    "/app/portfolios/:id": ` ${portfolio?.name}`,
    "/app/portfolios/:id/companies/:companyId": `${company?.name}`,
    "/app/portfolios/:id/companies/:companyId/shares/add": `Add shares`, // order matters. Must be before the edit
    "/app/portfolios/:id/companies/:companyId/shares/:transactionId": `Edit shares transaction: ${sharesTransaction?.id}`,
    "/app/portfolios/:id/companies/:companyId/rights/add": `Add rights`, // order matters. Must be before the edit
    "/app/portfolios/:id/companies/:companyId/rights/:transactionId": `Edit rights transaction: ${rightsTransaction?.id}`,
    "/app/portfolios/:id/companies/:companyId/dividends/add": `Add dividends`, // order matters. Must be before the edit
    "/app/portfolios/:id/companies/:companyId/dividends/:transactionId": `Edit dividends transaction: ${dividendsTransaction?.id}`,
    "/app/profile": "Profile",
    "/app/sectors": "Sectors",
    "/app/sectors/:id": `${sector?.name}`
  };

  // const pathSnippets = location.pathname.split("/").filter((i) => i);
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  // pathSnippets.shift();
  const extraBreadcrumbItems: any[] = [];
  pathSnippets.forEach((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    let addFound = false;
    Object.keys(breadcrumbNameMap).forEach((item) => {
      if (pathToRegexp(item).test(url)) {
        console.log(pathToRegexp(item).test(url), url);
        console.log(item);
        if (!addFound) {
          extraBreadcrumbItems.push(
            <Breadcrumb.Item key={url}>
              <Link to={url}>{breadcrumbNameMap[item]}</Link>
            </Breadcrumb.Item>
          );
        }

        if (item.endsWith("/add")) {
          addFound = true;
        }
      }
    });
  });
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/app/home">
        <HomeOutlined />
      </Link>
    </Breadcrumb.Item>
  ].concat(extraBreadcrumbItems);
  return (
    <div className="demo">
      <Breadcrumb style={{ margin: "16px 0" }}>{breadcrumbItems}</Breadcrumb>
    </div>
  );
};

Breadcrumbs.defaultProps = {
  portfolioName: ""
};

export default Breadcrumbs;
