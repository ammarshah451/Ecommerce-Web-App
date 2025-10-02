import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  BarElement,
} from "chart.js";
import React from "react";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import { getLast7DaysLabel, getLast4DaysLabel } from "../../lib/features";
ChartJS.register(
  CategoryScale,
  Tooltip,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend,
  BarElement
);

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true, // Enable the legend
      labels: {
        color: "black", // Customize legend label color
        font: {
          size: 14, // Increase font size for better visibility
        },
      },
    },
    title: {
      display: true, // Show chart title
      color: "black",
      font: {
        size: 16, // Increase title font size
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // Hide x-axis grid lines
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: true, // Enable horizontal grid lines for y-axis
        color: "rgba(0, 0, 0, 0.2)", // Adjust the color and transparency of the grid lines
      },
      ticks: {
        callback: function (value) {
          return `$${value}`; // Add $ sign to y-axis values
        },
        color: "black", // Change y-axis tick color
        font: {
          size: 14, // Adjust font size of the y-axis labels
        },
      },
    },
  },
};

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: "75%",
};

const labels7 = getLast7DaysLabel();
const labels4 = getLast4DaysLabel();
export const LineChart = ({ dataArr = [], label = "" }) => {
  const data = {
    labels: label === "Revenue" ? labels7 : labels4,
    datasets: [
      {
        data: dataArr,
        label: label,
        fill: true,
        backgroundColor: "rgb(255, 248, 220)",
        borderColor: "#ffc107", // Customize the border color
        tension: 0.3, // Smooth out the lines
      },
    ],
  };

  return <Line data={data} options={lineChartOptions} />;
};
export const DoughnutChart = ({ labels, dataArr }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        data: dataArr,
        fill: false,
        backgroundColor: ["#ffc107", "#5ce65c", "#6CB4EE"],
        offset: 10,
      },
    ],
  };
  return (
    <div
      style={{
        width: "14rem",
        height: "14rem",
        marginLeft: "3rem",
      }}
    >
      <Doughnut data={data} options={doughnutChartOptions} />
    </div>
  );
};

export const BarChart = ({ dataArr = [] }) => {
  const data = {
    labels: labels4,
    datasets: [
      {
        data: dataArr,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
        ],
        borderWidth: 3,
      },
    ],
  };
  const barChartOptions = {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };
  return (
    <div>
      <Bar data={data} options={barChartOptions} />
    </div>
  );
};
