import React from "react";
import { Link } from "react-router-dom";

export function breadcrumbItemRender(route: any) {
  return (
    <Link to={route.path}>
      {route.icon} {!route.iconOnly && route.breadcrumbName}
    </Link>
  );
}

export default breadcrumbItemRender;
