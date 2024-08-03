import { useEffect } from "react";
import "./index.css";
import "./App.css";
import { Outlet, useLocation } from "react-router-dom";
import {
  AppShell,
  Burger,
  Group,
  ScrollArea,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Logo from "components/Logo/Logo";
import NavigationLinks from "components/NavigationLinks/NavigationLinks";
import PageFooter from "components/PageFooter/PageFooter";
import TasksModal from "components/TasksModal/TasksModal";
import ToggleThemeButton from "components/ToggleThemeButton/ToggleThemeButton";

function AppLayout() {
  const [opened, { toggle, close }] = useDisclosure();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const location = useLocation();
  useEffect(() => {
    close();
  }, [close, location]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger onClick={toggle} hiddenFrom="sm" size="sm" />
            <Logo />
          </Group>
          <Group>
            <ToggleThemeButton />
            <TasksModal />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar hidden={!opened} p="md">
        <AppShell.Section my="md" component={ScrollArea}>
          <NavigationLinks />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main
        style={{
          backgroundColor: colorScheme === "dark" ? "" : theme.colors.gray[0],
        }}
      >
        <Outlet />
        <PageFooter />
      </AppShell.Main>
    </AppShell>
  );
}

export default AppLayout;
