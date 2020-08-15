import React from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  } from 'recharts'
  
const ChartData = ({label, data, color}) => {
    return (
      <div className="charts">
        <h1>Most used {label}</h1>
        <ResponsiveContainer height='100%' width='100%'>
          <BarChart
            data={data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="text"/>
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

export default ChartData