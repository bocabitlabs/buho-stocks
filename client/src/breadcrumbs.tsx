import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { pathToRegexp } from "path-to-regexp";

interface IDict {
  [key: string]: string;
}

function Breadcrumbs() {
  const location = useLocation();
  const { id, companyId, transactionId } = useParams();

  const breadcrumbNameMap: IDict = {
    "/app/currencies": "Currencies",
    "/app/currencies/:id": `Edit ${id}`,
    "/app/home": "Home",
    "/app/import-export": "Import & Export",
    "/app/settings": "Settings",
    "/app/markets": "Markets",
    "/app/markets/add": "Add market",
    "/app/markets/:id": `Edit ${id}`,
    "/app/markets/:id/edit": `Edit`,
    "/app/portfolios/add": `Add portfolio`,
    "/app/portfolios/:id": `Portfolio ${id}`,
    "/app/portfolios/:id/companies/add": `Add company`,
    "/app/portfolios/:id/companies/:companyId": `Company ${companyId}`,
    "/app/portfolios/:id/companies/:companyId/edit": `Edit ${companyId}`,
    "/app/portfolios/:id/companies/:companyId/shares/add": `Add shares`, // order matters. Must be before the edit
    "/app/portfolios/:id/companies/:companyId/shares/:transactionId": `Edit shares transaction ${transactionId}`,
    "/app/portfolios/:id/companies/:companyId/rights/add": `Add rights`, // order matters. Must be before the edit
    "/app/portfolios/:id/companies/:companyId/rights/:transactionId": `Edit rights transaction ${transactionId}`,
    "/app/portfolios/:id/companies/:companyId/dividends/add": `Add dividends`, // order matters. Must be before the edit
    "/app/portfolios/:id/companies/:companyId/dividends/:transactionId": `Edit dividends transaction ${transactionId}`,
    "/app/profile": "Profile",
    "/app/sectors": "Sectors",
    "/app/sectors/add": "Add sector",
    "/app/sectors/:id": `Edit`,
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
        if (!addFound) {
          extraBreadcrumbItems.push(
            <Breadcrumb.Item key={url}>
              <Link to={url}>{breadcrumbNameMap[item]}</Link>
            </Breadcrumb.Item>,
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
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);
  return (
    <div className="demo">
      <Breadcrumb style={{ margin: "16px 0" }}>{breadcrumbItems}</Breadcrumb>
    </div>
  );
}

Breadcrumbs.defaultProps = {
  portfolioName: "",
};

export default Breadcrumbs;
