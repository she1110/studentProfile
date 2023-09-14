import {Chart} from '@antv/g2';
import React from 'react';
import {connect} from 'umi';

let datatemp;
let chart: any;

class ColorBlock extends React.Component {
  elementClick = (ev) => {
    // console.log(ev);
    // console.log(ev.view.coordinateController.option);
  };

  componentDidMount = () => {
    chart = new Chart({
      container: 'containerblock',
      autoFit: true,
      height: 1500,
      padding: [50, 120, 50, 120],
    });

    chart.on('legend:valuechanged', (ev: any) => this.elementClick(ev));

    datatemp = this.props.evaluateinstructor.counseloranddormblock.data;
    datatemp = JSON.parse(datatemp);
    console.log(datatemp);

    //调整图表的位置
    chart.coordinate({
      type: 'cartesian',
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
      // min:0,
      // max:20,
      // value: [2,5],
      // position: 'right',
    }); //设置图例

    chart.tooltip({
      title: 'DORMITORY',
      showMarkers: false,
    }); //设置气泡
    chart.facet('list', {
      fields: ['COUNSELORID'],
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
    // chart.interaction('element-active');
    chart.render();
  };

  componentDidUpdate = () => {
    chart.coordinateController.option = {
      type: this.props.charttype,
      cfg: {
        innerRadius: 0.1,
      },
    };
    if (this.props.charttype === 'cartesian') {
      datatemp = this.props.evaluateinstructor.counseloranddormblock.data;
      chart.data(JSON.parse(datatemp));
    }
    if (this.props.charttype === 'polar') {
      datatemp = this.props.evaluateinstructor.counseloranddormround.data;
      chart.data(JSON.parse(datatemp));
    }
    chart.render();
  };

  render() {
    return (
      <>
        <div id={'containerblock'} style={{marginTop: 10}}></div>
      </>
    );
  }
}

export default connect(({evaluateinstructor}: any) => ({
  evaluateinstructor,
}))(ColorBlock);
