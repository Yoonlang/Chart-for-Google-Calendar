import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { ChartEvent, ActiveElement } from "chart.js";
import AverageDailyTime from "./AverageDailyTime";
import { AverageData, ChartData } from "../types";
import styled from "styled-components";
import { IconButton } from "rsuite";
import ArrowLeftLineIcon from "@rsuite/icons/ArrowLeftLine";
import Analytics from "../googleAnalytics";

const DatasetBodyCommonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: absolute;
  top: 50px;
  width: 100%;
  transition: 0.5s;
  transition-property: left;
`;

const DatasetBodyMainContainer = styled(DatasetBodyCommonContainer)<{
  isOpenDetailDataset: boolean;
}>`
  ${({ isOpenDetailDataset }) =>
    isOpenDetailDataset ? `left: 350px; visibility: hidden;` : `left: 0;`}
`;

const DatasetBodyInnerContainer = styled(DatasetBodyCommonContainer)<{
  isOpenDetailDataset: boolean;
}>`
  ${({ isOpenDetailDataset }) =>
    isOpenDetailDataset ? `left: 0;` : `left: 350px; visibility: hidden;`}

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

interface MemorizedDoughnutProps {
  data: ChartData;
  options?: any;
}

const MemorizedDoughnut = React.memo<MemorizedDoughnutProps>(
  ({ data, options }) => {
    if (!options) {
      return (
        <Doughnut
          data={data}
          style={{
            maxHeight: "280px",
          }}
        />
      );
    }
    return (
      <Doughnut
        data={data}
        options={options}
        style={{
          maxHeight: "280px",
        }}
      />
    );
  }
);

const DatasetBodyMain: React.FC<MainProps> = ({
  chartContent,
  averageContent,
  openDetailDataset,
  isOpenDetailDataset,
}) => {
  const options = useMemo(() => {
    return {
      onClick: (ev: ChartEvent, el: ActiveElement[]) => {
        if (el[0]) {
          openDetailDataset(el[0].index);
          Analytics.fireEvent("click_pie");
        }
      },
    };
  }, []);

  return (
    <DatasetBodyMainContainer isOpenDetailDataset={isOpenDetailDataset}>
      <MemorizedDoughnut data={chartContent.main} options={options} />
      <AverageDailyTime data={averageContent.main} />
    </DatasetBodyMainContainer>
  );
};

interface InnerProps {
  chartData: ChartData | null;
  averageData: AverageData | null;
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
        icon={<ArrowLeftLineIcon style={{ fontSize: "2em" }} />}
        onClick={closeDetailDataset}
        appearance="link"
        aria-hidden={!isOpenDetailDataset}
        disabled={!isOpenDetailDataset}
      />
      {chartData && <MemorizedDoughnut data={chartData} />}
      {averageData && <AverageDailyTime data={averageData} />}
    </DatasetBodyInnerContainer>
  );
};

const DatasetBody = {
  Main: DatasetBodyMain,
  Inner: DatasetBodyInner,
};

export default DatasetBody;
