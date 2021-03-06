import moment from "moment";
import { IRightsTransaction, RightsTransactionFormProps } from "types/rights-transaction";
import sendIpcSql from "message-control/renderer";
import { deleteById } from "../operations/operations";

export default class RightsTransactionsDAO {
  static create = (rightsTransaction: RightsTransactionFormProps) => {
    const sql = `
    INSERT INTO "rightsTransactions"
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
        '${rightsTransaction.count}'
      , '${rightsTransaction.price}'
      , '${rightsTransaction.commission}'
      , '${rightsTransaction.type}'
      , '${rightsTransaction.exchangeRate}'
      , '${rightsTransaction.notes}'
      , '${rightsTransaction.transactionDate}'
      , '${rightsTransaction.companyId}'
      , '${rightsTransaction.color}'
      , '${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}'
      , '${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}'
    );
    `;
    const results = sendIpcSql(sql, "insert");
    return results;
  };

  static  exportAll = () => {
    //Call the DB
    console.debug("Export all rights transactions");
    const sql = `
    SELECT
    rightsTransactions.count as count
    , rightsTransactions.price as price
    , rightsTransactions.commission as commission
    , rightsTransactions.color as color
    , rightsTransactions.transactionDate as transactionDate
    , rightsTransactions.exchangeRate as exchangeRate
    , rightsTransactions.notes as notes
    , rightsTransactions.type as type
    , currencies.symbol as currencySymbol
    , currencies.name as currencyName
    , companies.name as companyName
    , companies.ticker as ticker
    , portfolios.name as portfolioName
  FROM "rightsTransactions"
  LEFT JOIN "companies"
    ON companies.id = rightsTransactions.companyId
  LEFT JOIN "currencies"
    ON currencies.id = companies.currencyId
  LEFT JOIN "portfolios"
    ON portfolios.id = companies.portfolioId
    ;
    `;
    const results = sendIpcSql(sql);
    return results;
  };

  static getById = (transactionId: string): IRightsTransaction => {
    //Call the DB
    const sql = `
    SELECT *
    FROM "rightsTransactions"
    WHERE rightsTransactions.id = '${transactionId}';
    `;
    const results = sendIpcSql(sql, "get");
    return results;
  };

  static getAll = (companyId: string) => {
    //Call the DB
    const sql = `
    SELECT
    rightsTransactions.*
      , currencies.symbol as currencySymbol
      , currencies.name as currencyName
    FROM  rightsTransactions
    LEFT JOIN "companies"
      ON companies.id = rightsTransactions.companyId
    LEFT JOIN "currencies"
      ON currencies.id = companies.currencyId
    WHERE rightsTransactions.companyId = '${companyId}'
    ORDER BY datetime(rightsTransactions.transactionDate) ASC
    ;
    `;

    const results = sendIpcSql(sql);
    return results;
  };

  static deleteById = (transactionId: string) => {
    //Call the DB
    const results = deleteById("rightsTransactions", transactionId);
    return results;
  };

  static update = (
    transactionId: string,
    transaction: RightsTransactionFormProps
  ) => {
    const sql = `
    UPDATE rightsTransactions
    SET
    count = '${transaction.count}'
    , price = '${transaction.price}'
    , commission = '${transaction.commission}'
    , type = '${transaction.type}'
    , exchangeRate = '${transaction.exchangeRate}'
    , notes = '${transaction.notes}'
    , transactionDate = '${transaction.transactionDate}'
    , companyId = '${transaction.companyId}'
    , color = '${transaction.color}'
    , lastUpdateDate = '${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}'
    WHERE rightsTransactions.id = '${transactionId}';
    `;
    const results = sendIpcSql(sql, "update");
    return results;
  };
}
