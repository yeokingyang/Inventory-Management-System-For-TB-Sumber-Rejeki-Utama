import React, { useState } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data, width, height }) => {
    // Process the data into an array of objects with x and y properties
    const dataSource = Object.entries(data).map(([month, expense]) => ({ x: month, y: parseInt(expense) }));

    // Find the maximum value in the data to use for scaling the y-axis
    const maxValue = d3.max(dataSource, (d) => d.y);

    // Define the dimensions of the chart area
    const margin = { top: 20, right: 20, bottom: 20, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create a scale for the x-axis (using ordinal scale for discrete values)
    const xScale = d3.scaleBand().domain(dataSource.map((d) => d.x)).range([0, chartWidth]).padding(0.2);
    
    // Create a scale for the y-axis (using linear scale for continuous values)
    const yScale = d3.scaleLinear().domain([0, maxValue]).range([chartHeight, 0]).nice();

    // Define state for tooltip
    const [tooltipData, setTooltipData] = useState(null);

    // Event handlers for showing and hiding tooltip
    const handleMouseOver = (event, d) => {
        setTooltipData(d);
    };

    const handleMouseOut = (event, d) => {
        setTooltipData(null);
    };

    return (
        <div className="bar-chart-container border p-6 mr-5 overflow-hidden max-w-screen-lg">
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* Render the bars */}
                <g>
                    {dataSource.map((d, i) => (
                        <g key={`bar-${i}`}>
                            <rect
                                x={xScale(d.x)}
                                y={yScale(d.y)}
                                width={xScale.bandwidth()}
                                height={chartHeight - yScale(d.y)}
                                className="fill-current text-red-500"
                                onMouseOver={(event) => handleMouseOver(event, d)}
                                onMouseOut={(event) => handleMouseOut(event, d)}
                            />
                            {tooltipData && tooltipData.x === d.x && (
                                <g>
                                    <rect
                                        x={xScale(d.x) + xScale.bandwidth() / 2 - 133}
                                        y={yScale(d.y) - 30}
                                        width={160}
                                        height={20}
                                        fill="rgba(0, 0, 0, 0.7)"
                                        stroke="gray"
                                        strokeWidth={1}
                                        rx={5}
                                        ry={5}
                                    />
                                    <text x={xScale(d.x) + xScale.bandwidth() / 2 - 60} y={yScale(d.y) - 15} textAnchor="middle" className="text-white" fill="white">
                                        {`Expense: Rp ${tooltipData.y}`}
                                    </text>
                                </g>
                            )}
                        </g>
                    ))}
                </g>

                {/* Render the x-axis */}
                <g transform={`translate(0, ${chartHeight})`}>
                    <g className="text-gray-500" ref={(node) => d3.select(node).call(d3.axisBottom(xScale))} />
                </g>
                {/* Render the y-axis */}
                <g>
                    <g className="text-gray-500" ref={(node) => d3.select(node).call(d3.axisLeft(yScale))} />
                </g>
            </g>
        </svg>
        </div>
    );
};

export default BarChart;
