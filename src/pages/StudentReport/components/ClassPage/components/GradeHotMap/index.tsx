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
  GradeHotMapData?: any;
};

const {TabPane} = Tabs;
const {Option} = Select;

let chart: any;
let datatemp: any = [];
let source: any;

class GradeHotMap extends Component<Props> {
  state = {};

  componentDidMount = () => {
    console.log(this.props.GradeHotMapData);
    datatemp = this.props.GradeHotMapData;
    const data = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 2, 0],
      [0, 3, 0],
      [0, 4, 0],
      [1, 0, 0],
      [1, 1, 0],
      [1, 2, 0],
      [1, 3, 0],
      [1, 4, 0],
      [2, 0, 0],
      [2, 1, 0],
      [2, 2, 0],
      [2, 3, 0],
      [2, 4, 0],
      [3, 0, 0],
      [3, 1, 0],
      [3, 2, 0],
      [3, 3, 0],
      [3, 4, 0],
      [4, 0, 0],
      [4, 1, 0],
      [4, 2, 0],
      [4, 3, 0],
      [4, 4, 0],
    ];

    source = datatemp.map((arr) => {
      return {
        name: arr[0],
        day: arr[1],
        人数: arr[2],
      };
    });

    chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 400,
    });

    chart.data(source);

    chart.scale('name', {
      type: 'cat',
      values: ['GPA不合格', 'GPA合格', 'GPA中等', 'GPA良好', 'GPA优秀'],
    });
    chart.scale('day', {
      type: 'cat',
      values: ['五育不合格', '五育合格', '五育中等', '五育良好', '五育优秀'],
    });
    chart.scale('人数', {
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

    // chart.tooltip({
    //   showMarkers: false,
    // });

    chart
      .polygon()
      .position('name*day')
      .color('人数', '#BAE7FF-#1890FF-#0050B3')
      .label('人数', {
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

  componentDidUpdate = () => {
    const {GradeHotMapData} = this.props;
    datatemp = GradeHotMapData;
    source = datatemp.map((arr) => {
      return {
        name: arr[0],
        day: arr[1],
        人数: arr[2],
      };
    });
    chart.data(source);
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
