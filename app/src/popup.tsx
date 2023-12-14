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
import { wrapPromise } from "./util";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale);

const SCPopup = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
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

const resource = wrapPromise(useCalendarData());

const DatasetList = () => {
  const { chartData, averageData } = resource.read();

  return (
    <>
      {chartData?.map((d, idx) => {
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
