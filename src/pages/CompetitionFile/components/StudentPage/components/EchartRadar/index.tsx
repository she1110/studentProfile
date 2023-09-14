import React, {Component} from 'react';
import {connect, Link} from 'umi';
import {FormInstance} from 'antd/lib/form';
import * as echarts from 'echarts';

export type Props = {
  fiveStar?: object[];
};

class Test extends Component<Props> {
  state = {};

  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {fiveStar} = this.props;
    let studentArry: any = [];
    let classArry: any = [];
    fiveStar?.map((element: any, index: any) => {
      studentArry.push(element.student);
      classArry.push(element.class);
    });

    let chartDom = document.getElementById('main');
    let myChart = echarts.init(chartDom);
    let option;
    option = {
      color: ['#C71585', '#1890FF'],
      tooltip: {
        trigger: 'item',
      },
      legend: {
        x: 'left',
        bottom: 2,
      },
      radar: [
        {
          indicator: [
            {text: '德育分值'},
            {text: '智育分值'},
            {text: '体育分值'},
            {text: '美育分值'},
            {text: '劳动分值'},
          ],
          center: ['25%', '50%'],
          radius: 120,
          startAngle: 90,
          splitNumber: 5,
          shape: 'circle',
          axisName: {
            formatter: '【{value}】',
            color: '#428BD4',
          },
          splitArea: {
            areaStyle: {
              color: ['#ff3300', '#ff6600', '#ff9900', '#ffcc00', '#32CD32'],
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 10,
            },
          },
        },
      ],
      series: [
        {
          type: 'radar',
          emphasis: {
            lineStyle: {
              width: 4,
            },
          },
          data: [
            {
              value: studentArry,
              name: '学生个人',
              areaStyle: {
                color: 'rgba(186, 234, 255, 0.01)',
              },
            },
            {
              value: classArry,
              name: '班级平均',
              areaStyle: {
                color: 'rgba(0, 147, 233,0.01)',
              },
            },
          ],
        },
      ],
    };
    option && myChart.setOption(option);
  };

  render() {
    const {} = this.props;

    return <div id="main" style={{width: 1000, height: 400}}></div>;
  }
}

export default connect(({trainingplan, loading}: any) => ({
  ...trainingplan,
  // allLoading: loading.effects['trainingplan/personalProfile'],
}))(Test);
