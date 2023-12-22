import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getAllDatasetContent,
  handleDatasetPercent,
} from "../getDatasetContent";
import { Loader } from "rsuite";
import dayjs from "dayjs";
import { DatasetContent, DateRange } from "../const";
import Dataset from "./Dataset";

const SCPopup = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const now = dayjs();

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
    const tempDatasetContentList = [...datasetContentList];
    tempDatasetContentList[idx] = datasetContent;
    handleDatasetPercent(tempDatasetContentList, idx);
    setDatasetContentList(tempDatasetContentList);
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

export default Popup;
