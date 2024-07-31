import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { Paper, Text, Title } from "@mantine/core";

interface Props {
  companyDescription: string;
}

export default function CompanyInfo({ companyDescription }: Props) {
  const { t } = useTranslation();
  return (
    <Paper p="lg" shadow="xs">
      <Title order={3}>{t("About the company")}</Title>
      <Text mt={20}>
        {companyDescription !== "undefined" &&
        companyDescription !== undefined ? (
          <ReactMarkdown>{companyDescription}</ReactMarkdown>
        ) : (
          ""
        )}
      </Text>
    </Paper>
  );
}
