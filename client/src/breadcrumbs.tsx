import React from "react";
import { Translation } from "react-i18next";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";

export default function breadCrumbRender(props: any, originBreadcrumb: any) {
  const homeRoute = {
    path: "/home",
    breadcrumbName: <Translation>{(t) => <>{t("Home")}</>}</Translation>,
  };
  return (
    <Breadcrumb>
      <Breadcrumb.Item key={homeRoute.path}>
        <Link key={homeRoute.path} to={homeRoute.path}>
          {homeRoute.breadcrumbName}
        </Link>
      </Breadcrumb.Item>
      {originBreadcrumb.props.routes.map((route: any) => {
        return (
          <Breadcrumb.Item key={route.path}>
            <Link key={route.path} to={route.path}>
              {route.breadcrumbName}
            </Link>
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}
