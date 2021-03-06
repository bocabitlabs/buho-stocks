import sendIpcSql from "../../../message-control/renderer";


export const getById = (table: string, id: string) => {
  //Call the DB
  const sql = `SELECT * FROM ${table} WHERE "id" = '${id}'`;
  const results = sendIpcSql(sql, "get");
  return results;
};

export const deleteById = (table: string, id: string) => {
  //Call the DB
  const sql = `DELETE FROM ${table} WHERE "id" = '${id}'`;
  const results = sendIpcSql(sql, "delete");
  return results;
};