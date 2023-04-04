import React from 'react';
import { SparklineComponent, Inject, SparklineTooltip } from '@syncfusion/ej2-react-charts';

const SparkLine = ({ id, height, width, color, data, type, currentColor }) => {

    const dataSource = Object.entries(data).map(([month, expense]) => ({ xvalue: month, yvalue: expense }));

    return (
        <div className="sparkline-container">
            <SparklineComponent
                id={id}
                height={height}
                width={width}
                lineWidth={1}
                valueType="Category"
                fill={color}
                border={{ color: currentColor, width: 2 }}
                tooltipSettings={{
                    visible: true,
                    // eslint-disable-next-line no-template-curly-in-string
                    format: '${xvalue} : data ${yvalue}',
                    trackLineSettings: {
                        visible: true,
                    },
                }}
                markerSettings={{ visible: ['All'], size: 2.5, fill: currentColor }}
                dataSource={dataSource}
                xName='xvalue'
                yName='yvalue'
                type={type}
            >
                <Inject services={[SparklineTooltip]} />
            </SparklineComponent>
        </div>
    );
}

export default SparkLine;
