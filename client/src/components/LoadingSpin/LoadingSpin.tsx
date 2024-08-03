import { useTranslation } from "react-i18next";
import { Box, Loader } from "@mantine/core";

interface Props {
  text?: string;
}

export default function LoadingSpin({ text = "Loading..." }: Props) {
  const { t } = useTranslation();

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
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
    </Box>
  );
}
