import UpdatePortfolioForm from "./components/UpdatePortfolioForm/UpdatePortfolioForm";

interface Props {
  portfolioId: number | undefined;
  onPortfolioUpdated: Function;
}

export default function UpdatePortfolioStep({
  portfolioId,
  onPortfolioUpdated,
}: Props) {
  return (
    <div>
      <UpdatePortfolioForm
        portfolioId={portfolioId}
        onPortfolioUpdated={onPortfolioUpdated}
      />
    </div>
  );
}
