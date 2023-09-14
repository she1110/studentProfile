import {Chart} from '@antv/g2';
import React from 'react';
import {connect} from 'umi';

class ColorRound extends React.Component {
  componentDidMount = () => {
    let datatemp;
    datatemp = this.props.evaluateinstructor.counseloranddormround.data;
    datatemp = JSON.parse(datatemp);

    //调整图表的位置
    const chart = new Chart({
      container: 'containerround',
      autoFit: true,
      height: 1500,
      padding: [50, 120, 50, 120],
    });

    chart.coordinate({
      type: 'polar',
      cfg: {
        innerRadius: 0.1,
      },
      // actions: [ ['scale', 1.8, 1]],
    });

    chart.data(datatemp);
    //图的度量？定义数据的类型和展示方式
    chart.scale({
      x: {
        type: 'cat', //连续的时间度量
      },
      y: {
        type: 'cat',
      },
      挂科总数: {
        type: 'linear', //线性度量
        min: 0,
        max: 20,
        sync: true,
      },
    });
    chart.axis(false);
    chart.legend('挂科总数', {
      offset: 0,
    }); //设置图例
    chart.tooltip({
      title: 'dormitory',
      showMarkers: false,
    }); //设置气泡
    chart.facet('list', {
      fields: ['counselorid'],
      cols: 2,
      padding: [0, 15, 30, 15],
      columnTitle: {
        offsetY: -10,
        style: {
          fontSize: 12,
          textAlign: 'center',
          fill: '#666',
        },
      },
      eachView: (view) => {
        view
          .polygon()
          .position('x*y')
          .color('挂科总数', '#E3F6FF-#FFF2D1-#FFBE15-#FA541C-#F51D27')
          // .color('挂科总数', '#F51D27-#FA541C-#FFBE15-#FFF2D1-#E3F6FF-#85C6FF-#0086FA-#0A61D7')
          .style({
            lineWidth: 1,
            stroke: '#fff',
          });
      },
    });
    chart.interaction('element-active');
    chart.render();
  };

  render() {
    return <div id={'containerround'} style={{marginTop: 10}}></div>;
  }
}

export default connect(({evaluateinstructor}: any) => ({
  evaluateinstructor,
}))(ColorRound);
