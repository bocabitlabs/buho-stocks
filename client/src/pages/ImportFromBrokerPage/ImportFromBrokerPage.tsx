import React, { lazy, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ImportFromBrokerPageHeader from "./components/ImportFromBrokerPageHeader/ImportFromBrokerPageHeader";
import brokersList from "brokers/brokers-list";

export default function ImportFromBrokerPage(): ReactElement {
  const { t } = useTranslation();
  const { brokerId } = useParams();
  const broker = brokersList.find((b: any) => b.id === brokerId);
  const ImportForm = lazy(() => import(`brokers/${broker?.importPath}/Form`));

  if (!broker) {
    return (
      <ImportFromBrokerPageHeader title="Broker not found">
        {t("Broker not found")}
      </ImportFromBrokerPageHeader>
    );
  }

  return (
    <ImportFromBrokerPageHeader title={`${t("Import from")} ${broker.name}`}>
      <ImportForm />
    </ImportFromBrokerPageHeader>
  );
}
