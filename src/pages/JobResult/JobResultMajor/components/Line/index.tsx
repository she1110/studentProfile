import React, {useEffect} from 'react';
import {Line} from '@ant-design/charts';

export type Props = {
  chartdata: object[];
};

const DemoLine: React.FC<Props> = (props) => {
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
  useEffect(() => {
    // console.log(props.chartdata);
  }, []);

  var config = {
    data: props.chartdata,
    xField: 'yearandseme',
    yField: 'value',
    seriesField: 'majorid',
    smooth: true,
    legend: {
      itemHeight: 20,
    },
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
            return ''.concat(s, ',');
          });
        },
      },
    },
    // color: ['#1979C9', '#D62A0D', '#FAA219'],
  };
  return (
    <div>
      <Line {...config} />
    </div>
  );
};

export default DemoLine;
