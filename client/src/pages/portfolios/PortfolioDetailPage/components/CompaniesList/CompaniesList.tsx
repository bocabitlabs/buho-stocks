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
  MRT_PaginationState,
  MRT_Row,
  MRT_SortingState,
  useMantineReactTable,
} from "mantine-react-table";
import { useCompanies } from "hooks/use-companies/use-companies";
import { ICompany } from "types/company";

interface IProps {
  portfolioId: string;
}

function PriceCell({
  cell,
  row,
}: Readonly<{ cell: MRT_Cell<ICompany>; row: MRT_Row<ICompany> }>) {
  return (
    <Stack>
      <NumberFormatter
        value={cell.getValue() as string}
        decimalScale={2}
        thousandSeparator
      />
      <Text size="sm">{row.original.allStats?.portfolioCurrency}</Text>
    </Stack>
  );
}

function ReturnPercentCell({ row }: Readonly<{ row: MRT_Row<ICompany> }>) {
  return (
    <Stack>
      <Text>
        <NumberFormatter
          value={row.original.allStats.returnWithDividends}
          suffix={` ${row.original.allStats?.portfolioCurrency}`}
          decimalScale={2}
          thousandSeparator
        />
      </Text>
      <Text
        c={
          Number(row.original.allStats.returnWithDividendsPercent) <= 0
            ? "red"
            : "green"
        }
      >
        <NumberFormatter
          value={row.original.allStats.returnWithDividendsPercent}
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
        c={Number(row.original.allStats.dividendsYield) <= 0 ? "red" : "green"}
      >
        <NumberFormatter
          value={row.original.allStats.dividendsYield}
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
      <Text>
        <NumberFormatter
          value={row.original.allStats.portfolioValue}
          decimalScale={2}
          thousandSeparator
        />
      </Text>
      <Text size="sm">{row.original.allStats?.portfolioCurrency}</Text>
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
        to={`/portfolios/${row.original.portfolio}/companies/${row.original.id}`}
        component={Link}
      >
        {row.original.name}
      </Anchor>
      <Text c="dimmed" size="sm">
        {row.original.allStats.sectorName}
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
      <Text fw={700}>{row.original.ticker}</Text>
      <Text c="dimmed">{row.original.allStats.marketName}</Text>
    </Stack>
  );
}

export default function CompaniesList({ portfolioId }: IProps) {
  const { t } = useTranslation();
  const [showClosed, setShowClosed] = useState<boolean>(false);
  const [sorting, setSorting] = useState<MRT_SortingState>([
    {
      desc: false,
      id: "ticker",
    },
  ]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 60,
  });
  const { data, isLoading, isError, isFetching } = useCompanies(
    +portfolioId!,
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
        maxSize: 50,
      },
      {
        accessorKey: "name",
        header: t("Name"),
        Cell: CompanyNameCell,
        maxSize: 200,
      },
      {
        accessorKey: "ticker",
        header: t("Ticker"),
        Cell: TickerCell,
        maxSize: 50,
      },
      {
        accessorKey: "sharesCount",
        header: t("Shares"),
        maxSize: 50,
      },
      {
        accessorKey: "allStats.accumulatedInvestment",
        header: t("Invested"),
        Cell: PriceCell,
        maxSize: 50,
      },
      {
        accessorKey: "allStats.portfolioValue",
        header: t("Portfolio Value"),
        Cell: PortfolioValueCell,
        maxSize: 50,
      },
      {
        accessorKey: "allStats.returnWithDividends",
        header: t("Return + Dividends"),
        Cell: ReturnPercentCell,
        maxSize: 50,
      },
      {
        accessorKey: "allStats.dividendsYield",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const fetchedCompanies = data?.results ?? [];
  const totalRowCount = data?.count ?? 0;

  const table = useMantineReactTable({
    columns,
    data: fetchedCompanies,
    positionActionsColumn: "last",
    rowCount: totalRowCount,
    manualPagination: true,
    // manualSorting: true,
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
  });

  return (
    <div>
      <Stack>
        <Switch
          defaultChecked
          label={t("Displaying open companies")}
          onChange={(event) => setShowClosed(event.currentTarget.checked)}
          checked={showClosed}
        />
        <MantineReactTable table={table} />
      </Stack>
    </div>
  );
}
