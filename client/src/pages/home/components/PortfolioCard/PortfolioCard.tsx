import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Card, Center, Group, Text } from "@mantine/core";
import { IconBuildingCommunity } from "@tabler/icons-react";
import PortfolioAllStats from "./components/PortfolioAllStats/PortfolioAllStats";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { IPortfolio } from "types/portfolio";

interface Props {
  portfolio: IPortfolio;
}

export default function PortfolioCard({
  portfolio,
}: Readonly<Props>): ReactElement {
  const { t } = useTranslation();

  return (
    <Card withBorder shadow="sm" radius="md">
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Text fw={500}>{portfolio.name}</Text>
          <CountryFlag code={portfolio.baseCurrency.code} />
        </Group>
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Text>
            <Center>
              <IconBuildingCommunity /> {portfolio.companies.length}{" "}
              {t("companies")}
            </Center>
          </Text>
        </Group>
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <PortfolioAllStats portfolioId={portfolio.id} />
      </Card.Section>
    </Card>
  );
}
