import dayjs from "dayjs";
import {
  AverageData,
  COLORS_IN_EVENT,
  ChartData,
  DatasetContent,
  DateRange,
  HeaderData,
  MIN_IN_MS,
  URLS,
} from "./const";
import { getDateRangeEvents, getHHMM, getMinuites } from "./util";

const getInnerTimeData = (calendarList) => {
  const res = [];
  calendarList.forEach((c) => {
    const obj = {};
    const { events } = c;
    events.forEach((e) => {
      if (!e.colorId) {
        if (obj.hasOwnProperty("main")) {
          obj["main"] += dayjs(e.end.dateTime).diff(
            dayjs(e.start.dateTime),
            "ms"
          );
        } else {
          obj["main"] = dayjs(e.end.dateTime).diff(
            dayjs(e.start.dateTime),
            "ms"
          );
        }
      } else {
        if (obj.hasOwnProperty(e.colorId)) {
          obj[e.colorId] += dayjs(e.end.dateTime).diff(
            dayjs(e.start.dateTime),
            "ms"
          );
        } else {
          obj[e.colorId] = dayjs(e.end.dateTime).diff(
            dayjs(e.start.dateTime),
            "ms"
          );
        }
      }
    });
    Object.entries(obj).forEach((entry) => {
      const [key, value] = entry;
      obj[key] = getMinuites(value);
    });
    res.push(obj);
  });
  return res;
};

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

const formatInnerChartData = ({ calendarList }, innerTimeData): ChartData[] => {
  return innerTimeData.map((d, idx) => {
    return {
      labels: Object.keys(d).map((key) => {
        return key === "main" ? key : COLORS_IN_EVENT[key];
      }),
      datasets: [
        {
          label: "Time spent(m)",
          data: Object.values(d).map((value) => value),
          backgroundColor: Object.keys(d).map((key) => {
            return key === "main"
              ? calendarList[idx].backgroundColor
              : COLORS_IN_EVENT[key];
          }),
        },
      ],
    };
  });
};

const formatAverageData = (prevCalendarData, calendarData): AverageData => {
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

const formatInnerAverageData = (
  prevCalendarData,
  calendarData,
  prevInnerTimeData,
  innerTimeData
) => {
  const { calendarList, range } = calendarData;
  return innerTimeData.map((d, idx) => {
    return {
      backgroundColor: Object.keys(d).map((key) =>
        key === "main"
          ? calendarList[idx].backgroundColor
          : COLORS_IN_EVENT[key]
      ),
      averageDailyTime: Object.values(d).map((value) =>
        getHHMM(Math.floor(Number(value) / range) * MIN_IN_MS)
      ),
      percentOfChange: Object.entries(d).map((entry) => {
        const [key, value] = entry;
        if (!prevInnerTimeData || !prevCalendarData) {
          return null;
        }
        const currentTime = (value as number) / range;
        const prevTime =
          (prevInnerTimeData[key] as number) / prevCalendarData.range;
        return (((currentTime - prevTime) / prevTime) * 100).toFixed(1);
      }),
    };
  });
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
            const events = s[idx2].items
              ?.map((i) => {
                const { start, end, colorId, id } = i;
                return { start, end, colorId, id };
              })
              ?.filter((e) => e.start?.dateTime);

            return {
              id,
              backgroundColor,
              summary,
              events,
              eventsTotalTime: getMinuites(
                events
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
        const innerTimeData = getInnerTimeData(d.calendarList);
        res[idx] = {
          innerTimeData,
          headerData: formatHeaderData(d, idx),
          chartData: {
            main: formatChartData(d),
            inner: formatInnerChartData(d, innerTimeData),
          },
          averageData: {
            main: formatAverageData(
              idx === 0 ? null : calendarData[idx - 1],
              d
            ),
            inner: formatInnerAverageData(
              idx === 0 ? null : calendarData[idx - 1],
              d,
              idx === 0 ? null : res[idx - 1].innerTimeData,
              innerTimeData
            ),
          },
        };
      });
      resolve(res);
    });
  });
};

export const getDatasetContent = (dateRanges: DateRange) => {};