import {formatTime} from '@/utils/tools';
import React from 'react';
import './index.less';

class FormatTime extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      timeStr: '',
      weekday: [
        '星期天',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
      ],
    };
  }

  componentDidMount() {
    this.setTimeFunc();
  }

  setTimeFunc() {
    this.timeing = setInterval(() => {
      let datYear = formatTime(new Date(), 'yyyy-MM-dd');
      let datMonth = formatTime(new Date(), 'HH:mm:ss');
      let datWeek = this.state.weekday[new Date().getDay()];
      this.setState({
        timeStr: `${datYear} | ${datMonth} | ${datWeek}`,
      });
    });
  }

  render() {
    return <div className="time-str">{this.state.timeStr}</div>;
  }
}

export default FormatTime;
