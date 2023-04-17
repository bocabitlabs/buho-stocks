import React from "react";
import { Translation } from "react-i18next";
// import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";

export default function breadCrumbRender(props: any, originBreadcrumb: any) {
  const homeRoute = {
    href: "/home",
    title: <Translation>{(t) => <>{t("Home")}</>}</Translation>,
  };
  const allRoutes = [homeRoute, ...originBreadcrumb.props.items];

  return <Breadcrumb items={allRoutes} />;
}
