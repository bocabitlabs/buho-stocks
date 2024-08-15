import { useTranslation } from "react-i18next";
import {
  IconBuildingBank,
  IconChartBar,
  IconCoinEuro,
  IconFileImport,
  IconHierarchy2,
  IconHome,
  IconSettings,
} from "@tabler/icons-react";
import NavigationLink from "./NavigationLink";
import routes from "routes";

export default function NavigationLinks() {
  const { t } = useTranslation();

  return (
    <div>
      <NavigationLink
        label={t("Home")}
        to={routes.homeRoute}
        icon={<IconHome size={16} />}
        color="blue"
      />
      <NavigationLink
        label={t("Markets")}
        to={routes.marketsRoute}
        icon={<IconBuildingBank size={16} />}
        color="red"
      />
      <NavigationLink
        label={t("Sectors")}
        to={routes.sectorsRoute}
        icon={<IconHierarchy2 size={16} />}
        color="orange"
      />
      <NavigationLink
        label={t("Currencies")}
        to={routes.currenciesRoute}
        icon={<IconCoinEuro size={16} />}
        color="green"
      />
      <NavigationLink
        label={t("Benchmarks")}
        to={routes.benchmarksRoute}
        icon={<IconChartBar size={16} />}
        color="grape"
      />
      <NavigationLink
        label={t("Import from CSV")}
        to={routes.importCsvRoute}
        icon={<IconFileImport size={16} />}
        color="pink"
      />
      <NavigationLink
        label={t("Settings")}
        to={routes.settingsRoute}
        icon={<IconSettings size={16} />}
        color="
        black"
      />
    </div>
  );
}
