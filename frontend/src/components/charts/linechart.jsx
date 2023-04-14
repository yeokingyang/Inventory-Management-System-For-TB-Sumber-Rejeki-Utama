import React, { useRef, useState } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data, width, height }) => {
  const svgRef = useRef(null);
  const expenseData = Object.entries(data.expense).map(([month, expense]) => ({ x: month, y: parseInt(expense), type: 'expense' }));
  const incomeData = Object.entries(data.income).map(([month, income]) => ({ x: month, y: parseInt(income), type: 'income' }));
  const [tooltipData, setTooltipData] = useState(null);

  const xScale = d3.scalePoint()
    .domain([...expenseData, ...incomeData].map((d) => d.x))
    .range([50, width - 20]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max([...expenseData, ...incomeData], (d) => d.y)])
    .range([height - 20, 50]);

  const line = d3.line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(d3.curveMonotoneX);

  const expensePathData = line(expenseData);
  const incomePathData = line(incomeData);

  const handleMouseOver = (d) => {
    setTooltipData(d);
  };

  const handleMouseOut = () => {
    setTooltipData(null);
  };

  return (
    <div className="line-chart-container border p-6 mr-5 overflow-hidden max-w-screen-lg shadow-md">
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height + 30}`}>
        <path d={expensePathData} stroke="red" strokeWidth={2} fill="none" />
        <path d={incomePathData} stroke="green" strokeWidth={2} fill="none" />
        {([...expenseData, ...incomeData]).map((d, i) => (
          <circle key={i} cx={xScale(d.x)} cy={yScale(d.y)} r={4} fill={d.type === 'expense' ? 'red' : 'green'}
            onMouseOver={() => handleMouseOver(d)}
            onMouseOut={handleMouseOut} />
        ))}
        {tooltipData && (
          <g>
            <rect
              x={xScale(tooltipData.x) * 0 + 80}
              y={yScale(tooltipData.y) * 0 + 65}
              width={160}
              height={30}
              fill="rgba(0, 0, 0, 0.7)"
              stroke="gray"
              strokeWidth={1}
              rx={5}
              ry={5}
            />
            <text x={xScale(tooltipData.x) * 0 + 160} y={yScale(tooltipData.y) * 0 + 85} textAnchor="middle" className="text-white" fill="white">
              {`${tooltipData.type === 'expense' ? 'Expense' : 'Income'}: Rp ${tooltipData.y}`}
            </text>
          </g>
        )}
        {/* Render the x-axis */}
        <g transform={`translate(0, ${height})`}>
          <g className="text-gray-500" ref={(svgRef) => d3.select(svgRef).call(d3.axisBottom(xScale))} />
        </g>
      </svg>
    </div>
  );

};

export default LineChart;
