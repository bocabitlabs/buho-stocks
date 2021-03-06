import sendIpcSql from "message-control/renderer";
import moment from "moment";
import {
  ISharesTransaction,
  SharesTransactionFormProps
} from "types/shares-transaction";
import { deleteById } from "../operations/operations";

export default class SharesTransactionsDAO {
  static create = (sharesTransaction: SharesTransactionFormProps) => {
    //Call the DB
    const sql = `
    INSERT INTO "sharesTransactions"
    (
        "count"
      , "price"
      , "commission"
      , "type"
      , "exchangeRate"
      , "notes"
      , "transactionDate"
      , "companyId"
      , "color"
      , "creationDate"
      , "lastUpdateDate"
    )
    VALUES
    (
        '${sharesTransaction.count}'
      , '${sharesTransaction.price}'
      , '${sharesTransaction.commission}'
      , '${sharesTransaction.type}'
      , '${sharesTransaction.exchangeRate}'
      , '${sharesTransaction.notes}'
      , '${sharesTransaction.transactionDate}'
      , '${sharesTransaction.companyId}'
      , '${sharesTransaction.color}'
      , '${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}'
      , '${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}'
    );
    `;
    const results = sendIpcSql(sql, "insert");
    return results;
  };

  static exportAll = () => {
    //Call the DB
    console.debug("Export all shares transactions");
    const sql = `
    SELECT
      sharesTransactions.count as count
      , sharesTransactions.price as price
      , sharesTransactions.commission as commission
      , sharesTransactions.color as color
      , sharesTransactions.transactionDate as transactionDate
      , sharesTransactions.exchangeRate as exchangeRate
      , sharesTransactions.notes as notes
      , sharesTransactions.type as type
      , currencies.symbol as currencySymbol
      , currencies.name as currencyName
      , companies.name as companyName
      , companies.ticker as ticker
      , portfolios.name as portfolioName
    FROM "sharesTransactions"
    LEFT JOIN "companies"
      ON companies.id = sharesTransactions.companyId
    LEFT JOIN "currencies"
      ON currencies.id = companies.currencyId
    LEFT JOIN "portfolios"
      ON portfolios.id = companies.portfolioId
    ;
    `;
    const results = sendIpcSql(sql);
    return results;
  };

  static getById = (transactionId: string): ISharesTransaction => {
    //Call the DB
    const sql = `
    SELECT *
    FROM "sharesTransactions"
    WHERE sharesTransactions.id = '${transactionId}';
    `;
    const results = sendIpcSql(sql, "get");
    return results;
  };

  static getAll = (companyId: string) => {
    //Call the DB
    const sql = `
    SELECT
    sharesTransactions.*
      , currencies.symbol as currencySymbol
      , currencies.name as currencyName
    FROM  sharesTransactions
    LEFT JOIN "companies"
      ON companies.id = sharesTransactions.companyId
    LEFT JOIN "currencies"
      ON currencies.id = companies.currencyId
    WHERE sharesTransactions.companyId = '${companyId}'
    ORDER BY datetime(sharesTransactions.transactionDate) ASC
    ;
    `;
    const results = sendIpcSql(sql);
    return results;
  };

  static deleteById = (id: string) => {
    //Call the DB
    const results = deleteById("sharesTransactions", id);
    return results;
  };

  static update = (
    transactionId: string,
    transaction: SharesTransactionFormProps
  ) => {
    const sql = `
    UPDATE sharesTransactions
    SET
    count = '${transaction.count}'
    , price = '${transaction.price}'
    , commission = '${transaction.commission}'
    , exchangeRate = '${transaction.exchangeRate}'
    , notes = '${transaction.notes}'
    , transactionDate = '${transaction.transactionDate}'
    , companyId = '${transaction.companyId}'
    , color = '${transaction.color}'
    , type = '${transaction.type}'
    , lastUpdateDate = '${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}'
    WHERE sharesTransactions.id = '${transactionId}';
    `;
    const results = sendIpcSql(sql, "update");
    return results;
  };
}
