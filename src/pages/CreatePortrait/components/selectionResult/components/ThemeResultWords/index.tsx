import React from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';

export type CreatePortraitType = {
  dispatch?: Dispatch;
  location?: any;
  theme: string;
  primaryInfo?: any;
};

class ThemeResultWords extends React.Component<CreatePortraitType> {
  state = {};

  componentDidMount = () => {
  };

  render() {
    const {theme, primaryInfo} = this.props;
    const ratio: any = (primaryInfo.count / primaryInfo.total).toFixed(4);
    const ratiotemp: string = (ratio * 100 + '').substr(0, 5);

    return (
      <>
        {theme === 'studentprofile' ? (
          <>
            <span>总人数为{primaryInfo?.total}</span>
            <p></p>
            <span>符合条件人数为{primaryInfo?.count}</span>
            <p></p>
            <span>
              符合条件人数占总人数百分之{ratiotemp === 'NaN' ? null : ratiotemp}
            </span>
          </>
        ) : null}
        {theme === 'dormitoryprofile' ? (
          <>
            <span>总宿舍数为{primaryInfo?.total}</span>
            <p></p>
            <span>符合条件宿舍为{primaryInfo?.count}</span>
            <p></p>
            <span>
              符合条件宿舍占总宿舍百分之{ratiotemp === 'NaN' ? null : ratiotemp}
            </span>
          </>
        ) : null}
        {theme === 'classprofile' ? (
          <>
            <span>总班级数为{primaryInfo?.total}</span>
            <p></p>
            <span>符合条件班级数为{primaryInfo?.count}</span>
            <p></p>
            <span>
              符合条件班级占总班级百分之{ratiotemp === 'NaN' ? null : ratiotemp}
            </span>
          </>
        ) : null}
        {theme === 'majorprofile' ? (
          <>
            <span>总专业数为{primaryInfo?.total}</span>
            <p></p>
            <span>符合条件专业数为{primaryInfo?.count}</span>
            <p></p>
            <span>
              符合条件专业占总专业百分之{ratiotemp === 'NaN' ? null : ratiotemp}
            </span>
          </>
        ) : null}
        {theme === 'courseprofile' ? (
          <>
            <span>总课程数为{primaryInfo?.total}</span>
            <p></p>
            <span>符合课程数为{primaryInfo?.count}</span>
            <p></p>
            <span>
              符合条件课程占总课程百分之{ratiotemp === 'NaN' ? null : ratiotemp}
            </span>
          </>
        ) : null}
        {theme === 'unitprofile' ? (
          <>
            <span>总学院数为{primaryInfo?.total}</span>
            <p></p>
            <span>符合条件学院数为{primaryInfo?.count}</span>
            <p></p>
            <span>
              符合条件学院占总学院百分之{ratiotemp === 'NaN' ? null : ratiotemp}
            </span>
          </>
        ) : null}
      </>
    );
  }
}

export default connect(({portrait}: any) => ({
  ...portrait,
}))(ThemeResultWords);
