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

interface Props {
  portfolioName: string;
}

function PortfolioDetailsPageHeader({ portfolioName }: Readonly<Props>) {
  const { id } = useParams();
  const { t } = useTranslation();
  const routes = [
    {
      href: "/home",
      title: t("Home"),
      id: "home",
    },
    {
      href: `/portfolios/${id}`,
      title: portfolioName,
      id: "portfolio",
    },
    {
      href: `/portfolios/${id}/logs`,
      title: t("Log"),
      id: "log",
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
        <Stack>
          <Title order={1} textWrap="pretty">
            {t("Portfolio transactions log")}
          </Title>
          <Title order={2} textWrap="pretty">
            {portfolioName}
          </Title>
        </Stack>
      </Group>
    </Stack>
    // <PageHeader
    //   className="site-page-header"
    //   style={{
    //     background: token.colorBgContainer,
    //   }}
    //   title={<Typography.Title level={2}>{portfolioName}</Typography.Title>}
    //   subTitle={t("Portfolio transactions log")}
    //   breadcrumb={{ items: routes }}
    //   breadcrumbRender={breadCrumbRender}
    //   tags={[
    //     <CountryFlag code={portfolioCountryCode} key={portfolioCountryCode} />,
    //   ]}
    // >
    //   {children}
    // </PageHeader>
  );
}

export default PortfolioDetailsPageHeader;
