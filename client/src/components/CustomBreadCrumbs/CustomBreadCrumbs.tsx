import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";

interface Props {
  breadCrumbs: any[];
}

export default function CustomBreadCrumbs({
  breadCrumbs,
}: Props): ReactElement {
  return (
    <div>
      <Breadcrumb.Item key="home">
        <Link to="/app/home">
          <HomeOutlined />
        </Link>
      </Breadcrumb.Item>
      {breadCrumbs.map((breadCrumb: any) => (
        <Breadcrumb.Item key={breadCrumb.path}>
          <Link to={breadCrumb.path}>{breadCrumb.title}</Link>
        </Breadcrumb.Item>
      ))}
    </div>
  );
}
