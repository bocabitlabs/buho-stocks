import React, { ReactElement } from "react";
import { Layout } from "antd";
import { PACKAGE_VERSION } from "version";

export default function PageFooter(): ReactElement {
  return (
    <Layout.Footer style={{ textAlign: "center", zIndex: 999 }}>
      Buho Stocks {PACKAGE_VERSION} - Bocabitlabs ©2021 -{" "}
      {new Date().getFullYear()}
    </Layout.Footer>
  );
}
