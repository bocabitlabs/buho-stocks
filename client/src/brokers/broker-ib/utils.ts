/**
 * Obtain the commission element from the csv if present
 * @param elementDescription
 * @param transactionDate
 */
export const getCommissionsForElement = (
  elementDescription: string,
  transactionDate: string,
  commissionsArray: any,
) => {
  const nameWithISINMatch = elementDescription.match(/(\w)+\s?\(\w+\)/g);
  console.debug(
    `Name with ISIN: ${nameWithISINMatch}. Date: ${transactionDate}`,
  );
  if (nameWithISINMatch && nameWithISINMatch.length > 0) {
    const nameWithISIN = nameWithISINMatch[0];

    const commissionElement = commissionsArray.find((element: any) => {
      const taxesNameWithIsinMatch = element.data[4].match(/(\w)+\s?\(\w+\)/g);
      return (
        taxesNameWithIsinMatch &&
        taxesNameWithIsinMatch.length > 0 &&
        taxesNameWithIsinMatch[0] === nameWithISIN &&
        transactionDate === element.data[3]
      );
    });
    if (commissionElement) {
      console.debug(`Found tax match ${commissionElement.data}`);
      return commissionElement.data;
    }
  }
  return null;
};

export default { getCommissionsForElement };
