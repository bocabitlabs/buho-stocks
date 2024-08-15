import { useTranslation } from "react-i18next";
import { rem, Tabs } from "@mantine/core";
import { IconHierarchy, IconHierarchy3 } from "@tabler/icons-react";
import { MRT_Localization } from "mantine-react-table";
import SectorsTable from "../SectorsTable/SectorsTable";
import SuperSectorsTable from "../SuperSectorsTable/SuperSectorsTable";

interface Props {
  mrtLocalization: MRT_Localization;
}

export default function SectorsListTable({ mrtLocalization }: Props) {
  const { t } = useTranslation();
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Tabs defaultValue="sectors">
      <Tabs.List>
        <Tabs.Tab
          value="sectors"
          leftSection={<IconHierarchy3 style={iconStyle} />}
        >
          {t("Sectors")}
        </Tabs.Tab>
        <Tabs.Tab
          value="super-sectors"
          leftSection={<IconHierarchy style={iconStyle} />}
        >
          {t("Super sectors")}
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="sectors">
        <SectorsTable mrtLocalization={mrtLocalization} />
      </Tabs.Panel>

      <Tabs.Panel value="super-sectors">
        <SuperSectorsTable mrtLocalization={mrtLocalization} />
      </Tabs.Panel>
    </Tabs>
  );
}
