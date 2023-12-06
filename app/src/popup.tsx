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
import { getMinuites, getThisMondayMidnight, getTodayMidnight } from "./util";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale);

const URLS = {
  CALENDAR_LIST: "https://www.googleapis.com/calendar/v3/users/me/calendarList",
  EVENTS_PRE: "https://www.googleapis.com/calendar/v3/calendars/",
  EVENTS_SUF: "/events",
};

const Popup = () => {
  const [calendarData, setCalendarData] = useState<any>();
  const [chartData, setChartData] = useState<any>();

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

      const thisWeekResponse = await Promise.all(
        calendarList.map((c) =>
          fetch(
            `${URLS.EVENTS_PRE}${c.id}${
              URLS.EVENTS_SUF
            }/?timeMin=${getThisMondayMidnight().toISOString()}&timeMax=${getTodayMidnight().toISOString()}&maxResults=1000`,
            {
              headers,
            }
          )
        )
      );
      const thisWeekData = await Promise.all(
        thisWeekResponse.map(async (res) => await res.json())
      );

      setCalendarData(
        calendarList.map(({ id, backgroundColor, summary }, idx) => {
          return {
            id,
            backgroundColor,
            summary,
            events: thisWeekData[idx].items.map(
              ({ start, end, colorId, id }) => {
                return { start, end, colorId, id };
              }
            ),
          };
        })
      );
    });
  }, []);

  useEffect(() => {
    if (!calendarData) {
      return;
    }

    setChartData({
      labels: calendarData.map((d) => d.summary),
      datasets: [
        {
          label: "Time spent(m)",
          data: calendarData.map(({ events }) => {
            return getMinuites(
              events
                .filter((e) => e.start.dateTime)
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
      <div>{chartData && <Doughnut data={chartData} />}</div>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
