import React, { ReactNode } from "react";
import { PageHeader } from "antd";

interface Props {
  children: ReactNode;
  title: string;
}
function ImportFromBrokerPageHeader({ children, title }: Props) {
  return (
    <PageHeader className="site-page-header" title={title}>
      {children}
    </PageHeader>
  );
}

export default ImportFromBrokerPageHeader;
