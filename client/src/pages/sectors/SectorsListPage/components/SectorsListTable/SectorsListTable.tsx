import { useTranslation } from "react-i18next";
import { rem, Tabs } from "@mantine/core";
import { IconHierarchy, IconHierarchy3 } from "@tabler/icons-react";
import SectorsTable from "../SectorsTable/SectorsTable";
import SuperSectorsTable from "../SuperSectorsTable/SuperSectorsTable";

export default function SectorsListTable() {
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
        <SectorsTable />
      </Tabs.Panel>

      <Tabs.Panel value="super-sectors">
        <SuperSectorsTable />
      </Tabs.Panel>
    </Tabs>
  );
}
