import { DateRangePicker } from "rsuite";
import styled from "styled-components";

const SCDatasetHead = styled.div`
  display: flex;
  gap: 10px;
`;

const DatasetHead = (prop) => {
  const { data, refreshData } = prop;
  const { idx, dateRange } = data;

  return (
    <SCDatasetHead>
      Dataset {idx + 1}
      <DateRangePicker
        defaultValue={dateRange}
        onChange={(v) => {
          refreshData(v, idx);
        }}
      />
    </SCDatasetHead>
  );
};

export default DatasetHead;
