import React from 'react';
import {Line} from '@ant-design/charts';

export type Props = {
  // dispatch: Dispatch;
  selectedRowKeys: string[]; //画像列表
  chartdata: object[]; //图表数据
};

const DemoLine: React.FC<Props> = (props) => {
  const {selectedRowKeys, chartdata} = props;
  let datatemp: any = [];
  for (let i = 0; i < selectedRowKeys.length; i++) {
    chartdata.map((element: any, index: any) => {
      if (element.userid === selectedRowKeys[i]) {
        datatemp.push(element);
      }
    });
  }

  var config = {
    data: datatemp,
    xField: 'yearandseme',
    yField: 'value',
    seriesField: 'username',
    smooth: true,
    legend: {
      itemHeight: 20,
    },
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
            return ''.concat(s, ',');
          });
        },
      },
    },
  };
  return <Line {...config} />;
};

export default DemoLine;
