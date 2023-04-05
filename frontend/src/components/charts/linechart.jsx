import React, { useRef, useState } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data, width, height }) => {
  const svgRef = useRef(null);
  const dataSource = Object.entries(data).map(([month, expense]) => ({ x: month, y: parseInt(expense) }));
  const [tooltipData, setTooltipData] = useState(null);

  const xScale = d3.scalePoint()
    .domain(dataSource.map((d) => d.x))
    .range([50, width - 20]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataSource, (d) => d.y)])
    .range([height - 20, 50]);

  const line = d3.line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(d3.curveMonotoneX);
  const pathData = line(dataSource);

  const handleMouseOver = (d) => {
    setTooltipData(d);
  };

  const handleMouseOut = () => {
    setTooltipData(null);
  };

  return (
<div className="line-chart-container border p-6 mr-5 overflow-hidden max-w-screen-lg">
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height + 30}`}>
        <path d={pathData} stroke="red" strokeWidth={2} fill="none" />
        {dataSource.map((d, i) => (
          <circle key={i} cx={xScale(d.x)} cy={yScale(d.y)} r={4} fill="red"
            onMouseOver={() => handleMouseOver(d)}
            onMouseOut={handleMouseOut} />
        ))}
        {tooltipData && (
          <g>
            <rect
              x={xScale(tooltipData.x) *0 + 80}
              y={yScale(tooltipData.y) *0 + 65}
              width={160}
              height={30}
              fill="rgba(0, 0, 0, 0.7)"
              stroke="gray"
              strokeWidth={1}
              rx={5}
              ry={5}
            />
            <text x={xScale(tooltipData.x)*0 + 160} y={yScale(tooltipData.y) *0 + 85} textAnchor="middle" className="text-white" fill="white">
              {`Expense: Rp ${tooltipData.y}`}
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
