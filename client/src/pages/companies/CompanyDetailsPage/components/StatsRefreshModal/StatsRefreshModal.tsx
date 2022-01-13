import React, { ReactElement, useCallback, useState } from "react";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Modal } from "antd";
import useFetch, { CachePolicies } from "use-http";

interface Props {
  companyId: string | undefined;
  selectedYear: string | undefined;
  setStockPrice: Function;
  setStats: Function;
}

export default function StatsRefreshModal({
  companyId,
  selectedYear,
  setStockPrice,
  setStats,
}: Props): ReactElement {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [updateStockPriceSwitch, setUpdateStockPriceSwitch] = useState(false);
  const [updateStatsSwitch, setUpdateStatsSwitch] = useState(false);

  const { response: responsePrice, get: getPrice } = useFetch(
    `companies/${companyId}/stock-prices`,
    { cachePolicy: CachePolicies.NO_CACHE },
  );
  const { response, get } = useFetch(`stats/${companyId}`, {
    cachePolicy: CachePolicies.NO_CACHE,
  });

  const showModal = () => {
    setVisible(true);
  };

  const getStatsForced = useCallback(async () => {
    const initialData = await get(`/${selectedYear}/force/`);
    if (response.ok) {
      setStats(initialData);
    }
    if (response.ok) {
      setStats(initialData);
    }
  }, [get, response.ok, selectedYear, setStats]);

  const getStockPrice = useCallback(async () => {
    let tempYear = selectedYear;
    if (selectedYear === "all") {
      tempYear = new Date().getFullYear().toString();
    }

    const result = await getPrice(`${tempYear}/last/force/`);
    if (responsePrice.ok) {
      setStockPrice(result);
    }
  }, [getPrice, responsePrice.ok, selectedYear, setStockPrice]);

  const handleOk = async () => {
    if (updateStockPriceSwitch) {
      setConfirmLoading(true);
      await getStockPrice();
      setConfirmLoading(false);
    }
    if (updateStatsSwitch) {
      setConfirmLoading(true);
      await getStatsForced();
    }
    setVisible(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onStockPriceChange = (e: any) => {
    setUpdateStockPriceSwitch(e.target.checked);
  };

  const onStatsChange = (e: any) => {
    setUpdateStatsSwitch(e.target.checked);
  };

  return (
    <>
      <Button
        htmlType="button"
        type="text"
        onClick={showModal}
        icon={<SyncOutlined />}
      />
      <Modal
        title="Refresh stats and stock prices"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form>
          Do you want to update the stats and the stock price?
          <Form.Item style={{ marginBottom: 0 }}>
            <Checkbox onChange={onStockPriceChange}>
              Update the stock price from API
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox onChange={onStatsChange}>
              Update the stats for the year {selectedYear}
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
