import React from 'react';
import {Card, Skeleton, Spin,} from 'antd';
import type {Dispatch} from 'umi';
import {connect, history, Link} from 'umi';
import SelectionForm from './components/SelectionForm';
import SelectionResult from './components/selectionResult';
import SelectionChart from './components/SelectionChart';

export type CreatePortraitType = {
  dispatch: Dispatch;
  location: any;
  Loading?: boolean;
  tempid?: string;
  clusterDetail?: object[];
};

const themegroup = {
  studentprofile: '创建分群：学生主题',
  dormitoryprofile: '创建分群：宿舍主题',
  classprofile: '创建分群：班级主题',
  majorprofile: '创建分群：专业主题',
  courseprofile: '创建分群：课程主题',
  unitprofile: '创建分群：学院主题',
};

class CreatePortrait extends React.Component<CreatePortraitType> {
  state = {
    theme: undefined, //创建什么主题的画像
    createMethod: undefined, //创建画像的方式 0：选择主题创建；1：getone创建
    portrait: undefined, //getone创建的方式，画像信息
  };

  componentDidMount = () => {
    const {location, dispatch} = this.props;
    if (location.state === undefined) {
      history.goBack();
    } else {
      //给主题、创建方式和画像信息赋值并清空数据
      this.setState({
        theme: location.state.theme,
        createMethod: location.state.createMethod,
        portrait: location.state.portrait,
      });
      dispatch({
        type: 'portrait/clearPortraitModal',
      });
      // dispatch({
      //     type: 'portrait/deleteGroupResult',
      //     payload: {
      //         UserGroupResultTemp: [],
      //         GroupResultRequestParametersTemp: [],
      //     }
      // });
    }
  };

  render() {
    const {theme, createMethod, portrait} = this.state;
    const {dispatch, Loading, tempid, clusterDetail} = this.props;

    return (
      <div>
        {createMethod && theme ? (
          <Spin spinning={Loading ? Loading : false}>
            <div
              style={{
                paddingTop: 30,
                paddingRight: 30,
                paddingLeft: 30,
                background: ' #ececec',
                width: '100%',
              }}
            >
              <SelectionForm
                theme={theme}
                createMethod={createMethod}
                cardTitle={themegroup[theme]}
                dispatch={dispatch}
                portrait={portrait}
              />
            </div>
            <div
              style={{
                paddingTop: 30,
                paddingRight: 30,
                paddingLeft: 30,
                background: ' #ececec',
                width: '100%',
              }}
            >
              <SelectionResult
                theme={theme}
                createMethod={createMethod}
                dispatch={dispatch}
              />
            </div>
            {clusterDetail?.length !== 0 ? (
              <div
                style={{padding: 30, background: ' #ececec', width: '100%'}}
              >
                <SelectionChart
                  theme={theme}
                  createMethod={createMethod}
                  tempID={tempid}
                  portrait={portrait}
                />
              </div>
            ) : (
              <div
                style={{padding: 30, background: ' #ececec', width: '100%'}}
              >
                <Card title="用户画像" bordered={false}>
                  <Skeleton/>
                </Card>
              </div>
            )}
          </Spin>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default connect(({portrait, loading}: any) => ({
  ...portrait,
  Loading: loading.effects['portrait/checkName'],
}))(CreatePortrait);
