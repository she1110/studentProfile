import React from 'react';
import {TinyLine} from '@ant-design/charts';

export type Props = {
  record?: any;
  dim?: any;
};

const MiniChart: React.FC<Props> = (props) => {
  let dataTemp: any = [];
  if (props.record && props.dim === 'stu') {
    if (props.record.gpa11 !== 0) {
      dataTemp.push(parseFloat(props.record.gpa11.toFixed(2)));
    }
    if (props.record.gpa12 !== 0) {
      dataTemp.push(parseFloat(props.record.gpa12.toFixed(2)));
    }
    if (props.record.gpa21 !== 0) {
      dataTemp.push(parseFloat(props.record.gpa21.toFixed(2)));
    }
    if (props.record.gpa22 !== 0) {
      dataTemp.push(parseFloat(props.record.gpa22.toFixed(2)));
    }
    if (props.record.gpa31 !== 0) {
      dataTemp.push(parseFloat(props.record.gpa31.toFixed(2)));
    }
    if (props.record.gpa32 !== 0) {
      dataTemp.push(parseFloat(props.record.gpa32.toFixed(2)));
    }
    if (props.record.gpa41 !== 0) {
      dataTemp.push(parseFloat(props.record.gpa41.toFixed(2)));
    }
    if (props.record.gpa42 !== 0) {
      dataTemp.push(parseFloat(props.record.gpa42.toFixed(2)));
    }
  }

  if (props.record && props.dim === 'dorm') {
    if (props.record.GPA11 !== 0) {
      dataTemp.push(parseFloat(props.record.GPA11.toFixed(2)));
    }
    if (props.record.GPA12 !== 0) {
      dataTemp.push(parseFloat(props.record.GPA12.toFixed(2)));
    }
    if (props.record.GPA21 !== 0) {
      dataTemp.push(parseFloat(props.record.GPA21.toFixed(2)));
    }
    if (props.record.GPA22 !== 0) {
      dataTemp.push(parseFloat(props.record.GPA22.toFixed(2)));
    }
    if (props.record.GPA31 !== 0) {
      dataTemp.push(parseFloat(props.record.GPA31.toFixed(2)));
    }
    if (props.record.GPA32 !== 0) {
      dataTemp.push(parseFloat(props.record.GPA32.toFixed(2)));
    }
    if (props.record.GPA41 !== 0) {
      dataTemp.push(parseFloat(props.record.GPA41.toFixed(2)));
    }
    if (props.record.GPA42 !== 0) {
      dataTemp.push(parseFloat(props.record.GPA42.toFixed(2)));
    }
  }

  let dataTempTemp: any = [];
  dataTemp.map((element: any, index: any) => {
    let TempObj: any = element * 100 - 300;
    dataTempTemp.push(TempObj);
  });
  var config = {
    height: 60,
    autoFit: true,
    data: dataTempTemp,
    smooth: true,
    tooltip: false,
    // areaStyle: { fill: '#d6e3fd' },
    annotations: [
      {
        type: 'line',
        start: ['min', 'mean'],
        end: ['max', 'mean'],
        text: {
          content: '均值线',
          // position: 'center',
          offsetY: 10,
          offsetX: 10,
          style: {
            textAlign: 'right',
            fill: 'lightblue',
          },
        },
        style: {
          lineDash: [4, 4],
          stroke: 'lightblue',
        },
      },
      // {
      //     type: 'regionFilter',
      //     start: ['min', 'mean'],
      //     end: ['max', 'min'],
      //     color: 'red'
      // },
    ],
  };
  return <TinyLine {...config} />;
};

export default MiniChart;
