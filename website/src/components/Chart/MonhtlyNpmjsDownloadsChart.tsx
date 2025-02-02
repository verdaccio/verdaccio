import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

import { monthlyDownloads } from '@verdaccio/local-scripts';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  labels: monthlyDownloads.map((entry) => entry.start),
  datasets: [
    {
      label: 'Npmjs Monthly Downloads',
      data: monthlyDownloads.map((entry) => entry.downloads),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: false,
      tension: 0.1,
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Month',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Downloads',
      },
    },
  },
};

const NpmjsMonthlyDownloadsChart = () => {
  return <Line data={data} options={options} />;
};

export default NpmjsMonthlyDownloadsChart;
