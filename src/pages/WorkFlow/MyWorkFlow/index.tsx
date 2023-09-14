import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
// import { connect } from 'dva';
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  Input,
  Modal,
  PageHeader,
  Radio,
  Row,
  Select,
  Space,
  Steps,
  Table,
  Tabs,
  Tag,
  Typography,
  Upload,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import {ColumnsType} from 'antd/es/table';

const {Search} = Input;
const {Option} = Select;
const {Panel} = Collapse;
const {TextArea} = Input;
const {RangePicker} = DatePicker;
const {TabPane} = Tabs;
const {Step} = Steps;
const {Paragraph} = Typography;

export type wfSteptempType = {
  workflowforms?: object[];
  remark?: string;
  approveroption?: object[];
};
export type APP = {
  wfId?: string;
  wfName?: string;
  wfUserId?: string;
  wfCreateTime?: string;
  wfBak?: string;
};
export type Props = {
  dispatch: Dispatch;
  workFlowList: object[];
  wfSteptemp: wfSteptempType[];
  columnTypeList: object[];
  dataTableList: object[];
  treeData: object[];
  myWorkFlowlist: object[];
  getOneTask: object[];
  nowStepInfotemp: object[];
  taskNowPosition: string;
  taskNametemp: string;
  taskIdtemp: string;
  AllOperation: object[];
  taskInfotemp: object[];
  pathtemp: string;
  needDealList: object[];
  doneList: object[];
  copyList: object[];
  needDoneCopyList: object[];
  location: any;
};

class WorkFlowManage extends Component<Props> {
  state = {
    workflowvisible: false, //workflow modal
    wfpreviewvisible: false, //workflow preview modal
    drawervisible: false, //Drawer
    wfSteptemp: [], //用于预览
    taskIdtemp: '', //整个流程实例的ID
    taskNametemp: '', //整个流程实例的名字
    taskFormtemp: [], //上一步流程的表单
    nowStepInfotemp: [], //当前这步流程的表单
    taskNowPosition: '', //当前第多少步
    taskInfotemp: [], //同意拒绝和备注的内容
    pathtemp: '', //path地址
    page: undefined, //从哪里进入当前页 显示哪个Tabs

    refusevisible: false, //refuse modal
    current: 0, //预览工作流类 标识步骤的
    refuseReason: '', //拒绝的原因
    refuseString: '', //拒绝的JSON
  };
  workflowRef = React.createRef<FormInstance>();
  wfpreviewRef = React.createRef<FormInstance>();
  workflowhandleRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch, location} = this.props;
    dispatch({
      type: 'workflow/getMyUserTask',
      payload: {
        state: ' ',
      },
    }); //待办

    dispatch({
      type: 'workflow/getMyUserTask',
      payload: {
        state: '0',
      },
    }); //待办
    dispatch({
      type: 'workflow/getMyUserTask',
      payload: {
        state: '1',
      },
    }); //已办
    dispatch({
      type: 'workflow/getMyUserTask',
      payload: {
        state: '2',
      },
    }); //抄送
    if (location.state) {
      this.setState({
        page: location.state.page,
      });
    } else {
      this.setState({
        page: '1',
      });
    }
  };
  //右侧抽屉 查看详情
  showDrawer = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'workflow/getOneTask',
      payload: {
        taskId: {taskId: value.taskId},
        callback: this.getOneTaskCallback,
      },
    });
    this.setState({
      drawervisible: true,
    });
  };
  drawerOnClose = () => {
    this.setState({
      drawervisible: false,
    });
  };
  getOneTaskCallback = (value: any) => {
    let taskFormtempCom: any = JSON.parse(value.task.taskForm);
    taskFormtempCom.map((element: any, index: any) => {
      if ('form' in element) {
        element.form.map((elementsub: any, indexsub: any) => {
          if (elementsub.columnType === '4') {
            let time1 = moment(JSON.parse(elementsub.value)[0]);
            let time2 = moment(JSON.parse(elementsub.value)[1]);
            let time: any = [];
            time.push(time1);
            time.push(time2);
            elementsub.value = time;
          }
          if (elementsub.name === 'path') {
            this.setState({
              pathtemp: elementsub.value,
            });
            delete element.form[indexsub];
          }
        });
      } else {
        element.form = [];
        element.index = element.index + '';
      }
    });

    this.setState({
      taskNowPosition: JSON.parse(value.task.taskNowPosition).index,
      taskFormtemp: taskFormtempCom,
      nowStepInfotemp: JSON.parse(value.nowStepInfo),
      taskNametemp: value.task.taskName,
      taskIdtemp: value.task.taskId,
      taskInfotemp: JSON.parse(value.task.taskInfo),
    });
  };
  //根据columnType显示不同录入组件
  whichOneComponent = (value: any, id: any, dataTable: any, edit: boolean) => {
    if (dataTable !== undefined) {
      let optionstemp: any = JSON.parse(dataTable);
      switch (value) {
        case '1':
          return <Input key={Math.random()} id={id} disabled={edit}/>;
        case '2':
          return (
            <Select
              key={Math.random()}
              id={id}
              style={{width: '100%'}}
              disabled={edit}
            >
              {optionstemp.map((element: any, index: any) => {
                return (
                  <Option value={element.ID} key={element.ID}>
                    {element.NAME}
                  </Option>
                );
              })}
            </Select>
          );
        case '3':
          return (
            <Radio.Group disabled={edit}>
              {optionstemp.map((element: any, index: any) => {
                return (
                  <Radio value={element.ID} key={element.ID}>
                    {element.NAME}
                  </Radio>
                );
              })}
            </Radio.Group>
          );
        case '4':
          return (
            <RangePicker key={Math.random()} id={id} disabled={edit} showTime/>
          );
        case '7':
          return <Checkbox key={Math.random()} id={id} disabled={edit}/>;
        case '5':
          return (
            <Upload key={Math.random()} id={id}>
              <Button type="link">点击上传</Button>
            </Upload>
          );
        default:
      }
    } else {
      switch (value) {
        case '1':
          return <Input key={Math.random()} id={id} disabled={edit}/>;
        case '2':
          return (
            <Select
              key={Math.random()}
              id={id}
              style={{width: '100%'}}
              disabled={edit}
            >
              {/* {
                                columnTypeList.map((element: any, index: any) => {
                                    return <Option value={element.ID} key={element.ID}>{element.REMARK}</Option>
                                })
                            } */}
            </Select>
          );
        case '3':
          return (
            <Radio.Group disabled={edit}>
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
            </Radio.Group>
          );
        case '4':
          return (
            <RangePicker key={Math.random()} id={id} disabled={edit} showTime/>
          );
        case '7':
          return <Checkbox key={Math.random()} id={id} disabled={edit}/>;
        case '5':
          return (
            <Upload key={Math.random()} id={id}>
              <Button type="link">点击上传</Button>
            </Upload>
          );
        default:
      }
    }
  };
  //工作流的开启/关闭
  closeOrOpen = (value: any, record: any) => {
    const {dispatch} = this.props;
    if (value) {
      dispatch({
        type: 'workflow/closeWorkFlow',
        payload: {
          workFlowId: record.wfId,
        },
      }).then(() => {
        dispatch({
          type: 'workflow/getAllWorkFlow',
        });
      });
    } else {
      dispatch({
        type: 'workflow/openWorkFlow',
        payload: {
          workFlowId: record.wfId,
        },
      }).then(() => {
        dispatch({
          type: 'workflow/getAllWorkFlow',
        });
      });
    }
  };

  //我的待办
  workFlowShowModal = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'workflow/getOneTask',
      payload: {
        taskId: {taskId: value.taskId},
        callback: this.getOneTaskCallback1,
      },
    });
    this.setState({
      workflowvisible: true,
    });
  };
  getOneTaskCallback1 = (value: any) => {
    let taskFormtempCom: any = JSON.parse(value.task.taskForm);
    taskFormtempCom.map((element: any, index: any) => {
      if ('form' in element) {
        element.form.map((elementsub: any, indexsub: any) => {
          if (elementsub.columnType === '4') {
            let time1 = moment(JSON.parse(elementsub.value)[0]);
            let time2 = moment(JSON.parse(elementsub.value)[1]);
            let time: any = [];
            time.push(time1);
            time.push(time2);
            elementsub.value = time;
          }
          if (elementsub.name === 'path') {
            this.setState({
              pathtemp: elementsub.value,
            });
            delete element.form[indexsub];
          }
        });
      } else {
        element.form = [];
        element.index = element.index + '';
      }
    });
    this.setState({
      taskNowPosition: JSON.parse(value.task.taskNowPosition).index,
      taskFormtemp: taskFormtempCom,
      nowStepInfotemp: JSON.parse(value.nowStepInfo),
      taskNametemp: value.task.taskName,
      taskIdtemp: value.task.taskId,
      taskInfotemp: JSON.parse(value.task.taskInfo),
    });
  };

  workFlowRefuse = (value: any) => {
    this.workflowhandleRef.current?.validateFields().then((values: any) => {
      this.refuseShowModal(values);
    });
    this.setState({workflowvisible: false});
  };
  workFlowHandleCancel = () => {
    this.setState({workflowvisible: false});
  };
  //我的待办 拒绝modal
  refuseShowModal = (values: any) => {
    const {getOneTask, dispatch} = this.props;
    values.taskId = getOneTask.task.taskId;
    let formtemp: any = JSON.parse(JSON.stringify(values));
    formtemp.nowOperation = {
      form: {},
      operation: '2',
      remark: '拒绝',
    };
    delete formtemp.operation;
    delete formtemp.remark;
    delete values.operation;
    delete values.remark;
    delete values.taskId;
    formtemp.nowOperation.form = values;
    this.setState({
      refuseString: formtemp,
    });
    this.setState({refusevisible: true});
  };

  workFlowHandleOk = () => {
    // console.log(JSON.stringify(this.workflowhandleRef.current?.getFieldsValue(true)));
    // //判断用户是否输入了审批表单项
    // if (JSON.stringify(this.workflowhandleRef.current?.getFieldsValue(true))
    //     && JSON.stringify(this.workflowhandleRef.current?.getFieldsValue(true)) === '{}') {
    //     message.info('请审批人输入审批选项！！！');
    //     return;
    // };
    this.workflowhandleRef.current?.validateFields().then((values: any) => {
      const {getOneTask, dispatch} = this.props;
      values.taskId = getOneTask.task.taskId;
      let formtemp: any = JSON.parse(JSON.stringify(values));
      formtemp.nowOperation = {
        form: {},
        operation: '1',
        remark: '同意',
      };
      delete formtemp.operation;
      delete formtemp.remark;
      delete values.operation;
      delete values.remark;
      delete values.taskId;
      formtemp.nowOperation.form = values;
      this.setState({
        workflowvisible: false,
      });
      dispatch({
        type: 'workflow/updateTask',
        payload: formtemp,
      }).then(() => {
        dispatch({
          type: 'workflow/getMyUserTask',
          payload: {
            state: ' ',
          },
        }); //待办
        dispatch({
          type: 'workflow/getMyUserTask',
          payload: {
            state: '0',
          },
        }); //待办
        dispatch({
          type: 'workflow/getMyUserTask',
          payload: {
            state: '1',
          },
        }); //已办
        dispatch({
          type: 'workflow/getMyUserTask',
          payload: {
            state: '2',
          },
        }); //抄送
      });
    });
    this.setState({workflowvisible: false});
  };
  refuseHandleOk = () => {
    const {dispatch} = this.props;
    const {refuseReason, refuseString} = this.state;
    let refuseReasontemp: any = JSON.parse(JSON.stringify(refuseString));
    refuseReasontemp.remark = refuseReason;
    dispatch({
      type: 'workflow/updateTask',
      payload: refuseReasontemp,
    }).then(() => {
      dispatch({
        type: 'workflow/getMyUserTask',
        payload: {
          state: ' ',
        },
      }); //待办
      dispatch({
        type: 'workflow/getMyUserTask',
        payload: {
          state: '0',
        },
      }); //待办
      dispatch({
        type: 'workflow/getMyUserTask',
        payload: {
          state: '1',
        },
      }); //已办
      dispatch({
        type: 'workflow/getMyUserTask',
        payload: {
          state: '2',
        },
      }); //抄送
    });
    this.setState({refusevisible: false});
  };
  refuseHandleCancel = () => {
    this.setState({workflowvisible: true});
    this.setState({refusevisible: false});
  };

  //收集拒绝的原因
  refuseReason = (event: any) => {
    const value = event.target.value;
    this.setState({
      refuseReason: value,
    });
  };

  render() {
    const {needDealList, doneList, copyList, needDoneCopyList} = this.props;
    const {
      workflowvisible,
      wfSteptemp,
      taskIdtemp,
      taskNametemp,
      taskNowPosition,
      taskFormtemp,
      nowStepInfotemp,
      taskInfotemp,
      pathtemp,
      page,
      drawervisible,
      refusevisible,
    } = this.state;
    const workFlowColumns: ColumnsType<APP> = [
      {
        title: '流程实例ID',
        dataIndex: 'taskId',
        align: 'center',
      },
      {
        title: '流程名称',
        dataIndex: 'taskName',
        align: 'center',
      },
      {
        title: '抄送人',
        dataIndex: 'userAccount',
        align: 'center',
      },
      {
        title: '流程创建时间',
        dataIndex: 'createDate',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (text !== null) {
            return <span>{moment(text).format('YYYY-MM-DD')}</span>;
          } else {
            return <span></span>;
          }
        },
      },
      {
        title: '办理状态',
        dataIndex: 'state',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (text == '0') {
            return <Tag color="#108ee9">待办</Tag>;
          } else if (text == '1') {
            return <Tag color="#87d068">已办</Tag>;
          } else if (text == '2') {
            return <Tag color="#87d068">抄送</Tag>;
          }
        },
      },
      {
        title: '工作流状态',
        dataIndex: 'taskState',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (text == '0') {
            return (
              <Tag icon={<CloseCircleOutlined/>} color="error">
                拒绝
              </Tag>
            );
          } else if (text == '1') {
            return (
              <Tag icon={<SyncOutlined spin/>} color="processing">
                正常
              </Tag>
            );
          } else if (text == '2') {
            return (
              <Tag icon={<CheckCircleOutlined/>} color="success">
                完成
              </Tag>
            );
          } else if (text == '3') {
            return (
              <Tag icon={<ExclamationCircleOutlined/>} color="warning">
                失效
              </Tag>
            );
          } else if (text == '4') {
            return (
              <Tag icon={<ClockCircleOutlined/>} color="default">
                过期
              </Tag>
            );
          }
        },
      },
      {
        title: '类型',
        dataIndex: 'type',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (text == 'flow') {
            return <span>工作流</span>;
          } else if (text == '1') {
            return (
              <Tag icon={<SyncOutlined spin/>} color="processing">
                正常
              </Tag>
            );
          } else if (text == '2') {
            return (
              <Tag icon={<CheckCircleOutlined/>} color="success">
                完成
              </Tag>
            );
          } else if (text == '3') {
            return <span>失效</span>;
          } else if (text == '4') {
            return <span>过期</span>;
          }
        },
      },

      {
        title: '操作',
        dataIndex: 'english',
        align: 'center',
        render: (text: any, record: any) => {
          const handle = record.state === '0';
          return (
            <Space>
              <Button
                type="link"
                onClick={() => {
                  this.showDrawer(record);
                }}
              >
                查看
              </Button>
              {handle ? (
                <Button
                  type="link"
                  onClick={() => {
                    this.workFlowShowModal(record);
                  }}
                >
                  审批
                </Button>
              ) : null}

              <Button type="link" onClick={() => {
              }} disabled>
                删除
              </Button>
            </Space>
          );
        },
      },
    ];

    const content = (
      <>
        <Paragraph>
          事务管理实现电子化审批流程、沟通协作、考勤等业务，实现无纸化办公。
        </Paragraph>
        <Paragraph>
          有助于实现单位内部的协同管理，提升人与人、部门与部门之间的管理和办公效率。
        </Paragraph>
        <Paragraph>
          涵盖了单位内部的沟通与协作、信息与资料的共享、文档管理、工作流程(各类请示、汇报、审批)等内容。
        </Paragraph>
      </>
    );

    const Content = ({children, extraContent}: any) => (
      <Row>
        <div style={{flex: 1}}>{children}</div>
        <div className="image">{extraContent}</div>
      </Row>
    );

    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        <div style={{marginBottom: 30, backgroundColor: 'white'}}>
          <PageHeader
            title="事务管理"
            subTitle="办公自动化"
            tags={<Tag color="blue">运行中</Tag>}
            avatar={{src: require('@/assets/picture/事务.png')}}
          >
            <Content>{content}</Content>
          </PageHeader>
        </div>
        <ConfigProvider locale={zhCN}>
          {page ? (
            <Card>
              <Tabs defaultActiveKey={page}>
                <TabPane tab="全部" key="1">
                  <Card>
                    <Table
                      columns={workFlowColumns}
                      dataSource={needDoneCopyList}
                      rowKey={() => Math.random()}
                      style={{height: '800px'}}
                    />
                  </Card>
                </TabPane>
                <TabPane tab="待处理" key="2">
                  <Card>
                    <Table
                      columns={workFlowColumns}
                      dataSource={needDealList}
                      rowKey={() => Math.random()}
                      style={{height: '800px'}}
                    />
                  </Card>
                </TabPane>
                <TabPane tab="已处理" key="3">
                  <Card>
                    <Table
                      columns={workFlowColumns}
                      dataSource={doneList}
                      rowKey={() => Math.random()}
                      style={{height: '800px'}}
                    />
                  </Card>
                </TabPane>
                <TabPane tab="我收到的" key="4">
                  <Card>
                    <Table
                      columns={workFlowColumns}
                      dataSource={copyList}
                      rowKey={() => Math.random()}
                      style={{height: '800px'}}
                    />
                  </Card>
                </TabPane>
              </Tabs>
            </Card>
          ) : (
            <></>
          )}

          <Drawer
            title={taskNametemp}
            placement="top"
            onClose={this.drawerOnClose}
            visible={drawervisible}
            height="360px"
          >
            <Descriptions bordered size={'small'}>
              {taskFormtemp.length !== 0
                ? taskFormtemp.map((element: any, index: any) => {
                  return (
                    <>
                      {element.form.length !== 0 ? (
                        <>
                          {element.form.map(
                            (elementsub: any, indexsub: any) => {
                              return (
                                <>
                                  {'type' in elementsub &&
                                  elementsub.type === 'file' ? (
                                    <Descriptions.Item
                                      label={elementsub.name}
                                    >
                                      <Button
                                        type="link"
                                        onClick={() => {
                                          const {dispatch} = this.props;
                                          dispatch({
                                            type: 'workflow/downloadFile',
                                            payload: {
                                              path: pathtemp,
                                            },
                                          });
                                        }}
                                      >
                                        下载{elementsub.name}
                                      </Button>
                                    </Descriptions.Item>
                                  ) : (
                                    <Descriptions.Item
                                      label={elementsub.name}
                                    >
                                      {elementsub.value}
                                    </Descriptions.Item>
                                  )}
                                </>
                              );
                            },
                          )}
                        </>
                      ) : null}
                    </>
                  );
                })
                : null}
            </Descriptions>
            {taskInfotemp && taskInfotemp.length !== 0 ? (
              <Card
                key={Math.random()}
                style={{borderRadius: 20, marginTop: 10}}
              >
                <Steps current={parseInt(taskNowPosition) - 1}>
                  {taskInfotemp.map((element: any, index: any) => {
                    // console.log(element);
                    let operation: any = '';
                    if (element.operation) {
                      operation = element.operation;
                    }
                    let time: any = '';
                    if (element.time) {
                      time = element.time;
                    }
                    let statustemp: any = undefined;
                    if (
                      operation === '同意' ||
                      operation === '发起' ||
                      operation === '抄送'
                    ) {
                      statustemp = 'finish';
                    }
                    if (operation === '拒绝') {
                      statustemp = 'error';
                    }
                    return (
                      <Step
                        title={element.name}
                        description={
                          <>
                            <Row>{element.id + '：' + operation}</Row>
                            <Row>{time}</Row>
                          </>
                        }
                        status={statustemp ? statustemp : 'wait'}
                      />
                    );
                  })}
                </Steps>
              </Card>
            ) : (
              <></>
            )}
          </Drawer>

          {/* 我的待办 处理流程 */}
          <Modal
            title={taskNametemp}
            visible={workflowvisible}
            // onOk={this.workFlowHandleOk}
            onCancel={this.workFlowHandleCancel}
            width="1000px"
            // okText="同意"
            // cancelText="拒绝"
            footer={[
              <Button key="cancel" onClick={this.workFlowHandleCancel}>
                取消
              </Button>,
              <Button key="refuse" type="primary" onClick={this.workFlowRefuse}>
                拒绝
              </Button>,
              <Button
                key="agree"
                type="primary"
                onClick={this.workFlowHandleOk}
              >
                同意
              </Button>,
            ]}
          >
            {taskFormtemp.length !== 0
              ? taskFormtemp.map((element: any, index: any) => {
                return (
                  <>
                    {element.form.length !== 0 ? (
                      <Descriptions bordered size={'small'}>
                        {element.form.map(
                          (elementsub: any, indexsub: any) => {
                            return (
                              <>
                                {'type' in elementsub &&
                                elementsub.type === 'file' ? (
                                  <Descriptions.Item label={elementsub.name}>
                                    <Button
                                      type="link"
                                      onClick={() => {
                                        const {dispatch} = this.props;
                                        dispatch({
                                          type: 'workflow/downloadFile',
                                          payload: {
                                            path: pathtemp,
                                          },
                                        });
                                      }}
                                    >
                                      下载{elementsub.name}
                                    </Button>
                                  </Descriptions.Item>
                                ) : (
                                  <Descriptions.Item label={elementsub.name}>
                                    {elementsub.value}
                                  </Descriptions.Item>
                                )}
                              </>
                            );
                          },
                        )}
                      </Descriptions>
                    ) : null}
                  </>
                );
              })
              : null}
            {nowStepInfotemp && nowStepInfotemp.length !== 0 ? (
              <Collapse style={{marginTop: 10}}>
                <Panel header="审批人需要填写" key="1" forceRender>
                  <Form
                    key={Math.random()}
                    // onFinish={this.workFlowOnFinish}
                    ref={this.workflowhandleRef}
                    layout="inline"
                  >
                    {nowStepInfotemp && nowStepInfotemp.length !== 0 ? (
                      nowStepInfotemp.map((element: any, index: any) => {
                        return (
                          <Form.Item
                            key={Math.random()}
                            label={element.columnName}
                            name={element.columnName}
                            rules={[
                              {
                                required: true,
                                message: '请输入' + element.columnName,
                              },
                            ]}
                            initialValue={' '}
                          >
                            {this.whichOneComponent(
                              element.columnType,
                              Math.random(),
                              element.dataTable,
                              false,
                            )}
                          </Form.Item>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </Form>
                </Panel>
              </Collapse>
            ) : (
              <Form key={Math.random()} ref={this.workflowhandleRef}>
                {' '}
              </Form>
            )}
            {taskInfotemp && taskInfotemp.length !== 0 ? (
              <Card key={Math.random()} style={{marginTop: 10}}>
                <Steps current={parseInt(taskNowPosition) - 1}>
                  {taskInfotemp.map((element: any, index: any) => {
                    let operation: any = '';
                    if (element.operation) {
                      operation = element.operation;
                    }
                    let time: any = '';
                    if (element.time) {
                      time = element.time;
                    }
                    let statustemp: any = undefined;
                    if (
                      operation === '同意' ||
                      operation === '发起' ||
                      operation === '抄送'
                    ) {
                      statustemp = 'finish';
                    }
                    if (operation === '拒绝') {
                      statustemp = 'error';
                    }
                    return (
                      <Step
                        title={element.name}
                        description={
                          <>
                            <Row>{element.id + '：' + operation}</Row>
                            <Row>{time}</Row>
                          </>
                        }
                        status={statustemp ? statustemp : 'wait'}
                      />
                    );
                  })}
                </Steps>
              </Card>
            ) : (
              <></>
            )}
          </Modal>

          <Modal
            title="拒绝理由"
            visible={refusevisible}
            onOk={this.refuseHandleOk}
            onCancel={this.refuseHandleCancel}
          >
            <TextArea
              rows={4}
              onChange={(value: any) => this.refuseReason(value)}
            />
          </Modal>
        </ConfigProvider>
      </div>
    );
  }
}

export default connect(({workflow, role, user}: any) => ({
  ...workflow,
  ...role,
  ...user,
}))(WorkFlowManage);
