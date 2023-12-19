import { DatasetContent } from "./const";
import DatasetHead from "./DatasetHead";
import { Doughnut } from "react-chartjs-2";
import AverageDailyTime from "./AverageDailyTime";

interface props {
  datasetContent: DatasetContent;
  handleDatasetContent: (datasetContent: DatasetContent, idx: number) => void;
}

const Dataset: React.FC<props> = ({ datasetContent, handleDatasetContent }) => {
  const { headerData, chartData, averageData } = datasetContent;

  return (
    <div>
      <DatasetHead
        data={headerData}
        handleDatasetContent={handleDatasetContent}
      />
      <Doughnut
        data={chartData}
        options={{
          onClick: (ev, el) => {
            if (el[0]) {
              console.log("data change");
            }
          },
        }}
      />
      <AverageDailyTime data={averageData} />
    </div>
  );
};

export default Dataset;
