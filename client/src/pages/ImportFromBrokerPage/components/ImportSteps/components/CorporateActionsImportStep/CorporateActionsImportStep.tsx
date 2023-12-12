import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  if (corporateActions && corporateActions.length > 0) {
    return (
      <div>
        {corporateActions.map((corporateAction: any) => (
          <CorporateActionsImportForm
            key={corporateAction.id}
            corporateAction={corporateAction}
            portfolioId={portfolioId}
            onImported={onImported}
          />
        ))}
      </div>
    );
  }
  return <div>{t("No corporate actions found on the CSV file")}</div>;
}
