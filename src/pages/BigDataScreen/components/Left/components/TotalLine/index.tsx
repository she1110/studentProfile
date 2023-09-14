import {Line} from '@ant-design/charts';
import React from 'react';
// import './index.less'

const data = [
  {
    value: 506,
    semester: '1-1',
    type: '计算机科学与技术',
  },
  {
    value: 363,
    semester: '1-2',
    type: '计算机科学与技术',
  },
  {
    value: 506,
    semester: '2-1',
    type: '计算机科学与技术',
  },
  {
    value: 363,
    semester: '2-2',
    type: '计算机科学与技术',
  },
  {
    value: 506,
    semester: '3-1',
    type: '计算机科学与技术',
  },
  {
    value: 363,
    semester: '3-2',
    type: '计算机科学与技术',
  },
  {
    value: 506,
    semester: '4-1',
    type: '计算机科学与技术',
  },
  {
    value: 363,
    semester: '4-2',
    type: '计算机科学与技术',
  },
  {
    value: 406,
    semester: '1-1',
    type: '软件工程',
  },
  {
    value: 443,
    semester: '1-2',
    type: '软件工程',
  },
  {
    value: 436,
    semester: '2-1',
    type: '软件工程',
  },
  {
    value: 243,
    semester: '2-2',
    type: '软件工程',
  },
  {
    value: 336,
    semester: '3-1',
    type: '软件工程',
  },
  {
    value: 283,
    semester: '3-2',
    type: '软件工程',
  },
  {
    value: 476,
    semester: '4-1',
    type: '软件工程',
  },
  {
    value: 333,
    semester: '4-2',
    type: '软件工程',
  },
];

class TotalLine extends React.Component {
  render() {
    const config = {
      data: data,
      xField: 'semester',
      yField: 'value',
      seriesField: 'type',
      legend: {position: 'top'},
      smooth: true,
      animation: {
        appear: {
          animation: 'path-in',
          duration: 5000,
        },
      },
      interactions: [{type: 'marker-active'}],
      yAxis: {
        //   minLimit: minValue,
        nice: true,
      },
      // theme: theme,
    };
    return (
      <div style={{paddingTop: 15}}>
        <Line
          {...config}
          style={{
            width: '730px',
            height: '250px',
          }}
        />
      </div>
    );
  }
}

export default TotalLine;
