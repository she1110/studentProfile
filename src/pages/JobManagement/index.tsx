import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {
  Badge,
  Button,
  Card,
  Col,
  ConfigProvider,
  Form,
  Input,
  Modal,
  PageHeader,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import {PlusOutlined, RedoOutlined} from '@ant-design/icons';
import {ColumnsType} from 'antd/es/table';

const {Search} = Input;
const {Option} = Select;
const {CheckableTag} = Tag;
const tagsData = ['不限', '成功', '处理中', '失败', '未计算'];
const {Paragraph} = Typography;

export type Props = {
  dispatch: Dispatch;
  joblist: TableStyle[]; //任务列表
  picturelist: object[]; //画像列表
  strategylist: object[]; //策略列表
  evaluateStudentloading: boolean;
  evaluateClassOrMajorloading: boolean;
  MyPersons?: object[]; //画像列表 校验权限
};

interface TableStyle {
  key: number;
  id: number;
  name: string;
  state: string;
  persons_id: number;
  persons_name: string;
  result: string;
  creator: string;
  time: string;
  dim: string;
  strategy_id: number;
  strategy_name: string;
}

class JobManagement extends Component<Props> {
  state = {
    visible: false, //新建modal
    editvisible: false, //编辑modal
    selectedTags: ['不限', '成功', '处理中', '失败', '未计算'],
    // coursetag: false, //新建任务 任务评价纬度选中科目 显示科目FORMITEM
  };
  formRef = React.createRef<FormInstance>();

  handleChange(tag: any, checked: any) {
    const {selectedTags} = this.state;
    if (tag === '不限' && checked === true) {
      this.setState({
        selectedTags: ['不限', '成功', '处理中', '失败', '未计算'],
      });
      this.handleNextSelectedTags(['成功', '处理中', '失败', '未计算']);
    } else if (tag === '不限' && checked === false) {
      this.setState({selectedTags: []});
      this.handleNextSelectedTags([]);
    } else {
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter((t) => t !== tag);
      // console.log(nextSelectedTags);
      if (nextSelectedTags.indexOf('不限') > -1) {
        this.setState({
          selectedTags: ['不限', '成功', '处理中', '失败', '未计算'],
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
      // console.log(element + index);
      if (element === '成功') {
        stringtemp.push('1');
      }
      if (element === '处理中') {
        stringtemp.push('2');
      }
      if (element === '失败') {
        stringtemp.push('3');
      }
      if (element === '未计算') {
        stringtemp.push('0');
      }
    });
    // console.log(stringtemp);
    if (dispatch) {
      dispatch({
        type: 'job/jobGetByState',
        payload: {states: stringtemp},
      });
    }
  };
  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'job/jobGet',
        payload: {type: '0'},
      });
      dispatch({
        type: 'job/getAll',
        // type: 'job/gejob',
      });
      dispatch({
        type: 'job/getAllStrategy',
        payload: {type: '0'},
      });
    }
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
  editshowModal = (value: any) => {
    this.formRef.current?.setFieldsValue(value);
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
    values.creator = localStorage.getItem('userName');
    // values.time = moment().format('YYYY-MM-DD HH:mm:ss');
    values.state = '0';
    dispatch({
      type: 'job/jobAdd',
      payload: values,
    })
      .then(() => {
        dispatch({
          type: 'job/jobGet',
          payload: {type: '0'},
        });
      })
      .then(() => {
        this.setState({visible: false});
      });
  };
  editonFinish = (values: any) => {
    const {dispatch} = this.props;
    values.creator = localStorage.getItem('userName');
    // values.time = moment().format('YYYY-MM-DD HH:mm:ss');
    values.state = '0';
    // console.log(values);
    dispatch({
      type: 'job/update',
      payload: values,
    })
      .then(() => {
        dispatch({
          type: 'job/jobGet',
          payload: {type: '0'},
        });
      })
      .then(() => {
        this.setState({editvisible: false});
      });
  };
  onSearch = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'job/jobGetAllByName',
      payload: {name: value},
    });
  };
  reset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'job/jobGet',
      payload: {type: '0'},
    });
  };
  delete = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'job/jobDel',
      payload: {id: value.id},
    }).then(() => {
      dispatch({
        type: 'job/jobGet',
        payload: {type: '0'},
      });
    });
  };
  // formitemChange = (e: any) => {
  //   if (e === 'courseid') {
  //     this.setState({
  //       coursetag: true,
  //     });
  //   } else {
  //     this.setState({
  //       coursetag: false,
  //     });
  //   }
  // };
  evaluateClassOrMajor = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'job/evaluateClassOrMajor',
      payload: {jobId: value.id},
    });
    dispatch({
      type: 'job/jobGet',
      payload: {type: '0'},
    });
  };
  evaluateStudent = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'job/evaluateStudent',
      payload: {jobId: value.id},
    });
    dispatch({
      type: 'job/jobGet',
      payload: {type: '0'},
    });
  };

  render() {
    const {joblist, strategylist, evaluateStudentloading, MyPersons} =
      this.props;

    const {selectedTags} = this.state;
    const columns: ColumnsType<TableStyle> = [
      {
        key: 'id',
        title: '任务ID',
        dataIndex: 'id',
        align: 'center',
      },
      {
        key: 'name',
        title: '任务名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        key: 'strategyName',
        title: '评价策略',
        dataIndex: 'strategyName', //strategy_name
        align: 'center',
      },
      {
        key: 'personName',
        title: '关联分群',
        dataIndex: 'personName',
        align: 'center',
      },

      {
        key: 'creator',
        title: '创建人',
        dataIndex: 'creator',
        align: 'center',
      },
      {
        key: 'time',
        title: '创建时间',
        dataIndex: 'time',
        align: 'center',
      },
      {
        key: 'dim',
        title: '维度',
        dataIndex: 'dim',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          switch (text) {
            case 'userid':
              return <span>学生</span>;
            case 'majorid':
              return <span>专业</span>;
            case 'dormitory':
              return <span>宿舍</span>;
            case 'classid':
              return <span>班级</span>;
            default:
          }
        },
      },
      {
        key: 'state',
        title: '任务状态',
        dataIndex: 'state',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          switch (text) {
            case '1':
              return <Badge color="green" text="成功"/>;
            case '2':
              return <Badge color="blue" text="处理中"/>;
            case '3':
              return <Badge color="red" text="失败"/>;
            case '0':
              return <Badge color="volcano" text="未计算"/>;
            default:
          }
        },
      },
      {
        title: '操作',
        // dataIndex: 'english',
        align: 'center',
        render: (text: any, record: any) => (
          <Space>
            {record.dim === 'userid' ? (
              <Button type="link" onClick={() => this.evaluateStudent(record)}>
                计算
              </Button>
            ) : (
              <Button
                type="link"
                onClick={() => this.evaluateClassOrMajor(record)}
              >
                计算
              </Button>
            )}

            <Button type="link" onClick={() => this.editshowModal(record)}>
              编辑
            </Button>
            <Button type="link" onClick={() => this.delete(record)}>
              删除
            </Button>
          </Space>
        ),
      },
    ];

    const content = (
      <>
        <Paragraph>任务通过把策略与分群进行绑定，从而评价分群。</Paragraph>
        <Paragraph>
          策略，评价规则以及对应评价规则权重的集合，对分群进行量化分析。
        </Paragraph>
        <Paragraph>
          分群，用户感兴趣的学生群体，基于用户属性和用户行为筛选出的部分学生。
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
            title="分群评价/任务管理"
            subTitle="任务把策略与分群进行绑定"
            tags={<Tag color="blue">运行中</Tag>}
            extra={[
              <Button
                key={'reset'}
                onClick={this.reset}
                icon={<RedoOutlined/>}
              >
                刷新列表
              </Button>,
              <Button
                key={'create'}
                type="primary"
                onClick={this.showModal}
                icon={<PlusOutlined/>}
              >
                新建任务
              </Button>,
            ]}
            avatar={{src: require('@/assets/picture/任务.png')}}
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
                <span style={{marginRight: 8}}>任务状态:</span>
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
                placeholder="请输入任务名称开始查询"
                onSearch={this.onSearch}
                style={{width: 250}}
              />
            }
          >
            <Table
              columns={columns}
              dataSource={joblist}
              rowKey={() => Math.random()}
              loading={evaluateStudentloading}
            />
          </Card>

          <Modal
            width="600px"
            title="新建任务"
            visible={this.state.visible}
            onOk={this.handleOk}
            // confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel}
            footer={null}
          >
            <Form name="新建任务" onFinish={this.onFinish}>
              <Form.Item
                label="&nbsp;&nbsp;任&nbsp;务&nbsp;名&nbsp;称&nbsp;&nbsp;"
                name="name"
                rules={[{required: true, message: '请输入策略名称'}]}
              >
                <Input style={{width: '100%'}}/>
              </Form.Item>

              <Form.Item
                label="任务关联分群"
                name="personsId"
                rules={[{required: true, message: '请输入策略名称'}]}
              >
                <Select>
                  {MyPersons?.map((element: any, index: any) => {
                    return (
                      <Option value={element.id} key={index}>
                        {element.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>

              <Row>
                <Col span={8}>
                  <Form.Item
                    label="任务评价纬度"
                    name="dim"
                    rules={[{required: true, message: '请输入评价纬度'}]}
                  >
                    <Select
                      style={{width: '100%'}}
                      // onChange={this.formitemChange}
                    >
                      <Option value="majorid">专业</Option>
                      <Option value="classid">班级</Option>
                      <Option value="userid">学生</Option>
                      {/* <Option value="dormitory">宿舍</Option> */}
                    </Select>
                  </Form.Item>
                </Col>
                {/* <Col span={12} offset={4}>
                  <Form.Item
                    label="任务类型"
                    name="jobType"
                    rules={[{ required: true, message: '请输入任务类型' }]}
                  >
                    <Select style={{ width: '100%' }}>
                      <Option value="0">分群</Option>
                      <Option value="1">第二课堂</Option>
                    </Select>
                  </Form.Item>
                </Col> */}
              </Row>

              <Form.Item
                label="任务评价策略"
                name="strategyId"
                rules={[{required: true, message: '请输入策略名称'}]}
              >
                <Select>
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
            title="编辑任务"
            visible={this.state.editvisible}
            onOk={this.edithandleOk}
            // confirmLoading={this.state.confirmLoading}
            onCancel={this.edithandleCancel}
            footer={null}
            forceRender
          >
            <Form
              name="编辑任务"
              onFinish={this.editonFinish}
              ref={this.formRef}
            >
              <Form.Item
                label="&nbsp;&nbsp;任&nbsp;务&nbsp;名&nbsp;称&nbsp;&nbsp;"
                name="name"
                rules={[{required: true, message: '请输入策略名称'}]}
              >
                <Input style={{width: '100%'}}/>
              </Form.Item>

              <Form.Item
                label="任务关联分群"
                name="personsId"
                rules={[{required: true, message: '请输入策略名称'}]}
              >
                <Select>
                  {MyPersons?.map((element: any, index: any) => {
                    return (
                      <Option value={element.id} key={index}>
                        {element.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="id" hidden>
                <Input/>
              </Form.Item>

              <Row>
                <Col span={8}>
                  <Form.Item
                    label="任务评价纬度"
                    name="dim"
                    rules={[{required: true, message: '请输入策略名称'}]}
                  >
                    <Select
                      style={{width: '100%'}}
                      // onChange={this.formitemChange}
                    >
                      <Option value="majorid">专业</Option>
                      <Option value="classid">班级</Option>
                      <Option value="userid">学生</Option>
                      {/* <Option value="dormitory">宿舍</Option> */}
                    </Select>
                  </Form.Item>
                </Col>
                {/* <Col span={12} offset={4}>
                  <Form.Item
                    label="任务类型"
                    name="jobType"
                    rules={[{ required: true, message: '请输入任务类型' }]}
                  >
                    <Select style={{ width: '100%' }}>
                      <Option value="0">分群</Option>
                      <Option value="1">第二课堂</Option>
                    </Select>
                  </Form.Item>
                </Col> */}
              </Row>

              <Form.Item
                label="任务评价策略"
                name="strategyId"
                rules={[{required: true, message: '请输入策略名称'}]}
              >
                <Select>
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

export default connect(({job, loading, portrait}: any) => ({
  ...job,
  ...portrait,
  evaluateStudentloading: loading.effects['job/evaluateStudent'],
  evaluateClassOrMajorloading: loading.effects[' job/evaluateClassOrMajor'],
}))(JobManagement);
