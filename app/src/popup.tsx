import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  getDateRangeEvents,
  getMinuites,
  getThisMondayMidnight,
  getTodayMidnight,
} from "./util";
import { URLS } from "./const";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale);

const Popup = () => {
  const [calendarData, setCalendarData] = useState<any>();
  const [prevChartData, setPrevChartData] = useState<any>();
  const [nextChartData, setNextChartData] = useState<any>();

  useEffect(() => {
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

      const thisMondayMidnight = getThisMondayMidnight();
      const mondayOfLastWeek = new Date(thisMondayMidnight);
      mondayOfLastWeek.setDate(thisMondayMidnight.getDate() - 7);

      const thisWeekData = await getDateRangeEvents(
        calendarList,
        headers,
        thisMondayMidnight.toISOString(),
        getTodayMidnight().toISOString()
      );

      const lastWeekData = await getDateRangeEvents(
        calendarList,
        headers,
        mondayOfLastWeek.toISOString(),
        thisMondayMidnight.toISOString()
      );

      setCalendarData(
        calendarList.map(({ id, backgroundColor, summary }, idx) => {
          return {
            id,
            backgroundColor,
            summary,
            events: [
              lastWeekData[idx].items.map(({ start, end, colorId, id }) => {
                return { start, end, colorId, id };
              }),
              thisWeekData[idx].items.map(({ start, end, colorId, id }) => {
                return { start, end, colorId, id };
              }),
            ],
          };
        })
      );
    });
  }, []);

  useEffect(() => {
    if (!calendarData) {
      return;
    }

    console.log(calendarData);

    setPrevChartData({
      labels: calendarData.map((d) => d.summary),
      datasets: [
        {
          label: "Time spent(m)",
          data: calendarData.map(({ events }) => {
            console.log("events", events, events[0]);
            return getMinuites(
              events[0]
                .filter((e) => e.start?.dateTime)
                .map((e) => {
                  return (
                    new Date(e.end.dateTime).getTime() -
                    new Date(e.start.dateTime).getTime()
                  );
                })
                .reduce((acc, cur) => acc + cur, 0)
            );
          }),
          backgroundColor: calendarData.map((d) => d.backgroundColor),
        },
      ],
    });

    setNextChartData({
      labels: calendarData.map((d) => d.summary),
      datasets: [
        {
          label: "Time spent(m)",
          data: calendarData.map(({ events }) => {
            return getMinuites(
              events[1]
                .filter((e) => e.start?.dateTime)
                .map((e) => {
                  return (
                    new Date(e.end.dateTime).getTime() -
                    new Date(e.start.dateTime).getTime()
                  );
                })
                .reduce((acc, cur) => acc + cur, 0)
            );
          }),
          backgroundColor: calendarData.map((d) => d.backgroundColor),
        },
      ],
    });
  }, [calendarData]);

  return (
    <>
      <div>
        Last Week
        {prevChartData && <Doughnut data={prevChartData} />}
      </div>
      <div>
        This Week
        {nextChartData && <Doughnut data={nextChartData} />}
      </div>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
