import dayjs from "dayjs";
import {
  AverageData,
  ChartData,
  DatasetContent,
  DateRange,
  HeaderData,
  MIN_IN_MS,
  URLS,
} from "./const";
import { getDateRangeEvents, getHHMM, getMinuites } from "./util";

const formatHeaderData = (calendarData, idx: number): HeaderData => {
  return {
    datasetIdx: idx,
    dateRange: calendarData.dateRange,
  };
};

const formatChartData = ({ calendarList }): ChartData => {
  return {
    labels: calendarList.map((l) => l.summary),
    datasets: [
      {
        label: "Time spent(m)",
        data: calendarList.map((l) => l.eventsTotalTime),
        backgroundColor: calendarList.map((l) => l.backgroundColor),
      },
    ],
  };
};

const formatAverageData = (
  prevCalendarData,
  calendarData,
  idx: number
): AverageData => {
  const { calendarList, range } = calendarData;
  return {
    backgroundColor: calendarList.map((l) => l.backgroundColor),
    averageDailyTime: calendarList.map((l) =>
      getHHMM(Math.floor(l.eventsTotalTime / range) * MIN_IN_MS)
    ),
    percentOfChange: calendarList.map((l, idx2) => {
      if (!prevCalendarData) {
        return null;
      }
      const { calendarList: cl, range: r } = prevCalendarData;
      const currentTime = l.eventsTotalTime / range;
      const prevTime = cl[idx2].eventsTotalTime / r;
      return (((currentTime - prevTime) / prevTime) * 100).toFixed(1);
    }),
  };
};

export const getAllDatasetContent = (
  dateRanges: DateRange
): Promise<DatasetContent[]> => {
  // indexedDB 데이터 먼저 확인
  return new Promise<DatasetContent[]>((resolve) => {
    const res = [];
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      const headers = new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });

      const calendarListResponse = await fetch(URLS.CALENDAR_LIST, {
        headers,
      });
      const calendarListData = await calendarListResponse.json();
      const calendarList = calendarListData.items;

      const dataset = await Promise.all(
        dateRanges.map((r) =>
          getDateRangeEvents(
            calendarList,
            headers,
            r[0].toISOString(),
            r[1].toISOString()
          )
        )
      );

      const calendarData = dataset.map((s, idx) => {
        const [from, to] = dateRanges[idx];
        return {
          range: to.diff(from, "d") + 1,
          dateRange: dateRanges[idx],
          calendarList: calendarList.map((c, idx2) => {
            const { id, backgroundColor, summary } = c;
            const events = s[idx2].items?.map((i) => {
              const { start, end, colorId, id } = i;
              return { start, end, colorId, id };
            });

            return {
              id,
              backgroundColor,
              summary,
              events,
              eventsTotalTime: getMinuites(
                events
                  ?.filter((e) => e.start?.dateTime)
                  .map((e) =>
                    dayjs(e.end.dateTime).diff(dayjs(e.start.dateTime), "ms")
                  )
                  .reduce((acc, cur) => acc + cur, 0)
              ),
            };
          }),
        };
      });

      calendarData.forEach((d, idx) => {
        res[idx] = {
          headerData: formatHeaderData(d, idx),
          chartData: formatChartData(d),
          averageData: formatAverageData(
            idx === 0 ? null : calendarData[idx - 1],
            d,
            idx
          ),
        };
      });
      resolve(res);
    });
  });
};

export const getDatasetContent = (dateRanges: DateRange) => {};
