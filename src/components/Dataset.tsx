import { DatasetContent } from "../const";
import DatasetHead from "./DatasetHead";
import { useState } from "react";
import DatasetBody from "./DatasetBody";
import styled from "styled-components";
import { Loader } from "rsuite";

interface props {
  datasetContent: DatasetContent;
  handleDatasetContent: (datasetContent: DatasetContent, idx: number) => void;
}

const DatasetBodyContainer = styled.div`
  display: flex;
  position: relative;
  min-width: 300px;
  min-height: 420px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
    setInnerDatasetIdx(null);
    setIsOpenDetailDataset(false);
  };

  return (
    <div>
      <DatasetHead
        data={headerData}
        handleDatasetContent={handleDatasetContent}
        setIsLoading={setIsLoading}
      />
      <DatasetBodyContainer>
        {isLoading ? (
          <Loader size="lg" />
        ) : (
          <>
            <DatasetBody.Main
              chartContent={chartContent}
              averageContent={averageContent}
              isOpenDetailDataset={isOpenDetailDataset}
              openDetailDataset={openDetailDataset}
            />
            <DatasetBody.Inner
              chartData={chartContent.inner[innerDatasetIdx]}
              averageData={averageContent.inner[innerDatasetIdx]}
              isOpenDetailDataset={isOpenDetailDataset}
              closeDetailDataset={closeDetailDataset}
            />
          </>
        )}
      </DatasetBodyContainer>
    </div>
  );
};

export default Dataset;
