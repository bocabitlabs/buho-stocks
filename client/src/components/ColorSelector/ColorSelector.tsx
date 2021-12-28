import React, { ReactElement, useLayoutEffect, useState } from "react";
import { ColorChangeHandler, TwitterPicker } from "react-color";
import { Button, Row, Space } from "antd";
import { allColors, fewColorsScale } from "utils/colors";

interface Props {
  color: string;
  handleColorChange: ColorChangeHandler;
}

export default function ColorSelector({
  color,
  handleColorChange,
}: Props): ReactElement {
  const [showAll, setShowAll] = useState(false);

  const [width, setWidth] = useState(window.innerWidth);
  const [sidebarWidth, setSidebarWidth] = useState(0);

  useLayoutEffect(() => {
    function updateSize() {
      setWidth(window.innerWidth);
      const info = document.getElementById("sidebar") as HTMLDivElement;

      if (info !== null) {
        setSidebarWidth(info.offsetWidth);
      }
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <Space direction="vertical">
      <Row>
        <TwitterPicker
          color={color}
          onChange={handleColorChange}
          width={(width - sidebarWidth).toString()}
          colors={showAll ? allColors : fewColorsScale}
        />
      </Row>
      <Row>
        <Button type="link" size="small" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show less" : "Show all"}
        </Button>
      </Row>
    </Space>
  );
}
