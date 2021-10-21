import React, { ReactElement } from "react";
import { Button, Form, Select, Spin } from "antd";

import { useTranslation } from "react-i18next";
import { ISettingsFormFields } from "types/settings";
import { useSettingsContext } from "hooks/use-settings/use-settings-context";

function SettingsForm(): ReactElement | null {
  const [form] = Form.useForm();
  const {
    isLoading,
    settings,
    update: updateSettings
  } = useSettingsContext();
  const { t, i18n } = useTranslation();

  const handleUpdate = async (values: any) => {
    const {
      // companyDisplayMode,
      // companySortBy,
      language,
      // mainPortfolio,
      // portfolioDisplayMode,
      // portfolioSortBy
    } = values;
    const newSettings: ISettingsFormFields = {
      language,
      companyDisplayMode: "TODO",
      companySortBy: "TODO",
      mainPortfolio: "TODO",
      portfolioDisplayMode: "TODO",
      portfolioSortBy: "TODO"
    };
    if (settings) {
      updateSettings(settings.id, newSettings);
      i18n.changeLanguage(newSettings.language);
    }
  };

  if (isLoading || !settings) {
    return <Spin />;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleUpdate}
      initialValues={{
        // companyDisplayMode: settings.companyDisplayMode,
        // companySortBy: settings.companySortBy,
        language: settings?.language,
        // mainPortfolio: settings.mainPortfolio,
        // portfolioDisplayMode: settings.portfolioDisplayMode,
        // portfolioSortBy: settings.portfolioSortBy
      }}
    >
      {JSON.stringify(settings)}
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
