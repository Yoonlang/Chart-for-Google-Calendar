import React from "react";
import { DatasetContent } from "../types";
import DatasetHead from "./DatasetHead";
import { useMemo, useState } from "react";
import DatasetBody from "./DatasetBody";
import styled from "styled-components";
import { Loader } from "rsuite";
import { isNumber } from "chart.js/helpers";
import EventDetailIcon from "@rsuite/icons/EventDetail";

interface props {
  datasetContent: DatasetContent;
  handleDatasetContent: (datasetContent: DatasetContent, idx: number) => void;
  setOpenedDateRangePickerIdx: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}

const SCDataset = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  width: 320px;
  height: 100%;
  margin: 0 15px;
`;

const SCDatasetBodyContainer = styled.div`
  width: 100%;
  height: calc(100% - 45px);

  .center {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;

    h4 {
      font-size: 36px;
      color: #ff7f50;
    }
  }
`;

const Dataset: React.FC<props> = ({
  datasetContent,
  handleDatasetContent,
  setOpenedDateRangePickerIdx,
}) => {
  const { headerData, chartContent, averageContent, innerTimeDataList } =
    datasetContent;
  const [isOpenDetailDataset, setIsOpenDetailDataset] = useState(false);
  const [innerDatasetIdx, setInnerDatasetIdx] = useState<number | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const hasTimeInDataset: boolean = useMemo(() => {
    let time: number = 0;
    innerTimeDataList.forEach((d) => {
      time += Object.values(d).reduce((acc, cur) => acc + cur, 0);
    });
    return time > 0;
  }, [innerTimeDataList]);

  const openDetailDataset = (idx: number) => {
    setInnerDatasetIdx(idx);
    setIsOpenDetailDataset(true);
  };

  const closeDetailDataset = () => {
    setIsOpenDetailDataset(false);
  };

  return (
    <SCDataset>
      <DatasetHead
        data={headerData}
        handleDatasetContent={handleDatasetContent}
        setIsLoading={setIsLoading}
        setOpenedDateRangePickerIdx={setOpenedDateRangePickerIdx}
      />
      <SCDatasetBodyContainer>
        {isLoading ? (
          <div className="center">
            <Loader size="lg" />
          </div>
        ) : hasTimeInDataset ? (
          <>
            <DatasetBody.Main
              chartContent={chartContent}
              averageContent={averageContent}
              isOpenDetailDataset={isOpenDetailDataset}
              openDetailDataset={openDetailDataset}
            />
            <DatasetBody.Inner
              chartData={
                isNumber(innerDatasetIdx)
                  ? chartContent.inner[innerDatasetIdx]
                  : null
              }
              averageData={
                isNumber(innerDatasetIdx)
                  ? averageContent.inner[innerDatasetIdx]
                  : null
              }
              isOpenDetailDataset={isOpenDetailDataset}
              closeDetailDataset={closeDetailDataset}
            />
          </>
        ) : (
          <div className="center">
            <h4>No Events!</h4>
            <EventDetailIcon style={{ fontSize: "8em", color: "#ff7f50" }} />
          </div>
        )}
      </SCDatasetBodyContainer>
    </SCDataset>
  );
};

export default Dataset;
