import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { useUpdatePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";

interface Props {
  portfolioId: number | undefined;
  onPortfolioUpdated: Function;
}

export default function TradesImportForm({
  portfolioId,
  onPortfolioUpdated,
}: Props) {
  const { t } = useTranslation();

  const { data: portfolio } = usePortfolio(portfolioId);
  const [formSent, setFormSent] = useState(false);
  const { mutate: updatePortfolioStats, isLoading } =
    useUpdatePortfolioYearStats();

  const updatePortfolioAction = () => {
    setFormSent(true);
    // Get current year
    const date = new Date();
    const selectedYear = date.getFullYear().toString();

    // Get the id of each company of the portfolio and store them in an array
    const companiesIds = portfolio?.companies.map((company) => company.id);

    updatePortfolioStats({
      portfolioId: portfolio?.id,
      year: selectedYear,
      updateApiPrice: true,
      companiesIds,
    });
    onPortfolioUpdated();
  };

  return (
    <Row style={{ marginTop: 10, marginBottom: 10 }}>
      <Col>
        <Typography.Title level={4}>
          {t("Update the portfolio")}
        </Typography.Title>
        <Typography.Paragraph>
          <Typography.Text type="secondary">
            {t("Do you want to update the portfolio?")}
          </Typography.Text>
        </Typography.Paragraph>

        <Button
          type="primary"
          htmlType="submit"
          icon={formSent ? <CheckOutlined /> : null}
          loading={isLoading}
          disabled={!portfolio}
          onClick={updatePortfolioAction}
        >
          {t("Update portfolio")}
        </Button>
      </Col>
    </Row>
  );
}
