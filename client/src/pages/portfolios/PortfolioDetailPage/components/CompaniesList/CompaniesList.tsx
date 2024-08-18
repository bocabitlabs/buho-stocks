import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  NumberFormatter,
  Stack,
  Switch,
  Image,
  Anchor,
  Text,
} from "@mantine/core";
import {
  MantineReactTable,
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Localization,
  MRT_PaginationState,
  MRT_Row,
  MRT_SortingState,
  useMantineReactTable,
} from "mantine-react-table";
import { useCompanies } from "hooks/use-companies/use-companies";
import { ICompany } from "types/company";

interface IProps {
  portfolioId: string;
  mrtLocalization: MRT_Localization;
}

function PriceCell({
  cell,
  row,
}: Readonly<{ cell: MRT_Cell<ICompany>; row: MRT_Row<ICompany> }>) {
  return (
    <Stack>
      <Text size="sm">
        <NumberFormatter
          value={cell.getValue() as string}
          decimalScale={2}
          thousandSeparator
        />
      </Text>
      <Text c="dimmed" size="xs">
        {row.original.portfolio.baseCurrency}
      </Text>
    </Stack>
  );
}

function ReturnPercentCell({ row }: Readonly<{ row: MRT_Row<ICompany> }>) {
  return (
    <Stack>
      <Text size="sm">
        <NumberFormatter
          value={row.original?.returnWithDividends}
          suffix={` ${row.original.portfolio.baseCurrency}`}
          decimalScale={2}
          thousandSeparator
        />
      </Text>
      <Text
        c={
          Number(row.original?.returnWithDividendsPercent) <= 0
            ? "red"
            : "green"
        }
        size="xs"
      >
        <NumberFormatter
          value={row.original?.returnWithDividendsPercent}
          suffix={` %`}
          decimalScale={2}
          thousandSeparator
        />
      </Text>
    </Stack>
  );
}

function DividendsYieldCell({ row }: Readonly<{ row: MRT_Row<ICompany> }>) {
  return (
    <Stack>
      <Text
        c={Number(row.original?.dividendsYield) <= 0 ? "red" : "green"}
        size="sm"
      >
        <NumberFormatter
          value={row.original?.dividendsYield}
          suffix={` %`}
          decimalScale={2}
          thousandSeparator
        />
      </Text>
    </Stack>
  );
}

function PortfolioValueCell({ row }: Readonly<{ row: MRT_Row<ICompany> }>) {
  return (
    <Stack>
      <Text size="sm">
        <NumberFormatter
          value={row.original.portfolioValue}
          decimalScale={2}
          thousandSeparator
        />
      </Text>
      <Text c="dimmed" size="xs">
        {row.original.portfolio.baseCurrency}
      </Text>
    </Stack>
  );
}

function LogoCell({
  row,
}: Readonly<{
  row: MRT_Row<ICompany>;
}>) {
  return (
    <Stack>
      <Image src={row.original.logo} alt={`${row.original.name} logo`} w={50} />
    </Stack>
  );
}

function CompanyNameCell({
  row,
}: Readonly<{
  row: MRT_Row<ICompany>;
}>) {
  return (
    <Stack>
      <Anchor
        to={`/portfolios/${row.original.portfolio.id}/companies/${row.original.id}`}
        component={Link}
      >
        <Text size="sm">{row.original.name}</Text>
      </Anchor>
      <Text c="dimmed" size="xs">
        {row.original.sector.name}
      </Text>
    </Stack>
  );
}

function TickerCell({
  row,
}: Readonly<{
  row: MRT_Row<ICompany>;
}>) {
  return (
    <Stack>
      <Text fw={700} size="sm">
        {row.original.ticker}
      </Text>
      <Text c="dimmed" size="xs">
        {row.original.market.name}
      </Text>
    </Stack>
  );
}

export default function CompaniesList({
  portfolioId,
  mrtLocalization,
}: IProps) {
  const { t } = useTranslation();
  const [showClosed, setShowClosed] = useState<boolean>(false);
  const [sorting, setSorting] = useState<MRT_SortingState>([
    {
      desc: false,
      id: "name",
    },
  ]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 60,
  });
  const { data, isLoading, isError, isFetching } = useCompanies(
    +portfolioId || undefined,
    sorting,
    pagination,
    showClosed,
  );

  const columns = useMemo<MRT_ColumnDef<ICompany>[]>(
    () => [
      {
        accessorKey: "logo",
        header: "",
        Cell: LogoCell,
        size: 50, //small column
        enableSorting: false,
        enableColumnFilter: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "name",
        header: t("Name"),
        Cell: CompanyNameCell,
      },
      {
        accessorKey: "ticker",
        header: t("Ticker"),
        Cell: TickerCell,
      },
      {
        accessorKey: "sharesCount",
        header: t("Shares"),
      },
      {
        accessorKey: "accumulatedInvestment",
        header: t("Invested"),
        Cell: PriceCell,
      },
      {
        accessorKey: "portfolioValue",
        header: t("Portfolio Value"),
        Cell: PortfolioValueCell,
      },
      {
        accessorKey: "returnWithDividends",
        header: t("Return + Dividends"),
        Cell: ReturnPercentCell,
      },
      {
        accessorKey: "dividendsYield",
        header: t("Dividends Yield"),
        Cell: DividendsYieldCell,
      },
      {
        accessorKey: "lastTransactionMonth",
        header: t("Last buy"),
      },
      {
        accessorKey: "lastDividendMonth",
        header: t("Last dividend"),
      },
    ],
    [t],
  );

  const fetchedCompanies = data?.results ?? [];
  const totalRowCount = data?.count ?? 0;

  const table = useMantineReactTable({
    columns,
    data: fetchedCompanies,
    positionActionsColumn: "last",
    mantineTableBodyCellProps: {
      align: "center",
    },
    rowCount: totalRowCount,
    manualPagination: true,
    manualSorting: true,
    mantineToolbarAlertBannerProps: isError
      ? {
          color: "red",
          children: "Error loading data",
        }
      : undefined,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      sorting,
    },
    localization: mrtLocalization,
  });

  return (
    <Stack>
      <Switch
        defaultChecked
        label={t("Display closed companies")}
        onChange={(event) => setShowClosed(event.currentTarget.checked)}
        checked={showClosed}
      />
      <MantineReactTable table={table} />
    </Stack>
  );
}
