import React from 'react';
import {Line} from '@ant-design/charts';

export type Props = {
  gpaTrend?: any;
  getBase64GPA?: any;
  type?: any;
  test?: any;
  selectedRowKeys?: any;
  studentAllData?: any;
};
const LineChartDormClass: React.FC<Props> = (props) => {
  // console.log(props.gpaTrend);
  let data: any = [];
  if (props.gpaTrend) {
    data = props.gpaTrend;
  }
  let dataTemp: any = [];
  props.selectedRowKeys.map((element: any, index: any) => {
    props.studentAllData.map((elementsub: any, indexsub: any) => {
      if (elementsub.userid === element) {
        if (elementsub.gpa11 !== 0) {
          let dataObj = {
            name: '第1学年第1学期',
            type: elementsub.username,
            value: parseFloat(elementsub.gpa11.toFixed(2)),
          };
          dataTemp.push(dataObj);
        }
        if (elementsub.gpa12 !== 0) {
          let dataObj = {
            name: '第1学年第2学期',
            type: elementsub.username,
            value: parseFloat(elementsub.gpa12.toFixed(2)),
          };
          dataTemp.push(dataObj);
        }
        if (elementsub.gpa21 !== 0) {
          let dataObj = {
            name: '第2学年第1学期',
            type: elementsub.username,
            value: parseFloat(elementsub.gpa21.toFixed(2)),
          };
          dataTemp.push(dataObj);
        }
        if (elementsub.gpa22 !== 0) {
          let dataObj = {
            name: '第2学年第2学期',
            type: elementsub.username,
            value: parseFloat(elementsub.gpa22.toFixed(2)),
          };
          dataTemp.push(dataObj);
        }
        if (elementsub.gpa31 !== 0) {
          let dataObj = {
            name: '第3学年第1学期',
            type: elementsub.username,
            value: parseFloat(elementsub.gpa31.toFixed(2)),
          };
          dataTemp.push(dataObj);
        }
        if (elementsub.gpa32 !== 0) {
          let dataObj = {
            name: '第3学年第2学期',
            type: elementsub.username,
            value: parseFloat(elementsub.gpa32.toFixed(2)),
          };
          dataTemp.push(dataObj);
        }
        if (elementsub.gpa41 !== 0) {
          let dataObj = {
            name: '第4学年第1学期',
            type: elementsub.username,
            value: parseFloat(elementsub.gpa41.toFixed(2)),
          };
          dataTemp.push(dataObj);
        }
        if (elementsub.gpa42 !== 0) {
          let dataObj = {
            name: '第4学年第2学期',
            type: elementsub.username,
            value: parseFloat(elementsub.gpa42.toFixed(2)),
          };
          dataTemp.push(dataObj);
        }
      }
    });
  });
  data = data.concat(dataTemp);
  let dataTempTemp: any = [];
  data.map((element: any, index: any) => {
    let TempObj = {
      name: element.name,
      type: element.type,
      value: element.value * 100 - 200,
    };
    dataTempTemp.push(TempObj);
  });

  var config = {
    data: dataTempTemp,
    xField: 'name',
    yField: 'value',
    // label: {},
    seriesField: 'type',
    smooth: true,
    legend: {position: 'top'},
    // animation: {
    //     appear: {
    //         animation: 'path-in',
    //         duration: 5000,
    //     },
    // },
    // interactions: [{ type: 'marker-active' }],
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      formatter: (item: any) => {
        return {name: item.type, value: (item.value + 200) / 100};
      },
    },
    lineStyle: (item: any) => {
      if (item.type === '宿舍平均') {
        return {
          lineDash: [5, 5],
        };
      } else if (item.type === '班级平均') {
        return {
          lineDash: [5, 5],
        };
      } else {
        return {
          lineDash: [1, 1],
        };
      }
    },
  };
  return <Line {...config} />;
};

export default LineChartDormClass;
