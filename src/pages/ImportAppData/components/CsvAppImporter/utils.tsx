import CompanyService from "services/companies/companies-service";
import CurrencyService from "services/currencies/currencies-service";
import DividendsTransactionsService from "services/dividends-transactions/dividends-transactions-service";
import MarketService from "services/markets/markets-service";
import PortfolioService from "services/portfolios/portfolios-service";
import RightsTransactionsService from "services/rights-transactions/rights-transactions-service";
import SectorsService from "services/sectors/sectors-service";
import SharesTransactionsService from "services/shares-transactions/shares-transactions-service";
import StockPriceService from "services/stock-prices/stock-prices-service";
import { CompanyFormFields } from "types/company";
import { CurrencyFormFields } from "types/currency";
import { DividendsTransactionFormProps } from "types/dividends-transaction";
import { MarketFormProps } from "types/market";
import { PortfolioFormFields } from "types/portfolio";
import { RightsTransactionFormProps } from "types/rights-transaction";
import { SectorFormFields } from "types/sector";
import { SharesTransactionFormProps } from "types/shares-transaction";
import { StockPriceFormProps } from "types/stock-price";

export function importSectors(sectors: any[]) {
  let importedCount = 0;
  let totalCount = 0;
  let notes: string[] = [];
  sectors.forEach((sectorData: any) => {
    const sector: SectorFormFields = {
      name: sectorData.data[1],
      color: sectorData.data[2],
      isSuperSector: sectorData.data[3],
      superSectorId: sectorData.data[4]
    };
    const exists = SectorsService.getByName(sector.name);
    if (exists === undefined) {
      SectorsService.create(sector);
      importedCount++;
    } else {
      notes.push(`Sectors: Sector ${sector.name} already exists. Skipping.`);
    }
    totalCount++;
  });
  return { importedCount, totalCount, notes };
}

export function importMarkets(markets: any[]) {
  let importedCount = 0;
  let totalCount = 0;
  let notes: string[] = [];

  markets.forEach((marketData: any) => {
    const market: MarketFormProps = {
      name: marketData.data[1],
      color: marketData.data[2],
      region: marketData.data[3],
      description: marketData.data[4],
      openTime: marketData.data[5],
      closeTime: marketData.data[6]
    };
    const exists = MarketService.getByName(market.name);
    if (exists === undefined) {
      MarketService.create(market);
      importedCount++;
    } else {
      notes.push(`Markets: Market ${market.name} already exists. Skipping.`);
    }
    totalCount++;
  });
  console.debug(`Imported ${importedCount} markets`);
  return { importedCount, totalCount, notes };
}

export function importCurrencies(currencies: any[]) {
  let importedCount = 0;
  let totalCount = 0;
  let notes: string[] = [];

  currencies.forEach((currencyData: any) => {
    const currency: CurrencyFormFields = {
      abbreviation: currencyData.data[2],
      name: currencyData.data[3],
      color: currencyData.data[4],
      symbol: currencyData.data[5],
      country: currencyData.data[6]
    };
    console.debug(currencyData);
    const exists = CurrencyService.getByName(currency.name);
    if (exists === undefined) {
      CurrencyService.create(currency);
      importedCount++;
    } else {
      notes.push(
        `Currencies: Currency ${currency.name} already exists. Skipping.`
      );
    }
    totalCount++;
  });
  console.debug(`Imported ${importedCount} currencies`);
  return { importedCount, totalCount, notes };
}
export function importPortfolios(portfolios: any[]) {
  let importedCount = 0;
  let totalCount = 0;
  let notes: string[] = [];

  portfolios.forEach((portfolioData: any) => {
    const exists = PortfolioService.getByName(portfolioData.data[1]);
    if (exists === undefined) {
      const currency = CurrencyService.getByName(portfolioData.data[6]);
      if (currency !== undefined) {
        const portfolio: PortfolioFormFields = {
          name: portfolioData.data[1],
          color: portfolioData.data[2],
          description: portfolioData.data[3],
          currencyId: currency.id
        };
        PortfolioService.create(portfolio);
        importedCount++;
      } else {
        notes.push(
          `Portfolios: Currency ${portfolioData.data[6]} doesn't exist. Add it first. Skipping.`
        );
      }
      totalCount++;
    } else {
      notes.push(
        `Portfolios: Portfolio ${portfolioData.data[1]} already exists. Skipping.`
      );
    }
  });
  return { importedCount, totalCount, notes };
}

export function importCompanies(companies: any[]) {
  let importedCount = 0;
  let totalCount = 0;
  let notes: string[] = [];

  companies.forEach((portfolioData: any) => {
    const exists = CompanyService.getByTicker(portfolioData.data[3]);
    if (exists === undefined) {
      const sector = SectorsService.getByName(portfolioData.data[8]);
      const currency = CurrencyService.getByName(portfolioData.data[9]);
      const portfolio = PortfolioService.getByName(portfolioData.data[11]);
      const market = MarketService.getByName(portfolioData.data[12]);

      if (currency && sector && market && portfolio) {
        const company: CompanyFormFields = {
          name: portfolioData.data[1],
          color: portfolioData.data[2],
          ticker: portfolioData.data[3],
          description: portfolioData.data[4],
          broker: portfolioData.data[5],
          url: portfolioData.data[6],
          closed: portfolioData.data[7],
          currencyId: currency.id,
          marketId: market.id,
          sectorId: sector.id,
          portfolioId: portfolio.id,
          alternativeTickers: portfolioData.data[13],
          countryCode: portfolioData.data[14],
          dividendsCurrencyId: portfolioData.data[15]
        };
        CompanyService.create(company);
        importedCount++;
      } else {
        notes.push(
          `Companies: Either currency, sector, market or portfolio don't exist for company ${portfolioData.data[1]}. Add them first. Skipping.`
        );
      }
      totalCount++;
    } else {
      notes.push(
        `Companies: Company ${portfolioData.data[1]} already exists. Skipping.`
      );
    }
  });
  console.debug(`Imported ${importedCount} companies`);
  return { importedCount, totalCount, notes };
}

export function importSharesTransactions(shares: any[]) {
  let importedCount = 0;
  let totalCount = 0;
  let notes: string[] = [];

  shares.forEach((portfolioData: any) => {
    const portfolio = PortfolioService.getByName(portfolioData.data[13]);
    if (portfolio) {
      const company = CompanyService.getByTickerPortfolio(
        portfolioData.data[12],
        portfolio.id
      );
      if (company) {
        const transaction: SharesTransactionFormProps = {
          count: portfolioData.data[1],
          price: portfolioData.data[2],
          commission: portfolioData.data[3],
          color: portfolioData.data[4],
          transactionDate: portfolioData.data[5],
          exchangeRate: portfolioData.data[6],
          notes: portfolioData.data[7],
          type: portfolioData.data[8],
          companyId: company.id
        };
        SharesTransactionsService.create(transaction);
        importedCount++;
      } else {
        notes.push(
          `Shares transactions: Company ${portfolioData.data[12]} doesn't exist. Add it first. Skipping.`
        );
      }
      totalCount++;
    } else {
      notes.push(
        `Shares transactions: Portfolio ${portfolioData.data[13]} doesn't exist. Add it first. Skipping.`
      );
    }
  });
  console.debug(`Imported ${importedCount} shares transactions`);
  return { importedCount, totalCount, notes };
}

export function importRightsTransactions(rights: any[]) {
  let importedCount = 0;
  let totalCount = 0;
  let notes: string[] = [];

  rights.forEach((portfolioData: any) => {
    const portfolio = PortfolioService.getByName(portfolioData.data[13]);
    if (portfolio) {
      const company = CompanyService.getByTickerPortfolio(
        portfolioData.data[12],
        portfolio.id
      );
      if (company) {
        const transaction: RightsTransactionFormProps = {
          count: portfolioData.data[1],
          price: portfolioData.data[2],
          commission: portfolioData.data[3],
          color: portfolioData.data[4],
          transactionDate: portfolioData.data[5],
          exchangeRate: portfolioData.data[6],
          notes: portfolioData.data[7],
          type: portfolioData.data[8],
          companyId: company.id
        };
        RightsTransactionsService.create(transaction);
        importedCount++;
      } else {
        notes.push(
          `Rights transactions: Company ${portfolioData.data[12]} doesn't exist. Add it first. Skipping.`
        );
      }
      totalCount++;
    } else {
      notes.push(
        `Rights transactions: Portfolio ${portfolioData.data[13]} doesn't exist. Add it first. Skipping.`
      );
    }
  });
  console.debug(`Imported ${importedCount} rights transactions`);
  return { importedCount, totalCount, notes };
}

export function importDividendsTransactions(dividends: any[]) {
  let importedCount = 0;
  let totalCount = 0;
  let notes: string[] = [];

  console.debug("Importing dividends transactions: ", dividends.length);
  dividends.forEach((portfolioData: any) => {
    const portfolio = PortfolioService.getByName(portfolioData.data[12]);
    if (portfolio) {
      const company = CompanyService.getByTickerPortfolio(
        portfolioData.data[11],
        portfolio.id
      );
      if (company) {
        const transaction: DividendsTransactionFormProps = {
          count: portfolioData.data[1],
          price: portfolioData.data[2],
          commission: portfolioData.data[3],
          color: portfolioData.data[4],
          transactionDate: portfolioData.data[5],
          exchangeRate: portfolioData.data[6],
          notes: portfolioData.data[7],
          companyId: company.id
        };
        DividendsTransactionsService.create(transaction);
        importedCount++;
      } else {
        notes.push(
          `Dividends transactions: Company ${portfolioData.data[11]} doesn't exist. Add it first. Skipping.`
        );
      }
      totalCount++;
    } else {
      notes.push(
        `Dividends transactions: Portfolio ${portfolioData.data[12]} doesn't exist. Add it first. Skipping.`
      );
    }
  });
  console.debug(`Imported ${importedCount} dividends transactions`);
  return { importedCount, totalCount, notes };
}

export function importStockPrices(dividends: any[]) {
  let importedCount = 0;
  let totalCount = 0;
  let notes: string[] = [];

  console.debug("Importing stock prices: ", dividends.length);
  dividends.forEach((portfolioData: any) => {
    const portfolio = PortfolioService.getByName(portfolioData.data[5]);
    if (portfolio) {
      const company = CompanyService.getByTickerPortfolio(
        portfolioData.data[4],
        portfolio.id
      );
      if (company) {
        const transaction: StockPriceFormProps = {
          price: portfolioData.data[1],
          exchangeRate: portfolioData.data[2],
          transactionDate: portfolioData.data[3],
          companyId: company.id
        };
        StockPriceService.create(transaction);
        importedCount++;
      } else {
        notes.push(
          `Stock prices: Company ${portfolioData.data[4]} doesn't exist. Add it first. Skipping.`
        );
      }
    } else {
      notes.push(
        `Stock prices: Portfolio ${portfolioData.data[5]} doesn't exist. Add it first. Skipping.`
      );
    }
    totalCount++;
  });
  console.debug(`Imported ${importedCount} stock prices`);
  return { importedCount, totalCount, notes };
}
