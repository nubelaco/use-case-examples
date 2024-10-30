'use client';
import React, { useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


function PieChart({ data }) {

  useEffect(() => {
    console.log(data);
  }, [data]);

  return <Pie data={data} />;
}

export default PieChart;