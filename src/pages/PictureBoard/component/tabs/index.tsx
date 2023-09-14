import {Select, Tabs,} from 'antd';
import type {Dispatch} from 'umi';
import {connect} from 'umi';
import React from 'react';
import PictureBoardTable from '../table';

const {TabPane} = Tabs;
const {Option} = Select;

const initialPanes = [
  {
    boardName: '教务年度评比',
    content: 'Content of Tab 1',
    key: '1',
    id: '123321',
    closable: false,
  },
  {
    boardName: '数学类竞赛选拔',
    content: [
      {
        author: '曹嘉玺',
        createtime: '2021-05-26 22:03:00',
        id: '15389',
        name: '智能学院高数挂科画像',
        runFinishState: '1',
      },
    ],
    key: '2',
    id: '123123',
    closable: false,
  },
  {
    boardName: '毕业班成绩预警',
    content: 'Content of Tab 3',
    key: '3',
    id: '321321',
    closable: false,
  },
];

export type TABSType = {
  dispatch?: Dispatch;
  allboard?: object[];
};

class TABS extends React.Component<TABSType> {
  state = {
    activeKey: '0',
  };

  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'portraitboard/getMyAllBoard',
      });
    }
  };

  //切换看板 控制显示
  onChange = (activeKey: any) => {
    this.setState({
      activeKey,
    });
  };

  render() {
    const {activeKey} = this.state;
    const {allboard} = this.props;
    return (
      <div style={{height: 900}}>
        <Tabs
          type="editable-card"
          onChange={this.onChange}
          activeKey={activeKey}
          // onEdit={this.onEdit}
          hideAdd
          animated={true}
        >
          {allboard?.map((element: any, index: any) => (
            <TabPane tab={element.boardName} key={index} closeIcon={true}>
              <PictureBoardTable allinfo={element} onChange={this.onChange}/>
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default connect(({portraitboard}: any) => ({
  ...portraitboard,
}))(TABS);
