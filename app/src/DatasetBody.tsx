import { Doughnut } from "react-chartjs-2";
import AverageDailyTime from "./AverageDailyTime";
import { AverageData, ChartData } from "./const";
import styled from "styled-components";
import { Button } from "rsuite";

interface MainProps {
  chartData: ChartData;
  averageData: AverageData;
  openDetailDataset: () => void;
  isOpenDetailDataset: boolean;
}

const DatasetBodyInnerContainer = styled.div`
  width: 100%;
`;

const DatasetBodyMainContainer = styled(DatasetBodyInnerContainer)<{
  isOpenDetailDataset: boolean;
}>`
  position: absolute;
  ${({ isOpenDetailDataset }) =>
    isOpenDetailDataset ? `left: -100%;` : `left: 0;`}
  transition: 0.5s;
`;

const DatasetBodyDetailContainer = styled(DatasetBodyInnerContainer)<{
  isOpenDetailDataset: boolean;
}>`
  position: absolute;
  ${({ isOpenDetailDataset }) =>
    isOpenDetailDataset ? `left: 0;` : `left: 100%;`}
  transition: 0.5s;
`;

const DatasetBodyMain: React.FC<MainProps> = ({
  chartData,
  averageData,
  openDetailDataset,
  isOpenDetailDataset,
}) => {
  return (
    <DatasetBodyMainContainer isOpenDetailDataset={isOpenDetailDataset}>
      <Doughnut
        data={chartData}
        options={{
          onClick: (ev, el) => {
            if (el[0]) {
              openDetailDataset();
            }
          },
        }}
      />
      <AverageDailyTime data={averageData} />
    </DatasetBodyMainContainer>
  );
};

interface DetailProps {
  isOpenDetailDataset: boolean;
  closeDetailDataset: () => void;
}

const DatasetBodyDetail: React.FC<DetailProps> = ({
  isOpenDetailDataset,
  closeDetailDataset,
}) => {
  return (
    <DatasetBodyDetailContainer isOpenDetailDataset={isOpenDetailDataset}>
      <Button onClick={closeDetailDataset}>go back</Button>
    </DatasetBodyDetailContainer>
  );
};

const DatasetBody = {
  main: DatasetBodyMain,
  detail: DatasetBodyDetail,
};

export default DatasetBody;
