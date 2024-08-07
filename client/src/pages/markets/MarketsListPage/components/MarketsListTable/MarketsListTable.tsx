import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Group, Loader, Menu, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import {
  MantineReactTable,
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Localization,
  MRT_PaginationState,
  MRT_Row,
  useMantineReactTable,
} from "mantine-react-table";
import MarketFormProvider from "../MarketForm/MarketFormProvider";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { useDeleteMarket, useMarkets } from "hooks/use-markets/use-markets";
import { useSettings } from "hooks/use-settings/use-settings";
import { IMarket } from "types/market";
import convertToTimezone from "utils/dates";

interface Props {
  mrtLocalization: MRT_Localization;
}

function RegionCell({ row }: Readonly<{ row: MRT_Row<IMarket> }>) {
  return (
    <span>
      <CountryFlag code={row.original.region} />
    </span>
  );
}

function TimezoneCell({ row }: Readonly<{ row: MRT_Row<IMarket> }>) {
  const { data: settings, isFetching } = useSettings();

  if (isFetching) {
    return <span>Loading...</span>;
  }

  const marketTimezone = row.original.timezone;
  const toTimezone = settings?.timezone ?? marketTimezone;

  return <span>{toTimezone}</span>;
}

function TimeCell({
  cell,
  row,
}: Readonly<{ cell: MRT_Cell<IMarket>; row: MRT_Row<IMarket> }>) {
  const { data: settings, isLoading } = useSettings();

  if (isLoading) {
    return <Loader type="dots" />;
  }

  const marketTimezone = row.original.timezone;
  const toTimezone = settings?.timezone;

  // Convert the openTime to the timezone of the settings using dayjs
  const cellValue = cell.getValue() as string;

  const newDate = convertToTimezone(
    cellValue,
    "HH:mm:ss",
    marketTimezone,
    toTimezone,
  );
  const openTime = dayjs(newDate);

  return <span>{openTime.format("HH:mm")}</span>;
}

export default function MarketsListTable({ mrtLocalization }: Props) {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const {
    data: marketsData,
    isLoading,
    isError,
    isFetching,
  } = useMarkets({
    pagination,
  });

  const { mutate: deleteMarket } = useDeleteMarket();
  const [selectedMarketId, setSelectedMarketId] = useState<number | undefined>(
    undefined,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);

  const showModal = (recordId: number) => {
    setSelectedMarketId(recordId);
    setIsModalVisible(true);
  };

  const showDeleteModal = (recordId: number) => {
    setSelectedMarketId(recordId);
    openDeleteModal();
  };

  const confirmDelete = async (recordId: number | undefined) => {
    if (!recordId) return;
    deleteMarket(recordId);
    closeDeleteModal();
  };

  const onCloseCallback = () => {
    setIsModalVisible(false);
    setSelectedMarketId(undefined);
  };

  const onDeleteCloseCallback = () => {
    closeDeleteModal();
    setSelectedMarketId(undefined);
  };

  const columns = useMemo<MRT_ColumnDef<IMarket>[]>(
    () => [
      {
        accessorKey: "region",
        header: t("Region"),
        Cell: RegionCell,
      },
      {
        accessorKey: "name",
        header: t("Name"),
      },
      {
        accessorKey: "description",
        header: t("Description"),
      },
      {
        accessorKey: "timezone",
        header: t("Timezone"),
        Cell: TimezoneCell,
      },
      {
        accessorKey: "openTime",
        header: t("Opening time"),
        Cell: TimeCell,
      },
      {
        accessorKey: "closeTime",
        header: t("Closing time"),
        Cell: TimeCell,
      },
    ],
    [t],
  );

  const fetchedMarkets = marketsData?.results ?? [];
  const totalRowCount = marketsData?.count ?? 0;

  const table = useMantineReactTable({
    columns,
    data: fetchedMarkets,
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActionMenuItems: ({ row }) => (
      <>
        <Menu.Item onClick={() => showModal(row.original.id)}>Edit</Menu.Item>
        <Menu.Item onClick={() => showDeleteModal(row.original.id)}>
          {t("Delete")}
        </Menu.Item>
      </>
    ),
    rowCount: totalRowCount,
    manualPagination: true,
    mantineToolbarAlertBannerProps: isError
      ? {
          color: "red",
          children: "Error loading data",
        }
      : undefined,
    onPaginationChange: setPagination,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
    },
    localization: mrtLocalization,
  });

  return (
    <div>
      <MantineReactTable table={table} />
      <MarketFormProvider
        id={selectedMarketId}
        isVisible={isModalVisible}
        onCloseCallback={onCloseCallback}
        isUpdate
      />
      <Modal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
        title={t("Delete market")}
      >
        {t("Are you sure you want to delete this market?")}
        <Group>
          <Button
            disabled={!selectedMarketId}
            onClick={() => confirmDelete(selectedMarketId)}
          >
            {t("Yes")}
          </Button>
          <Button onClick={onDeleteCloseCallback}>{t("No")}</Button>
        </Group>
      </Modal>
    </div>
  );
}
