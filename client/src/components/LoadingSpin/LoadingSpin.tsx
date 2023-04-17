import React from "react";
import { useTranslation } from "react-i18next";
import { Spin } from "antd";

interface Props {
  text?: string;
}

export default function LoadingSpin({ text = "Loading..." }: Props) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Spin tip={t(text)} />
    </div>
  );
}
LoadingSpin.defaultProps = {
  text: "Loading...",
};
