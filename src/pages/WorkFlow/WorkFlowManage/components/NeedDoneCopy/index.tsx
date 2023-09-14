import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Steps,
  Table,
  Upload,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import ProCard from '@ant-design/pro-card';

const {Search} = Input;
const {Option} = Select;
const {Panel} = Collapse;
const {TextArea} = Input;
const {RangePicker} = DatePicker;
const {Step} = Steps;

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
  tag: number;
  tags: number[];
  roleList: object[];
  // allapplist: APP[];
  // picturelist: object[];
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
};

class NeedDoneCopy extends Component<Props> {
  state = {
    workflowvisible: false, //workflow modal
    donevisible: false, //donelist modal
    copyvisible: false, //copylist modal
    refusevisible: false, //refuse modal

    wfSteptemp: [], //用于预览
    taskIdtemp: '', //整个流程实例的ID
    taskNametemp: '', //整个流程实例的名字
    taskFormtemp: [], //上一步流程的表单
    nowStepInfotemp: [], //当前这步流程的表单
    taskNowPosition: '', //当前第多少步
    taskInfotemp: [], //同意拒绝和备注的内容
    pathtemp: '', //path地址
    current: 0, //预览工作流类 标识步骤的
    refuseReason: '', //拒绝的原因
    refuseString: '', //拒绝的JSON
  };
  workflowhandleRef = React.createRef<FormInstance>();
  wfpreviewRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'workflow/getAllOperation',
    });
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
  refuseHandleCancel = () => {
    this.setState({workflowvisible: true});
    this.setState({refusevisible: false});
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
      message.info('提交成功！！！');
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
    });
    this.setState({refusevisible: false});
  };

  //我的抄送modal
  copyShowModal = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'workflow/getOneTask',
      payload: {
        taskId: {taskId: value.taskId},
        callback: this.getOneTaskCallback,
      },
    });
    this.setState({copyvisible: true});
  };
  copyHandleCancel = () => {
    this.setState({copyvisible: false});
  };
  copyHandleOk = () => {
    this.setState({copyvisible: false});
  };

  //我的待办
  workFlowShowModal = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'workflow/getOneTask',
      payload: {
        taskId: {taskId: value.taskId},
        callback: this.getOneTaskCallback,
      },
    });

    this.setState({
      workflowvisible: true,
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

  workFlowRefuse = (value: any) => {
    this.workflowhandleRef.current?.validateFields().then((values: any) => {
      this.refuseShowModal(values);
    });
    this.setState({workflowvisible: false});
  };
  workFlowHandleCancel = () => {
    this.setState({workflowvisible: false});
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
      // console.log(formtemp);

      dispatch({
        type: 'workflow/updateTask',
        payload: formtemp,
      }).then(() => {
        message.info('提交成功！！！');
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
      });
    });
    this.setState({workflowvisible: false});
  };
  //收集拒绝的原因
  refuseReason = (event: any) => {
    const value = event.target.value;
    this.setState({
      refuseReason: value,
    });
  };
  //循环出表单项
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
                  <Option value={element.KEY} key={index}>
                    {element.VALUE}
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
                  <Radio value={element.KEY} key={index}>
                    {element.VALUE}
                  </Radio>
                );
              })}
            </Radio.Group>
          );
        case '4':
          return <RangePicker key={Math.random()} id={id} disabled={edit}/>;
        case '7':
          return <Checkbox key={Math.random()} id={id} disabled={edit}/>;
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
              <Radio value={1}>无值</Radio>
              <Radio value={2}>无值</Radio>
            </Radio.Group>
          );
        case '4':
          return <RangePicker key={Math.random()} id={id} disabled={edit}/>;
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
  //我的已办
  doneListShowModal = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'workflow/getOneTask',
      payload: {
        taskId: {taskId: value.taskId},
        callback: this.getOneTaskCallback,
      },
    });
    this.setState({
      donevisible: true,
    });
  };
  doneListHandleOk = () => {
    this.setState({
      donevisible: false,
    });
  };
  doneListHandleCancel = () => {
    this.setState({
      donevisible: false,
    });
  };
  doneListOnFinish = (value: any) => {
    console.log(value);
  };

  render() {
    const {needDealList, doneList, copyList} = this.props;
    const {
      workflowvisible,
      taskNametemp,
      taskNowPosition,
      taskFormtemp,
      nowStepInfotemp,
      taskInfotemp,
      pathtemp,
      donevisible,
      copyvisible,
      refusevisible,
    } = this.state;

    const needDealColumns = [
      {
        title: '待办事务',
        dataIndex: 'taskName',
        key: 'taskName',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: (text: any) => {
          return <span>{moment(text).format('YYYY-MM-DD')}</span>;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text: any, record: any) => {
          return (
            <Space>
              <a onClick={() => this.workFlowShowModal(record)}>查看</a>
            </Space>
          );
        },
      },
    ];
    const doneListColumns = [
      {
        title: '已办事务',
        dataIndex: 'taskName',
        key: 'taskName',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: (text: any) => {
          return <span>{moment(text).format('YYYY-MM-DD')}</span>;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text: any, record: any) => {
          return (
            <Space>
              <a
                onClick={() => {
                  this.doneListShowModal(record);
                }}
              >
                查看
              </a>
            </Space>
          );
        },
      },
    ];
    const copyListColumns = [
      {
        title: '抄送事务',
        dataIndex: 'taskName',
        key: 'taskName',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: (text: any) => {
          return <span>{moment(text).format('YYYY-MM-DD')}</span>;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text: any, record: any) => {
          return (
            <Space>
              <a
                onClick={() => {
                  this.copyShowModal(record);
                }}
              >
                查看
              </a>
            </Space>
          );
        },
      },
    ];
    return (
      <ConfigProvider locale={zhCN}>
        <ProCard
          // title="左右分栏带标题"
          // extra="2019年9月28日"
          split={'vertical'}
          bordered
          headerBordered
          style={{
            marginTop: 10,
          }}
        >
          <ProCard
            title="我的待办（Top5）"
            colSpan="50%"
            extra={
              <Link
                to={{pathname: '/WorkFlow/MyWorkFlow', state: {page: '2'}}}
              >
                更多
              </Link>
            }
          >
            <div style={{height: 250}}>
              <Table
                size="small"
                dataSource={needDealList.slice(0, 5)}
                columns={needDealColumns}
                pagination={{
                  hideOnSinglePage: true,
                  pageSize: 6,
                }}
                rowKey={'taskId'}
              />
            </div>
          </ProCard>
          <ProCard
            title="我的已办（Top5）"
            colSpan="50%"
            extra={
              <Link
                to={{pathname: '/WorkFlow/MyWorkFlow', state: {page: '3'}}}
              >
                更多
              </Link>
            }
          >
            <div style={{height: 250}}>
              <Table
                size="small"
                dataSource={doneList.slice(0, 5)}
                columns={doneListColumns}
                pagination={{
                  hideOnSinglePage: true,
                  pageSize: 6,
                }}
                rowKey={'taskId'}
              />
            </div>
          </ProCard>
        </ProCard>

        <ProCard split={'vertical'} bordered headerBordered>
          <ProCard
            title="我的抄送（Top5）"
            extra={
              <Link
                to={{pathname: '/WorkFlow/MyWorkFlow', state: {page: '4'}}}
              >
                更多
              </Link>
            }
          >
            <div style={{height: 250}}>
              <Table
                size="small"
                dataSource={copyList.slice(0, 5)}
                columns={copyListColumns}
                pagination={{
                  hideOnSinglePage: true,
                  pageSize: 6,
                }}
                rowKey={'taskId'}
              />
            </div>
          </ProCard>
        </ProCard>
        <br/>
        {/* 我的已办 */}
        <Modal
          title={taskNametemp}
          visible={donevisible}
          onOk={this.doneListHandleOk}
          onCancel={this.doneListHandleCancel}
          width="1000px"
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
                      </>
                    ) : null}
                  </>
                );
              })
              : null}
          </Descriptions>
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
            <Button key="agree" type="primary" onClick={this.workFlowHandleOk}>
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
                      {element.form.map((elementsub: any, indexsub: any) => {
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
                      })}
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

        {/* 我的抄送 */}
        <Modal
          title={taskNametemp}
          visible={copyvisible}
          onOk={this.copyHandleOk}
          onCancel={this.copyHandleCancel}
          width="1000px"
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
    );
  }
}

export default connect(({workflow, role, user, countersign}: any) => ({
  ...workflow,
  ...role,
  ...user,
  ...countersign,
}))(NeedDoneCopy);
