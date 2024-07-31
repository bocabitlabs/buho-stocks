import { useTranslation } from "react-i18next";
import { Loader } from "@mantine/core";
import { theme } from "antd";

interface Props {
  text?: string;
}

const { useToken } = theme;
export default function LoadingSpin({ text = "Loading..." }: Props) {
  const { t } = useTranslation();
  const { token } = useToken();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: token.colorBgContainer,
        color: token.colorText,
      }}
    >
      <Loader>
        <div
          style={{
            padding: 50,
          }}
        >
          {t(text)}
        </div>
      </Loader>
    </div>
  );
}
