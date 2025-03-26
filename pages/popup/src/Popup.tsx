// import "@src/Popup.css";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { isNumber } from "chart.js/helpers";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useState } from "react";
import { Loader } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import styled from "styled-components";
import Dataset from "../../../components/Dataset";
import {
  getAllDatasetContent,
  handleDatasetPercent,
} from "../../../components/getDatasetContent";
import Analytics from "../../../components/googleAnalytics";
import { GlobalStyle } from "../../../components/style";
import { DatasetContent, DateRange } from "../../../components/type";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale);

const SCPopup = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-around;
`;

const SCLoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;

  h1 {
    color: #497df2;
  }
`;

const Blur = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 6;

  h4 {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    top: calc(50% - 183px - 30px - 15px + 20px);
    width: 120px;
    height: 30px;
    color: #fff;
  }
`;

dayjs.Ls.en.weekStart = 1;
const now = dayjs();

const defaultDateRanges: DateRange[] = [
  [now.startOf("w").subtract(1, "w"), now.startOf("w").subtract(1, "ms")],
  [
    now.startOf("w"),
    now.startOf("d").subtract(1, "ms").isBefore(now.startOf("w"))
      ? now.endOf("d")
      : now.startOf("d").subtract(1, "ms"),
  ],
];

const Popup = () => {
  const [datasetContentList, setDatasetContentList] =
    useState<DatasetContent[]>();
  const [openedDateRangePickerIdx, setOpenedDateRangePickerIdx] =
    useState<number>();

  useEffect(() => {
    const handleAllDatasetContent = async () => {
      const res = await getAllDatasetContent(defaultDateRanges);
      setDatasetContentList(res);
    };
    handleAllDatasetContent();
  }, []);

  useEffect(() => {
    Analytics.firePageViewEvent("popup", document.location.href);
  }, []);

  const handleDatasetContent = (
    datasetContent: DatasetContent,
    idx: number
  ) => {
    const copiedDatasetContentList = _.cloneDeep(datasetContentList) ?? [];
    copiedDatasetContentList[idx] = datasetContent;
    handleDatasetPercent(copiedDatasetContentList, idx);
    setDatasetContentList(copiedDatasetContentList);
  };

  return (
    <>
      <GlobalStyle />
      <SCPopup>
        {datasetContentList ? (
          datasetContentList.map((c, idx) => {
            return (
              <Dataset
                key={idx}
                datasetContent={c}
                handleDatasetContent={handleDatasetContent}
                setOpenedDateRangePickerIdx={setOpenedDateRangePickerIdx}
              />
            );
          })
        ) : (
          <SCLoaderContainer>
            <h1>Chart for Google Calendar!</h1>
            <Loader size="lg" />
          </SCLoaderContainer>
        )}
        {isNumber(openedDateRangePickerIdx) && (
          <Blur>
            <h4>Dataset {openedDateRangePickerIdx + 1}</h4>
          </Blur>
        )}
      </SCPopup>
    </>
  );
};

export default Popup;
