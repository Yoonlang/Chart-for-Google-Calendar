import { URLS } from "./const";

export const getHHMM = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  return formattedTime;
};

export const getMinuites = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return minutes;
};

export const getDateRangeEvents = async (calendarList, headers, prev, next) => {
  const res = await Promise.all(
    calendarList.map((c) =>
      fetch(
        `${URLS.EVENTS_PRE}${c.id}${URLS.EVENTS_SUF}/?timeMin=${prev}&timeMax=${next}&maxResults=1000`,
        {
          headers,
        }
      )
    )
  );
  return await Promise.all(res.map(async (res) => await res.json()));
};

type PromiseStatus = "pending" | "success" | "error";

export const wrapPromise = (promise) => {
  let status: PromiseStatus = "pending";
  let response;
  let suspender = promise.then(
    (r) => {
      status = "success";
      response = r;
    },
    (e) => {
      status = "error";
      response = e;
    }
  );

  const read = () => {
    switch (status) {
      case "pending":
        throw suspender;
      case "error":
        throw response;
      default:
        return response;
    }
  };

  return { read };
};
