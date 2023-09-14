import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';

export type Props = {
  dispatch?: Dispatch;

  HullTree?: any;
  FirstLevelWarning?: any;
  HelpCandidate?: any;
  WarnQues?: any;
};
const {Option} = Select;

class ThirdWarning extends Component<Props> {
  state = {
    selectedRowKeys: [], // Check here to configure the default column

    FuzzyValue: [], //模糊查询的下拉框 班级
    addHelpVisible: false, //帮扶人modal 是否可见
    MessageListVisible: false, //消息列表modal 是否可见
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'studentwarning/getWarnListByType',
        payload: {
          warnlevel: '三级预警',
        },
      });
      dispatch({
        type: 'studentwarning/getWarnQues',
      });
      dispatch({
        type: 'user/getHullTree',
      });
    }
  };
  onSelectChange = (selectedRowKeys: any) => {
    // console.log(selectedRowKeys);
    this.setState({selectedRowKeys});
  };
  searchOnFinish = (value: any) => {
    console.log(value);
    if ('userid' in value && value.userid === '') {
      value.userid = undefined;
    }
    if ('username' in value && value.username === '') {
      value.username = undefined;
    }
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'studentwarning/getWarnListByType',
        payload: {
          warnlevel: '三级预警',
          ...value,
        },
      });
    }
  };
  //班级 模糊查询框
  handleSearch = (str: any) => {
    const {dispatch} = this.props;
    if (dispatch) {
      if (str) {
        dispatch({
          type: 'portrait/getLike',
          payload: {
            payload: {
              id: 10,
              str: str,
            },
            callback: (value: any) => {
              this.getLikeCallback(value);
            },
          },
        });
      }
    }
  };
  getLikeCallback = (value: any) => {
    this.setState({
      FuzzyValue: value,
    });
  };
  //添加帮扶人modal
  addHelpShowModal = () => {
    const {selectedRowKeys} = this.state;
    const {FirstLevelWarning} = this.props;
    if (selectedRowKeys.length !== 0) {
      console.log(selectedRowKeys);
      let selectedRowKeysTemp: any = [];
      selectedRowKeys.map((element: any, index: any) => {
        FirstLevelWarning?.map((elementsub: any, indexsub: any) => {
          if (elementsub.SEMEWARNID === element) {
            selectedRowKeysTemp.push(elementsub.USERID);
          }
        });
      });

      const {dispatch} = this.props;
      if (dispatch) {
        dispatch({
          type: 'studentwarning/getHelp',
          payload: selectedRowKeysTemp,
        });
      }
      this.setState({
        addHelpVisible: true,
      });
    } else {
      message.error('未选中学生，无法绑定帮扶人！！！');
    }
  };
  addHelpHandleOk = () => {
    const {selectedRowKeys} = this.state;
    const {FirstLevelWarning} = this.props;

    this.formRef.current
      ?.validateFields()
      .then((value: any) => {
        console.log(value);
        console.log(selectedRowKeys);

        let swIdsTemp: any = [];
        selectedRowKeys.map((element: any, index: any) => {
          FirstLevelWarning?.map((elementsub: any, indexsub: any) => {
            if (element === elementsub.USERID) {
              swIdsTemp.push(elementsub.SEMEWARNID);
            }
          });
        });
        console.log(swIdsTemp);

        const {dispatch} = this.props;
        if (dispatch) {
          dispatch({
            type: 'studentwarning/addHelp',
            payload: {
              helpuserid: value.helpPeople,
              swIds: selectedRowKeys,
            },
          })
            .then(() => {
              this.setState({
                addHelpVisible: false,
                selectedRowKeys: [],
              });
              this.formRef.current?.resetFields();
            })
            .then(() => {
              dispatch({
                type: 'studentwarning/getWarnListByType',
                payload: {
                  warnlevel: '三级预警',
                },
              });
            });
        }
      })
      .catch((info: any) => {
        message.info('请填写帮扶人！');
      });
  };
  addHelpHandleCancel = () => {
    this.setState({
      addHelpVisible: false,
    });
  };
  //消息列表MessageListVisible Modal
  MessageListShowModal = () => {
    this.setState({
      MessageListVisible: true,
    });
  };
  MessageListHandleOk = () => {
    this.setState({
      MessageListVisible: false,
    });
  };
  MessageListHandleCancel = () => {
    this.setState({
      MessageListVisible: false,
    });
  };

  //消息列表 确认
  okconfirm = (value: any) => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'studentwarning/handleWarnQues',
        payload: {
          warnQuesId: value.warnQuesId,
          flag: '2', //2是同意
        },
      }).then(() => {
        dispatch({
          type: 'studentwarning/getWarnListByType',
          payload: {
            warnlevel: '三级预警',
          },
        });
        dispatch({
          type: 'studentwarning/getWarnQues',
        });
      });
    }
  };
  //消息列表 取消
  cancelconfirm = (value: any) => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'studentwarning/handleWarnQues',
        payload: {
          warnQuesId: value.warnQuesId,
          flag: '3', //2是同意
        },
      }).then(() => {
        dispatch({
          type: 'studentwarning/getWarnListByType',
          payload: {
            warnlevel: '三级预警',
          },
        });
        dispatch({
          type: 'studentwarning/getWarnQues',
        });
      });
    }
  };

  render() {
    const {HullTree, FirstLevelWarning, HelpCandidate, WarnQues} = this.props;
    const {selectedRowKeys, FuzzyValue, addHelpVisible, MessageListVisible} =
      this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: '学号',
        dataIndex: 'USERID',
        key: 'USERID',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'USERNAME',
        key: 'USERNAME',
        align: 'center',
      },
      {
        title: '班级',
        dataIndex: 'CLASSNAME',
        key: 'CLASSNAME',
        align: 'center',
      },
      {
        title: '宿舍',
        dataIndex: 'DORMITORY',
        key: 'DORMITORY',
        align: 'center',
      },
      {
        title: '专业',
        dataIndex: 'MAJORNAME',
        key: 'MAJORNAME',
        align: 'center',
      },
      {
        title: '学院',
        dataIndex: 'UNITNAME',
        key: 'UNITNAME',
        align: 'center',
      },
      {
        title: '帮扶人',
        dataIndex: 'HELPNAME',
        key: 'HELPNAME',
        align: 'center',
      },
      {
        title: '辅导员',
        dataIndex: 'COUNSELORID',
        key: 'COUNSELORID',
        align: 'center',
      },
      {
        title: '挂科数目',
        dataIndex: 'FAIL_COUNT',
        key: 'FAIL_COUNT',
        align: 'center',
      },
      {
        title: '预警年份',
        dataIndex: 'WARN_YEAR',
        key: 'WARN_YEAR',
        align: 'center',
      },
      {
        title: '预警学期',
        dataIndex: 'WARN_SEASON',
        key: 'WARN_SEASON',
        align: 'center',
      },
      //   {
      //     title: '联系方式',
      //     dataIndex: 'phone',
      //     key: 'phone',
      //     align: 'center',
      //   },
      {
        title: '操作',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          return (
            <Space>
              {'HELP_USERID' in record ? (
                <Button type="link">
                  <Link to={{pathname: '/HelpDetails', state: {...record}}}>
                    帮扶详情
                  </Link>
                </Button>
              ) : (
                <Button type="link" disabled>
                  帮扶详情
                </Button>
              )}
            </Space>
          );
        },
      },
    ];
    const MessageListColumns = [
      {
        title: '问题编号',
        dataIndex: 'warnQuesId',
        key: 'warnQuesId',
        align: 'center',
      },
      {
        title: '提问人学号',
        dataIndex: 'applyUserid',
        key: 'applyUserid',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'applyUsername',
        key: 'applyUsername',
        align: 'center',
      },
      {
        title: '班级',
        dataIndex: 'className',
        key: 'className',
        align: 'center',
      },
      {
        title: '申诉项目',
        dataIndex: 'dormitory',
        key: 'dormitory',
        align: 'center',
      },
      {
        title: '申诉课程',
        dataIndex: 'courseName',
        key: 'courseName',
        align: 'center',
      },
      {
        title: '课程时间',
        dataIndex: 'courseTime',
        key: 'courseTime',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          return (
            <Space>
              <Popconfirm
                title="确认同意该申诉吗?"
                onConfirm={() => {
                  this.okconfirm(record);
                }}
                // onCancel={cancel}
                okText="确认"
                cancelText="取消"
              >
                <a href="#">同意</a>
              </Popconfirm>
              <Popconfirm
                title="确认拒绝该申诉吗?"
                onConfirm={() => {
                  this.cancelconfirm(record);
                }}
                // onCancel={cancel}
                okText="确认"
                cancelText="取消"
              >
                <a href="#">拒绝</a>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];
    return (
      <div>
        {/* <Button
                    onClick={() => {
                        console.log(selectedRowKeys);
                        console.log(FirstLevelWarning);
                        console.log(HelpCandidate);
                    }}
                >
                    测试
                </Button> */}
        <ConfigProvider locale={zhCN}>
          <Card
            title={'三级预警 学生名单'}
            style={{marginBottom: 30}}
            extra={
              <div>
                <Form layout={'inline'} onFinish={this.searchOnFinish}>
                  <Form.Item label="学号" name="userid">
                    <Input style={{width: 150}} allowClear={true}></Input>
                  </Form.Item>
                  <Form.Item label="姓名" name="username">
                    <Input style={{width: 120}} allowClear={true}></Input>
                  </Form.Item>
                  <Form.Item label="班级" name="classid">
                    <Select
                      placeholder="请输入班级"
                      showSearch
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onSearch={(str: any) => {
                        this.handleSearch(str);
                      }}
                      notFoundContent={null}
                      style={{width: 150}}
                      allowClear={true}
                    >
                      {FuzzyValue?.map((element: any, index: any) => {
                        return (
                          <Option key={index} value={element.VALUE}>
                            {element.LABEL}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item label="预警年份" name="warnyear">
                    <Select style={{width: 100}} allowClear={true}>
                      <Option value={'2017'}>2017</Option>
                      <Option value={'2018'}>2018</Option>
                      <Option value={'2019'}>2019</Option>
                      <Option value={'2020'}>2020</Option>
                      <Option value={'2021'}>2021</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="春秋" name="warnseason">
                    <Select style={{width: 100}} allowClear={true}>
                      <Option value={0}>春季</Option>
                      <Option value={1}>秋季</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={this.addHelpShowModal}>
                      添加帮扶人
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    {WarnQues ? (
                      <Button
                        type="primary"
                        onClick={this.MessageListShowModal}
                      >
                        消息列表
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={this.MessageListShowModal}
                        disabled
                      >
                        消息列表
                      </Button>
                    )}
                  </Form.Item>
                </Form>
              </div>
            }
          >
            <Table
              dataSource={FirstLevelWarning}
              rowSelection={rowSelection}
              columns={columns}
            />
          </Card>

          <Modal
            title="添加帮扶人"
            visible={addHelpVisible}
            onOk={this.addHelpHandleOk}
            onCancel={this.addHelpHandleCancel}
            forceRender
          >
            <span>
              正在为
              {selectedRowKeys.map((element: any, index: any) => {
                return (
                  <>
                    {FirstLevelWarning?.map(
                      (elementsub: any, indexsub: any) => {
                        if (elementsub.SEMEWARNID === element) {
                          if (index === selectedRowKeys.length - 1) {
                            console.log(elementsub.USERNAME);
                            return (
                              <span key={index}>{elementsub.USERNAME}</span>
                            );
                          } else {
                            console.log(elementsub.USERNAME);
                            return (
                              <span key={index}>{elementsub.USERNAME}、</span>
                            );
                          }
                        }
                      },
                    )}
                  </>
                );
              })}
              绑定帮扶人
            </span>
            <Divider></Divider>
            <Form
              name="绑定帮扶人"
              // layout="vertical"
              ref={this.formRef}
            >
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="帮扶人"
                    name="helpPeople"
                    rules={[{required: true, message: '请输入帮扶人'}]}
                  >
                    <Select style={{width: '100%'}}>
                      {HelpCandidate?.map((element: any, index: any) => {
                        return (
                          <Option value={element.USERID} key={index}>
                            {element.USERNAME}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>

          <Modal
            title="消息列表"
            visible={MessageListVisible}
            onOk={this.MessageListHandleOk}
            onCancel={this.MessageListHandleCancel}
            width={1200}
            footer={null}
          >
            <Table
              dataSource={WarnQues}
              columns={MessageListColumns}
              rowKey={(record) => record.warnQuesId}
            />
          </Modal>
        </ConfigProvider>
      </div>
    );
  }
}

export default connect(({loading, user, studentwarning}: any) => ({
  ...user,
  ...studentwarning,
}))(ThirdWarning);
