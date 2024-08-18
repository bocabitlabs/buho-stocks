import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  Anchor,
  Breadcrumbs,
  Group,
  Loader,
  Stack,
  Title,
} from "@mantine/core";
import CountryFlag from "components/CountryFlag/CountryFlag";

interface Props {
  portfolioName: string;
  portfolioCountryCode: string;
}

function PortfolioChartsPageHeader({
  portfolioName,
  portfolioCountryCode,
}: Props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const routes = [
    { href: "/", title: t("Home"), id: "home" },
    {
      href: `/portfolios/${id}`,
      title: portfolioName,
      id: "portfolio",
    },
    {
      href: `/portfolios/${id}/charts`,
      title: `${t("Charts")}`,
      id: "charts",
    },
  ].map((item) => (
    <Anchor href={item.href} key={item.id}>
      {item.title}
    </Anchor>
  ));

  if (!portfolioName) {
    return <Loader />;
  }
  return (
    <Stack>
      <Breadcrumbs>{routes}</Breadcrumbs>
      <Group justify="space-between">
        <Group>
          <Title order={1}>
            {portfolioName}{" "}
            <CountryFlag
              code={portfolioCountryCode}
              key={portfolioCountryCode}
              width={30}
            />
          </Title>
        </Group>
      </Group>
    </Stack>
  );
}

export default PortfolioChartsPageHeader;
