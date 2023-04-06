import CorporateActionsImportForm from "./components/CorporateActionsImportForm/CorporateActionsImporForm";

interface Props {
  corporateActions: any[];
  portfolioId: number | undefined;
  onImported: Function;
}

export default function CorporateActionsImportStep({
  corporateActions,
  portfolioId,
  onImported,
}: Props) {
  console.log(corporateActions);
  return (
    <div>
      {corporateActions &&
        corporateActions.length > 0 &&
        corporateActions.map((corporateAction) => (
          <CorporateActionsImportForm
            key={`${corporateAction.date}-${corporateAction.isin}`}
            corporateAction={corporateAction}
            portfolioId={portfolioId}
            onImported={onImported}
          />
        ))}
    </div>
  );
}
