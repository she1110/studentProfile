import React from 'react';
import {Pie} from '@ant-design/charts';

export type Props = {
  type?: any;
  pieData?: any;
};

const DemoPie: React.FC<Props> = (props) => {
  let data: any = [];
  if (props.type && props.type === 'class') {
    data = props.pieData;
  } else if (props.type && props.type === 'major') {
    data = props.pieData;
  } else if (props.type && props.type === 'counselor') {
    data = props.pieData;
  }
  // console.log("???");

  // console.log(data);

  const config = {
    forceFit: true,
    title: {
      // visible: true,
      text: '多色饼图',
    },
    description: {
      visible: true,
      text: '指定颜色映射字段(colorField)\uFF0C饼图切片将根据该字段数据显示为不同的颜色\u3002指定颜色需要将color配置为一个数组\u3002\n当把饼图label的类型设置为inner时\uFF0C标签会显示在切片内部\u3002设置offset控制标签的偏移值\u3002',
    },
    radius: 0.8,
    data,
    angleField: 'count',
    colorField: 'type',
    label: {
      visible: true,
      type: 'inner',
      formatter: (item: any) => {
        return item.count + '%';
      },
    },
    tooltip: {
      position: 'top',
      formatter: (item: any) => {
        return {name: item.type, value: item.count + '%'};
      },
    },
  };

  return <Pie {...config} />;
};

export default DemoPie;
