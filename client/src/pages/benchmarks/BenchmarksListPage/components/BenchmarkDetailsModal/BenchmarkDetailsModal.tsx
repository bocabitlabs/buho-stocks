import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Accordion, Button, Group, Loader, Menu, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Row,
  useMantineReactTable,
} from "mantine-react-table";
import BenchmarkYearFormProvider from "../BenchmarkYearForm/BenchmarkYearFormProvider";
import { useDeleteBenchmarkYear } from "hooks/use-benchmarks/use-benchmark-years";
import { useBenchmark } from "hooks/use-benchmarks/use-benchmarks";
import { IBenchmarkYear } from "types/benchmark";

interface BenchmarkModalProps {
  id: number;
  isModalVisible: boolean;
  onCancel: () => void;
}

function ValueCell({ row }: Readonly<{ row: MRT_Row<IBenchmarkYear> }>) {
  return (
    <span>
      {row.original.value} {row.original.valueCurrency}
    </span>
  );
}

function ReturnCell({ row }: Readonly<{ row: MRT_Row<IBenchmarkYear> }>) {
  return <span>{row.original.returnPercentage} %</span>;
}

function BenchmarkDetailsModal({
  isModalVisible,
  onCancel,
  id,
}: BenchmarkModalProps) {
  const { t } = useTranslation();
  const { mutate: deleteBenchmarkYear } = useDeleteBenchmarkYear();
  const { data: benchmark, isError, isFetching, isLoading } = useBenchmark(id);
  const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [selectedYearId, setSelectedMarketId] = useState<number | undefined>(
    undefined,
  );

  const showDeleteModal = (recordId: number) => {
    setSelectedMarketId(recordId);
    openDeleteModal();
  };

  const onDeleteCloseCallback = () => {
    closeDeleteModal();
    setSelectedMarketId(undefined);
  };
  const confirmDelete = async (recordId: number | undefined) => {
    if (recordId) {
      deleteBenchmarkYear({ id: recordId });
    }
  };

  const columns = useMemo<MRT_ColumnDef<IBenchmarkYear>[]>(
    () => [
      {
        accessorKey: "year",
        header: "Year",
      },
      {
        accessorKey: "returnPercentage", // access nested data with dot notation
        header: "Return",
        Cell: ReturnCell,
      },
      {
        accessorKey: "value",
        header: "Value",
        Cell: ValueCell,
      },
    ],
    [],
  );

  const fetchedYears = benchmark?.years ?? [];

  const table = useMantineReactTable({
    columns,
    data: fetchedYears,
    enableRowActions: true,
    enablePagination: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    positionActionsColumn: "last",
    renderRowActionMenuItems: ({ row }) => (
      <Menu.Item onClick={() => showDeleteModal(row.original.id)}>
        {t("Delete")}
      </Menu.Item>
    ),
    mantineToolbarAlertBannerProps: isError
      ? {
          color: "red",
          children: "Error loading data",
        }
      : undefined,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Modal
      size="xl"
      opened={isModalVisible}
      onClose={onCancel}
      title={benchmark.name}
    >
      <Accordion>
        <Accordion.Item key="add" value="add">
          <Accordion.Control icon={<IconPlus />}>
            {t("Add year")}
          </Accordion.Control>
          <Accordion.Panel>
            <BenchmarkYearFormProvider id={benchmark.id} />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <MantineReactTable table={table} />
      <Modal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
        title={t("Delete year")}
      >
        {t("Are you sure you want to delete this year?")}
        <Group>
          <Button
            disabled={!selectedYearId}
            onClick={() => confirmDelete(selectedYearId)}
          >
            {t("Yes")}
          </Button>
          <Button onClick={onDeleteCloseCallback}>{t("No")}</Button>
        </Group>
      </Modal>
    </Modal>
  );
}

export default BenchmarkDetailsModal;
