import { useTranslation } from "react-i18next";
import { Stack, Title } from "@mantine/core";
import CorporateActionsImportFormProvider from "./components/CorporateActionsImportForm/CorportateActionsImportFormProvider";
import { ICsvCorporateActionsRow } from "types/csv";

interface Props {
  corporateActions: ICsvCorporateActionsRow[];
  portfolioId: number | undefined;
  onImportedCallback: () => void;
}

export default function CorporateActionsImportStep({
  corporateActions,
  portfolioId,
  onImportedCallback,
}: Props) {
  const { t } = useTranslation();

  if (!portfolioId) {
    return <div>{t("Select a portfolio to import corporate actions.")}</div>;
  }

  if (corporateActions && corporateActions.length > 0) {
    return (
      <Stack>
        <Title order={2}>{t("Import corporate actions")}</Title>
        {corporateActions.map((corporateAction) => (
          <CorporateActionsImportFormProvider
            key={corporateAction.id}
            corporateAction={corporateAction}
            portfolioId={portfolioId}
            onImportedCallback={onImportedCallback}
          />
        ))}
      </Stack>
    );
  }
  return <div>{t("No corporate actions found on the CSV file")}</div>;
}
