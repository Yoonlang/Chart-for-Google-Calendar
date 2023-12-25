import styled from "styled-components";
import { AverageData } from "../types";
import { isNumber } from "chart.js/helpers";
import { Table } from "rsuite";
import { useMemo } from "react";
const { Column, HeaderCell, Cell } = Table;

const SCCalendarCell = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  gap: 5px;
`;

const formatNumber = (num: number) => {
  return num > 0 ? `+${num}%` : `${num}%`;
};

const SCAverageDailyTime = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  p {
    font-weight: bold;
  }
  margin-bottom: 10px;
`;

interface props {
  data: AverageData;
}

const AverageDailyTime: React.FC<props> = ({ data }) => {
  const { backgroundColor, averageDailyTime, percentOfChange, summaryList } =
    data;

  const tableData = useMemo(() => {
    return backgroundColor.map((c, idx) => {
      return {
        color: c,
        time: averageDailyTime[idx],
        rate:
          percentOfChange[idx] && isNumber(Number(percentOfChange[idx]))
            ? percentOfChange[idx]
            : null,
        summary: summaryList[idx],
      };
    });
  }, [data]);

  return (
    <SCAverageDailyTime>
      <p>Average Daily Time</p>
      <Table data={tableData} autoHeight>
        <Column width={100}>
          <HeaderCell align="center">Calendar</HeaderCell>
          <Cell style={{ padding: 0 }} align="center">
            {(rowData) => {
              return (
                <SCCalendarCell>
                  <div
                    style={{
                      backgroundColor: rowData.color,
                      width: "10px",
                      height: "100%",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "80%",
                      height: "100%",
                    }}
                  >
                    {rowData.summary}
                  </div>
                </SCCalendarCell>
              );
            }}
          </Cell>
        </Column>

        <Column width={100}>
          <HeaderCell align="center">Time</HeaderCell>
          <Cell dataKey="time" align="center" />
        </Column>

        <Column width={100}>
          <HeaderCell align="center">Rate</HeaderCell>
          <Cell dataKey="rate" align="center">
            {(rowData) => {
              if (!rowData.rate) {
                return null;
              }
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    color:
                      Number(rowData.rate) >= 0 ? "rgb(0, 200, 0)" : "#cd5c5c",
                  }}
                >
                  {formatNumber(Number(rowData.rate))}
                </div>
              );
            }}
          </Cell>
        </Column>
      </Table>
    </SCAverageDailyTime>
  );
};

export default AverageDailyTime;
