import dayjs from "dayjs";
import { DateRangePicker } from "rsuite";
import styled from "styled-components";

const SCDatasetHead = styled.div`
  display: flex;
  gap: 10px;
`;

const DatasetHead = (prop) => {
  const { data, refreshData } = prop;
  const { idx, dateRange } = data;
  const [from, to] = dateRange;

  return (
    <SCDatasetHead>
      Dataset {idx + 1}
      <DateRangePicker
        defaultValue={[from.toDate(), to.toDate()]}
        onChange={(v) => {
          const [from, to] = v;
          refreshData([dayjs(from), dayjs(to)], idx);
        }}
      />
    </SCDatasetHead>
  );
};

export default DatasetHead;
