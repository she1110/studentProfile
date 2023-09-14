import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {Card, ConfigProvider, Input, Select, Space, Table,} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import {ColumnsType} from 'antd/es/table';

const {Search} = Input;
const {Option} = Select;
export type APP = {
  id: number;
  name: string;
  creator: string;
  creat_time: string;
  persons_info: string;
};

export type Props = {
  dispatch: Dispatch;
  UserActSorceList: APP[];
  StudentTotalScore: number;
  Tableloading: boolean;

  // picturelist: object[];
  // creatorlist: object[];
  // schoollist: object[];
  // unitlist: object[];
  // rolesbyunit: object[];
  // userbyroles: object[];
};

class ActivityScore extends Component<Props> {
  state = {
    // visible: false,
    // editvisible: false, //编辑modal
    // tag: false, //false BTN显示个人应用 true显示全部应用
    // pushTag: false, //是否显示推送用户
    studentnumber: '182513', //当前活动信息对应的学生学号
  };
  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'activity/getActSorceByUser',
        payload: {
          id: '182513',
        },
      });
    }
  };

  onSearch = (value: any) => {
    const {dispatch} = this.props;
    this.setState({
      studentnumber: value,
    });
    dispatch({
      type: 'activity/getActSorceByUser',
      payload: {
        id: value,
      },
    });
  };

  render() {
    const {dispatch, UserActSorceList, StudentTotalScore, Tableloading} =
      this.props;
    const {studentnumber} = this.state;
    const columns: ColumnsType<APP> = [
      {
        title: '活动ID',
        dataIndex: 'activityid',
        align: 'center',
      },
      {
        title: '活动名称',
        dataIndex: 'activityname',
        align: 'center',
      },

      {
        title: '活动时间',
        dataIndex: 'activitytime',
        align: 'center',
      },
      {
        title: '德',
        dataIndex: 'virtue',
        align: 'center',
      },
      {
        title: '智',
        dataIndex: 'wisdom',
        align: 'center',
      },
      {
        title: '体',
        dataIndex: 'sports',
        align: 'center',
      },
      {
        title: '美',
        dataIndex: 'art',
        align: 'center',
      },
      {
        title: '劳',
        dataIndex: 'labour',
        align: 'center',
      },
      {
        title: '得分',
        dataIndex: 'rewardresult',
        align: 'center',
      },
    ];

    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        <ConfigProvider locale={zhCN}>
          <Card
            title={
              '参加活动列表' +
              ' ' +
              '学号：' +
              studentnumber +
              ' ' +
              ' ' +
              '获得总学分' +
              ' ' +
              StudentTotalScore
            }
            extra={
              <Space>
                <Search
                  placeholder="学生学号"
                  onSearch={this.onSearch}
                  style={{width: 208}}
                />
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={UserActSorceList}
              rowKey={() => Math.random()}
              loading={Tableloading}
            />
          </Card>
        </ConfigProvider>
      </div>
    );
  }
}

export default connect(({activity, loading}: any) => ({
  ...activity,
  Tableloading: loading.effects['activity/getActSorceByUser'],
}))(ActivityScore);
