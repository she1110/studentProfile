import React from 'react';
import {Line} from '@ant-design/charts';

const DemoLine: React.FC = (props) => {
  var config = {
    data: props.data,
    xField: 'yearandseme',
    yField: 'count',
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {showMarkers: false},
    state: {
      active: {
        style: {
          shadowColor: 'yellow',
          shadowBlur: 4,
          stroke: 'transparent',
          fill: 'red',
        },
      },
    },
    theme: {
      geometries: {
        point: {
          diamond: {
            active: {
              style: {
                shadowColor: '#FCEBB9',
                shadowBlur: 2,
                stroke: '#F6BD16',
              },
            },
          },
        },
      },
    },
    interactions: [{type: 'marker-active'}],
  };
  return <Line {...config} />;
};

export default DemoLine;
