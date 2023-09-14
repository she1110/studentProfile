import {Chart} from '@antv/g2';
import React, {Component} from 'react';
import {Link} from 'umi';

export type Props = {
  ScatterData?: any;
};

let chart: any;
let datatemp: any = [];

class ScatterChart extends Component<Props> {
  state = {};
  componentDidMount = () => {
    const {ScatterData} = this.props;
    if (ScatterData) {
      datatemp = ScatterData;
    }
    chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 400,
      padding: [20, 20, 50, 80],
    });
    // 数据格式： [{ "gender": "班级1", "height": 161.2, "weight": 51.6 },]
    chart.data(datatemp);
    chart.scale({
      GPA: {nice: true},
      TOTAL: {nice: true},
    });
    chart.tooltip({
      showCrosshairs: true,
      showContent: false,
      crosshairs: {
        type: 'xy',
        text: (type: any, defaultText: any, items: any) => {
          const color = items[0].color;
          if (type === 'x') {
            return {
              offset: 5,
              position: 'end',
              content: 'GPA: ' + defaultText,
              style: {
                textAlign: 'center',
                textBaseline: 'top',
                fontSize: 14,
                fontWeight: 'bold',
              },
            };
          }
          return {
            offset: 5,
            content: '五育: ' + defaultText,
            style: {
              textAlign: 'end',
              fontSize: 14,
              fontWeight: 'bold',
            },
          };
        },
        textBackground: null,
      },
    });
    chart
      .point()
      .position('GPA*TOTAL')
      .color('CLASSNAME')
      .shape('circle')
      .tooltip('CLASSNAME')
      // .tooltip('CLASSNAME*GPA*TOTAL', (CLASSNAME: any, GPA: any, TOTAL: any) => {
      //   return {
      //     name: CLASSNAME,
      //     value: "GPA:" + GPA + ', ' + "五育:" + TOTAL,
      //   };
      // })
      .style({
        fillOpacity: 0.85,
      });
    chart.interaction('legend-highlight');
    chart.render();
  };

  componentDidUpdate = () => {
    const {ScatterData} = this.props;
    datatemp = ScatterData;
    chart.data(datatemp);
    chart.render();
  };

  render() {
    return <div id={'container'} style={{padding: 30}}></div>;
  }
}

export default ScatterChart;
