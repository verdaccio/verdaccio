import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

import { yearlyDownloads } from '@verdaccio/local-scripts';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: Object.keys(yearlyDownloads),
  datasets: [
    {
      label: 'Yearly Downloads',
      data: Object.values(yearlyDownloads),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Year',
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

const NpmjsYearlyDownloadsChart = () => {
  return <Bar data={data} options={options} />;
};

export default NpmjsYearlyDownloadsChart;
