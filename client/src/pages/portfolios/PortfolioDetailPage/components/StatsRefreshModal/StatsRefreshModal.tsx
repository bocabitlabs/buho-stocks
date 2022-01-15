import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Modal, Typography } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import useFetch, { CachePolicies } from "use-http";
import { ICompany } from "types/company";

interface Props {
  id: string | undefined;
  selectedYear: string | undefined;
  setStats: Function;
}

async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
}

export default function StatsRefreshModal({
  id,
  selectedYear,
  setStats,
}: Props): ReactElement {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [updateStockPriceSwitch, setUpdateStockPriceSwitch] = useState(false);
  const [updateStatsSwitch, setUpdateStatsSwitch] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = React.useState(false);

  const [companies, setCompanies] = useState<CheckboxValueType[]>([]);
  const { response: responsePortfolio, get: getPortfolio } = useFetch(
    "portfolios",
    { cachePolicy: CachePolicies.NO_CACHE },
  );
  const {
    get: getPrice,
    loading: loadingPrice,
    response: priceResponse,
    cache: priceCache,
  } = useFetch(`companies`);
  const {
    response,
    get: getStats,
    loading: loadingStats,
    cache,
  } = useFetch(`stats`);

  useEffect(() => {
    async function loadInitialPortfolio() {
      const initialPortfolio = await getPortfolio(`${id}/`);
      if (responsePortfolio.ok) {
        const checkboxes = initialPortfolio.companies.map(
          (company: ICompany) => {
            return `${company.name} (${company.ticker}) - #${company.id}`;
          },
        );
        setCompanies(checkboxes);
      }
    }
    loadInitialPortfolio();
  }, [responsePortfolio.ok, getPortfolio, id]);

  const showModal = () => {
    setVisible(true);
  };

  const getStatsForced = useCallback(
    async (companyId: string) => {
      cache.clear();
      setUpdateMessage(`Updating stats for company #${companyId}`);
      await getStats(`/${companyId}/${selectedYear}/force/`);
      if (response.ok) {
        setUpdateMessage(
          `Stats updated for company #${companyId} and year ${selectedYear}`,
        );
      } else {
        setUpdateMessage(
          `Error updating stats for company #${companyId} and year ${selectedYear}`,
        );
      }
    },
    [getStats, response.ok, selectedYear],
  );

  const getStockPrice = useCallback(
    async (companyId: string) => {
      let tempYear = selectedYear;
      if (selectedYear === "all") {
        tempYear = new Date().getFullYear().toString();
      }
      priceCache.clear();
      setUpdateMessage(`Updating price for company #${companyId}`);
      await getPrice(`/${companyId}/stock-prices/${tempYear}/last/force/`);
      if (priceResponse.ok) {
        setUpdateMessage(
          `Price updated for company #${companyId} and year ${tempYear}`,
        );
      } else {
        setUpdateMessage(
          `Error updating price for company #${companyId} and year ${tempYear}`,
        );
      }
    },
    [getPrice, priceCache, priceResponse.ok, selectedYear],
  );

  const updatePortfolioStatsForced = useCallback(async () => {
    cache.clear();
    setUpdateMessage(
      `Updating stats for portfolio #${id} and year ${selectedYear}`,
    );
    const updatedStats = await getStats(
      `portfolio/${id}/${selectedYear}/force/`,
    );
    if (response.ok) {
      setStats(updatedStats);
      setUpdateMessage(
        `Stats updated for portfolio #${id} and year ${selectedYear}`,
      );
    }
  }, [cache, getStats, id, response.ok, selectedYear, setStats]);

  const handleOk = async () => {
    setConfirmLoading(true);
    let companyId;
    if (updateStockPriceSwitch) {
      await asyncForEach(checkedList, async (checkboxName: string) => {
        // eslint-disable-next-line prefer-destructuring
        companyId = checkboxName.split("-")[1].split("#")[1];
        await getStockPrice(companyId);
      });
      setConfirmLoading(false);
    }
    if (updateStatsSwitch) {
      setConfirmLoading(true);
      await asyncForEach(checkedList, async (checkboxName: string) => {
        // eslint-disable-next-line prefer-destructuring
        companyId = checkboxName.split("-")[1].split("#")[1];
        await getStatsForced(companyId);
      });
      setConfirmLoading(false);
    }
    await updatePortfolioStatsForced();
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

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? companies : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const onChange = (checkedValue: CheckboxValueType[]) => {
    setCheckedList(checkedValue);
    setIndeterminate(
      !!checkedValue.length && checkedValue.length < companies.length,
    );
    setCheckAll(checkedValue.length === companies.length);
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
        title={`Refresh stats and stock prices for ${selectedYear}`}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{ style: { display: "none" } }}
      >
        <Form onFinish={handleOk}>
          For each company:
          <Form.Item
            name="updateStockPrice"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <Checkbox onChange={onStockPriceChange}>
              Update the stock price from API
            </Checkbox>
          </Form.Item>
          <Form.Item name="updateStats" valuePropName="checked">
            <Checkbox onChange={onStatsChange}>
              Update the stats for the year {selectedYear}
            </Checkbox>
          </Form.Item>
          <Typography.Title level={5}>
            Select the companies to update
          </Typography.Title>
          <Form.Item>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              Check all
            </Checkbox>
          </Form.Item>
          <Form.Item
            name="companies"
            style={{ marginBottom: 10 }}
            valuePropName="checked"
          >
            <Checkbox.Group onChange={onChange} value={checkedList}>
              {companies.map((company, index: number) => (
                <div key={index.toString()}>
                  <Checkbox value={company}>{company}</Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </Form.Item>
          <Typography.Paragraph>{updateMessage}</Typography.Paragraph>
          <Button
            type="primary"
            htmlType="submit"
            loading={loadingPrice || loadingStats}
          >
            Update stats
          </Button>
        </Form>
      </Modal>
    </>
  );
}
