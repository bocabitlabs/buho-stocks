import React, { FC, ReactNode } from "react";
import Breadcrumbs from "breadcrumbs";

const WrapperPage: FC<ReactNode> = ({ children }) => {
  return (
    <>
      <Breadcrumbs />
      <div className="site-layout-background" style={{ minHeight: 380 }}>
        {children}
      </div>
    </>
  );
};

export default WrapperPage;
