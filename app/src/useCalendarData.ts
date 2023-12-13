import { useEffect, useState } from "react";
import { DAY_IN_MS, MIN_IN_MS, URLS } from "./const";
import {
  getDateRange,
  getDateRangeEvents,
  getHHMM,
  getMinuites,
  getThisMondayMidnight,
  getTodayMidnight,
} from "./util";

export const useCalendarData = () => {
  const [dateRanges, setDateRanges] = useState<[Date, Date][]>([
    [
      new Date(getThisMondayMidnight().getTime() - 7 * DAY_IN_MS),
      getThisMondayMidnight(),
    ],
    [getThisMondayMidnight(), getTodayMidnight()],
  ]);
  const [calendarData, setCalendarData] = useState<any>([]);
  const [chartData, setChartData] = useState<any>([]);
  const [averageData, setAverageData] = useState<any>([]);

  useEffect(() => {
    // indexedDB 데이터 보고 Api call 안해도 되면 indexedDB에서 가져옴
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

      setCalendarData(
        dataset.map((s, idx) => {
          const range = getDateRange(dateRanges[idx]);
          return {
            range,
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
                    .map((e) => {
                      return (
                        new Date(e.end.dateTime).getTime() -
                        new Date(e.start.dateTime).getTime()
                      );
                    })
                    .reduce((acc, cur) => acc + cur, 0)
                ),
              };
            }),
          };
        })
      );
    });
  }, [dateRanges]);

  useEffect(() => {
    if (calendarData) {
      setChartData(
        calendarData.map((d) => {
          const { calendarList } = d;
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
        })
      );
      setAverageData(
        calendarData.map((d, idx) => {
          const { calendarList, range } = d;
          return {
            backgroundColor: calendarList.map((l) => l.backgroundColor),
            averageDailyTime: calendarList.map((l) =>
              getHHMM(Math.floor(l.eventsTotalTime / range) * MIN_IN_MS)
            ),
            percentOfChange: calendarList.map((l, idx2) => {
              if (idx === 0) {
                return null;
              }
              const { calendarList: cl, range: r } = calendarData[idx - 1];
              const currentTime = l.eventsTotalTime / range;
              const prevTime = cl[idx2].eventsTotalTime / r;
              return (((currentTime - prevTime) / prevTime) * 100).toFixed(1);
            }),
          };
        })
      );
    }
  }, [calendarData]);

  return { calendarData, chartData, averageData };
};