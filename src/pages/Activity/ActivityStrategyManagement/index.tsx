import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {
  Button,
  Card,
  Col,
  Collapse,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  PageHeader,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import {DeleteOutlined, MinusCircleOutlined, PlusOutlined, RedoOutlined, SearchOutlined,} from '@ant-design/icons';
import moment from 'moment';
import {ColumnsType} from 'antd/es/table';

const {Search} = Input;
const {Panel} = Collapse;
const {TextArea} = Input;
const {Option} = Select;
const {RangePicker} = DatePicker;
const {Paragraph} = Typography;

export type Props = {
  dispatch: Dispatch;
  strategylist: TableType[]; //策略列表
  conditionlist: object[]; //评价指标列表
  Tableloading: boolean;
  picturelist: object[]; //画像列表
  rolelist: object[]; //角色列表
  calculateloading: boolean;
};

interface TableType {
  key: number;
  id: number;
  name: string;
  conditions: Array<object>;
  creator: string;
  jobs: Array<object>;
  remark: string;
  strategy_time: string;
  temp: string;
}

let tempClusterOrRole: any = [];

class ActivityStrategyManagement extends Component<Props> {
  state = {
    selectVisible: false, //二选一modal
    visible: false, //自定义策略modal
    solicitationVisible: false, //征集策略modal
    editvisible: false, //编辑自定义创建modal
    solicitationEditVisible: false, //编辑征集创建modal
    clusterOrRole: [], //征集范围是角色或者分群
  };
  strategyBySelf = React.createRef<FormInstance>();
  strategyByCollect = React.createRef<FormInstance>();
  formRef = React.createRef<FormInstance>();
  solicitationformRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'strategy/getAllStrategy',
        payload: {type: '1'},
      });
      dispatch({
        type: 'strategy/getAllCondition',
        payload: {type: '1'},
      });
      dispatch({
        type: 'strategy/getAll',
      });
      dispatch({type: 'strategy/findrole'});
    }
  };

  showModal = () => {
    this.setState({visible: true});
    this.setState({selectVisible: false});
  };
  handleCancel = () => {
    this.setState({visible: false});
    this.strategyBySelf.current?.resetFields();
  };
  handleOk = () => {
    this.setState({visible: false});
  };
  solicitationshowModal = () => {
    this.setState({solicitationVisible: true});
    this.setState({selectVisible: false});
  };
  solicitationhandleCancel = () => {
    this.setState({solicitationVisible: false});
    this.strategyByCollect.current?.resetFields();
  };
  solicitationhandleOk = () => {
    this.setState({solicitationVisible: false});
  };
  solicitationEditshowModal = (value: any) => {
    let time: any = [];
    time[0] = moment(value.strategyBegintime);
    time[1] = moment(value.strategyEndtime);
    let valuetemp: any = JSON.parse(JSON.stringify(value));
    valuetemp.time = time;
    valuetemp.strategyGroup = JSON.parse(valuetemp.groupId);
    let tempClusterOrRole: any = [];
    valuetemp.strategyGroup.map((element: any, index: any) => {
      tempClusterOrRole[index] = element.type;
    });
    this.setState({
      clusterOrRole: tempClusterOrRole,
    });
    this.solicitationformRef.current?.resetFields();
    this.solicitationformRef.current?.setFieldsValue(valuetemp);
    this.formRef.current?.setFieldsValue({
      strategyId: value.strategyId,
    });
    this.setState({solicitationEditVisible: true});
  };
  solicitationEdithandleCancel = () => {
    this.setState({solicitationEditVisible: false});
  };
  solicitationEdithandleOk = () => {
    this.setState({solicitationEditVisible: false});
  };
  selectshowModal = () => {
    this.setState({selectVisible: true});
  };
  selecthandleOk = () => {
    this.setState({selectVisible: false});
  };
  selecthandleCancel = () => {
    this.setState({selectVisible: false});
  };
  editshowModal = (value: any) => {
    this.formRef.current?.resetFields();
    // let edit = JSON.parse(value.temp);
    this.formRef.current?.setFieldsValue(value);
    this.formRef.current?.setFieldsValue({
      strategyId: value.strategyId,
    });
    this.setState({editvisible: true});
  };
  edithandleCancel = () => {
    this.setState({editvisible: false});
  };
  edithandleOk = () => {
    this.setState({editvisible: false});
  };
  standardFormat = (values: any) => {
    const {conditionlist} = this.props;
    let param = {
      name: '',
      creator: '',
      strategy_time: '',
      conditions: [{}],
      remark: '',
      temp: '',
    };

    param.creator = localStorage.getItem('userName');
    param.strategy_time = moment().format('YYYY-MM-DD HH:mm:ss');
    param.temp = JSON.stringify(values);
    let conditions: object[] = [];
    for (let i = 0; i < conditionlist.length; i++) {
      let conditiontemp = {
        condition_id: '',
        percent: 0.0,
        weight: 0.0,
      };
      if (
        values[i + '' + '1'] != undefined &&
        values[i + '' + '1'].length !== 0
      ) {
        conditiontemp.condition_id = values[i + '' + '1'][0];
      }
      if (values[i + '' + '2'] != undefined) {
        conditiontemp.percent = parseFloat(values[i + '' + '2']);
      }
      if (values[i + '' + '3'] != undefined) {
        conditiontemp.weight = parseFloat(values[i + '' + '3']);
      }
      if (conditiontemp.condition_id !== '') {
        conditions.push(conditiontemp);
      }
    }
    param.conditions = conditions;
    param.remark = values.remark;
    param.name = values.name;
    return param;
  };
  onFinish = (values: any) => {
    if (!values.scList || values.scList.length === 0) {
      message.error('请填写评价规则！！');
      return;
    }
    values.strategyType = '1';
    const {dispatch} = this.props;
    dispatch({
      type: 'strategy/addStrategyBySelf',
      payload: values,
    })
      .then(() => {
        dispatch({
          type: 'strategy/getAllStrategy',
          payload: {type: '1'},
        });
      })
      .then(() => {
        this.setState({visible: false});
      });
    this.strategyBySelf.current?.resetFields();
  };
  solicitationonFinish = (value: any) => {
    if (!value.scList || value.scList.length === 0) {
      message.error('请填写评价规则');
      return;
    }
    if (!value.strategyGroup || value.strategyGroup.length === 0) {
      message.error('请填写征集范围');
      return;
    }
    const {dispatch} = this.props;
    // value.strategyBeginTime = moment().format('YYYY-MM-DD HH:mm:ss');
    value.strategyBeginTime = moment(value.time[0]).format('YYYY-MM-DD');
    value.strategyEndTime = moment(value.time[1]).format('YYYY-MM-DD');
    value.strategyType = '1';
    dispatch({
      type: 'strategy/addStrategyByCollect',
      payload: value,
    }).then(() => {
      dispatch({
        type: 'strategy/getAllStrategy',
        payload: {type: '1'},
      });
      this.setState({solicitationVisible: false});
    });
    this.strategyByCollect.current?.resetFields();
  };
  solicitationEditOnFinish = (value: any) => {
    value.strategyAuthor = localStorage.getItem('userName');
    value.strategyType = '1';
    value.strategyTemp = '';
    value.collectType = '1';
    value.calculate = '';
    value.group = '';
    value.strategyBegintime = moment(value.time[0]).format('YYYY-MM-DD');
    value.strategyEndtime = moment(value.time[1]).format('YYYY-MM-DD');
    const {dispatch} = this.props;
    dispatch({
      type: 'strategy/updateStrategy',
      payload: value,
    })
      .then(() => {
        dispatch({
          type: 'strategy/getAllStrategy',
          payload: {type: '1'},
        });
      })
      .then(() => {
        this.setState({solicitationEditVisible: false});
      });
  };
  editonFinish = (value: any) => {
    value.strategyAuthor = localStorage.getItem('userName');
    value.strategyType = '1';
    value.strategyTemp = '';
    value.collectType = '0';
    value.calculate = '';
    value.group = '';
    value.strategyBegintime = '';
    value.strategyEndtime = '';
    const {dispatch} = this.props;
    dispatch({
      type: 'strategy/updateStrategy',
      payload: value,
    })
      .then(() => {
        dispatch({
          type: 'strategy/getAllStrategy',
          payload: {type: '1'},
        });
      })
      .then(() => {
        this.setState({editvisible: false});
      });
  };
  onSearch = (value: any) => {
    const {dispatch} = this.props;
    if (/^\d+$/.test(value)) {
      dispatch({
        type: 'strategy/strategyGetOne',
        payload: {id: value},
      });
    } else {
      dispatch({
        type: 'strategy/strategyGetOneByName',
        payload: {name: value},
      });
    }
  };
  reset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'strategy/getAllStrategy',
      payload: {type: '1'},
    });
  };
  delete = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'strategy/deleteStrategy',
      payload: {strategyId: value.strategyId},
    }).then(() => {
      dispatch({
        type: 'strategy/getAllStrategy',
        payload: {type: '1'},
      });
    });
  };
  setClusterOrRole = (value: any, fieldKey: any) => {
    tempClusterOrRole[fieldKey] = value;
    this.setState({
      clusterOrRole: tempClusterOrRole,
    });
  };

  calculationAllAct = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'strategy/evaluateAllActivity',
      payload: {
        strategyId: value.strategyId,
      },
    }).then(() => {
      dispatch({
        type: 'strategy/getAllStrategy',
        payload: {type: '1'},
      });
    });
  };

  render() {
    const {
      strategylist,
      conditionlist,
      Tableloading,
      picturelist,
      rolelist,
      calculateloading,
    } = this.props;
    const {clusterOrRole} = this.state;
    const columns: ColumnsType<TableType> = [
      {
        title: '策略名称',
        dataIndex: 'strategyName',
        align: 'center',
      },
      // {
      //   title: '策略ID',
      //   dataIndex: 'strategyId',
      //   align: 'center',
      // },
      {
        title: '创建人',
        dataIndex: 'strategyAuthor',
        align: 'center',
      },
      {
        title: '策略开始时间',
        dataIndex: 'strategyBegintime',
        align: 'center',
      },
      {
        title: '策略结束时间',
        dataIndex: 'strategyEndtime',
        align: 'center',
      },
      {
        title: '备注',
        dataIndex: 'strategyRemark',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'isFinish',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          switch (text) {
            case '0':
              return <Tag color="processing">未计算</Tag>;
            case '1':
              return <Tag color="volcano">计算完成</Tag>;
            default:
          }
        },
      },
      {
        title: '创建方式',
        dataIndex: 'collectType',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          switch (text) {
            case '0':
              return <span>自定义创建</span>;
            case '1':
              return <span>征集创建</span>;
            default:
          }
        },
      },
      // {
      //   title: '策略开关',
      //   // dataIndex: 'english',
      //   align: 'center',
      //   render: (text: any, record: any) => (
      //     <Switch
      //       checkedChildren="开启"
      //       unCheckedChildren="关闭"
      //       defaultChecked
      //     />
      //   ),
      // },
      {
        title: '操作',
        // dataIndex: 'english',
        align: 'center',
        render: (text: any, record: any) => (
          <Space>
            {record.collectType === '0' ? (
              <Tooltip title="查看">
                <Button
                  type="link"
                  icon={<SearchOutlined/>}
                  onClick={() => this.editshowModal(record)}
                ></Button>
              </Tooltip>
            ) : (
              <Tooltip title="查看">
                <Button
                  type="link"
                  icon={<SearchOutlined/>}
                  onClick={() => this.solicitationEditshowModal(record)}
                ></Button>
              </Tooltip>
            )}
            <Tooltip title="计算策略的所有活动">
              {/* <Link to={{ pathname: '/StrategyContent', state: { ...record } }}> */}
              {/* <Button
                type="link"
                icon={<RocketOutlined />}
                onClick={() => { this.calculationAllAct(record) }}
              ></Button> */}
              {/* </Link> */}
            </Tooltip>
            <Tooltip title="删除">
              <Popconfirm
                title="您确定要删除该策略吗？"
                onConfirm={() => this.delete(record)}
                okText="是"
                cancelText="否"
              >
                <Button type="link" icon={<DeleteOutlined/>}></Button>
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];
    const content = (
      <>
        <Paragraph>按照策略来对第二课堂活动进行“五育”计算。</Paragraph>
        <Paragraph>
          可以征集创建策略，指定系统中的不同角色来提供自己的意见。
        </Paragraph>
        <Paragraph>
          可以自定义创建策略，由管理员或创建者直接指定评价规则以及所占权重。
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
            title="第二课堂/策略管理"
            subTitle="通过策略对第二课堂活动评价"
            tags={<Tag color="blue">运行中</Tag>}
            extra={[
              <Button
                key={'calculate'}
                onClick={() => {
                  const {dispatch} = this.props;
                  dispatch({
                    type: 'strategy/calculateCollect',
                  }).then(() => {
                    dispatch({
                      type: 'strategy/getAllStrategy',
                      payload: {type: '1'},
                    });
                  });
                }}
              >
                计算征集策略
              </Button>,
              <Button
                onClick={this.reset}
                icon={<RedoOutlined/>}
                key={'reset'}
              >
                刷新列表
              </Button>,
              <Button
                type="primary"
                onClick={this.selectshowModal}
                icon={<PlusOutlined/>}
                key={'create'}
              >
                新建策略
              </Button>,
            ]}
            avatar={{src: require('@/assets/picture/二课策略.png')}}
          >
            <Content
              extraContent={
                <img
                  src="https://gw.alipayobjects.com/zos/antfincdn/K%24NnlsB%26hz/pageHeader.svg"
                  alt="content"
                  width="100%"
                />
              }
            >
              {content}
            </Content>
          </PageHeader>
        </div>
        <ConfigProvider locale={zhCN}>
          <Card title={'策略列表'}>
            <Table
              columns={columns}
              dataSource={strategylist}
              rowKey={() => Math.random()}
              loading={calculateloading}
            />
          </Card>

          <Modal
            title="选择创建策略方式"
            visible={this.state.selectVisible}
            onOk={this.selecthandleOk}
            onCancel={this.selecthandleCancel}
            footer={null}
          >
            <Card style={{width: 470}} hoverable onClick={this.showModal}>
              <Row>
                <Col span={8}>
                  <img
                    src={require('@/assets/picture/自定义创建.png')}
                    style={{height: 100}}
                  />
                </Col>
                <Col span={16}>
                  <p style={{fontWeight: 'bold', fontSize: 16}}>自定义创建</p>
                  <p style={{fontSize: 14}}>
                    用户直接自定义活动评价策略及权重值
                  </p>
                </Col>
              </Row>
            </Card>
            <Card
              style={{width: 470}}
              hoverable
              onClick={this.solicitationshowModal}
            >
              <Row>
                <Col span={8}>
                  <img
                    src={require('@/assets/picture/征集创建.png')}
                    style={{height: 100}}
                  />
                </Col>
                <Col span={16}>
                  <p style={{fontWeight: 'bold', fontSize: 16}}>征集创建</p>
                  <p style={{fontSize: 14}}>
                    发起征集意见，根据征集意见计算活动评价策略及权重值
                  </p>
                </Col>
              </Row>
            </Card>
          </Modal>

          <Modal
            width="700px"
            title="自定义创建"
            visible={this.state.visible}
            onOk={this.handleOk}
            // confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel}
            footer={null}
          >
            <Form
              name="自定义创建"
              onFinish={this.onFinish}
              labelCol={{span: 4}}
              ref={this.strategyBySelf}
            >
              <Collapse defaultActiveKey={['1', '3']}>
                <Panel header="基础用户信息" key="1">
                  <Form.Item
                    label="策略名称"
                    name="strategyName"
                    rules={[{required: true, message: '请输入策略名称'}]}
                  >
                    <Input style={{width: '100%'}}/>
                  </Form.Item>
                  <Form.Item label="备注" name="strategyRemark">
                    <TextArea rows={4}/>
                  </Form.Item>
                </Panel>
                <Panel header="评价规则" key="3">
                  <Form.List name="scList">
                    {(fields, {add, remove}) => (
                      <>
                        <Row align="middle">
                          <Col span={3}>
                            <span style={{marginTop: 10, marginLeft: 10}}>
                              选择规则
                            </span>
                          </Col>
                          <Col span={1}>
                            <Form.Item>
                              <Button
                                type="primary"
                                style={{marginTop: 20}}
                                shape="circle"
                                size="small"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined/>}
                              ></Button>
                            </Form.Item>
                          </Col>
                        </Row>
                        {fields.map(({key, name, fieldKey, ...restField}) => (
                          <Space
                            key={key}
                            style={{
                              display: 'flex',
                              marginBottom: 8,
                              marginLeft: 100,
                            }}
                            align="baseline"
                          >
                            <Form.Item
                              {...restField}
                              name={[name, 'conditionId']}
                              fieldKey={[fieldKey, 'conditionId']}
                              rules={[{required: true, message: '请输入'}]}
                            >
                              <Select style={{width: 200}}>
                                {conditionlist.map(
                                  (element: any, index: any) => {
                                    return (
                                      <Option
                                        value={element.conditionId}
                                        key={element.conditionId}
                                      >
                                        {element.conditionName}
                                      </Option>
                                    );
                                  },
                                )}
                              </Select>
                            </Form.Item>
                            <span>设置</span>
                            <Form.Item
                              {...restField}
                              // label="总分"
                              name={[name, 'weight']}
                              fieldKey={[fieldKey, 'weight']}
                              rules={[{required: true, message: '请输入'}]}
                            >
                              <InputNumber
                                min={0}
                                max={1}
                                step="0.01"
                                style={{width: 200}}
                              />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)}/>
                          </Space>
                        ))}
                      </>
                    )}
                  </Form.List>
                </Panel>
              </Collapse>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{width: '100%'}}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            width="700px"
            title="征集创建"
            visible={this.state.solicitationVisible}
            onOk={this.solicitationhandleOk}
            // confirmLoading={this.state.confirmLoading}
            onCancel={this.solicitationhandleCancel}
            footer={null}
          >
            <Spin spinning={Tableloading ? Tableloading : false}>
              <Form
                name="征集创建"
                onFinish={this.solicitationonFinish}
                labelCol={{span: 4}}
                ref={this.strategyByCollect}
              >
                <Collapse defaultActiveKey={['1', '2', '4']}>
                  <Panel header="基础用户信息" key="1">
                    <Form.Item
                      label="策略名称"
                      name="strategyName"
                      rules={[{required: true, message: '请输入策略名称'}]}
                    >
                      <Input style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item label="备注" name="strategyRemark">
                      <TextArea rows={4}/>
                    </Form.Item>
                  </Panel>
                  <Panel header="征集信息" key="2">
                    <Form.Item
                      label="征集时间"
                      name="time"
                      rules={[{required: true, message: '请输入征集时间'}]}
                    >
                      <RangePicker/>
                    </Form.Item>
                    <Form.List name="strategyGroup">
                      {(fields, {add, remove}) => (
                        <>
                          <Row align="middle">
                            <Col span={4}>
                              <span style={{marginTop: 10, marginLeft: 35}}>
                                征集范围
                              </span>
                            </Col>
                            <Col span={1}>
                              <Form.Item>
                                <Button
                                  type="primary"
                                  style={{marginTop: 20}}
                                  shape="circle"
                                  size="small"
                                  onClick={() => add()}
                                  block
                                  icon={<PlusOutlined/>}
                                ></Button>
                              </Form.Item>
                            </Col>
                          </Row>
                          {fields.map(
                            ({key, name, fieldKey, ...restField}) => (
                              <Space
                                key={key}
                                style={{
                                  display: 'flex',
                                  marginBottom: 8,
                                  marginLeft: 100,
                                }}
                                align="baseline"
                              >
                                <Form.Item
                                  {...restField}
                                  name={[name, 'type']}
                                  fieldKey={[fieldKey, 'type']}
                                  rules={[
                                    {required: true, message: '请输入类型'},
                                  ]}
                                >
                                  <Select
                                    style={{width: 80}}
                                    onSelect={(e: any) => {
                                      this.setClusterOrRole(e, fieldKey);
                                    }}
                                  >
                                    {/* <Option value="cluster">分群</Option> */}
                                    <Option value="role">角色</Option>
                                  </Select>
                                </Form.Item>

                                <Form.Item
                                  {...restField}
                                  name={[name, 'id']}
                                  fieldKey={[fieldKey, 'id']}
                                  rules={[
                                    {required: true, message: '请输入'},
                                  ]}
                                >
                                  {clusterOrRole[fieldKey] === 'cluster' ? (
                                    <Select style={{width: 180}}>
                                      {picturelist.map(
                                        (element: any, index: any) => {
                                          return (
                                            <Option
                                              value={element.id}
                                              key={element.id}
                                            >
                                              {element.name}
                                            </Option>
                                          );
                                        },
                                      )}
                                    </Select>
                                  ) : clusterOrRole[fieldKey] === 'role' ? (
                                    <Select style={{width: 180}}>
                                      {rolelist.map(
                                        (element: any, index: any) => {
                                          return (
                                            <Option
                                              value={element.id}
                                              key={element.id}
                                            >
                                              {element.name}
                                            </Option>
                                          );
                                        },
                                      )}
                                    </Select>
                                  ) : (
                                    <Select style={{width: 180}}>
                                      <Option value={''}> </Option>
                                    </Select>
                                  )}
                                </Form.Item>
                                <span>意见权重</span>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'weight']}
                                  fieldKey={[fieldKey, 'weight']}
                                  rules={[
                                    {required: true, message: '请输入'},
                                  ]}
                                >
                                  <InputNumber
                                    min={0}
                                    max={1}
                                    step="0.01"
                                    style={{width: 120}}
                                  />
                                </Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => remove(name)}
                                />
                              </Space>
                            ),
                          )}
                        </>
                      )}
                    </Form.List>
                  </Panel>
                  <Panel header="评价规则" key="4">
                    <Form.List name="scList">
                      {(fields, {add, remove}) => (
                        <>
                          <Row align="middle">
                            <Col span={4}>
                              <span style={{marginTop: 10, marginLeft: 35}}>
                                评价规则
                              </span>
                            </Col>
                            <Col span={1}>
                              <Form.Item>
                                <Button
                                  type="primary"
                                  style={{marginTop: 20}}
                                  shape="circle"
                                  size="small"
                                  onClick={() => add()}
                                  block
                                  icon={<PlusOutlined/>}
                                ></Button>
                              </Form.Item>
                            </Col>
                          </Row>
                          {fields.map(
                            ({key, name, fieldKey, ...restField}) => (
                              <Space
                                key={key}
                                style={{
                                  display: 'flex',
                                  marginBottom: 8,
                                  marginLeft: 40,
                                }}
                                align="baseline"
                              >
                                <span>征集条件</span>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'conditionId']}
                                  fieldKey={[fieldKey, 'conditionId']}
                                  rules={[
                                    {required: true, message: '请输入'},
                                  ]}
                                >
                                  <Select style={{width: 150}}>
                                    {conditionlist.map(
                                      (element: any, index: any) => {
                                        return (
                                          <Option
                                            value={element.conditionId}
                                            key={element.conditionId}
                                          >
                                            {element.conditionName}
                                          </Option>
                                        );
                                      },
                                    )}
                                  </Select>
                                </Form.Item>
                                <span>分值范围</span>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'weightMin']}
                                  fieldKey={[fieldKey, 'weightMin']}
                                  rules={[
                                    {required: true, message: '请输入'},
                                  ]}
                                >
                                  <InputNumber
                                    min={0}
                                    max={1}
                                    step="0.01"
                                    style={{width: 80}}
                                  />
                                </Form.Item>
                                <span>~</span>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'weightMax']}
                                  fieldKey={[fieldKey, 'weightMax']}
                                  rules={[
                                    {required: true, message: '请输入'},
                                  ]}
                                >
                                  <InputNumber
                                    min={0}
                                    max={1}
                                    step="0.01"
                                    style={{width: 80}}
                                  />
                                </Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => remove(name)}
                                />
                              </Space>
                            ),
                          )}
                        </>
                      )}
                    </Form.List>
                  </Panel>
                </Collapse>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{width: '100%'}}
                  >
                    提交
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </Modal>

          <Modal
            width="700px"
            title="查看自定义策略"
            visible={this.state.editvisible}
            onOk={this.edithandleOk}
            // confirmLoading={this.state.confirmLoading}
            onCancel={this.edithandleCancel}
            footer={null}
            forceRender
          >
            <Form
              ref={this.formRef}
              name="editref"
              onFinish={this.editonFinish}
              labelCol={{span: 4}}
            >
              <Form.Item name="strategyId" hidden>
                <Input/>
              </Form.Item>
              <Collapse defaultActiveKey={['1', '3']}>
                <Panel header="基础用户信息" key="1">
                  <Form.Item
                    label="策略名称"
                    name="strategyName"
                    rules={[{required: true, message: '请输入策略名称'}]}
                  >
                    <Input style={{width: '100%'}} disabled/>
                  </Form.Item>
                  <Form.Item label="备注" name="strategyRemark">
                    <TextArea rows={4} disabled/>
                  </Form.Item>
                </Panel>
                <Panel header="评价规则" key="3">
                  <Form.List name="scList">
                    {(fields, {add, remove}) => (
                      <>
                        {fields.map(({key, name, fieldKey, ...restField}) => (
                          <Space
                            key={key}
                            style={{
                              display: 'flex',
                              marginBottom: 8,
                              marginLeft: 100,
                            }}
                            align="baseline"
                          >
                            <Form.Item
                              {...restField}
                              name={[name, 'conditionId']}
                              fieldKey={[fieldKey, 'conditionId']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Missing first name',
                                },
                              ]}
                            >
                              <Select style={{width: 200}} disabled>
                                {conditionlist.map(
                                  (element: any, index: any) => {
                                    return (
                                      <Option
                                        value={element.conditionId}
                                        key={element.conditionId}
                                      >
                                        {element.conditionName}
                                      </Option>
                                    );
                                  },
                                )}
                              </Select>
                            </Form.Item>
                            <span>设置</span>
                            <Form.Item
                              {...restField}
                              // label="总分"
                              name={[name, 'weight']}
                              fieldKey={[fieldKey, 'weight']}
                              // rules={[{ required: true, message: 'Missing last name' }]}
                            >
                              <Input
                                placeholder=""
                                style={{width: 200}}
                                disabled
                              />
                            </Form.Item>
                            {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                          </Space>
                        ))}
                      </>
                    )}
                  </Form.List>
                </Panel>
              </Collapse>

              {/* <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: '100%' }}
                >
                  提交
                </Button>
              </Form.Item> */}
            </Form>
          </Modal>

          <Modal
            width="700px"
            title="查看征集策略"
            visible={this.state.solicitationEditVisible}
            onOk={this.solicitationEdithandleOk}
            onCancel={this.solicitationEdithandleCancel}
            footer={null}
            forceRender
          >
            <Form
              name="编辑征集创建"
              onFinish={this.solicitationEditOnFinish}
              labelCol={{span: 4}}
              ref={this.solicitationformRef}
            >
              <Form.Item name="strategyId" hidden>
                <Input/>
              </Form.Item>
              <Collapse defaultActiveKey={['1', '2', '4']}>
                <Panel header="基础用户信息" key="1">
                  <Form.Item
                    label="策略名称"
                    name="strategyName"
                    rules={[{required: true, message: '请输入策略名称'}]}
                  >
                    <Input style={{width: '100%'}} disabled/>
                  </Form.Item>
                  <Form.Item label="备注" name="strategyRemark">
                    <TextArea rows={4} disabled/>
                  </Form.Item>
                </Panel>
                <Panel header="征集信息" key="2">
                  <Form.Item
                    label="征集时间"
                    name="time"
                    rules={[{required: true, message: '请输入征集时间'}]}
                  >
                    <RangePicker disabled/>
                  </Form.Item>
                  <Form.List name="strategyGroup">
                    {(fields, {add, remove}) => (
                      <>
                        <Row align="middle">
                          <Col span={4}>
                            <span style={{marginTop: 10, marginLeft: 35}}>
                              征集范围
                            </span>
                          </Col>
                          <Col span={1}>
                            <Form.Item>
                              <Button
                                type="primary"
                                style={{marginTop: 20}}
                                shape="circle"
                                size="small"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined/>}
                                disabled
                              ></Button>
                            </Form.Item>
                          </Col>
                        </Row>
                        {fields.map(({key, name, fieldKey, ...restField}) => (
                          <Space
                            key={key}
                            style={{
                              display: 'flex',
                              marginBottom: 8,
                              marginLeft: 100,
                            }}
                            align="baseline"
                          >
                            <Form.Item
                              {...restField}
                              name={[name, 'type']}
                              fieldKey={[fieldKey, 'type']}
                              rules={[
                                {required: true, message: '请输入类型'},
                              ]}
                            >
                              <Select
                                style={{width: 80}}
                                onSelect={(e: any) => {
                                  this.setClusterOrRole(e, fieldKey);
                                }}
                                disabled
                              >
                                {/* <Option value="cluster">分群</Option> */}
                                <Option value="role">角色</Option>
                              </Select>
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'id']}
                              fieldKey={[fieldKey, 'id']}
                              rules={[
                                {required: true, message: '请输入目标人群'},
                              ]}
                            >
                              {clusterOrRole[fieldKey] === 'cluster' ? (
                                <Select style={{width: 180}} disabled>
                                  {picturelist.map(
                                    (element: any, index: any) => {
                                      return (
                                        <Option
                                          value={element.id}
                                          key={element.id}
                                        >
                                          {element.name}
                                        </Option>
                                      );
                                    },
                                  )}
                                </Select>
                              ) : clusterOrRole[fieldKey] === 'role' ? (
                                <Select style={{width: 180}} disabled>
                                  {rolelist.map((element: any, index: any) => {
                                    return (
                                      <Option
                                        value={element.id}
                                        key={element.id}
                                      >
                                        {element.name}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              ) : (
                                <Select style={{width: 180}} disabled>
                                  <Option value={''}> </Option>
                                </Select>
                              )}
                            </Form.Item>
                            <span>意见权重</span>
                            <Form.Item
                              {...restField}
                              name={[name, 'weight']}
                              fieldKey={[fieldKey, 'weight']}
                            >
                              <Input
                                placeholder=""
                                style={{width: 120}}
                                disabled
                              />
                            </Form.Item>
                            {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                          </Space>
                        ))}
                      </>
                    )}
                  </Form.List>
                </Panel>

                <Panel header="评价规则" key="4">
                  <Form.List name="scList">
                    {(fields, {add, remove}) => (
                      <>
                        {/* <Row align="middle">
                          <Col span={4}>
                            <span style={{ marginTop: 10, marginLeft: 35 }}>
                              评价规则
                            </span>
                          </Col>
                          <Col span={1}>
                            <Form.Item>
                              <Button
                                type="primary"
                                style={{ marginTop: 20 }}
                                shape="circle"
                                size="small"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              ></Button>
                            </Form.Item>
                          </Col>
                        </Row> */}
                        {fields.map(({key, name, fieldKey, ...restField}) => (
                          <Space
                            key={key}
                            style={{
                              display: 'flex',
                              marginBottom: 8,
                              marginLeft: 40,
                            }}
                            align="baseline"
                          >
                            <span>征集条件</span>
                            <Form.Item
                              {...restField}
                              name={[name, 'conditionId']}
                              fieldKey={[fieldKey, 'conditionId']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Missing first name',
                                },
                              ]}
                            >
                              <Select style={{width: 180}} disabled>
                                {conditionlist.map(
                                  (element: any, index: any) => {
                                    return (
                                      <Option
                                        value={element.conditionId}
                                        key={element.conditionId}
                                      >
                                        {element.conditionName}
                                      </Option>
                                    );
                                  },
                                )}
                              </Select>
                            </Form.Item>
                            <span>&nbsp;&nbsp;&nbsp;权重</span>
                            <Form.Item
                              {...restField}
                              // label="总分"
                              name={[name, 'weight']}
                              fieldKey={[fieldKey, 'weight']}
                              // rules={[{ required: true, message: 'Missing last name' }]}
                            >
                              <Input
                                placeholder=""
                                style={{width: 50}}
                                disabled
                              />
                            </Form.Item>

                            {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                          </Space>
                        ))}
                      </>
                    )}
                  </Form.List>
                </Panel>
              </Collapse>
              {/* <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: '100%' }}
                  loading={Tableloading}
                >
                  提交
                </Button>
              </Form.Item> */}
            </Form>
          </Modal>
        </ConfigProvider>
      </div>
    );
  }
}

export default connect(({strategy, loading}: any) => ({
  ...strategy,
  Tableloading: loading.effects['strategy/addStrategyByCollect'],
  calculateloading: loading.effects['strategy/calculateCollect'],
}))(ActivityStrategyManagement);
