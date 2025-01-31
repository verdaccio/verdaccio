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
import semver from 'semver';

import { npmjsDownloads } from '@verdaccio/local-scripts';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const processData = (data, { prerelease }) => {
  const labels = [];
  const datasets = {};

  Object.keys(data).forEach((date) => {
    const downloads = data[date];

    labels.push(date);

    Object.keys(downloads).forEach((version) => {
      if (!datasets[version]) {
        datasets[version] = {
          label: version,
          data: Array(labels.length - 1).fill(0),
          borderColor: getRandomColor(),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
          tension: 0.1,
        };
      }

      while (datasets[version].data.length < labels.length - 1) {
        datasets[version].data.push(0);
      }

      datasets[version].data.push(downloads[version] || 0);
    });
  });

  Object.values(datasets).forEach((dataset) => {
    while (dataset.data.length < labels.length) {
      dataset.data.push(0);
    }
  });

  const totalDownloads = Object.entries(datasets).map(([version, dataset]) => {
    const total = dataset.data.reduce((sum, count) => sum + count, 0);
    return { version, total };
  });

  const groupedByMajor = {};
  totalDownloads.forEach(({ version, total }) => {
    const majorVersion = version.split('.')[0];
    if (!groupedByMajor[majorVersion]) {
      groupedByMajor[majorVersion] = [];
    }
    groupedByMajor[majorVersion].push({ version, total });
  });

  const topVersions = [];
  Object.values(groupedByMajor).forEach((versions) => {
    versions
      .sort((a, b) => b.total - a.total)
      .filter(({ version }) =>
        prerelease ? semver.prerelease(version) : !semver.prerelease(version)
      )
      .filter(({ version }) => (prerelease ? true : semver.satisfies(version, '>2.0.0')))
      .splice(0, prerelease ? 2 : 8)
      .forEach(({ version }) => topVersions.push(version));
  });
  console.log('topVersions', topVersions);

  const filteredDatasets = topVersions.map((version) => datasets[version]);
  filteredDatasets.sort((a, b) => semverCompare(a.label, b.label));
  return { labels, datasetArray: filteredDatasets };
};

const semverCompare = (v1, v2) => {
  const parse = (v) => v.split('.').map(Number);
  const [v1Major, v1Minor, v1Patch] = parse(v1);
  const [v2Major, v2Minor, v2Patch] = parse(v2);

  if (v1Major !== v2Major) return v1Major - v2Major;
  if (v1Minor !== v2Minor) return v1Minor - v2Minor;
  return v1Patch - v2Patch;
};
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const NpmjsVersionsChart = ({ prerelease }) => {
  const { labels, datasetArray } = processData(npmjsDownloads, { prerelease });
  const chartData = {
    labels: labels,
    datasets: datasetArray,
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
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
  return <Line data={chartData} options={options} />;
};

export default NpmjsVersionsChart;
