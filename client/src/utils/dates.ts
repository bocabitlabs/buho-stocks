import dayjs from "dayjs";

export const convertToTimezone = (
  date: string,
  dateFormat = "HH:mm:ss",
  fromTz = "Europe/Zurich",
  toTz = "Europe/Zurich",
) => {
  return dayjs.tz(date, dateFormat, fromTz).tz(toTz).toDate();
};

export default convertToTimezone;
