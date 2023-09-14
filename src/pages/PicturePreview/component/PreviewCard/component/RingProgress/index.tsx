import React from 'react';
import {RingProgress} from '@ant-design/charts';
import {connect} from 'umi';

export type ResultRingProgressType = {
  primaryInfo?: {
    total: number;
    count: number;
  };
};

const PreviewRingProgress: React.FC<ResultRingProgressType> = (props) => {
  const {primaryInfo} = props;

  let total: any = primaryInfo?.total;
  let count: any = primaryInfo?.count;
  let ratio: any = (count / total).toFixed(2);
  let ratioNumber = parseFloat(ratio);
  // console.log(ratioNumber);
  if (Object.is(ratioNumber, NaN)) {
    ratioNumber = 0;
  }
  var config = {
    height: 100,
    width: 100,
    autoFit: false,
    percent: ratioNumber,
    color: ['#1890ff', '#E8EDF3'],
    innerRadius: 0.6,
    radius: 0.98,
    statistic: {
      title: {
        style: {
          color: '#363636',
          fontSize: '12px',
          lineHeight: '14px',
        },
        formatter: function formatter() {
          return '占比';
        },
      },
    },
  };
  return <RingProgress {...config} />;
};
export default connect(({}: any) => ({}))(PreviewRingProgress);
