import React, { Suspense } from "react";
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
import AverageDailyTime from "./AverageDailyTime";
import { Loader } from "rsuite";
import "rsuite/dist/rsuite.min.css";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale);

const SCPopup = styled.div`
  display: flex;
`;

const Popup = () => {
  return (
    <SCPopup>
      <Suspense fallback={<Loader size="sm" />}>
        <DatasetList />
      </Suspense>
    </SCPopup>
  );
};

const DatasetList = () => {
  const { chartData, averageData } = useCalendarData();

  return (
    <>
      {chartData.map((d, idx) => {
        return (
          <div>
            Dataset {idx + 1}
            <>
              <Doughnut data={d} />
              <AverageDailyTime data={averageData[idx]} />
            </>
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
