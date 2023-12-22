import React from "react";
import { createRoot } from "react-dom/client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
} from "chart.js";
import "rsuite/dist/rsuite.min.css";
import Popup from "./components/Popup";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale);

const PopupContainer = () => {
  return <Popup />;
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <PopupContainer />
  </React.StrictMode>
);
