import { DateRangePicker } from "rsuite";
import styled from "styled-components";
import { DatasetContent, HeaderData } from "./const";

const SCDatasetHead = styled.div`
  display: flex;
  gap: 10px;
`;

interface props {
  data: HeaderData;
  handleDatasetContent: (datasetContent: DatasetContent, idx: number) => void;
}

const DatasetHead: React.FC<props> = ({ data, handleDatasetContent }) => {
  const { datasetIdx, dateRange } = data;
  const [from, to] = dateRange;

  return (
    <SCDatasetHead>
      Dataset {datasetIdx + 1}
      <DateRangePicker
        defaultValue={[from.toDate(), to.toDate()]}
        onChange={(v) => {
          const [from, to] = v;
          // from, to에 대해서 getDatasetContent 한다.
          // 그동안 이 컴포넌트는 Loading을 띄운다.
          // handleDatasetContent({} as DatasetContent, 1);
        }}
      />
    </SCDatasetHead>
  );
};

export default DatasetHead;
