'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Adjust the import path as needed

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ListingViewsStatisticsChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      try {
        // Get the current date and the current year in both full and short formats
        const now = new Date();
        const currentYearFull = now.getFullYear(); // e.g., 2024
        const currentYearShort = currentYearFull.toString().slice(-2); // '24'

        const startOfYear = new Date(currentYearFull, 0, 1).toISOString();
        const endOfYear = new Date(currentYearFull, 11, 31, 23, 59, 59).toISOString();

        // Fetch listing views created this year
        const { data: listingViews, error } = await supabase
          .from('Listing Views')
          .select('created_at')
          .gte('created_at', startOfYear)
          .lte('created_at', endOfYear);

        if (error) {
          console.error('Error fetching listing views:', error);
          return;
        }

        // Initialize an array for months with zero counts
        const monthlyCounts = Array(12).fill(0);

        // Process the data to get counts per month
        listingViews.forEach((view) => {
          const createdAt = new Date(view.created_at);
          const month = createdAt.getMonth(); // Returns 0 for January, 1 for February, etc.

          if (month >= 0 && month <= 11) {
            monthlyCounts[month] += 1;
          }
        });

        // Prepare the labels with the current year
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December',
        ];

        const labels = monthNames.map((monthName) => `${monthName} '${currentYearShort}`);

        // Ensure counts are integers
        const integerCounts = monthlyCounts.map((count) => Math.round(count));

        // Prepare the data for the chart
        const data = {
          labels,
          datasets: [
            {
              label: `Total`,
              data: integerCounts,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              fill: false,
            },
          ],
        };

        setChartData(data);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    }

    fetchData();
  }, []);

  // Define chart options with Y-axis starting at zero
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        position: 'nearest',
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 4,
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Ensure Y-axis starts at zero
        ticks: {
          stepSize: 1, // Ensure Y-axis increments by whole numbers
          callback: function (value) {
            return Number.isInteger(value) ? value : null;
          },
        },
      },
    },
  };

  if (!chartData) {
    return <p>Loading chart...</p>;
  }

  return <Line options={options} data={chartData} />;
}
