import React from 'react';
import {Pie} from '@ant-design/charts';

const StudentChart: React.FC = () => {
  var data = [
    {
      type: '本科生',
      value: 2925,
    },
    {
      type: '研究生',
      value: 755,
    },
    {
      type: '博士生',
      value: 28,
    },
  ];
  var config = {
    appendPadding: 10,
    data: data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: function content(_ref) {
        var percent = _ref.percent;
        return ''.concat((percent * 100).toFixed(0), '%');
      },
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{type: 'element-active'}],
  };
  return (
    <div style={{width: '350px', height: '180px', paddingTop: 20}}>
      <Pie {...config} />
    </div>
  );
};

export default StudentChart;
