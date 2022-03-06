import React, { ReactElement, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { RoutePathProps } from "types/routes";

export interface RoutesMenuProps {
  routeLinks: RoutePathProps[];
  selectedKey: string;
  changeSelectedKey: any;
  extraCallback?: Function;
}

function RoutesMenu({
  routeLinks,
  selectedKey,
  changeSelectedKey,
  extraCallback,
}: RoutesMenuProps) {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const menuClickAction = useCallback(
    (event: any) => {
      const { key } = event;
      changeSelectedKey(event);
      navigate(routeLinks.find((item) => item.key === key)?.path || "");
      if (extraCallback) extraCallback();
    },
    [changeSelectedKey, extraCallback, navigate, routeLinks],
  );

  const updateSelectedKey = useCallback(
    (event: any) => {
      const { key } = event;
      changeSelectedKey(event);
      navigate(routeLinks.find((item) => item.key === key)?.path || "");
    },
    [changeSelectedKey, navigate, routeLinks],
  );

  const styledRouteLinks: ReactElement[] = [];
  routeLinks.forEach((topic) =>
    styledRouteLinks.push(
      <Menu.Item key={topic.key} onClick={menuClickAction} icon={topic.icon}>
        {t(topic.text)}
      </Menu.Item>,
    ),
  );

  useEffect(() => {
    const selected =
      routeLinks.find((item) => location.pathname.startsWith(item.path))?.key ||
      "";
    if (selected) {
      updateSelectedKey(routeLinks[Number(selected)]);
    }
  }, [location.pathname, updateSelectedKey, routeLinks]);

  return (
    <Menu mode="inline" selectedKeys={[selectedKey]}>
      {styledRouteLinks}
    </Menu>
  );
}
RoutesMenu.defaultProps = {
  extraCallback: () => {},
};
export default RoutesMenu;
