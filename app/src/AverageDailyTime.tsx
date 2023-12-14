import styled from "styled-components";

const formatNumber = (num) => {
  return num > 0 ? `+${num}%` : `${num}%`;
};

const SCAverageDailyTime = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SCAverageDailyTimeDetail = styled.div`
  display: flex;
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

const AverageDailyTime = ({ data }) => {
  const { backgroundColor, averageDailyTime, percentOfChange } = data;
  return (
    <SCAverageDailyTime>
      Average Daily Time
      {backgroundColor?.map((c, idx) => {
        return (
          <SCAverageDailyTimeDetail color={c}>
            <div className="color"></div>
            <div>{averageDailyTime[idx]}</div>
            {percentOfChange[idx] && (
              <div className={percentOfChange[idx] >= 0 ? "plus" : "minus"}>
                {formatNumber(percentOfChange[idx])}
              </div>
            )}
          </SCAverageDailyTimeDetail>
        );
      })}
    </SCAverageDailyTime>
  );
};

export default AverageDailyTime;
