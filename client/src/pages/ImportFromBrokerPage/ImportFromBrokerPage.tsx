import React, { ReactElement } from "react";
import ImportFromBrokerPageHeader from "./components/ImportFromBrokerPageHeader/ImportFromBrokerPageHeader";
import ImportSteps from "./components/ImportSteps/ImportSteps";

export default function ImportFromBrokerPage(): ReactElement {
  return (
    <ImportFromBrokerPageHeader>
      <ImportSteps />
    </ImportFromBrokerPageHeader>
  );
}
