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

import { dockerPulls } from '@verdaccio/local-scripts';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DockerTotalPull = () => {
  const monthlyData = {};
  Object.entries(dockerPulls).forEach(([date, { pullCount }]) => {
    const d = new Date(date);
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // Format: YYYY-MM
    if (!monthlyData[yearMonth]) {
      monthlyData[yearMonth] = 0;
    }
    monthlyData[yearMonth] += pullCount;
  });

  // Prepare data for the chart
  const labels = Object.keys(monthlyData); // Months in YYYY-MM format
  const pullCounts = Object.values(monthlyData);

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Pulls',
        data: pullCounts, // y-axis data
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Total Pulls by Year',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month (Year-Month)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Pulls',
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default DockerTotalPull;
