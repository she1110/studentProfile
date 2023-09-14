import React from 'react';
import {Column, G2} from '@ant-design/charts';

export type Props = {
  examDataMap?: any;
};

const LinkageChart: React.FC<Props> = (props) => {
  let examDataMap = props.examDataMap || {};
  let temp: any = [];
  Object.keys(examDataMap).map((key) => {
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;
    let count5 = 0;
    examDataMap[key].map((element: any, index: any) => {
      if (element.score >= 90) {
        count1 = count1 + 1;
      } else if (element.score >= 80 && element.score < 90) {
        count2 = count2 + 1;
      } else if (element.score >= 70 && element.score < 80) {
        count3 = count3 + 1;
      } else if (element.score >= 60 && element.score < 70) {
        count4 = count4 + 1;
      } else {
        count5 = count5 + 1;
      }
    });
    temp.push({
      yearandseme: key,
      scoreRank: '优秀',
      count: count1,
    });
    temp.push({
      yearandseme: key,
      scoreRank: '较好',
      count: count2,
    });
    temp.push({
      yearandseme: key,
      scoreRank: '良好',
      count: count3,
    });
    temp.push({
      yearandseme: key,
      scoreRank: '及格',
      count: count4,
    });
    temp.push({
      yearandseme: key,
      scoreRank: '不及格',
      count: count5,
    });
  });
  G2.registerInteraction('element-link', {
    start: [
      {
        trigger: 'interval:mouseenter',
        action: 'element-link-by-color:link',
      },
    ],
    end: [
      {
        trigger: 'interval:mouseleave',
        action: 'element-link-by-color:unlink',
      },
    ],
  });
  temp.sort((a: { yearandseme: string }, b: { yearandseme: string }) => {
    return a.yearandseme.localeCompare(b.yearandseme);
  });
  var config = {
    data: temp,
    xField: 'yearandseme',
    yField: 'count',
    seriesField: 'scoreRank',
    isPercent: true,
    isStack: true,
    meta: {
      count: {
        min: 0,
        max: 1,
      },
    },
    label: {
      position: 'middle',
      content: function content(item) {
        return ''.concat((item.count * 100).toFixed(2), '%');
      },
      style: {fill: '#fff'},
    },
    tooltip: false,
    interactions: [
      {type: 'element-highlight-by-color'},
      {type: 'element-link'},
    ],
  };
  return <Column {...config} />;
};

export default LinkageChart;
