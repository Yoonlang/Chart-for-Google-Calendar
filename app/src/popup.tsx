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

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale);

const SCPopup = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const Popup = () => {
  const [data, setData] = useState(wrapPromise(getCalendarData()));

  return (
    <SCPopup>
      <Suspense fallback={<Loader size="sm" />}>
        <DatasetList data={data} />
      </Suspense>
    </SCPopup>
  );
};

const DatasetList = ({ data }) => {
  const { chartData, averageData } = data.read();

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
