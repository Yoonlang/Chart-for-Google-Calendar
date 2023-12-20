import { DatasetContent } from "./const";
import DatasetHead from "./DatasetHead";
import { useState } from "react";
import DatasetBody from "./DatasetBody";
import styled from "styled-components";

interface props {
  datasetContent: DatasetContent;
  handleDatasetContent: (datasetContent: DatasetContent, idx: number) => void;
}

const DatasetBodyContainer = styled.div`
  display: flex;
  position: relative;
  min-width: 300px;
  min-height: 420px;
  overflow: hidden;
`;

const Dataset: React.FC<props> = ({ datasetContent, handleDatasetContent }) => {
  const { headerData, chartData, averageData } = datasetContent;
  const [isOpenDetailDataset, setIsOpenDetailDataset] = useState(false);
  const [innerDatasetIdx, setInnerDatasetIdx] = useState<number | null>();

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
      />
      <DatasetBodyContainer>
        <DatasetBody.Main
          chartData={chartData}
          averageData={averageData}
          isOpenDetailDataset={isOpenDetailDataset}
          openDetailDataset={openDetailDataset}
        />
        <DatasetBody.Inner
          chartData={chartData.inner[innerDatasetIdx]}
          averageData={averageData.inner[innerDatasetIdx]}
          isOpenDetailDataset={isOpenDetailDataset}
          closeDetailDataset={closeDetailDataset}
        />
      </DatasetBodyContainer>
    </div>
  );
};

export default Dataset;
