import { Doughnut } from "react-chartjs-2";
import AverageDailyTime from "./AverageDailyTime";
import { AverageData, ChartData } from "./const";
import styled from "styled-components";
import { Button, IconButton } from "rsuite";
import ArrowLeftLineIcon from "@rsuite/icons/ArrowLeftLine";

const DatasetBodyCommonContainer = styled.div`
  width: 100%;
`;

const DatasetBodyMainContainer = styled(DatasetBodyCommonContainer)<{
  isOpenDetailDataset: boolean;
}>`
  position: absolute;
  ${({ isOpenDetailDataset }) =>
    isOpenDetailDataset ? `left: -100%;` : `left: 0;`}
  transition: 0.5s;
`;

const DatasetBodyInnerContainer = styled(DatasetBodyCommonContainer)<{
  isOpenDetailDataset: boolean;
}>`
  position: absolute;
  ${({ isOpenDetailDataset }) =>
    isOpenDetailDataset ? `left: 0;` : `left: 100%;`}
  transition: 0.5s;

  > button {
    position: absolute;
    top: 5px;
    left: 5px;
  }
`;

interface MainProps {
  chartContent: {
    main: ChartData;
    inner: ChartData[];
  };
  averageContent: {
    main: AverageData;
    inner: AverageData[];
  };
  openDetailDataset: (idx: number) => void;
  isOpenDetailDataset: boolean;
}

const DatasetBodyMain: React.FC<MainProps> = ({
  chartContent,
  averageContent,
  openDetailDataset,
  isOpenDetailDataset,
}) => {
  return (
    <DatasetBodyMainContainer isOpenDetailDataset={isOpenDetailDataset}>
      <Doughnut
        data={chartContent.main}
        options={{
          onClick: (ev, el) => {
            if (el[0]) {
              openDetailDataset(el[0].index);
            }
          },
        }}
      />
      <AverageDailyTime data={averageContent.main} />
    </DatasetBodyMainContainer>
  );
};

interface InnerProps {
  chartData?: ChartData;
  averageData?: AverageData;
  isOpenDetailDataset: boolean;
  closeDetailDataset: () => void;
}

const DatasetBodyInner: React.FC<InnerProps> = ({
  chartData,
  averageData,
  isOpenDetailDataset,
  closeDetailDataset,
}) => {
  return (
    <DatasetBodyInnerContainer isOpenDetailDataset={isOpenDetailDataset}>
      <IconButton
        icon={<ArrowLeftLineIcon style={{ fontSize: "3em" }} />}
        onClick={closeDetailDataset}
        appearance="subtle"
      />
      {chartData && <Doughnut data={chartData} />}
      {averageData && <AverageDailyTime data={averageData} />}
    </DatasetBodyInnerContainer>
  );
};

const DatasetBody = {
  Main: DatasetBodyMain,
  Inner: DatasetBodyInner,
};

export default DatasetBody;
