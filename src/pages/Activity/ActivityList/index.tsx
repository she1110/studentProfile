import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  PageHeader,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Transfer,
  Typography,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import {EditOutlined, PlusOutlined, RedoOutlined} from '@ant-design/icons';
import moment from 'moment';
import {ColumnsType} from 'antd/es/table';

const {Search} = Input;
const {Option} = Select;
const {CheckableTag} = Tag;
const tagsData = ['不限', '国家级', '省市级', '校级', '院级'];
const {RangePicker} = DatePicker;
const {TextArea} = Input;
const {Paragraph} = Typography;

export type Props = {
  dispatch: Dispatch;
  Tableloading: boolean;
  Tableloading1: boolean;
  Tableloading2: boolean;
  evaluateLoading: boolean;
  ActivityList: TableStyle[]; //活动列表
  orgList: object[]; //模糊查询 举办方的选项
  strategylist: object[]; //策略列表
  scListtemp: object[]; //策略中的条件列表，用于策略的预览
  tagList: object[]; //活动标签列表
};

interface TableStyle {
  id: number;
  name: string;
  orgId: number;
  orgLevel: string;
  orgSid: string;
  orgStartTime: string;
  orgEndTime: string;
  orgTid: string;
  tags: number[];
}

class ActivityList extends Component<Props> {
  state = {
    visible: false, //新建活动modal
    editvisible: false, //编辑活动modal
    strategyvisible: false, //策略modal
    actLabelvisible: false, //活动标签modal
    addactLabelvisible: false, //新建活动标签modal
    scListtemp: [], //策略中的条件列表，用于策略的预览
    selectedTags: ['不限', '国家级', '省市级', '校级', '院级'],

    tagList: [], //活动标签列表
    targetKeys: [], //活动标签目标key
    selectedKeys: [], //活动标签选择key
  };
  formRef = React.createRef<FormInstance>();
  strategyformRef = React.createRef<FormInstance>();
  activityformRef = React.createRef<FormInstance>();

  handleChange(tag: any, checked: any) {
    const {selectedTags} = this.state;
    if (tag === '不限' && checked === true) {
      this.setState({
        selectedTags: ['不限', '国家级', '省市级', '校级', '院级'],
      });
      this.handleNextSelectedTags(['国家级', '省市级', '校级', '院级']);
    } else if (tag === '不限' && checked === false) {
      this.setState({selectedTags: []});
      this.handleNextSelectedTags([]);
    } else {
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter((t) => t !== tag);
      if (nextSelectedTags.indexOf('不限') > -1) {
        this.setState({
          selectedTags: ['不限', '国家级', '省市级', '校级', '院级'],
        });
      } else {
        this.setState({selectedTags: nextSelectedTags});
        this.handleNextSelectedTags(nextSelectedTags);
      }
    }
  }

  handleNextSelectedTags = (value: any) => {
    const {dispatch} = this.props;
    let stringtemp: any = [];
    value.map((element: any, index: any) => {
      if (element === '校级') {
        stringtemp.push('1');
      }
      if (element === '省市级') {
        stringtemp.push('2');
      }
      if (element === '国家级') {
        stringtemp.push('3');
      }
      if (element === '院级') {
        stringtemp.push('0');
      }
    });
    if (dispatch) {
      dispatch({
        type: 'activity/getActByLevel',
        payload: {
          levels: stringtemp,
        },
      });
    }
  };
  componentDidMount = () => {
    const {dispatch, tagList} = this.props;
    if (dispatch) {
      dispatch({
        type: 'activity/getAllAct',
      });
      dispatch({
        type: 'activity/getAllStrategy',
        payload: {type: '1'},
      });
      dispatch({
        type: 'activity/getAllTag',
      });
    }
    this.setState({
      tagList: tagList,
    });
  };
  showModal = () => {
    this.setState({visible: true});
  };
  handleCancel = () => {
    this.setState({visible: false});
  };
  handleOk = () => {
    this.setState({visible: false});
  };
  addActLabelshowModal = () => {
    this.setState({addactLabelvisible: true, actLabelvisible: false});
  };
  addActLabelhandleCancel = () => {
    this.setState({addactLabelvisible: false});
  };
  addActLabelhandleOk = () => {
    this.setState({addactLabelvisible: false});
  };
  actLabelshowModal = (value: any) => {
    this.setState({actLabelvisible: true});
    this.activityformRef.current?.setFieldsValue(value);
    let targetKeystemp: any = [];
    if (value.tags.length !== 0) {
      value.tags.map((element: any, index: any) => {
        targetKeystemp.push(element.id);
      });
    }
    this.setState({
      targetKeys: targetKeystemp,
    });
  };
  actLabelhandleCancel = () => {
    this.setState({actLabelvisible: false});
  };
  actLabelhandleOk = () => {
    this.setState({actLabelvisible: false});
  };
  strategyshowModal = (value: any) => {
    this.setState({strategyvisible: true});
    this.strategyformRef.current?.setFieldsValue(value);
  };
  strategyhandleCancel = () => {
    this.setState({scListtemp: [], strategyvisible: false});
  };
  strategyhandleOk = () => {
    this.setState({scListtemp: [], strategyvisible: false});
  };
  editshowModal = (value: any) => {
    let time: any = [];
    time[0] = moment(value.orgStartTime);
    time[1] = moment(value.orgEndTime);
    let tagstemp: any = [];
    if (value.tags.length !== 0) {
      value.tags.map((element: any, index: any) => {
        tagstemp.push(element.id);
      });
    }
    this.formRef.current?.setFieldsValue(value);
    this.formRef.current?.setFieldsValue({
      time: time,
      tags: tagstemp,
    });
    this.setState({editvisible: true});
  };
  edithandleCancel = () => {
    this.setState({editvisible: false});
  };
  edithandleOk = () => {
    this.setState({editvisible: false});
  };
  onFinish = (values: any) => {
    const {dispatch} = this.props;
    values.orgStartTime = moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss');
    values.orgEndTime = moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss');
    // let tagstemp: any = [];
    // if (values.tags.length !== 0) {
    //   values.tags.map((element: any, index: any) => {
    //     let tagtemp: any = {};
    //     tagtemp.id = element;
    //     tagstemp.push(tagtemp);
    //   })
    // };
    // values.tags = tagstemp;
    dispatch({
      type: 'activity/addAct',
      payload: values,
    })
      .then(() => {
        dispatch({
          type: 'activity/getAllAct',
        });
      })
      .then(() => {
        this.setState({visible: false});
      });
  };
  editonFinish = (values: any) => {
    const {dispatch} = this.props;
    values.orgStartTime = moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss');
    values.orgEndTime = moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss');

    // let tagstemp: any = [];
    // if (values.tags.length !== 0) {
    //   values.tags.map((element: any, index: any) => {
    //     let tagtemp: any = {};
    //     tagtemp.id = element;
    //     tagstemp.push(tagtemp);
    //   })
    // };
    // values.tags = tagstemp;

    dispatch({
      type: 'activity/updateAct',
      payload: values,
    })
      .then(() => {
        dispatch({
          type: 'activity/getAllAct',
        });
      })
      .then(() => {
        this.setState({editvisible: false});
      });
  };
  onSearch = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'activity/getOneAct',
      payload: {name: value},
    });
  };
  reset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'activity/getAllAct',
    });
  };
  delete = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'activity/delAct',
      payload: {id: value.id},
    }).then(() => {
      dispatch({
        type: 'activity/getAllAct',
      });
    });
  };
  downloadFile = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'activity/getAllStuScoreInActivity',
      payload: {activityId: value.id},
    });
  };
  strategyPreview = (value: any) => {
    const {dispatch, strategylist} = this.props;
    let scListtemp: any = [];
    strategylist.map((element: any, index: any) => {
      if (element.strategyId === value) {
        scListtemp = element.scList;
      }
    });
    if (scListtemp.length !== 0) {
      this.setState({
        scListtemp: scListtemp,
      });
    }
    if (scListtemp.length === 0) {
      this.setState({
        scListtemp: [],
      });
    }
  };
  strategyonFinish = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'activity/updateAct',
      payload: {
        id: value.id,
        strategyId: value.strategyId,
      },
    }).then(() => {
      dispatch({
        type: 'activity/getAllAct',
      });
    });
    this.setState({scListtemp: [], strategyvisible: false});
  };
  onChange = (nextTargetKeys: any) => {
    this.setState({targetKeys: nextTargetKeys});
  };
  onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    this.setState({
      selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys],
    });
  };
  activityTagsOnFinish = (values: any) => {
    const {dispatch} = this.props;
    // let tagstemp: any = [];
    // if (values.tags.length !== 0) {
    //   values.tags.map((element: any, index: any) => {
    //     let tagtemp: any = {};
    //     tagtemp.id = element;
    //     tagstemp.push(tagtemp);
    //   })
    // }
    dispatch({
      type: 'activity/updateAct',
      payload: {
        id: values.id,
        tags: values.tags,
      },
    })
      .then(() => {
        dispatch({
          type: 'activity/getAllAct',
        });
      })
      .then(() => {
        this.setState({actLabelvisible: false});
      });
  };
  addActivityTagsOnFinish = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'activity/addTag',
      payload: value,
    })
      .then(() => {
        dispatch({
          type: 'activity/getAllTag',
        });
      })
      .then(() => {
        dispatch({
          type: 'activity/getAllAct',
        });
        this.setState({addactLabelvisible: false});
      });
  };
  evaluateOneActivity = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'activity/evaluateOneActivity',
      payload: {
        activityId: value.id,
      },
    });
  };

  render() {
    const {
      ActivityList,
      Tableloading,
      Tableloading1,
      Tableloading2,
      strategylist,
      tagList,
      evaluateLoading,
    } = this.props;
    const {selectedTags, scListtemp} = this.state;
    const columns: ColumnsType<TableStyle> = [
      // {
      //   key: 'id',
      //   title: '活动ID',
      //   dataIndex: 'id',
      //   align: 'center',
      // },
      {
        key: 'name',
        title: '活动名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        key: 'orgId',
        title: '举办方',
        dataIndex: 'orgId',
        align: 'center',
      },
      {
        key: 'orgLevel',
        title: '活动级别',
        dataIndex: 'orgLevel',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          switch (text) {
            case '1':
              return <span>校级</span>;
            case '2':
              return <span>省市级</span>;
            case '3':
              return <span>国家级</span>;
            case '0':
              return <span>院级</span>;
            default:
          }
        },
      },
      {
        key: 'orgStartTime',
        title: '活动开始时间',
        dataIndex: 'orgStartTime',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (record !== null) {
            return <span>{moment(text).format('YYYY-MM-DD')}</span>;
          }
        },
      },
      {
        key: 'orgEndTime',
        title: '活动结束时间',
        dataIndex: 'orgEndTime',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (record !== null) {
            return <span>{moment(text).format('YYYY-MM-DD')}</span>;
          }
        },
      },
      // {
      //   key: 'orgSid',
      //   title: '组织学生',
      //   dataIndex: 'orgSid',
      //   align: 'center',
      // },
      {
        key: 'orgTid',
        title: '负责人',
        dataIndex: 'orgTid',
        align: 'center',
      },
      {
        key: 'categoryId',
        title: '活动类型',
        dataIndex: 'categoryId',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (text === '1') {
            return <Tag color="blue">理想信念</Tag>;
          }
          if (text === '2') {
            return <Tag color="blue">实践服务</Tag>;
          }
          if (text === '3') {
            return <Tag color="blue">文化艺术</Tag>;
          }
          if (text === '4') {
            return <Tag color="blue">学术科技</Tag>;
          }
          if (text === '5') {
            return <Tag color="blue">社会工作</Tag>;
          }
          if (text === '6') {
            return <Tag color="blue">体育素质</Tag>;
          }
        },
      },

      {
        key: 'strategyId',
        title: '策略',
        dataIndex: 'strategyId',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (record !== null) {
            const strategyId = record.strategyId;
            if (strategyId === null) {
              return (
                <Button
                  type="link"
                  onClick={() => {
                    this.strategyshowModal(record);
                  }}
                >
                  绑定评价策略
                </Button>
              );
            } else {
              const strategyName = record.strategy.name;
              return (
                <>
                  <span>{strategyName}</span>
                  <Tooltip title="更换评价策略">
                    <Button
                      type="link"
                      icon={<EditOutlined/>}
                      onClick={() => {
                        this.strategyshowModal(record);
                      }}
                    ></Button>
                  </Tooltip>
                </>
              );
            }
          }
        },
      },
      {
        key: 'tags',
        title: '活动分类',
        dataIndex: 'tags',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (record !== null) {
            const tags = record.tags;
            if (tags.length === 0) {
              return (
                <Button
                  type="link"
                  onClick={() => {
                    this.actLabelshowModal(record);
                  }}
                >
                  添加活动标签
                </Button>
              );
            } else {
              return (
                <>
                  {tags.map((element: any, index: any) => {
                    return <Tag key={element.id}>{element.name}</Tag>;
                  })}
                  <Tooltip title="修改活动标签">
                    <Button
                      type="link"
                      icon={<EditOutlined/>}
                      onClick={() => {
                        this.actLabelshowModal(record);
                      }}
                    ></Button>
                  </Tooltip>
                </>
              );
            }
          }
        },
      },

      {
        title: '活动维护',
        align: 'center',
        render: (text: any, record: any) => {
          const recordHasStrategy: boolean = record.strategyId === null;
          return (
            <Space>
              <Button
                type="link"
                onClick={() => this.evaluateOneActivity(record)}
                disabled={recordHasStrategy}
              >
                计算
              </Button>
              <Button type="link" onClick={() => this.editshowModal(record)}>
                编辑
              </Button>
              <Button type="link" onClick={() => this.delete(record)}>
                删除
              </Button>
            </Space>
          );
        },
      },
      {
        title: '下载',
        align: 'center',
        render: (text: any, record: any) => (
          <Space>
            <Button
              type="link"
              onClick={() => {
                this.downloadFile(record);
              }}
            >
              下载学生成绩
            </Button>
          </Space>
        ),
      },
    ];
    const content = (
      <>
        <Paragraph>
          对学生参加的活动进行了统计，用户可以对活动进行分类。
        </Paragraph>
        <Paragraph>
          采集第二课堂活动数据，抓取每一个活动背后的多维属性，丰富活动标签体系。
        </Paragraph>
        <Paragraph>
          给某个活动绑定上策略后，即可点击计算；计算完成后，点击下载学生成绩，可通过excel表格的方式查看。
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
            title="第二课堂/活动管理"
            subTitle="学生参加的活动"
            tags={<Tag color="blue">运行中</Tag>}
            extra={[
              <Button
                onClick={this.reset}
                icon={<RedoOutlined/>}
                key={'reset'}
              >
                刷新列表
              </Button>,
              <Button
                type="primary"
                onClick={this.showModal}
                icon={<PlusOutlined/>}
                key={'create'}
              >
                新建活动
              </Button>,
            ]}
            avatar={{src: require('@/assets/picture/活动.png')}}
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
          <Card
            title={
              <>
                <span style={{marginRight: 8}}>活动级别:</span>
                {tagsData.map((tag) => (
                  <CheckableTag
                    key={tag}
                    checked={selectedTags.indexOf(tag) > -1}
                    onChange={(checked) => this.handleChange(tag, checked)}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </>
            }
            extra={
              <Search
                placeholder="请输入名称开始查询"
                onSearch={this.onSearch}
                style={{width: 250}}
              />
            }
          >
            <Table
              columns={columns}
              dataSource={ActivityList}
              rowKey={(record) => record.id}
              loading={
                Tableloading ||
                Tableloading1 ||
                Tableloading2 ||
                evaluateLoading
              }
            />
          </Card>

          <Modal
            width="600px"
            title="新建活动"
            visible={this.state.visible}
            onOk={this.handleOk}
            // confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel}
            footer={null}
          >
            <Form name="新建活动" onFinish={this.onFinish}>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="活动名称"
                    name="name"
                    rules={[{required: true, message: '请输入活动名称'}]}
                  >
                    <Input style={{width: '100%'}}/>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="活动级别"
                    name="orgLevel"
                    rules={[{required: true, message: '请输入活动级别'}]}
                  >
                    <Select>
                      <Option value={'3'}>国家级</Option>
                      <Option value={'2'}>省级</Option>
                      <Option value={'1'}>校级</Option>
                      <Option value={'0'}>院级</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label="举办方"
                    name="orgId"
                    rules={[{required: true, message: '请输入举办方'}]}
                  >
                    <Input style={{width: '100%'}}/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="活动时间"
                    name="time"
                    rules={[{required: true, message: '请输入活动时间'}]}
                  >
                    <RangePicker/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="负责教师"
                    name="orgTid"
                    rules={[{required: true, message: '请输入负责教师'}]}
                  >
                    <Input style={{width: '100%'}}/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="活动类型"
                    name="categoryId"
                    rules={[{required: true, message: '请输入活动类型'}]}
                  >
                    <Select>
                      <Option value={'6'}>体育素质</Option>
                      <Option value={'5'}>社会工作</Option>
                      <Option value={'4'}>学术科技</Option>
                      <Option value={'3'}>文化艺术</Option>
                      <Option value={'2'}>实践服务</Option>
                      <Option value={'1'}>理想信念</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="活动标签"
                    name="tags"
                    rules={[{required: true, message: '请输入活动标签'}]}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      style={{width: '100%'}}
                      placeholder="活动标签"
                    >
                      {tagList.map((element: any, index: any) => {
                        return (
                          <Option value={element.id} key={element.id}>
                            {element.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

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
            width="600px"
            title="编辑活动"
            visible={this.state.editvisible}
            onOk={this.edithandleOk}
            // confirmLoading={this.state.confirmLoading}
            onCancel={this.edithandleCancel}
            footer={null}
            forceRender
          >
            <Form
              name="编辑活动"
              onFinish={this.editonFinish}
              ref={this.formRef}
            >
              <Row>
                <Col span={24}>
                  <Form.Item name="id" hidden>
                    <Input style={{width: '100%'}}/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="活动名称"
                    name="name"
                    rules={[{required: true, message: '请输入活动名称'}]}
                  >
                    <Input style={{width: '100%'}}/>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="活动级别"
                    name="orgLevel"
                    rules={[{required: true, message: '请输入活动级别'}]}
                  >
                    <Select style={{width: '100%'}}>
                      <Option value={'3'}>国家级</Option>
                      <Option value={'2'}>省级</Option>
                      <Option value={'1'}>校级</Option>
                      <Option value={'0'}>院级</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label="举办方"
                    name="orgId"
                    rules={[{required: true, message: '请输入举办方'}]}
                  >
                    <Input style={{width: '100%'}}/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="活动时间"
                    name="time"
                    rules={[{required: true, message: '请输入活动时间'}]}
                  >
                    <RangePicker/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="负责教师"
                    name="orgTid"
                    rules={[{required: true, message: '请输入负责教师'}]}
                  >
                    <Input style={{width: '100%'}}/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="活动类型"
                    name="categoryId"
                    rules={[{required: true, message: '请输入活动类型'}]}
                  >
                    <Select>
                      <Option value={'6'}>体育素质</Option>
                      <Option value={'5'}>社会工作</Option>
                      <Option value={'4'}>学术科技</Option>
                      <Option value={'3'}>文化艺术</Option>
                      <Option value={'2'}>实践服务</Option>
                      <Option value={'1'}>理想信念</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="活动标签"
                    name="tags"
                    rules={[{required: true, message: '请输入活动标签'}]}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      style={{width: '100%'}}
                      placeholder="活动标签"
                    >
                      {tagList.map((element: any, index: any) => {
                        return (
                          <Option value={element.id} key={element.id}>
                            {element.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

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
            width="500px"
            title="更改绑定策略"
            visible={this.state.strategyvisible}
            onOk={this.strategyhandleOk}
            onCancel={this.strategyhandleCancel}
            footer={null}
            forceRender
          >
            <Form
              name="策略列表"
              onFinish={this.strategyonFinish}
              ref={this.strategyformRef}
            >
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="活&nbsp;动&nbsp;I&nbsp;D&nbsp;"
                    name="id"
                    rules={[{required: true, message: '请输入活动ID'}]}
                  >
                    <Input style={{width: '100%'}} disabled/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="活动名称"
                    name="name"
                    rules={[{required: true, message: '请输入活动名称'}]}
                  >
                    <TextArea rows={2} style={{width: '100%'}} disabled/>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label="绑定策略"
                    name="strategyId"
                    rules={[{required: true, message: '请选择策略'}]}
                  >
                    <Select
                      style={{width: '100%'}}
                      onSelect={this.strategyPreview}
                    >
                      {strategylist.map((element: any, index: any) => {
                        return (
                          <Option
                            value={element.strategyId}
                            key={element.strategyId}
                          >
                            {element.strategyName}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6} offset={2}>
                  <Link
                    to="/ActivityStrategyManagement"
                    style={{textDecoration: 'underline'}}
                  >
                    创建策略
                  </Link>
                  {/* <Button type='link'>创建策略</Button> */}
                </Col>
              </Row>

              {scListtemp.length !== 0 ? (
                scListtemp.map((element: any, index: any) => {
                  return (
                    <>
                      <Row align="middle" justify="center" gutter={8}>
                        <Col span={8}>
                          <Select
                            defaultValue={element.conditionId}
                            key={Math.random()}
                            style={{width: '100%'}}
                            disabled
                          >
                            <Option value="virtue">德育权重值</Option>
                            <Option value="wisdom">智育权重值</Option>
                            <Option value="sports">体育权重值</Option>
                            <Option value="art">美育权重值</Option>
                            <Option value="labour">劳动权重值</Option>
                          </Select>
                        </Col>
                        <Col span={3}>
                          <Input
                            style={{width: '100%'}}
                            key={Math.random()}
                            defaultValue={element.weight}
                            disabled
                          />
                        </Col>
                      </Row>
                    </>
                  );
                })
              ) : (
                <></>
              )}
              <Divider/>
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
            title="添加活动标签"
            visible={this.state.actLabelvisible}
            onOk={this.actLabelhandleOk}
            onCancel={this.actLabelhandleCancel}
            footer={null}
            forceRender
          >
            <Form
              name="添加活动标签"
              onFinish={this.activityTagsOnFinish}
              ref={this.activityformRef}
            >
              <Form.Item name="id" hidden>
                <Input style={{width: '100%'}}/>
              </Form.Item>
              <Row>
                <Col span={20}>
                  <Form.Item name="tags">
                    <Transfer
                      dataSource={tagList}
                      titles={['活动列表', '已选活动']}
                      listStyle={{
                        width: 200,
                        height: 200,
                      }}
                      targetKeys={this.state.targetKeys}
                      selectedKeys={this.state.selectedKeys}
                      onChange={this.onChange}
                      onSelectChange={this.onSelectChange}
                      render={(item: any) => item.title}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button onClick={this.addActLabelshowModal} type="link">
                    新建标签
                  </Button>
                </Col>
              </Row>

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
            title="创建活动标签"
            visible={this.state.addactLabelvisible}
            onOk={this.addActLabelhandleOk}
            onCancel={this.addActLabelhandleCancel}
            footer={null}
            forceRender
          >
            <Form name="创建活动标签" onFinish={this.addActivityTagsOnFinish}>
              <Form.Item
                label="活动标签名称"
                name="name"
                rules={[{required: true, message: '请输入活动名称'}]}
              >
                <TextArea rows={2} style={{width: '100%'}}/>
              </Form.Item>

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
        </ConfigProvider>
      </div>
    );
  }
}

export default connect(({activity, loading}: any) => ({
  ...activity,
  Tableloading: loading.effects['activity/getAllAct'],
  Tableloading1: loading.effects['activity/getOneAct'],
  Tableloading2: loading.effects['activity/getActByLevel'],
  evaluateLoading: loading.effects['activity/evaluateOneActivity'],
}))(ActivityList);
