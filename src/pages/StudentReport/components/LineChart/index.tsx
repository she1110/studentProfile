import React, {useEffect, useRef} from 'react';
import {Line} from '@ant-design/charts';

export type Props = {
  gpaTrend?: any;
  getBase64GPA?: any;
  type?: any;
  GPATrend?: any;
};
const LineChart: React.FC<Props> = (props) => {
  let data: any = [];
  if (props.gpaTrend) {
    data = props.gpaTrend;
  }
  let dataTemp: any = [];
  data.map((element: any, index: any) => {
    let dataTempObj = {
      name: element.name,
      type: element.type,
      value: element.value * 100 - 200,
    };
    dataTemp.push(dataTempObj);
  });
  var config = {
    data: dataTemp,
    xField: 'name',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    point: {
      size: 5,
      style: {
        lineWidth: 1,
        fillOpacity: 1,
      },
      shape: function shape(item) {
        if (item.type === '学生个人') {
          return 'circle';
        }
        return 'diamond';
      },
    },
    // meta: {
    //   name: {
    //     alias: '1',
    //     min: 0,
    //     nice: true,
    //   },
    // },
    tooltip: {
      formatter: (item: any) => {
        return {name: item.type, value: (item.value + 200) / 100};
      },
    },
    color: ['#1979C9', '#D62A0D', '#FAA219'],
    interactions: [{type: 'marker-active'}],
    lineStyle: (item: any) => {
      if (item.type === '学生个人') {
        return {
          lineDash: [1, 1],
        };
      } else {
        return {
          lineDash: [5, 5],
        };
      }
    },
  };

  const ref = useRef();
  const getChartBase64 = () => {
    return ref.current?.toDataURL();
  };
  useEffect(() => {
    if (props.type && props.type === 'student') {
      props.GPATrend.current = getChartBase64;
    }
  }, []);

  return (
    <>
      <Line
        {...config}
        onReady={(plot: any) => {
          ref.current = plot;
        }}
      />
    </>
  );
};

export default LineChart;
