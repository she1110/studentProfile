import React, {useEffect, useState} from 'react';
import {Line} from '@ant-design/charts';
import {Divider, Select,} from 'antd';

export type Props = {
  chartdata: any;
  classname: object[];
};

const {Option} = Select;

const TotalLine: React.FC<Props> = (props) => {
  const {chartdata, classname} = props;
  const data = [
    {
      year: '第一学年第一学期',
      value: 5.5,
      category: '专业1',
    },
    {
      year: '第一学年第一学期',
      value: 6.5,
      category: '专业2',
    },
    {
      year: '第一学年第一学期',
      value: 7.5,
      category: '专业3',
    },
    {
      year: '第一学年第二学期',
      value: 5.5,
      category: '专业1',
    },
    {
      year: '第一学年第二学期',
      value: 6.5,
      category: '专业2',
    },
    {
      year: '第一学年第二学期',
      value: 7.5,
      category: '专业3',
    },
    {
      year: '第二学年第一学期',
      value: 1,
      category: '专业1',
    },
    {
      year: '第二学年第一学期',
      value: 4,
      category: '专业2',
    },
    {
      year: '第二学年第一学期',
      value: 8,
      category: '专业3',
    },
    {
      year: '第二学年第二学期',
      value: 3,
      category: '专业1',
    },
    {
      year: '第二学年第二学期',
      value: 6,
      category: '专业2',
    },
    {
      year: '第二学年第二学期',
      value: 9,
      category: '专业3',
    },
    {
      year: '第三学年第一学期',
      value: 1,
      category: '专业1',
    },
    {
      year: '第三学年第一学期',
      value: 5,
      category: '专业2',
    },
    {
      year: '第三学年第一学期',
      value: 7,
      category: '专业3',
    },
    {
      year: '第三学年第二学期',
      value: 5,
      category: '专业1',
    },
    {
      year: '第三学年第二学期',
      value: 6,
      category: '专业2',
    },
    {
      year: '第三学年第二学期',
      value: 7,
      category: '专业3',
    },
    {
      year: '第四学年第一学期',
      value: 7,
      category: '专业1',
    },
    {
      year: '第四学年第一学期',
      value: 8,
      category: '专业2',
    },
    {
      year: '第四学年第一学期',
      value: 9,
      category: '专业3',
    },
    {
      year: '第四学年第二学期',
      value: 3,
      category: '专业1',
    },
    {
      year: '第四学年第二学期',
      value: 6,
      category: '专业2',
    },
    {
      year: '第四学年第二学期',
      value: 7,
      category: '专业3',
    },
  ];
  const [content, setContent] = useState([]);
  useEffect(() => {
    // console.log(chartdata);
    // console.log(test);
  }, []);
  const SelectOnChange = (value: any) => {
    console.log(chartdata[value]);
    setContent(chartdata[value]);
  };
  var config = {
    data: content,
    xField: 'yearandseme',
    yField: 'valuescore',
    seriesField: 'type',
    smooth: true,
    yAxis: {
      label: {
        formatter: function formatter(v: any) {
          return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
            return ''.concat(s, ',');
          });
        },
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
                      <span style={{margiRight: 16}}>{name}:</span>
                      <span>&nbsp;</span>
                      <span className="g2-tooltip-list-item-value1">
                        {value}分
                      </span>
                      <span>&nbsp;&nbsp;</span>
                      <span className="g2-tooltip-list-item-value2">
                        {data.valuecount}人
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        );
      },
    },
  };
  return (
    <div>
      选择班级：
      <Select style={{width: 120}} onChange={SelectOnChange}>
        {classname.map((element: any, index: any) => {
          return (
            <Option value={element.value} key={index}>
              {element.name}
            </Option>
          );
        })}
      </Select>
      <Divider/>
      <Line {...config} />
    </div>
  );
};

export default TotalLine;
