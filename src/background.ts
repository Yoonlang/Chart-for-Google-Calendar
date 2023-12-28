// reference : https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/tutorial.google-analytics/service-worker.js
import Analytics from "./googleAnalytics";

addEventListener("unhandledrejection", async (event) => {
  Analytics.fireErrorEvent(event.reason);
});

chrome.runtime.onInstalled.addListener(() => {
  Analytics.fireEvent("install");
});
