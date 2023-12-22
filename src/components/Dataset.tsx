import { DatasetContent } from "../types";
import DatasetHead from "./DatasetHead";
import { useState } from "react";
import DatasetBody from "./DatasetBody";
import styled from "styled-components";
import { Loader } from "rsuite";

interface props {
  datasetContent: DatasetContent;
  handleDatasetContent: (datasetContent: DatasetContent, idx: number) => void;
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

  .center {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Dataset: React.FC<props> = ({ datasetContent, handleDatasetContent }) => {
  const { headerData, chartContent, averageContent } = datasetContent;
  const [isOpenDetailDataset, setIsOpenDetailDataset] = useState(false);
  const [innerDatasetIdx, setInnerDatasetIdx] = useState<number | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      />
      <SCDatasetBodyContainer>
        {isLoading ? (
          <div className="center">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            <DatasetBody.Main
              chartContent={chartContent}
              averageContent={averageContent}
              isOpenDetailDataset={isOpenDetailDataset}
              openDetailDataset={openDetailDataset}
            />
            <DatasetBody.Inner
              chartData={
                innerDatasetIdx ? chartContent.inner[innerDatasetIdx] : null
              }
              averageData={
                innerDatasetIdx ? averageContent.inner[innerDatasetIdx] : null
              }
              isOpenDetailDataset={isOpenDetailDataset}
              closeDetailDataset={closeDetailDataset}
            />
          </>
        )}
      </SCDatasetBodyContainer>
    </SCDataset>
  );
};

export default Dataset;
