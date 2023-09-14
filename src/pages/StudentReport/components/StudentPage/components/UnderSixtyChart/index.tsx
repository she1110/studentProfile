import React from 'react';
import {Column} from '@ant-design/charts';

export type Props = {
  underSixtyGraph?: any;
};

const UnderSixtyChart: React.FC<Props> = (props) => {
  let data: any = [];
  if (props.underSixtyGraph) {
    data = props.underSixtyGraph;
  }
  console.log(data);

  var config = {
    data: data,
    xField: 'yearandseme',
    yField: 'number',
    // seriesField: 'type',
    isGroup: 'true',
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    tooltip: {
      customContent: (title: any, items: any) => {
        return (
          <>
            <h5 style={{marginTop: 16}}>{title}</h5>
            <ul style={{paddingLeft: 0}}>
              {items?.map((item: any, index: any) => {
                const {name, value, color} = item;
                const content = item.data.content;
                return (
                  <>
                    {content?.map((elementsub: any, indexsub: any) => {
                      return (
                        <li
                          key={item.year}
                          className="g2-tooltip-list-item"
                          data-index={indexsub}
                          style={{
                            marginBottom: 4,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            className="g2-tooltip-marker"
                            style={{backgroundColor: color}}
                          ></span>
                          <span
                            style={{
                              display: 'inline-flex',
                              flex: 1,
                              justifyContent: 'space-between',
                            }}
                          >
                            <span>科目{indexsub + 1}：</span>
                            <span className="g2-tooltip-list-item-value">
                              {elementsub}
                            </span>
                          </span>
                        </li>
                      );
                    })}
                    <li
                      key={item.year}
                      className="g2-tooltip-list-item"
                      data-index={index}
                      style={{
                        marginBottom: 4,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        className="g2-tooltip-marker"
                        style={{backgroundColor: color}}
                      ></span>
                      <span
                        style={{
                          display: 'inline-flex',
                          flex: 1,
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{margiRight: 16}}>总计:</span>
                        <span className="g2-tooltip-list-item-value">
                          {value}
                        </span>
                      </span>
                    </li>
                  </>
                );
              })}
            </ul>
          </>
        );
      },
    },
  };
  return <Column {...config} />;
};

export default UnderSixtyChart;
