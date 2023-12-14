import React, { Suspense, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styled from "styled-components";
import { getCalendarData } from "./useCalendarData";
import AverageDailyTime from "./AverageDailyTime";
import { Loader } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { wrapPromise } from "./util";
import DatasetHead from "./DatasetHead";
import { DAY_IN_MS } from "./const";
import { getThisMondayMidnight, getTodayMidnight } from "./util";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale);

const SCPopup = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const defaultDateRanges: [Date, Date][] = [
  [
    new Date(getThisMondayMidnight().getTime() - 7 * DAY_IN_MS),
    getThisMondayMidnight(),
  ],
  [getThisMondayMidnight(), getTodayMidnight()],
];

const Popup = () => {
  const [dateRanges, setDateRanges] = useState(defaultDateRanges);
  const [data, setData] = useState(
    wrapPromise(getCalendarData(defaultDateRanges))
  );

  const refreshData = (dateRange, idx) => {
    const [from, to] = dateRange;
    const newDateRanges = [...dateRanges];
    newDateRanges[idx] = [from, new Date(to.getTime() + DAY_IN_MS)];
    setDateRanges(newDateRanges);
    setData(wrapPromise(getCalendarData(newDateRanges)));
  };

  return (
    <SCPopup>
      <Suspense fallback={<Loader size="sm" />}>
        <DatasetList data={data} refreshData={refreshData} />
      </Suspense>
    </SCPopup>
  );
};

const DatasetList = (prop) => {
  const { data, refreshData } = prop;
  const { calendarData, chartData, averageData } = data.read();

  return (
    <>
      {chartData?.map((d, idx) => {
        return (
          <div>
            <DatasetHead
              data={{ idx, dateRange: calendarData[idx].dateRange }}
              refreshData={refreshData}
            />
            <Doughnut data={d} />
            <AverageDailyTime data={averageData[idx]} />
          </div>
        );
      })}
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
