import Breadcrumbs from "breadcrumbs";
import React, { FC, ReactNode } from "react";

const WrapperPage: FC<ReactNode> = ({ children }) => {
  return (
    <>
      <Breadcrumbs />
      <div
        className="site-layout-background"
        style={{ minHeight: 380 }}
      >
        {children}
      </div>
    </>
  );
};

export default WrapperPage;
