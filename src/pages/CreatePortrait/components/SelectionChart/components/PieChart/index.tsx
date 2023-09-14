import React from 'react';
import {Pie} from '@ant-design/charts';

export type PieChartType = {
  detail?: object[];
};

const PieChart: React.FC<PieChartType> = (props) => {
  let data: any = props.detail;
  var config = {
    appendPadding: 10,
    data: data,
    angleField: 'count',
    colorField: 'item',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    tooltip: {
      customContent: (title: any, items: any) => {
        return (
          <>
            <h5 style={{marginTop: 16}}>{title}</h5>
            <ul style={{paddingLeft: 0}}>
              {items?.map((item: any, index: any) => {
                const {name, value, color, data} = item;
                return (
                  <div key={index}>
                    <li
                      key={'1'}
                      className="g2-tooltip-list-item1"
                      data-index={index}
                      style={{
                        marginBottom: 4,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          flex: 1,
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>符合条件:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span className="g2-tooltip-list-item-value1">
                          {data.count}
                        </span>
                      </span>
                    </li>
                    <li
                      key={'2'}
                      className="g2-tooltip-list-item12"
                      data-index={index}
                      style={{
                        marginBottom: 4,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          flex: 1,
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>总数量:</span>
                        <span className="g2-tooltip-list-item-value1">
                          {data.grouptotalcount}
                        </span>
                      </span>
                    </li>
                    <li
                      key={'3'}
                      className="g2-tooltip-list-item2"
                      data-index={index}
                      style={{
                        marginBottom: 4,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          flex: 1,
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>占比:</span>
                        <span className="g2-tooltip-list-item-value2">
                          {data.grouptotalpercent + '%'}
                        </span>
                      </span>
                    </li>
                  </div>
                );
              })}
            </ul>
          </>
        );
      },
    },
    interactions: [{type: 'pie-legend-active'}, {type: 'element-active'}],
  };
  return <Pie {...config} />;
};

export default PieChart;
