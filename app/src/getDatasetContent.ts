import dayjs, { Dayjs } from "dayjs";
import {
  AverageData,
  COLORS_IN_EVENT,
  CalendarContent,
  CalendarData,
  CalendarMetadata,
  ChartData,
  DatasetContent,
  DateRange,
  Event,
  HeaderData,
  MIN_IN_MS,
  URLS,
} from "./const";
import { getDateRangeEvents, getHHMM, getMinuites } from "./util";

const getInnerTimeDataList = (
  calendarDataList: CalendarData[]
): Record<string, number>[] => {
  const res: Record<string, number>[] = [];
  calendarDataList.forEach((c) => {
    const obj = {};
    const { events } = c;
    events.forEach((e) => {
      if (!e.colorId) {
        if (obj.hasOwnProperty("main")) {
          obj["main"] += dayjs(e.end.dateTime).diff(
            dayjs(e.start.dateTime),
            "ms"
          );
        } else {
          obj["main"] = dayjs(e.end.dateTime).diff(
            dayjs(e.start.dateTime),
            "ms"
          );
        }
      } else {
        if (obj.hasOwnProperty(e.colorId)) {
          obj[e.colorId] += dayjs(e.end.dateTime).diff(
            dayjs(e.start.dateTime),
            "ms"
          );
        } else {
          obj[e.colorId] = dayjs(e.end.dateTime).diff(
            dayjs(e.start.dateTime),
            "ms"
          );
        }
      }
    });
    Object.entries(obj).forEach((entry) => {
      const [key, value] = entry;
      obj[key] = getMinuites(value);
    });
    res.push(obj);
  });
  return res;
};

const formatHeaderData = (
  calendarContent: CalendarContent,
  idx: number,
  calendarMetadataList: CalendarMetadata[]
): HeaderData => {
  return {
    datasetIdx: idx,
    dateRange: calendarContent.dateRange,
    calendarMetadataList,
  };
};

const formatChartData = ({ calendarDataList }: CalendarContent): ChartData => {
  return {
    labels: calendarDataList.map((l) => l.summary),
    datasets: [
      {
        label: "Time spent(m)",
        data: calendarDataList.map((l) => l.eventsTotalTime),
        backgroundColor: calendarDataList.map((l) => l.backgroundColor),
      },
    ],
  };
};

const formatInnerChartData = (
  { calendarDataList }: CalendarContent,
  innerTimeData: Record<string, number>[]
): ChartData[] => {
  return innerTimeData.map((d, idx) => {
    return {
      labels: Object.keys(d).map((key) => {
        return key === "main" ? key : COLORS_IN_EVENT[key];
      }),
      datasets: [
        {
          label: "Time spent(m)",
          data: Object.values(d).map((value) => value),
          backgroundColor: Object.keys(d).map((key) => {
            return key === "main"
              ? calendarDataList[idx].backgroundColor
              : COLORS_IN_EVENT[key];
          }),
        },
      ],
    };
  });
};

const formatAverageData = (
  prevCalendarContent: CalendarContent | null,
  calendarContent: CalendarContent
): AverageData => {
  const { calendarDataList, range } = calendarContent;
  return {
    backgroundColor: calendarDataList.map((l) => l.backgroundColor),
    averageDailyTime: calendarDataList.map((l) =>
      getHHMM(Math.floor(l.eventsTotalTime / range) * MIN_IN_MS)
    ),
    percentOfChange: calendarDataList.map((l, idx2) => {
      if (!prevCalendarContent) {
        return null;
      }
      const { calendarDataList: cl, range: r } = prevCalendarContent;
      const currentTime = l.eventsTotalTime / range;
      const prevTime = cl[idx2].eventsTotalTime / r;
      return (((currentTime - prevTime) / prevTime) * 100).toFixed(1);
    }),
  };
};

const formatInnerAverageData = (
  prevCalendarContent: CalendarContent | null,
  calendarContent: CalendarContent,
  prevInnerTimeDataList: Record<string, number>[] | null,
  innerTimeDataList: Record<string, number>[]
): AverageData[] => {
  const { calendarDataList, range } = calendarContent;
  return innerTimeDataList.map((d, idx) => {
    return {
      backgroundColor: Object.keys(d).map((key) =>
        key === "main"
          ? calendarDataList[idx].backgroundColor
          : COLORS_IN_EVENT[key]
      ),
      averageDailyTime: Object.values(d).map((value) =>
        getHHMM(Math.floor(Number(value) / range) * MIN_IN_MS)
      ),
      percentOfChange: Object.entries(d).map((entry) => {
        const [key, value] = entry;
        if (!prevInnerTimeDataList || !prevCalendarContent) {
          return null;
        }
        const currentTime = (value as number) / range;
        const prevTime =
          (prevInnerTimeDataList[idx][key] as number) /
          prevCalendarContent.range;
        return (((currentTime - prevTime) / prevTime) * 100).toFixed(1);
      }),
    };
  });
};

export const handleDatasetPercent = (
  datasetContentList: DatasetContent[],
  datasetIdx: number
) => {
  // datasetidx가 바뀐 주체.
  // 바꾼 것의 퍼센트 바꾸기 (앞에꺼 보고)
  // 바꾼 것의 뒤에거 퍼센트 바꾸기 (나 보고)
};

const getCalendarContentList = (
  eventDataList: any,
  dateRanges: DateRange,
  calendarMetadataList: CalendarMetadata[]
): CalendarContent[] => {
  return eventDataList.map((s, idx) => {
    const [from, to] = dateRanges[idx];
    return {
      range: to.diff(from, "d") + 1,
      dateRange: dateRanges[idx],
      calendarDataList: calendarMetadataList.map((c, idx2) => {
        const { id, backgroundColor, summary } = c;
        const events: Event[] = s[idx2].items
          ?.filter((e) => e.start?.dateTime)
          ?.map((e) => {
            const { start, end, colorId, id } = e;
            return { start, end, colorId, id };
          });

        return {
          id,
          backgroundColor,
          summary,
          events,
          eventsTotalTime: getMinuites(
            events
              .map((e) =>
                dayjs(e.end.dateTime).diff(dayjs(e.start.dateTime), "ms")
              )
              .reduce((acc, cur) => acc + cur, 0)
          ),
        };
      }),
    };
  });
};

const handleDatasetContent = (
  res: DatasetContent[],
  calendarContentList: CalendarContent[],
  calendarMetadataList: CalendarMetadata[]
) => {
  calendarContentList.forEach((d, idx) => {
    const innerTimeDataList = getInnerTimeDataList(d.calendarDataList);
    res[idx] = {
      calendarContentList: [],
      innerTimeDataList,
      headerData: formatHeaderData(d, idx, calendarMetadataList),
      chartContent: {
        main: formatChartData(d),
        inner: formatInnerChartData(d, innerTimeDataList),
      },
      averageContent: {
        main: formatAverageData(
          idx === 0 ? null : calendarContentList[idx - 1],
          d
        ),
        inner: formatInnerAverageData(
          idx === 0 ? null : calendarContentList[idx - 1],
          d,
          idx === 0 ? null : res[idx - 1].innerTimeDataList,
          innerTimeDataList
        ),
      },
    };
  });
};

export const getAllDatasetContent = (
  dateRanges: DateRange
): Promise<DatasetContent[]> => {
  // indexedDB 데이터 먼저 확인
  return new Promise<DatasetContent[]>((resolve) => {
    const res = [];
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      const headers = new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });

      const calendarListResponse = await fetch(URLS.CALENDAR_LIST, {
        headers,
      });
      const calendarListData = await calendarListResponse.json();
      const calendarMetadataList: CalendarMetadata[] =
        calendarListData.items.map((i) => {
          const { id, backgroundColor, summary } = i;
          return {
            id,
            backgroundColor,
            summary,
          };
        });

      const eventDataList = await Promise.all(
        dateRanges.map((r) =>
          getDateRangeEvents(
            calendarMetadataList.map((c) => c.id),
            headers,
            r[0].toISOString(),
            r[1].toISOString()
          )
        )
      );

      const calendarContentList = getCalendarContentList(
        eventDataList,
        dateRanges,
        calendarMetadataList
      );

      handleDatasetContent(res, calendarContentList, calendarMetadataList);
      resolve(res);
    });
  });
};

export const getDatasetContent = (
  dateRange: [Dayjs, Dayjs],
  calendarMetadataList: CalendarMetadata[]
) => {
  return new Promise<DatasetContent>((resolve) => {
    const res: DatasetContent[] = [];
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      const headers = new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });

      const eventData = await getDateRangeEvents(
        calendarMetadataList.map((c) => c.id),
        headers,
        dateRange[0].toISOString(),
        dateRange[1].toISOString()
      );

      const calendarContentList = getCalendarContentList(
        [eventData],
        [dateRange],
        calendarMetadataList
      );

      handleDatasetContent(res, calendarContentList, calendarMetadataList);
      resolve(res[0]);
    });
  });
};
