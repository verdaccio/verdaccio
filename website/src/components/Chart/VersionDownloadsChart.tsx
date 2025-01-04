import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

import { npmjsDownloads } from '@verdaccio/local-scripts';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

// @ts-ignore
const dates = [...Object.keys(npmjsDownloads)].sort((a, b) => new Date(b) - new Date(a));
const lastDate = dates[0];
const data = npmjsDownloads[lastDate];

function reduceDownloads(downloads) {
  const result = {};
  Object.entries(downloads).forEach(([version, count]) => {
    if (/(alpha|beta|next)/i.test(version)) {
      return;
    }

    const majorVersion = version.split('.')[0];

    result[majorVersion] = (result[majorVersion] || 0) + count;
  });

  return result;
}

const VersionDownloadsChart = () => {
  const processedData = reduceDownloads(data);

  const labels = Object.keys(processedData).map((version) => `v${version}`);
  const dataPoints = Object.values(processedData);
  const chartData = {
    labels,
    datasets: [
      {
        label: 'v6',
        data: dataPoints,
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Downloads by Major Version ${lastDate}`,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Version',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Downloads',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default VersionDownloadsChart;
