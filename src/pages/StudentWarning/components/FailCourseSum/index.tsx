import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {Button, Card, ConfigProvider, Form, Input, Modal, Select, Spin, Table,} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';

export type Props = {
  dispatch: Dispatch;
  AllFailTests?: object[];
  allLoading?: boolean;
  dormitoryReport?: any;
  getUserId?: any;
  phoneAndEmail?: any;
  DormName?: any;
};
const {Option} = Select;

class FailCourseSum extends Component<Props> {
  state = {
    modalVisible: false, //联系方式 是否弹出
    modalTitle: '', //modal标题
    selectedRowKeys: [], // Check here to configure the default column

    tag: 'GPA', // GPA和五育联合图 X轴是什么

    //累计挂科
    FuzzyValueClass: [], //模糊查询的下拉框--班级
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'studentwarning/getAllFailTests',
        payload: {},
      });
    }
  };

  searchOnFinish = (value: any) => {
    console.log(value);
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'studentwarning/getAllFailTests',
        payload: {
          userId: value.userId ? value.userId : undefined,
          name: value.name ? value.name : undefined,
          classId: value.classId ? value.classId : undefined,
        },
      });
    }
  };
  resetSearchForm = () => {
    this.formRef.current?.resetFields();
    this.props.dispatch({
      type: 'studentwarning/getAllFailTests',
      payload: {},
    });
  };

  //班级 模糊查询框
  handleclassSearch = (str: any) => {
    console.log(str);
    const {dispatch} = this.props;
    if (str) {
      dispatch({
        type: 'competition/getLike',
        payload: {
          payload: {
            id: 10,
            str: str,
          },
          callback: (value: any) => {
            this.getLikeCallbackclass(value);
          },
        },
      });
    }
  };
  getLikeCallbackclass = (value: any) => {
    this.setState({
      FuzzyValueClass: value,
    });
  };

  onExpand = (expanded: any, record: any) => {
    const rid = record.id;
  };

  render() {
    const {allLoading, AllFailTests, getUserId, phoneAndEmail} = this.props;
    const {modalVisible, modalTitle, selectedRowKeys, tag, FuzzyValueClass} =
      this.state;
    const gradeOption = (
      <>
        <Option value={5}>优秀</Option>
        <Option value={4}>良好</Option>
        <Option value={3}>中等</Option>
        <Option value={2}>合格</Option>
        <Option value={1}>不合格</Option>
      </>
    );

    const columns2 = [
      {title: '姓名', dataIndex: 'name', key: 'name', align: 'center'},
      {
        title: '学号',
        dataIndex: 'platform',
        key: 'platform',
        align: 'center',
      },
      {title: '班级', dataIndex: 'version', key: 'version', align: 'center'},
      {
        title: '累计挂科数',
        dataIndex: 'creator',
        key: 'creator',
        align: 'center',
      },
      // {
      //   title: '帮扶情况',
      //   align: 'center',
      //   render: (text: any, record: any, index: any) => {
      //     return (
      //       <Space>
      //         <Button type="link">
      //           <Link to={{ pathname: '/HelpDetails', state: { ...record } }}>
      //             查看
      //           </Link>
      //         </Button>
      //       </Space>
      //     );
      //   },
      // },
    ];
    const failtestsColumn = [
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
        width: 120,
      },
      {
        title: '学号',
        dataIndex: 'userId',
        key: 'userId',
        align: 'center',
        width: 120,
      },
      {
        title: '班级',
        dataIndex: 'className',
        key: 'className',
        align: 'center',
        width: 120,
      },
      {
        title: '累计挂科数',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
        width: 120,
      },
      // {
      //   title: '帮扶情况',
      //   align: 'center',
      //   render: (text: any, record: any, index: any) => {
      //     return (
      //       <Space>
      //         <Button type="link">
      //           <Link to={{ pathname: '/HelpDetails', state: { ...record } }}>
      //             查看
      //           </Link>
      //         </Button>
      //       </Space>
      //     );
      //   },
      // },
    ];
    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        name: '张三',
        platform: '2021263',
        version: '数据211',
        creator: '3科',
      });
    }
    //data = this.props.AllFailTests.detail;
    const expandedRowRender = (record: any) => {
      const failTestsDetail = [
        {
          title: '学期',
          dataIndex: 'YEARANDSEME',
          key: 'YEARANDSEME',
          align: 'center',
        },
        {
          title: '课程名称',
          dataIndex: 'EXAMCOURSENAME',
          key: 'EXAMCOURSENAME',
          align: 'center',
        },
        {
          title: '课程编号',
          dataIndex: 'COURSEID',
          key: 'COURSEID',
          align: 'center',
        },
      ];
      return (
        <Table
          columns={failTestsDetail}
          dataSource={record.detail}
          pagination={false}
          showHeader={false}
        />
      );
    };
    return (
      <div>
        <ConfigProvider locale={zhCN}>
          <Spin spinning={allLoading ? allLoading : false}>
            <Card
              title={'学生累计挂科'}
              style={{marginBottom: 30}}
              extra={
                <div>
                  <Form layout={'inline'} onFinish={this.searchOnFinish}>
                    <Form.Item label="学号" name="userId">
                      <Input style={{width: 120}}></Input>
                    </Form.Item>
                    <Form.Item label="姓名" name="name">
                      <Input style={{width: 120}}></Input>
                    </Form.Item>
                    {/* 模糊查询 */}
                    <Form.Item label="班级" name="classId">
                      <Select
                        showSearch
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onSearch={(str: any) => {
                          this.handleclassSearch(str);
                        }}
                        notFoundContent={null}
                        style={{width: 190}}
                      >
                        {FuzzyValueClass?.map((element: any, index: any) => {
                          return (
                            <Option key={index} value={element.VALUE}>
                              {element.LABEL}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" onClick={this.resetSearchForm}>
                        重置
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              }
            >
              <Table
                bordered={true}
                // dataSource={data}
                dataSource={AllFailTests}
                expandedRowRender={(record) => expandedRowRender(record)}
                rowKey="userId"
                columns={failtestsColumn}
              />
            </Card>
          </Spin>
        </ConfigProvider>

        <Modal
          title={modalTitle + ' ' + '联系方式'}
          visible={modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          forceRender
        >
          <Form
            name="basic"
            labelCol={{span: 4}}
            wrapperCol={{span: 18}}
            ref={this.formRef}
          >
            <Form.Item label="手机" name="phone">
              <Input/>
            </Form.Item>

            <Form.Item label="邮箱" name="email">
              <Input/>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default connect(
  ({studentwarning, competition, loading, user}: any) => ({
    ...studentwarning,
    ...competition,
    ...user,
    allLoading: loading.effects['studentwarning/getAllFailTests'],
  }),
)(FailCourseSum);
