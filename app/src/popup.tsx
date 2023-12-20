import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
} from "chart.js";
import styled from "styled-components";
import { getAllDatasetContent } from "./getDatasetContent";
import { Loader } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import dayjs from "dayjs";
import { DatasetContent, DateRange } from "./const";
import Dataset from "./Dataset";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale);
dayjs.Ls.en.weekStart = 1;

const now = dayjs();

const SCPopup = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const defaultDateRanges: DateRange = [
  [now.startOf("w").subtract(1, "w"), now.startOf("w").subtract(1, "ms")],
  [now.startOf("w"), now.startOf("d").subtract(1, "ms")],
];

const Popup = () => {
  const [datasetContentList, setDatasetContentList] = useState<
    DatasetContent[] | null
  >(null);

  useEffect(() => {
    const handleAllDatasetContent = async () => {
      const res = await getAllDatasetContent(defaultDateRanges);
      setDatasetContentList(res);
    };
    handleAllDatasetContent();
  }, []);

  const handleDatasetContent = (
    datasetContent: DatasetContent,
    idx: number
  ) => {
    setDatasetContentList((o) =>
      o.map((c, idx2) => (idx === idx2 ? datasetContent : c))
    );
  };

  if (!datasetContentList) {
    return <Loader size="sm" />;
  }

  return (
    <SCPopup>
      {datasetContentList.map((c, idx) => {
        return (
          <Dataset
            key={idx}
            datasetContent={c}
            handleDatasetContent={handleDatasetContent}
          />
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
