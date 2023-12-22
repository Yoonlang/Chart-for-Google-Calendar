import { DateRangePicker } from "rsuite";
import styled from "styled-components";
import { DatasetContent, HeaderData } from "../const";
import { getDatasetContent } from "../getDatasetContent";
import dayjs from "dayjs";

const SCDatasetHead = styled.div`
  display: flex;
  gap: 10px;
`;

interface props {
  data: HeaderData;
  handleDatasetContent: (datasetContent: DatasetContent, idx: number) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DatasetHead: React.FC<props> = ({
  data,
  handleDatasetContent,
  setIsLoading,
}) => {
  const { datasetIdx, dateRange, calendarMetadataList } = data;
  const [from, to] = dateRange;

  return (
    <SCDatasetHead>
      Dataset {datasetIdx + 1}
      <DateRangePicker
        defaultValue={[from.toDate(), to.toDate()]}
        onChange={async (v) => {
          const [from, to] = v;
          setIsLoading(true);
          const res = await getDatasetContent(
            [dayjs(from), dayjs(to).endOf("d")],
            calendarMetadataList
          );
          res.headerData.datasetIdx = datasetIdx;
          handleDatasetContent(res, datasetIdx);
          setIsLoading(false);
        }}
      />
    </SCDatasetHead>
  );
};

export default DatasetHead;
