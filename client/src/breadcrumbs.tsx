import React from "react";
import { Translation } from "react-i18next";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";

export default function breadCrumbRender(props: any, originBreadcrumb: any) {
  const homeRoute = {
    path: "/home",
    title: <Translation>{(t) => <>{t("Home")}</>}</Translation>,
  };

  return (
    <Breadcrumb>
      <Breadcrumb.Item key={homeRoute.path}>
        <Link key={homeRoute.path} to={homeRoute.path}>
          {homeRoute.title}
        </Link>
      </Breadcrumb.Item>
      {originBreadcrumb.props.items.map((route: any) => {
        return (
          <Breadcrumb.Item key={route.path}>
            <Link key={route.path} to={route.path}>
              {route.title}
            </Link>
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}
