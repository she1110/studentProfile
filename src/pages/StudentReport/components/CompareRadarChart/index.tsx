import React, {useEffect, useRef} from 'react';
import {Radar} from '@ant-design/charts';
import {DataSet} from '@antv/data-set';

export type Props = {
  fiveStar?: object[];
};

const CompareRadarChart: React.FC<Props> = (props) => {
  let data: any = [];
  if (props.fiveStar) {
    data = props.fiveStar;
  }
  // console.log(data);
  let dataTemp: any = [];
  data.map((element: any, index: any) => {
    let dataTempObj = {
      name: element.name,
      学生个人: element.student,
      班级平均: element.class,
    };
    dataTemp.push(dataTempObj);
  });
  dataTemp.splice(0, 1);
  dataTemp.reverse();
  data.map((element: any, index: any) => {
    if (element.name === '德育分值') {
      let dataTempObj = {
        name: element.name,
        学生个人: element.student === 2.09 ? 2.1 : element.student,
        班级平均: element.class,
      };
      dataTemp.splice(0, 0, dataTempObj);
    }
  });
  const {DataView} = DataSet;
  let dv = new DataView().source(dataTemp);
  dv.transform({
    type: 'fold',
    fields: ['学生个人', '班级平均'], // 展开字段集
    key: 'user', // key字段
    value: 'score', // value字段
  });
  // console.log(dv);
  const config = {
    data: dv.rows,
    xField: 'name',
    yField: 'score',
    seriesField: 'user',
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
    // yAxis: {
    //     label: false,
    //     line: null,
    //     tickLine: null,
    //     grid: {
    //         line: {
    //             style: {
    //                 fill: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
    //                 fillOpacity: 0.05,
    //                 stroke: 'white',
    //                 lineWidth: 1,
    //                 lineDash: [4, 5],
    //                 strokeOpacity: 0,
    //                 shadowColor: 'black',
    //                 shadowBlur: 10,
    //                 shadowOffsetX: 5,
    //                 shadowOffsetY: 5,
    //                 cursor: 'pointer'
    //             }
    //         }
    //     },
    // },
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

  const ref = useRef();
  const getChartBase64 = () => {
    return ref.current?.toDataURL();
  };
  useEffect(() => {
    props.fiveStarBase64.current = getChartBase64;
  }, []);

  return (
    <>
      <Radar
        {...config}
        onReady={(plot: any) => {
          ref.current = plot;
        }}
      />
    </>
  );
};

export default CompareRadarChart;
