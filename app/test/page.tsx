import React from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

export default function LandingPage() {
  // Sample data for the chart
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Landing Page</h1>
      <LineChart width={600} height={300} data={data}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </div>
  );
} 