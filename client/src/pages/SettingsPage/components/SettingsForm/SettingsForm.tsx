import React, { ReactElement, useContext } from "react";
import {
  Button,
  Form,
  message,
  Select,
  Typography
} from "antd";

// import { SettingsContext } from "contexts/settings";
// import { ISettingsForm } from "types/settings";
// import { backupDatabase } from "message-control/renderer";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "contexts/settings";
import { ISettingsFormFields } from "types/settings";

function SettingsForm(): ReactElement | null {
  const [form] = Form.useForm();
  const { settings, update: updateSettings } = useContext(SettingsContext);
  const { t } = useTranslation();
  const key = "updatable";

  const handleUpdate = async (values: any) => {
    const {
      companyDisplayMode,
      companySortBy,
      language,
      mainPortfolio,
      portfolioDisplayMode,
      portfolioSortBy
    } = values;
    const newSettings: ISettingsFormFields = {
      language,
      companyDisplayMode,
      companySortBy,
      mainPortfolio,
      portfolioDisplayMode,
      portfolioSortBy
    };
    let result = undefined;

    result = await updateSettings(newSettings);

    if (result?.error) {
      message.error({
        content: `Settings not updated: ${JSON.stringify(result)}`,
        key
      });
    } else {
      message.success({ content: "Settings updated", key });
    }
  };

  if (settings === null) {
    return null;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleUpdate}
      initialValues={{
        companyDisplayMode: settings.companyDisplayMode,
        companySortBy: settings.companySortBy,
        language: settings.language,
        mainPortfolio: settings.mainPortfolio,
        portfolioDisplayMode: settings.portfolioDisplayMode,
        portfolioSortBy: settings.portfolioSortBy
      }}
    >
      <Typography.Title level={3}>{t("Advanced")}</Typography.Title>

      <Form.Item name="language" label={t("Language")}>
        <Select placeholder={t("Select a language")}>
          <Select.Option value={"en"} key={"en"}>
            English
          </Select.Option>
          <Select.Option value={"es"} key={"es"}>
            Español
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {t("Update settings")}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default SettingsForm;
