import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {Select, Tabs,} from 'antd';

import {Chart} from '@antv/g2';

export type Props = {
  dispatch?: Dispatch;
  allLoading?: boolean;
  dormitoryReport?: any;
  getUserId?: any;
  phoneAndEmail?: any;
  DormName?: any;

  getClassId?: any;
  gradeReport?: any;
};

const {TabPane} = Tabs;
const {Option} = Select;

class GradeHotMap extends Component<Props> {
  state = {};

  componentDidMount = () => {
    const data = [
      [0, 0, 10],
      [0, 1, 19],
      [0, 2, 8],
      [0, 3, 24],
      [0, 4, 67],
      [1, 0, 92],
      [1, 1, 58],
      [1, 2, 78],
      [1, 3, 117],
      [1, 4, 48],
      [2, 0, 35],
      [2, 1, 15],
      [2, 2, 123],
      [2, 3, 64],
      [2, 4, 52],
      [3, 0, 72],
      [3, 1, 132],
      [3, 2, 114],
      [3, 3, 19],
      [3, 4, 16],
      [4, 0, 38],
      [4, 1, 5],
      [4, 2, 8],
      [4, 3, 117],
      [4, 4, 115],
    ];

    const source = data.map((arr) => {
      return {
        name: arr[0],
        day: arr[1],
        sales: arr[2],
      };
    });

    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 400,
    });

    chart.data(source);

    chart.scale('name', {
      type: 'cat',
      values: ['优', '良', '中', '合格', '不合格'],
    });
    chart.scale('day', {
      type: 'cat',
      values: ['优', '良', '中', '合格', '不合格'],
    });
    chart.scale('sales', {
      nice: true,
    });

    chart.axis('name', {
      tickLine: null,
      grid: {
        alignTick: false,
        line: {
          style: {
            lineWidth: 1,
            lineDash: null,
            stroke: '#f0f0f0',
          },
        },
      },
    });

    chart.axis('day', {
      title: null,
      grid: {
        alignTick: false,
        line: {
          style: {
            lineWidth: 1,
            lineDash: null,
            stroke: '#f0f0f0',
          },
        },
      },
    });

    chart.tooltip({
      showMarkers: false,
    });

    chart
      .polygon()
      .position('name*day')
      .color('sales', '#BAE7FF-#1890FF-#0050B3')
      .label('sales', {
        offset: -2,
        style: {
          fill: '#fff',
          shadowBlur: 2,
          shadowColor: 'rgba(0, 0, 0, .45)',
        },
      })
      .style({
        lineWidth: 1,
        stroke: '#fff',
      });

    chart.interaction('element-active');
    chart.render();
  };

  render() {
    return <div id={'container'} style={{padding: 30}}></div>;
  }
}

export default connect(({trainingplan, loading, user}: any) => ({
  ...trainingplan,
  ...user,
  allLoading: loading.effects['trainingplan/dormAndClassProfile'],
}))(GradeHotMap);
