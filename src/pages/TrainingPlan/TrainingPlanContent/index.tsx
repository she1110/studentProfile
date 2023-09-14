import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, history, Link} from 'umi';
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Tag,
  Typography,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import {PlusOutlined} from '@ant-design/icons';
import moment from 'moment';
import {ColumnsType} from 'antd/es/table';

const {Search} = Input;
const {Option} = Select;
const {Paragraph} = Typography;

export type APP = {
  courseId: string;
  courseName: string;
  courseType: string;
  courseAttr: string;
  courseTag: string;
  credit: string;
  schoolId: string;
};

export type Props = {
  dispatch: Dispatch;
  location?: any;
  courseInPlan?: any;
  courseAllTag?: any;
};

const data = [
  {
    courseId: '1',
    courseName: '高等数学',
    courseType: '通识',
    courseAttr: '选修',
    courseTag: '偏数学',
    credit: '4',
    schoolId: '河北工业大学',
  },
  {
    courseId: '2',
    courseName: '离散数学',
    courseType: '专业',
    courseAttr: '必修',
    courseTag: '偏数学',
    credit: '4',
    schoolId: '河北工业大学',
  },
];

class TrainingPlanContent extends Component<Props> {
  state = {
    visible: false, //给课程打标签 modal
    createTagVisible: false, //新建标签 modal
    courseInfoId: undefined, //点击课程标签加号 保存课程ID
  };
  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    this.reLoadData();
  };

  reLoadData = () => {
    const {location, dispatch} = this.props;
    console.log(location);
    let TrainingPlanContentState: any;
    if (location.state !== undefined) {
      localStorage.setItem(
        'TrainingPlanContent',
        JSON.stringify(location.state),
      );
      TrainingPlanContentState = location.state;
      console.log(TrainingPlanContentState);
      if (dispatch) {
        dispatch({
          type: 'trainingplan/getAllCourseByTrain',
          payload: {
            trainPlanId: TrainingPlanContentState.trainPlanId,
          },
        });
      }
    } else {
      if (localStorage.getItem('TrainingPlanContent') !== null) {
        TrainingPlanContentState = JSON.parse(
          localStorage.getItem('TrainingPlanContent'),
        );
        console.log(TrainingPlanContentState);
        if (dispatch) {
          dispatch({
            type: 'trainingplan/getAllCourseByTrain',
            payload: {
              trainPlanId: TrainingPlanContentState.trainPlanId,
            },
          });
        }
      } else {
        history.push('/TrainingPlan/TrainingPlanList');
      }
    }
  };

  showModal = (value: any) => {
    console.log(value);

    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'trainingplan/getAllTagByCourse',
        payload: {
          courseInfoId: value.courseInfoId,
        },
      });
    }

    this.setState({
      visible: true,
      courseInfoId: value.courseInfoId,
    });
  };
  handleOk = () => {
    this.setState({
      visible: false,
      courseInfoId: undefined,
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
      courseInfoId: undefined,
    });
  };

  showTagModal = () => {
    this.setState({
      createTagVisible: true,
      visible: false,
    });
  };
  handleTagOk = () => {
    const {dispatch} = this.props;
    this.formRef.current?.validateFields().then((values: any) => {
      console.log(values);
      dispatch({
        type: 'trainingplan/addTag',
        payload: {
          name: values.name,
          type: '1',
        },
      });
    });
    this.setState({
      createTagVisible: false,
    });
  };
  handleTagCancel = () => {
    this.setState({
      createTagVisible: false,
    });
  };

  //给课程添加标签
  addTag = (value: any) => {
    console.log(value);
    const {dispatch} = this.props;
    const {courseInfoId} = this.state;
    let tags: any = [];
    tags.push(value.name);
    dispatch({
      type: 'trainingplan/updateCourseTag',
      payload: {
        courseInfoId: courseInfoId ? courseInfoId : null,
        tags: tags,
        type: '1', //type=1 给课程添加标签
      },
    }).then(() => {
      dispatch({
        type: 'trainingplan/getAllTagByCourse',
        payload: {
          courseInfoId: courseInfoId,
        },
      });
      this.reLoadData();
    });
  };
  //给课程移除标签
  deleteTag = (value: any) => {
    console.log(value);
    const {dispatch} = this.props;
    const {courseInfoId} = this.state;
    let tags: any = [];
    tags.push(value.name);
    dispatch({
      type: 'trainingplan/updateCourseTag',
      payload: {
        courseInfoId: courseInfoId ? courseInfoId : null,
        tags: tags,
        type: '0', //type=0 给课程删除标签
      },
    }).then(() => {
      dispatch({
        type: 'trainingplan/getAllTagByCourse',
        payload: {
          courseInfoId: courseInfoId,
        },
      });
      this.reLoadData();
    });
  };
  onFinish = (value: any) => {
    console.log(value);
  };

  render() {
    const {dispatch, courseInPlan, courseAllTag} = this.props;
    const {visible, createTagVisible} = this.state;
    const columns: ColumnsType<APP> = [
      {
        title: '课程编号',
        dataIndex: 'courseId',
        align: 'center',
      },
      {
        title: '课程名称',
        dataIndex: 'courseName',
        align: 'center',
      },
      {
        title: '课程类别',
        dataIndex: 'courseType',
        align: 'center',
        render: (text: any, record: any) => {
          return <Tag>{text}</Tag>;
        },
      },
      {
        title: '课程属性',
        dataIndex: 'courseAttr',
        align: 'center',
        render: (text: any, record: any) => {
          if (text === '0') {
            return <Tag>选修</Tag>;
          }
          if (text === '1') {
            return <Tag>必修</Tag>;
          }
        },
      },
      {
        title: '课程标签',
        dataIndex: 'courseTag',
        align: 'center',
        render: (text: any, record: any) => {
          const tags = record.tags;
          return (
            <>
              {tags.map((element: any, index: any) => {
                return element.tag !== null ? (
                  <Tag color="blue" key={index}>
                    {element.tag}
                  </Tag>
                ) : null;
              })}
              <PlusOutlined
                onClick={() => {
                  this.showModal(record);
                }}
              />
            </>
          );
        },
      },
      {
        title: '学分',
        dataIndex: 'credit',
        align: 'center',
      },
    ];
    return (
      <div>
        <ConfigProvider locale={zhCN}>
          <Card
            title="培养计划详情"
            extra={
              <Button
                type="primary"
                onClick={() => {
                  history.push('/TrainingPlan/TrainingPlanList');
                }}
              >
                返回列表
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={courseInPlan}
              rowKey={() => Math.random()}
              // loading={AddLoading || UpdateLoading}
              style={{height: 800}}
            />
          </Card>
          <Modal
            title="添加标签"
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width="900px"
          >
            <Row>
              <Col span={12}>
                <Row>
                  <Col span={21}>
                    <Button
                      type="dashed"
                      style={{width: '100%', height: '58px'}}
                      onClick={this.showTagModal}
                    >
                      <PlusOutlined/> 新增标签
                    </Button>
                  </Col>
                  <Col span={2} offset={1}>
                    <Divider type="vertical" style={{height: '50px'}}/>
                  </Col>
                </Row>
                <Divider/>
              </Col>

              {courseAllTag?.map((element: any, index: any) => {
                return (
                  <Col span={12} key={index}>
                    <Row align="middle">
                      <Col span={3}>
                        <Image
                          src={require('@/assets/picture/标签.png')}
                          style={{height: '100%', width: '100%'}}
                          preview={false}
                        />
                      </Col>

                      <Col span={12}>
                        <div style={{fontSize: 16, marginLeft: 20}}>
                          {element.name}
                        </div>
                      </Col>

                      <Col span={5} offset={1}>
                        <Button
                          style={{width: '100%'}}
                          type={element.state === 0 ? 'primary' : undefined}
                          size="small"
                          onClick={() => {
                            element.state === 0
                              ? this.addTag(element)
                              : this.deleteTag(element);
                          }}
                        >
                          {element.state === 0 ? '添加' : '移除'}
                        </Button>
                      </Col>
                      <Col span={2} offset={1}>
                        <Divider type="vertical" style={{height: '50px'}}/>
                      </Col>
                    </Row>
                    <Divider/>
                  </Col>
                );
              })}
            </Row>
          </Modal>

          <Modal
            title="新建标签"
            visible={createTagVisible}
            // onOk={this.handleTagOk}
            onCancel={this.handleTagCancel}
            width="400px"
            footer={[
              <Button key="cancel" onClick={this.handleTagCancel}>
                取消
              </Button>,
              <Button key="agree" type="primary" onClick={this.handleTagOk}>
                添加
              </Button>,
            ]}
          >
            <Form layout="vertical" onFinish={this.onFinish} ref={this.formRef}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="name"
                    label="标签名称"
                    rules={[{required: true, message: '请输入标签名称'}]}
                  >
                    <Input placeholder="标签名称"/>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name="creator"
                    label="创建人"
                    rules={[{required: true, message: '请输入创建人'}]}
                    initialValue={localStorage.getItem('userName')}
                  >
                    <Input placeholder="标签创建人" disabled/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="createTime"
                    label="创建时间"
                    rules={[{required: true, message: '请输入创建时间'}]}
                    initialValue={moment(new Date()).format(
                      'YYYY-MM-DD HH:mm:ss',
                    )}
                  >
                    <Input placeholder="创建时间" disabled></Input>
                  </Form.Item>
                </Col>
              </Row>
              {/* <Divider />
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            保存用户画像
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row> */}
            </Form>
          </Modal>
        </ConfigProvider>
      </div>
    );
  }
}

export default connect(({trainingplan, loading}: any) => ({
  ...trainingplan,
  // AddLoading: loading.effects['application/appAdd'],
}))(TrainingPlanContent);
