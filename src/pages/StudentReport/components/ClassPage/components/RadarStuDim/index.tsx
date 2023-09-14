import React from 'react';
import {Radar} from '@ant-design/charts';

export type Props = {
  fiveStar?: object[];
  selectedRowKeys?: any;
  studentAllData?: any;
};

const RadarStuDim: React.FC<Props> = (props) => {
  let data: any = [];
  if (props.fiveStar) {
    data = props.fiveStar;
  }
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
      if (element === elementsub.userid) {
        if (elementsub.virtue) {
          let dataObj = {
            name: '德育分值',
            type: elementsub.username,
            value: parseFloat(elementsub.virtue.toFixed(2)),
          };
          dataTemp.push(dataObj);
        } else {
          let dataObj = {
            name: '德育分值',
            type: elementsub.username,
            value: 0,
          };
          dataTemp.push(dataObj);
        }
        if (elementsub.wisdom) {
          let dataObj = {
            name: '智育分值',
            type: elementsub.username,
            value: parseFloat(elementsub.wisdom.toFixed(2)),
          };
          dataTemp.push(dataObj);
        } else {
          let dataObj = {
            name: '智育分值',
            type: elementsub.username,
            value: 0,
          };
          dataTemp.push(dataObj);
        }

        if (elementsub.sports) {
          let dataObj = {
            name: '体育分值',
            type: elementsub.username,
            value: parseFloat(elementsub.sports.toFixed(2)),
          };
          dataTemp.push(dataObj);
        } else {
          let dataObj = {
            name: '体育分值',
            type: elementsub.username,
            value: 0,
          };
          dataTemp.push(dataObj);
        }

        if (elementsub.art) {
          let dataObj = {
            name: '美育分值',
            type: elementsub.username,
            value: parseFloat(elementsub.art.toFixed(2)),
          };
          dataTemp.push(dataObj);
        } else {
          let dataObj = {
            name: '美育分值',
            type: elementsub.username,
            value: 0,
          };
          dataTemp.push(dataObj);
        }
        if (elementsub.labour) {
          let dataObj = {
            name: '劳动分值',
            type: elementsub.username,
            value: parseFloat(elementsub.labour.toFixed(2)),
          };
          dataTemp.push(dataObj);
        } else {
          let dataObj = {
            name: '劳动分值',
            type: elementsub.username,
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

export default RadarStuDim;
