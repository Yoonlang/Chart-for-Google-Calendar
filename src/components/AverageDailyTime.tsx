import styled from "styled-components";
import { AverageData } from "../types";
import { isNumber } from "chart.js/helpers";

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

const SCAverageDailyTimeDetail = styled.div`
  display: flex;
  height: 20px;
  align-items: center;
  width: 100%;
  gap: 20px;
  .color {
    width: 25px;
    height: 15px;
    background-color: ${(props) => props.color};
  }
  .plus {
    color: rgb(0, 200, 0);
  }
  .minus {
    color: #cd5c5c;
  }
`;

interface props {
  data: AverageData;
}

const AverageDailyTime: React.FC<props> = ({ data }) => {
  const { backgroundColor, averageDailyTime, percentOfChange } = data;

  return (
    <SCAverageDailyTime>
      <p>Average Daily Time</p>
      {backgroundColor?.map((c, idx) => {
        return (
          <SCAverageDailyTimeDetail color={c}>
            <div className="color"></div>
            <div>{averageDailyTime[idx]}</div>
            {percentOfChange[idx] && isNumber(Number(percentOfChange[idx])) && (
              <div
                className={Number(percentOfChange[idx]) >= 0 ? "plus" : "minus"}
              >
                {formatNumber(Number(percentOfChange[idx]))}
              </div>
            )}
          </SCAverageDailyTimeDetail>
        );
      })}
    </SCAverageDailyTime>
  );
};

export default AverageDailyTime;
