import { Dayjs } from "dayjs";

export const URLS = {
  CALENDAR_LIST: "https://www.googleapis.com/calendar/v3/users/me/calendarList",
  EVENTS_PRE: "https://www.googleapis.com/calendar/v3/calendars/",
  EVENTS_SUF: "/events",
} as const;

export const MIN_IN_MS = 60 * 1000;

export const COLORS_IN_EVENT = [
  null as never,
  "#7986cb",
  "#33b679",
  "#8e24aa",
  "#e67c73",
  "#f6bf26",
  "#f4511e",
  "#039be5",
  "#616161",
  "#3f51b5",
  "#0b8043",
  "#d50000",
] as const;

export type DateRange = [Dayjs, Dayjs][];

export interface HeaderData {
  datasetIdx: number;
  calendarMetadataList: CalendarMetadata[];
  dateRange: [Dayjs, Dayjs];
}

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface AverageData {
  backgroundColor: string[];
  averageDailyTime: string[];
  percentOfChange: string[];
}

export interface CalendarMetadata {
  id: string;
  backgroundColor: string;
  summary: string;
}

export interface Event {
  start: any;
  end: any;
  colorId: string | null | undefined;
  id: string;
}

export interface CalendarData extends CalendarMetadata {
  events: Event[];
  eventsTotalTime: number;
}

export interface CalendarContent {
  range: number;
  dateRange: [Dayjs, Dayjs];
  calendarDataList: CalendarData[];
}

export interface ChartContent {
  main: ChartData;
  inner: ChartData[];
}

export interface AverageContent {
  main: AverageData;
  inner: AverageData[];
}

export interface DatasetContent {
  calendarContentList: CalendarContent[];
  innerTimeDataList: Record<string, number>[];
  headerData: HeaderData;
  chartContent: ChartContent;
  averageContent: AverageContent;
}
