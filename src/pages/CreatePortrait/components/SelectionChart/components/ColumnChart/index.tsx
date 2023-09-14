import React from 'react';
import {Column} from '@ant-design/charts';

export type ColumnChartType = {
  detail?: object[];
};

const ColumnChart: React.FC<ColumnChartType> = (props) => {
  let data: any = props.detail;
  var config = {
    data: data,
    xField: 'item',
    yField: 'count',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
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
    // meta: {
    //   type: { alias: '类别' },
    //   sales: { alias: '销售额' },
    // },
  };
  return <Column {...config} />;
};

export default ColumnChart;
