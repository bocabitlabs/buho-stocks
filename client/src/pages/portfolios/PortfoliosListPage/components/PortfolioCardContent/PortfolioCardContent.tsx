import React, { ReactElement } from "react";
import { Card } from "antd";
import { IPortfolio } from "types/portfolio";
// import { StringUtils } from "utils/string-utils";

interface Props {
  portfolio: IPortfolio;
}

export default function PortfolioCardContent({
  portfolio,
}: Props): ReactElement | null {
  // const { getById: getPortfolioById } = useContext(PortfoliosContext);
  // const [currentPortfolio, setCurrentPortfolio] = useState<IPortfolio | null>(
  //   null
  // );
  // const { t } = useTranslation();

  // useEffect(() => {
  //   const result = getPortfolioById(portfolioId);
  //   setCurrentPortfolio(result);
  // }, [portfolioId, getPortfolioById]);

  // if (currentPortfolio === null) {
  //   return null;
  // }

  // const portfolioValue = currentPortfolio.value.getPortfolioValue(true);
  // const portfolioReturn = currentPortfolio.returns.getReturnWithDividends(true);
  // const portfolioReturnPercentage =
  //   currentPortfolio.returns.getReturnWithDividendsPercentage(true);

  // let positive: BaseType = "success";
  // if (portfolioReturn < 0) {
  //   positive = "danger";
  // }
  // if (portfolioReturn === 0) {
  //   positive = "secondary";
  // }
  // const formattedReturn = StringUtils.getAmountWithSymbol(
  //   portfolioReturn,
  //   2,
  //   currentPortfolio.currencySymbol
  // );
  // const formattedReturnPercentage = StringUtils.getAmountWithSymbol(
  //   portfolioReturnPercentage,
  //   2,
  //   "%"
  // );

  return (
    <Card
      title={portfolio.name}
      hoverable
      // extra={<CountryFlag code={currentPortfolio.currencyCountryCode} />}
    >
      {/* {currentPortfolio.companies.length} {t("companies")} */}
      {/* <Statistic
        value={portfolioValue}
        suffix={currentPortfolio.currencySymbol}
        precision={2}
      />
      <Typography.Text type={positive}>{formattedReturn}</Typography.Text>{" "}
      {" / "}
      <Typography.Text type={positive}>
        {formattedReturnPercentage}
      </Typography.Text> */}
    </Card>
  );
}
