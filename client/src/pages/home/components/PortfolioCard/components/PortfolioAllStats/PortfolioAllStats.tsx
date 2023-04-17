import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Statistic, Typography } from "antd";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";

interface Props {
  portfolioId: number;
}

export default function PortfolioAllStats({ portfolioId }: Props) {
  const {
    data: stats,
    isFetching,
    error,
  } = usePortfolioYearStats(portfolioId, "all");

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {" "}
      <Statistic
        value={stats?.portfolioValue}
        precision={2}
        suffix={stats?.portfolioCurrency}
      />
      <Typography.Text
        type={stats && stats?.returnWithDividends < 0 ? "danger" : "success"}
      >
        {stats?.returnWithDividends
          ? Number(stats.returnWithDividends).toFixed(2)
          : ""}{" "}
        {stats?.portfolioCurrency}
      </Typography.Text>{" "}
      {" / "}
      <Typography.Text
        type={
          stats && stats?.returnWithDividendsPercent < 0 ? "danger" : "success"
        }
      >
        {Number(stats?.portfolioValue) <
        Number(stats?.accumulatedInvestment) ? (
          <ArrowDownOutlined />
        ) : (
          <ArrowUpOutlined />
        )}{" "}
        {stats?.returnWithDividendsPercent
          ? Number(stats?.returnWithDividendsPercent).toFixed(2)
          : ""}
        %
      </Typography.Text>
    </div>
  );
}
