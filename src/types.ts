import { Dayjs } from "dayjs";

export type DateRange = [Dayjs, Dayjs];

export interface HeaderData {
  datasetIdx: number;
  calendarMetadataList: CalendarMetadata[];
  dateRange: DateRange;
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
  dateRange: DateRange;
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
  innerTimeDataList: Record<string, number>[];
  headerData: HeaderData;
  chartContent: ChartContent;
  averageContent: AverageContent;
}
