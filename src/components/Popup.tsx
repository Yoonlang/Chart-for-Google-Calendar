import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getAllDatasetContent,
  handleDatasetPercent,
} from "../getDatasetContent";
import { Loader } from "rsuite";
import dayjs from "dayjs";
import { DatasetContent, DateRange } from "../types";
import Dataset from "./Dataset";

const SCPopup = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-around;
`;

const SCLoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;

  h1 {
    color: #497df2;
  }
`;

dayjs.Ls.en.weekStart = 1;
const now = dayjs();

const defaultDateRanges: DateRange = [
  [now.startOf("w").subtract(1, "w"), now.startOf("w").subtract(1, "ms")],
  [now.startOf("w"), now.startOf("d").subtract(1, "ms")],
];

const Popup = () => {
  const [datasetContentList, setDatasetContentList] =
    useState<DatasetContent[]>();

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
    const tempDatasetContentList = [...(datasetContentList ?? [])];
    tempDatasetContentList[idx] = datasetContent;
    handleDatasetPercent(tempDatasetContentList, idx);
    setDatasetContentList(tempDatasetContentList);
  };

  return (
    <SCPopup>
      {datasetContentList ? (
        datasetContentList.map((c, idx) => {
          return (
            <Dataset
              key={idx}
              datasetContent={c}
              handleDatasetContent={handleDatasetContent}
            />
          );
        })
      ) : (
        <SCLoaderContainer>
          <h1>Chart for Google Calendar!</h1>
          <Loader size="lg" />
        </SCLoaderContainer>
      )}
    </SCPopup>
  );
};

export default Popup;
