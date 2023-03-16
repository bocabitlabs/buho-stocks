import React from "react";
import {
  BankOutlined,
  BarChartOutlined,
  ClusterOutlined,
  CodeOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  SettingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import getRoute, { HOME_ROUTE } from "routes";
import { RoutePathProps } from "types/routes";

export const navLinks: RoutePathProps[] = [
  {
    key: "0",
    path: getRoute(HOME_ROUTE),
    text: "Home",
    icon: <HomeOutlined />,
  },
  { key: "1", path: "/markets", text: "Markets", icon: <BankOutlined /> },
  {
    key: "2",
    path: "/sectors",
    text: "Sectors",
    icon: <ClusterOutlined />,
  },
  {
    key: "3",
    path: "/currencies",
    text: "Currencies",
    icon: <DollarCircleOutlined />,
  },
  {
    key: "4",
    path: "/benchmarks",
    text: "Benchmarks",
    icon: <BarChartOutlined />,
  },
  {
    key: "5",
    path: "/exchange-rates",
    text: "Exchange Rates",
    icon: <CodeOutlined />,
  },
  {
    key: "6",
    path: "/import-export",
    text: "Import & Export",
    icon: <SyncOutlined />,
  },
  {
    key: "7",
    path: "/settings",
    text: "Settings",
    icon: <SettingOutlined />,
  },
];

export default navLinks;
