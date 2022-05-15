import React, { ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Affix, Card, Col, Form, Row, Select, Space } from "antd";
import ChartBrokerByCompany from "./components/ChartBrokerByCompany/ChartBrokerByCompany";
import ChartCurrenciesByCompany from "./components/ChartCurrenciesByCompany/ChartCurrenciesByCompany";
import ChartDividendsByCompany from "./components/ChartDividendsByCompany/ChartDividendsByCompany";
import ChartInvestedByCompany from "./components/ChartInvestedByCompany/ChartInvestedByCompany";
import ChartInvestedByCompanyYearly from "./components/ChartInvestedByCompanyYearly/ChartInvestedByCompanyYearly";
import ChartMarketByCompany from "./components/ChartMarketByCompany/ChartMarketByCompany";
import ChartPortfolioDividendsPerMonth from "./components/ChartPortfolioDividendsPerMonth/ChartPortfolioDividendsPerMonth";
import ChartSectorsByCompany from "./components/ChartSectorsByCompany/ChartSectorsByCompany";
import ChartSuperSectorsByCompany from "./components/ChartSuperSectorsByCompany/ChartSuperSectorsByCompany";
import ChartValueByCompany from "./components/ChartValueByCompany/ChartValueByCompany";
import ChartPortfolioDividends from "components/ChartPortfolioDividends/ChartPortfolioDividends";
import ChartPortfolioReturns from "components/ChartPortfolioReturns/ChartPortfolioReturns";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";

export default function ChartsList(): ReactElement {
  const { id } = useParams();
  const { t } = useTranslation();
  const [years, setYears] = React.useState<any[]>([]);
  const [selectedYear, setSelectedYear] = React.useState<any | null>(
    new Date().getFullYear(),
  );
  // States
  const rowStyle = {
    marginTop: 20,
  };
  const { data: portfolio } = usePortfolio(+id!);

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  useEffect(() => {
    async function loadFirstYear() {
      const currentYear = new Date().getFullYear();
      const newYears = [];
      if (portfolio && portfolio.firstYear != null) {
        for (
          let index = +currentYear;
          index >= +portfolio.firstYear;
          index -= 1
        ) {
          newYears.push(index);
        }
        setYears(newYears);
      }
    }
    loadFirstYear();
  }, [portfolio]);

  return (
    <>
      <Row>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 12, offset: 0 }}>
          <ChartPortfolioReturns />
        </Col>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 12, offset: 0 }}>
          <ChartPortfolioDividends />
        </Col>
      </Row>

      <Row style={rowStyle}>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 24, offset: 0 }}>
          <ChartPortfolioDividendsPerMonth />
        </Col>
      </Row>

      <Space direction="vertical" style={{ width: "100%", marginTop: 20 }}>
        <Affix offsetTop={0} onChange={(affixed) => console.log(affixed)}>
          <Card style={{ width: "100%", padding: 5, height: 90 }}>
            <Form.Item label={t("Select a year")}>
              <Select
                placeholder="Select a year"
                defaultValue={selectedYear}
                style={{ width: 120 }}
                onChange={handleYearChange}
              >
                {years.map((yearItem: any) => (
                  <Select.Option key={yearItem} value={yearItem}>
                    {yearItem}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Card>
        </Affix>

        <Row style={rowStyle}>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 24, offset: 0 }}>
            <ChartInvestedByCompany
              selectedYear={selectedYear}
              currency={portfolio?.baseCurrency.code}
            />
          </Col>
        </Row>

        <Row style={rowStyle}>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 24, offset: 0 }}>
            <ChartInvestedByCompanyYearly
              selectedYear={selectedYear}
              currency={portfolio?.baseCurrency.code}
            />
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 24, offset: 0 }}>
            <ChartValueByCompany
              selectedYear={selectedYear}
              currency={portfolio?.baseCurrency.code}
            />
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 16, offset: 4 }}>
            <ChartDividendsByCompany selectedYear={selectedYear} />
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 12, offset: 0 }}>
            <ChartSectorsByCompany selectedYear={selectedYear} />
          </Col>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 12, offset: 0 }}>
            <ChartSuperSectorsByCompany selectedYear={selectedYear} />
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 6, offset: 1 }}>
            <ChartCurrenciesByCompany selectedYear={selectedYear} />
          </Col>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 6, offset: 1 }}>
            <ChartBrokerByCompany selectedYear={selectedYear} />
          </Col>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 6, offset: 1 }}>
            <ChartMarketByCompany selectedYear={selectedYear} />
          </Col>
        </Row>
      </Space>
    </>
  );
}
