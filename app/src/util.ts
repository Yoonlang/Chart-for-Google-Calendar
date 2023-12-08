import { URLS } from "./const";

export const getThisMondayMidnight = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const daysUntilMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysUntilMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

export const getTodayMidnight = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getHHMM = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  return formattedTime;
};

export const getMinuites = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return minutes;
};

export const getDateRangeEvents = async (calendarList, headers, prev, next) => {
  const res = await Promise.all(
    calendarList.map((c) =>
      fetch(
        `${URLS.EVENTS_PRE}${c.id}${URLS.EVENTS_SUF}/?timeMin=${prev}&timeMax=${next}&maxResults=1000`,
        {
          headers,
        }
      )
    )
  );
  return await Promise.all(res.map(async (res) => await res.json()));
};