import React, { ReactElement } from "react";
import { Footer } from "antd/lib/layout/layout";
import packageJson from "../../../package.json";

export default function PageFooter(): ReactElement {
  return (
    <Footer style={{ textAlign: "center", zIndex: 999 }}>
      Buho Stocks {packageJson.version} - Bocabitlabs ©2021 -{" "}
      {new Date().getFullYear()}
    </Footer>
  );
}
