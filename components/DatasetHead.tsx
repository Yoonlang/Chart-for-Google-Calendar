import dayjs from "dayjs";
import React from "react";
import { DateRangePicker } from "rsuite";
import styled from "styled-components";
import { getDatasetContent } from "./getDatasetContent";
import Analytics from "./googleAnalytics";
import { DatasetContent, HeaderData } from "./type";

const SCDatasetHead = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 45px;
`;

interface props {
  data: HeaderData;
  handleDatasetContent: (datasetContent: DatasetContent, idx: number) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenedDateRangePickerIdx: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}

const DatasetHead: React.FC<props> = ({
  data,
  handleDatasetContent,
  setIsLoading,
  setOpenedDateRangePickerIdx,
}) => {
  const { datasetIdx, dateRange, calendarMetadataList } = data;
  const [from, to] = dateRange;

  return (
    <SCDatasetHead>
      <h5>Dataset {datasetIdx + 1}</h5>
      <DateRangePicker
        defaultValue={[from.toDate(), to.toDate()]}
        onChange={async (v) => {
          if (!v) {
            return;
          }
          const [from, to] = v!;
          Analytics.fireEvent("change_date_range", {
            prev_date_range: `${dateRange[0].toISOString()},${dateRange[1].toISOString()}`,
            new_date_range: `${from.toISOString()},${to.toISOString()}`,
          });
          setIsLoading(true);
          const res = await getDatasetContent(
            [dayjs(from), dayjs(to).endOf("d")],
            calendarMetadataList
          );
          res.headerData.datasetIdx = datasetIdx;
          handleDatasetContent(res, datasetIdx);
          setIsLoading(false);
        }}
        onEnter={() => setOpenedDateRangePickerIdx(datasetIdx)}
        onExit={() => setOpenedDateRangePickerIdx(undefined)}
      />
    </SCDatasetHead>
  );
};

export default DatasetHead;
