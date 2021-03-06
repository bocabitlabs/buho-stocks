import sendIpcSql from "message-control/renderer";
import moment from "moment";
import {
  IDividendsTransaction,
  DividendsTransactionFormProps
} from "types/dividends-transaction";
import { deleteById } from "../operations/operations";

export default class DividendsTransactionsDAO {
  static create = (transaction: DividendsTransactionFormProps) => {
    //Call the DB
    const sql = `
    INSERT INTO "dividendsTransactions"
    (
       "count"
      ,"price"
      ,"commission"
      ,"exchangeRate"
      ,"notes"
      ,"transactionDate"
      ,"companyId"
      ,"color"
      , "creationDate"
      , "lastUpdateDate"
    )
    VALUES
    (
       '${transaction.count}'
     , '${transaction.price}'
     , '${transaction.commission}'
     , '${transaction.exchangeRate}'
     , '${transaction.notes}'
     , '${transaction.transactionDate}'
     , '${transaction.companyId}'
     , '${transaction.color}'
     , '${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}'
     , '${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}'
    );
    `;

    const results = sendIpcSql(sql, "insert");
    return results;
  };

  static exportAll = () => {
    //Call the DB
    console.debug("Export all dividendsTransactions");
    const sql = `
    SELECT
    dividendsTransactions.count as count
    , dividendsTransactions.price as price
    , dividendsTransactions.commission as commission
    , dividendsTransactions.color as color
    , dividendsTransactions.transactionDate as transactionDate
    , dividendsTransactions.exchangeRate as exchangeRate
    , dividendsTransactions.notes as notes
    , currencies.symbol as currencySymbol
    , currencies.name as currencyName
    , companies.name as companyName
    , companies.ticker as ticker
    , portfolios.name as portfolioName
    FROM "dividendsTransactions"
    LEFT JOIN "companies"
      ON companies.id = dividendsTransactions.companyId
    LEFT JOIN "currencies"
      ON currencies.id = companies.currencyId
    LEFT JOIN "portfolios"
      ON portfolios.id = companies.portfolioId
    ;
    `;
    const results = sendIpcSql(sql);
    return results;
  };

  static update = (transactionId: string, transaction: DividendsTransactionFormProps) => {
    const sql = `
    UPDATE dividendsTransactions
    SET
    count = '${transaction.count}'
    , price = '${transaction.price}'
    , commission = '${transaction.commission}'
    , exchangeRate = '${transaction.exchangeRate}'
    , notes = '${transaction.notes}'
    , transactionDate = '${transaction.transactionDate}'
    , companyId = '${transaction.companyId}'
    , color = '${transaction.color}'
    , lastUpdateDate = '${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}'
    WHERE dividendsTransactions.id = '${transactionId}';
    `;
    const results = sendIpcSql(sql, "update");
    return results;
  }

  static getAll = (companyId: string) => {
    //Call the DB
    const sql = `
    SELECT
      dividendsTransactions.*
      , currencies.symbol as currencySymbol
      , currencies.name as currencyName
    FROM  dividendsTransactions
    LEFT JOIN "companies"
      ON companies.id = dividendsTransactions.companyId
    LEFT JOIN "currencies"
      ON currencies.id = companies.currencyId
    WHERE dividendsTransactions.companyId = '${companyId}'
    ORDER BY datetime(dividendsTransactions.transactionDate) ASC
    ;
    `;

    const results = sendIpcSql(sql);
    return results;
  };

  static getById = (transactionId: string): IDividendsTransaction => {
    //Call the DB
    const sql = `
    SELECT *
    FROM "dividendsTransactions"
    WHERE dividendsTransactions.id = '${transactionId}';
    `;
    const results = sendIpcSql(sql, "get");
    return results;
  };

  static deleteById = (transactionId: string) => {
    //Call the DB
    const results = deleteById("dividendsTransactions", transactionId);
    return results;
  };
}
