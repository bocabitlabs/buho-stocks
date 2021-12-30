import React, { lazy, ReactElement, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import ImportFromBrokerPageHeader from "./components/ImportFromBrokerPageHeader/ImportFromBrokerPageHeader";
import brokersList from "brokers/brokers-list";

export default function ImportFromBrokerPage(): ReactElement {
  const { brokerId } = useParams();
  const broker = brokersList.find((b: any) => b.id === brokerId);
  const ImportForm = lazy(() => import(`brokers/${broker?.importPath}/Form`));

  if (!broker) {
    return (
      <ImportFromBrokerPageHeader>Broker not found</ImportFromBrokerPageHeader>
    );
  }

  return (
    <ImportFromBrokerPageHeader>
      <Suspense fallback={<Spin />}>
        <ImportForm />
      </Suspense>
    </ImportFromBrokerPageHeader>
  );
}
