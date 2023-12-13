import React from "react";
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
import { useCalendarData } from "./useCalendarData";
import AverageDailyTime from "./components/AverageDailyTime";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale);

const SCPopup = styled.div`
  display: flex;
`;

const SCStatistics = styled.div``;

const Popup = () => {
  const { chartData, averageData } = useCalendarData();

  return (
    <SCPopup>
      {chartData.map((d, idx) => {
        return (
          <SCStatistics>
            Dataset {idx + 1}
            <>
              <Doughnut data={d} />
              <AverageDailyTime data={averageData[idx]} />
            </>
          </SCStatistics>
        );
      })}
    </SCPopup>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
