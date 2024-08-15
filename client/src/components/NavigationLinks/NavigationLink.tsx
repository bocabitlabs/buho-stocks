import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink as RouterNavLink } from "react-router-dom";
import { ThemeIcon, NavLink } from "@mantine/core";

interface NavigationLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  to: string;
}

export default function NavigationLink({
  icon,
  color,
  label,
  to,
}: Readonly<NavigationLinkProps>) {
  const { t } = useTranslation();

  return (
    <NavLink
      label={t<string>(label)}
      leftSection={
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
      }
      to={to}
      component={RouterNavLink}
    />
  );
}
