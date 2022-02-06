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
  const elementDescriptionWithoutConcept = elementDescription
    .replace(nameWithISINMatch ? nameWithISINMatch[0] : "", "")
    .split("(")[0];
  console.debug(
    `Name with ISIN: ${nameWithISINMatch}. Date: ${transactionDate}. Description ${elementDescriptionWithoutConcept}`,
  );
  if (nameWithISINMatch && nameWithISINMatch.length > 0) {
    const nameWithISIN = nameWithISINMatch[0];

    const commissionElement = commissionsArray.find((element: any) => {
      const commissionDescription: string = element.data[4];
      const taxesNameWithIsinMatch =
        commissionDescription.match(/(\w)+\s?\(\w+\)/g);
      return (
        taxesNameWithIsinMatch &&
        taxesNameWithIsinMatch.length > 0 &&
        taxesNameWithIsinMatch[0] === nameWithISIN &&
        transactionDate === element.data[3] &&
        commissionDescription.includes(elementDescriptionWithoutConcept)
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
