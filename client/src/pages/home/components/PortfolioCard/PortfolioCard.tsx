import { ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, Center, Group, Text } from "@mantine/core";
import { IconBuildingCommunity } from "@tabler/icons-react";
import PortfolioAllStats from "./components/PortfolioAllStats/PortfolioAllStats";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { ICompanyListItem } from "types/company";

interface Props {
  currencyCode: string;
  name: string;
  id: number;
  companies: ICompanyListItem[];
}

export default function PortfolioCard({
  companies,
  currencyCode,
  name,
  id,
}: Readonly<Props>): ReactElement {
  const { t } = useTranslation();

  const openCompaniesLength = useMemo(
    () => companies.filter((company) => !company.isClosed).length,
    [companies],
  );

  return (
    <Link to={`/portfolios/${id}`} style={{ textDecoration: "none" }}>
      <Card withBorder shadow="sm" radius="md">
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <Text fw={500}>{name}</Text>
            <CountryFlag code={currencyCode} />
          </Group>
        </Card.Section>
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <Center>
              <Text>
                <IconBuildingCommunity /> {openCompaniesLength} {t("companies")}
              </Text>
            </Center>
          </Group>
        </Card.Section>
        <Card.Section withBorder inheritPadding py="xs">
          <PortfolioAllStats portfolioId={id} />
        </Card.Section>
      </Card>
    </Link>
  );
}
