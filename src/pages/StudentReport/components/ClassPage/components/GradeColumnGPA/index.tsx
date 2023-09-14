import React from 'react';
import {Column} from '@ant-design/charts';

export type Props = {
  stackData?: any;
};

const GradeColumnGPA: React.FC<Props> = (props) => {
  console.log(props.stackData);
  let datatemp: any = [];
  if (props.stackData) {
    datatemp = props.stackData;
  }
  const data = [
    {
      year: 'GPA-差',
      value: 3,
      type: '五育-差',
    },
    {
      year: 'GPA-中',
      value: 4,
      type: '五育-差',
    },
    {
      year: 'GPA-良',
      value: 3.5,
      type: '五育-差',
    },
    {
      year: 'GPA-优',
      value: 5,
      type: '五育-差',
    },

    {
      year: 'GPA-差',
      value: 3,
      type: '五育-中',
    },
    {
      year: 'GPA-中',
      value: 4,
      type: '五育-中',
    },
    {
      year: 'GPA-良',
      value: 3.5,
      type: '五育-中',
    },
    {
      year: 'GPA-优',
      value: 5,
      type: '五育-中',
    },

    {
      year: 'GPA-差',
      value: 4.9,
      type: '五育-良',
    },
    {
      year: 'GPA-中',
      value: 7,
      type: '五育-良',
    },
    {
      year: 'GPA-良',
      value: 9,
      type: '五育-良',
    },
    {
      year: 'GPA-优',
      value: 13,
      type: '五育-良',
    },

    {
      year: 'GPA-差',
      value: 4.9,
      type: '五育-优',
    },
    {
      year: 'GPA-中',
      value: 6,
      type: '五育-优',
    },
    {
      year: 'GPA-良',
      value: 7,
      type: '五育-优',
    },
    {
      year: 'GPA-优',
      value: 9,
      type: '五育-优',
    },
  ];
  const config = {
    data: datatemp,
    isStack: true,
    xField: 'five',
    yField: 'count',
    seriesField: 'gpa',
    // isPercent: true,
    label: {
      // content: (item: any) => {
      //   return item.value.toFixed(2);
      // },
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'bottom', 'middle'
      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        {
          type: 'interval-adjust-position',
        }, // 数据标签防遮挡
        {
          type: 'interval-hide-overlap',
        }, // 数据标签文颜色自动调整
        {
          type: 'adjust-color',
        },
      ],
    },
  };
  return <Column {...config} style={{margin: 30}}/>;
};
export default GradeColumnGPA;
