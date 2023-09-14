import {Chart} from '@antv/g2';
import React from 'react';
import HeatMapTestData from '../assets/Heatmap.json';
import {connect} from 'umi';

class HeatMap extends React.Component {
  componentDidMount = () => {
    let datatemp: any;
    datatemp = this.props.evaluateinstructor.counseloranddormround;
    let data = HeatMapTestData;
    const chart = new Chart({
      container: 'HeatMapcontainer111',
      autoFit: true,
      height: 500,
      padding: 40,
    });
    chart.data(data);
    chart.tooltip({
      showTitle: null,
      showMarkers: false,
    });
    chart.coordinate('polar', {
      innerRadius: 0.2,
    });

    // chart.facet('list', {
    //     fields: ['counselorid'],
    //     cols: 2,
    //     padding: [0, 15, 30, 15],

    //     columnTitle: {
    //       offsetY: -10,
    //       style: {
    //         fontSize: 12,
    //         textAlign: 'center',
    //         fill: '#666',
    //       },
    //     },
    //     eachView: (view) => {
    //       view
    //         .polygon()
    //         .position('x*y')
    //         .color('挂科总数', '#E3F6FF-#FFF2D1-#FFBE15-#FA541C-#F51D27')
    //         // .color('挂科总数', '#F51D27-#FA541C-#FFBE15-#FFF2D1-#E3F6FF-#85C6FF-#0086FA-#0A61D7')
    //         .style({
    //           lineWidth: 1,
    //           stroke: '#fff',
    //         });
    //     },
    //   });
    chart.legend(true);
    chart.axis('week', {
      grid: null,
      line: null,
      tickLine: null,
      label: null,
    });
    chart.axis('time', {
      line: null,
      tickLine: null,
      grid: null,
      label: {
        offset: 3,
      },
    });
    chart
      .polygon()
      .position('time*week')
      .color('value', '#BAE7FF-#1890FF-#0050B3')
      .tooltip('week*time*value')
      .style({
        stroke: '#fff',
        lineWidth: 1,
      });

    chart.interaction('element-active');

    const values = ['Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.', 'Sun.'];
    values.map((val, idx) => {
      chart.annotation().text({
        top: true,
        position: [0, idx],
        content: val,
        style: {
          fill: '#fff',
          textAlign: 'center',
          shadowBlur: 2,
          shadowColor: 'rgba(0, 0, 0, .45)',
        },
      });

      return null;
    });
    chart.render();
  };

  render() {
    return <div id={'HeatMapcontainer111'} style={{marginTop: 10}}></div>;
  }
}

export default connect(({evaluateinstructor}: any) => ({
  evaluateinstructor,
}))(HeatMap);
