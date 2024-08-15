import { useTranslation } from "react-i18next";
import { Center, Group, Paper, Text, Anchor, Image } from "@mantine/core";

interface Props {
  companyTicker: string;
  companySectorName: string;
  companySuperSectorName?: string;
  marketName: string;
  baseCurrencyCode: string;
  dividendsCurrencyCode: string;
  companyUrl: string;
  isin: string;
  companyLogo?: string;
}

export default function CompanyInfo({
  companyTicker,
  companySectorName,
  companySuperSectorName = "",
  marketName,
  baseCurrencyCode,
  dividendsCurrencyCode,
  companyUrl,
  companyLogo = undefined,
  isin,
}: Props) {
  const { t } = useTranslation();
  console.log(companyTicker);
  console.log(companySectorName);
  console.log(companySuperSectorName);
  console.log(marketName);
  console.log(baseCurrencyCode);
  console.log(dividendsCurrencyCode);
  console.log(companyUrl);
  console.log(companyLogo);
  console.log(isin);
  // const items: DescriptionsProps["items"] = [
  //   {
  //     key: "0",
  //     label: (
  //       <strong>
  //         <Badge count={<ClusterOutlined />} /> {t("Ticker")}
  //       </strong>
  //     ),
  //     children: companyTicker,
  //   },
  //   {
  //     key: "1",
  //     label: (
  //       <strong>
  //         <Badge count={<ClusterOutlined />} /> {t("Sector")}
  //       </strong>
  //     ),
  //     children: `${t(companySectorName)}
  //     ${companySuperSectorName && ` - ${t(companySuperSectorName)}`}`,
  //   },
  //   {
  //     key: "2",
  //     label: (
  //       <strong>
  //         <Badge count={<BankOutlined />} /> {t("Market")}{" "}
  //       </strong>
  //     ),
  //     children: marketName,
  //   },
  //   {
  //     key: "3",
  //     label: (
  //       <strong>
  //         <Badge count={<BarcodeOutlined />} /> {t("ISIN")}
  //       </strong>
  //     ),
  //     children: isin,
  //   },
  //   {
  //     key: "4",
  //     label: (
  //       <strong>
  //         <Badge count={<DollarCircleOutlined />} /> {t("Base currency")}
  //       </strong>
  //     ),
  //     children: baseCurrencyCode,
  //   },
  //   {
  //     key: "5",
  //     label: (
  //       <strong>
  //         <Badge count={<DollarCircleOutlined />} /> {t("Dividends currency")}
  //       </strong>
  //     ),
  //     children: dividendsCurrencyCode,
  //   },
  //   {
  //     key: "6",
  //     label: (
  //       <strong>
  //         <LinkOutlined />
  //       </strong>
  //     ),
  //     children: (
  //       <a href={companyUrl} target="_blank" rel="noopener noreferrer">
  //         {t("Company Website")}
  //       </a>
  //     ),
  //   },
  // ];

  // return (
  //   <Row>
  //     <Col lg={{ span: 18 }} xs={{ span: 24 }}>
  //       <Descriptions items={items} />
  //     </Col>
  //     <Col lg={{ span: 6 }} xs={{ span: 24 }}>
  //       <Image width={200} src={companyLogo} />
  //     </Col>
  //   </Row>
  // );

  return (
    <Group>
      <Image radius="md" src={companyLogo} h={200} w="auto" />
      <Paper p="lg" shadow="xs">
        <Center>
          <Text fw="bold" size="xl">
            {companyTicker}
          </Text>
        </Center>
        <Center>
          <Text size="sm" c="dimmed">
            {t("Ticker")}
          </Text>
        </Center>
      </Paper>
      <Paper p="lg" shadow="xs">
        <Center>
          <Text size="xl">{companySectorName}</Text>
        </Center>
        <Center>
          <Text size="sm" c="dimmed">
            {companySuperSectorName}
          </Text>
        </Center>
      </Paper>
      <Paper p="lg" shadow="xs">
        <Center>
          <Text size="xl">{marketName}</Text>
        </Center>
        <Center>
          <Text size="sm" c="dimmed">
            {t("Market")}
          </Text>
        </Center>
      </Paper>
      <Paper p="lg" shadow="xs">
        <Center>
          <Text size="xl">{isin}</Text>
        </Center>
        <Center>
          <Text size="sm" c="dimmed">
            {t("ISIN")}
          </Text>
        </Center>
      </Paper>
      <Paper p="lg" shadow="xs">
        <Center>
          <Text size="xl">{baseCurrencyCode}</Text>
        </Center>
        <Center>
          <Text size="sm" c="dimmed">
            {t("Company Currency")}
          </Text>
        </Center>
      </Paper>
      <Paper p="lg" shadow="xs">
        <Center>
          <Text size="xl">{dividendsCurrencyCode}</Text>
        </Center>
        <Center>
          <Text size="sm" c="dimmed">
            {t("Dividends Currency")}
          </Text>
        </Center>
      </Paper>
      <Paper p="lg" shadow="xs">
        <Center>
          <Text size="xl">
            <Anchor href={companyUrl} target="_blank">
              URL
            </Anchor>
          </Text>
        </Center>
        <Center>
          <Text size="sm" c="dimmed">
            {t("Company Website")}
          </Text>
        </Center>
      </Paper>
    </Group>
  );
}
