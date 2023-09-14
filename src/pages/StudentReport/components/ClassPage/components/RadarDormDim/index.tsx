import React from 'react';
import {Radar} from '@ant-design/charts';

export type Props = {
  fiveStar?: object[];
  selectedRowKeys?: any;
  studentAllData?: any;
};

const RadarDormDim: React.FC<Props> = (props) => {
  let data: any = [];
  if (props.fiveStar) {
    data = props.fiveStar;
  }
  // console.log(data);
  let dataTemp: any = [];
  data.map((element: any, index: any) => {
    let dataTempObj = {
      name: element.name,
      type: '班级平均',
      value: element.value,
    };
    dataTemp.push(dataTempObj);
  });
  dataTemp.reverse();
  let arrtemp = dataTemp[4];
  dataTemp[4] = dataTemp[3];
  dataTemp[3] = arrtemp;
  props.selectedRowKeys.map((element: any, index: any) => {
    props.studentAllData.map((elementsub: any, indexsub: any) => {
      if (element === elementsub.DORMITORY) {
        if (elementsub.VIRTUE) {
          let dataObj = {
            name: '德育分值',
            type: elementsub.DORMITORY,
            value: parseFloat(elementsub.VIRTUE.toFixed(2)),
          };
          dataTemp.push(dataObj);
        } else {
          let dataObj = {
            name: '德育分值',
            type: elementsub.DORMITORY,
            value: 0,
          };
          dataTemp.push(dataObj);
        }
        if (elementsub.WISDOM) {
          let dataObj = {
            name: '智育分值',
            type: elementsub.DORMITORY,
            value: parseFloat(elementsub.WISDOM.toFixed(2)),
          };
          dataTemp.push(dataObj);
        } else {
          let dataObj = {
            name: '智育分值',
            type: elementsub.DORMITORY,
            value: 0,
          };
          dataTemp.push(dataObj);
        }

        if (elementsub.SPORTS) {
          let dataObj = {
            name: '体育分值',
            type: elementsub.DORMITORY,
            value: parseFloat(elementsub.SPORTS.toFixed(2)),
          };
          dataTemp.push(dataObj);
        } else {
          let dataObj = {
            name: '体育分值',
            type: elementsub.DORMITORY,
            value: 0,
          };
          dataTemp.push(dataObj);
        }

        if (elementsub.ART) {
          let dataObj = {
            name: '美育分值',
            type: elementsub.DORMITORY,
            value: parseFloat(elementsub.ART.toFixed(2)),
          };
          dataTemp.push(dataObj);
        } else {
          let dataObj = {
            name: '美育分值',
            type: elementsub.DORMITORY,
            value: 0,
          };
          dataTemp.push(dataObj);
        }
        if (elementsub.LABOUR) {
          let dataObj = {
            name: '劳动分值',
            type: elementsub.DORMITORY,
            value: parseFloat(elementsub.LABOUR.toFixed(2)),
          };
          dataTemp.push(dataObj);
        } else {
          let dataObj = {
            name: '劳动分值',
            type: elementsub.DORMITORY,
            value: 0,
          };
          dataTemp.push(dataObj);
        }
      }
    });
  });
  const config = {
    data: dataTemp,
    xField: 'name',
    yField: 'value',
    seriesField: 'type',
    meta: {
      score: {
        alias: '分数',
      },
    },
    xAxis: {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineDash: null,
          },
        },
      },
    },
    yAxis: {
      grid: {
        line: {
          type: 'line',
          style: {
            lineDash: null,
          },
        },
      },
    },
    // 开启面积
    area: {},
    // 开启辅助点
    point: {},
  };

  return <Radar {...config} />;
};

export default RadarDormDim;
