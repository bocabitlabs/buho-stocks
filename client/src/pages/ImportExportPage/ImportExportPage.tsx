import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Col, Radio, Row, Select, Space } from "antd";
import ImportExportPageHeader from "./components/ImportExportPageHeader/ImportExportPageHeader";
import brokersList from "brokers/brokers-list";

export default function ImportExportPage(): ReactElement {
  const [action, setAction] = useState<string | null>(null);
  const [importAction, setImportAction] = useState<string | null>(null);
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onChange1 = (e: any) => {
    console.log("radio4 checked", e.target.value);
    setAction(e.target.value);
  };

  const onChange2 = (e: any) => {
    setImportAction(e.target.value);
  };

  const onBrokerSelect = (value: any) => {
    setSelectedBroker(value);
  };

  const goToBrokerImportPage = (brokerId: string) => {
    navigate(`/app/import/${brokerId}`);
  };

  const options1 = [
    { label: "Import", value: "import" },
    { label: "Export", value: "export" },
  ];

  const options2 = [
    { label: "Import from App", value: "import-app" },
    { label: "Import from Broker", value: "import-broker" },
  ];

  return (
    <ImportExportPageHeader>
      <Row>
        <Col>
          <Space direction="vertical">
            <Radio.Group
              options={options1}
              onChange={onChange1}
              value={action}
              optionType="button"
              buttonStyle="solid"
            />
            {action === "import" && (
              <Radio.Group
                options={options2}
                onChange={onChange2}
                value={importAction}
                optionType="button"
                buttonStyle="solid"
              />
            )}
            {importAction === "import-broker" && (
              <Select
                onSelect={onBrokerSelect}
                showSearch
                placeholder={t("Select a broker")}
              >
                {brokersList.map((item: any) => (
                  <Select.Option
                    value={item.id}
                    key={`broker-${item.id}-${item.id}`}
                  >
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            )}
            {selectedBroker && (
              <Button onClick={() => goToBrokerImportPage(selectedBroker)}>
                Import
              </Button>
            )}
          </Space>
        </Col>
        <Col />
      </Row>
    </ImportExportPageHeader>
  );
}
