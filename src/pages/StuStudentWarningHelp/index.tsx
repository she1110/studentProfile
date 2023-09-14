import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {
  Button,
  Card,
  Col,
  Collapse,
  ConfigProvider,
  Descriptions,
  Form,
  Input,
  Modal,
  PageHeader,
  Row,
  Select,
  Skeleton,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import 'rc-texty/assets/index.css';
// import FirstWarning from "./components/FirstWarning";
import MuGe from '@/assets/stuwarning/damuge.png';

const {Search} = Input;
const {Option} = Select;
const {Paragraph} = Typography;
const {Panel} = Collapse;
const {TabPane} = Tabs;
const {TextArea} = Input;

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
  stuDetail?: object[];
  HullTree?: any;
  stuWarningMsg?: object[]; //学生的学期预警记录
  helper?: object[]; //帮扶信息
  warner?: object[]; //被帮扶信息
};

class StuStudentWarningHelp extends Component<Props> {
  state = {
    visible: false, //申诉modal
    addHelpDetailVisible: false, //添加帮扶记录modal
    showHelpDetailVisible: false, //查看帮扶详情modal
    record: {
      COURSEID: undefined,
      EXAMCOURSENAME: undefined,
      TIME: undefined,
    }, //申诉课程信息
    quesType: undefined, //申诉接口--问题类型： 0-学期预警，1-累计预警
    helpRecord: {
      userName: undefined,
      helpUserName: undefined,
      semeWarnId: undefined,
      warnLevel: undefined,
    },
    helpDetail: [], //帮扶详情数据
  };

  formRef = React.createRef<FormInstance>();
  addFormRef = React.createRef<FormInstance>();
  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'studentwarning/warningStuDetail',
        payload: {
          userId: JSON.parse(localStorage.userAllMessage).account,
        },
      });
      // getMyHelpSemeWarn,
      // addHelpRecord,
      dispatch({
        type: 'studentwarning/getMyHelpSemeWarn',
        payload: {
          userId: JSON.parse(localStorage.userAllMessage).account,
        },
      });
    }
    //筛选出作为被帮扶人的帮扶信息
  };

  onFinish = (value: any) => {
    console.log(value);
    const {dispatch} = this.props;
    const {helpRecord} = this.state;
    if (dispatch) {
      dispatch({
        type: 'studentwarning/addHelpRecord',
        payload: {
          semeWarnId: helpRecord.semeWarnId,
          helpDesc: value.helpDesc,
        },
      })
        .then(() => {
          dispatch({
            type: 'studentwarning/warningStuDetail',
            payload: {
              userId: JSON.parse(localStorage.userAllMessage).account,
            },
          });
        })
        .then(() => {
          this.setState({addHelpDetailVisible: false});
        });
    }
    this.addFormRef.current?.resetFields();
  };

  //Modal
  handleShenSuXueQi = (value: any) => {
    this.setState({record: value});
    this.setState({quesType: 0});
    this.setState({visible: true});
  };
  handleShenSuLeiJi = (value: any) => {
    this.setState({record: value});
    this.setState({quesType: 1});
    this.setState({visible: true});
  };
  onChange = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };
  handleOk = () => {
    //发送要申诉的课程信息
    const {dispatch, stuDetail} = this.props;
    const {record, quesType} = this.state;

    if (dispatch) {
      dispatch({
        type: 'studentwarning/questWarn',
        payload: {
          acceptId: stuDetail?.teacher.id, //接收者
          courseId: record.COURSEID, //课程编号
          courseTime: record.TIME, //考试时间
          courseName: record.EXAMCOURSENAME, //考试名
          semeQuesId: stuDetail?.info.semeWarnId, //关联预警id
          quesType: quesType, //'record.quesType'    //问题类型： 0-学期预警，1-累计预警
        },
      });
    }
    this.setState({visible: false});
  };
  handleCancel = () => {
    this.setState({visible: false});
    this.setState({addHelpDetailVisible: false});
    this.setState({showHelpDetailVisible: false});
  };
  //添加帮扶信息
  handleAddDetai = (record: any) => {
    this.setState({helpRecord: record});
    this.setState({addHelpDetailVisible: true});
  };
  addHelpDetail = () => {
    this.setState({addHelpDetailVisible: false});
  };
  //查看帮扶信息详情
  handleShowDetai = (record: any) => {
    const helpDetail = this.props.stuDetail?.helpRecords;
    this.setState({
      helpDetail: helpDetail.filter(
        (item: any) => item.semeWarnId == record.semeWarnId,
      ),
    });
    this.setState({showHelpDetailVisible: true});
  };

  render() {
    const {stuDetail, stuWarningMsg, helper, warner} = this.props;
    const {
      visible,
      addHelpDetailVisible,
      showHelpDetailVisible,
      helpRecord,
      helpDetail,
    } = this.state;
    const content = (
      <>
        <Paragraph>
          学业预警可以查看学生的预警等级、未达标科目等信息。
        </Paragraph>
        <Paragraph>帮扶记录可以查看学生间帮扶互助的学习过程。</Paragraph>
        <Paragraph>
          有助于学生了解自身学习情况，发现问题并及时处理，能促进学生之间友好互助。
        </Paragraph>
      </>
    );

    const Content = ({children, extraContent}: any) => (
      <Row>
        <div style={{flex: 1}}>{children}</div>
        <div className="image">{extraContent}</div>
      </Row>
    );

    const xueqicolumns = [
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
      {
        title: '课程学分',
        dataIndex: 'CREDIT',
        key: 'CREDIT',
        align: 'center',
      },
      {
        title: '考试时间',
        dataIndex: 'TIME',
        key: 'TIME',
        align: 'center',
      },
      {
        title: ' ',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          return (
            <Space>
              <Button
                type="link"
                onClick={() => this.handleShenSuXueQi(record)}
              >
                申诉
              </Button>
            </Space>
          );
        },
      },
    ];
    const leijiguake = [
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
      {
        title: '考试学期',
        dataIndex: 'SEME',
        key: 'SEME',
        align: 'center',
      },
      {
        title: '考试时间',
        dataIndex: 'TIME',
        key: 'TIME',
        align: 'center',
      },
      {
        title: ' ',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          return (
            <Space>
              <Button
                type="link"
                onClick={() => this.handleShenSuLeiJi(record)}
              >
                申诉
              </Button>
            </Space>
          );
        },
      },
    ];
    const helpInfoColumns = [
      // {
      //   title: '帮扶人',
      //   dataIndex: 'helpUserName',
      //   key: 'helpUserName',
      //   align: 'center',
      // },
      {
        title: '预警学生',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
      },
      {
        title: '预警学生学号',
        dataIndex: 'userId',
        key: 'userId',
        align: 'center',
      },
      {
        title: '挂科数',
        dataIndex: 'failCount',
        key: 'failCount',
        align: 'center',
      },
      {
        title: '预警等级',
        dataIndex: 'warnLevel',
        key: 'warnLevel',
        align: 'center',
      },
      {
        title: '帮扶学期',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          return (
            <Space>
              {record.warnYear}年{record.warnSeason}
            </Space>
          );
        },
      },
      {
        title: '详情',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          return (
            <Space size="middle">
              <Button type="link" onClick={() => this.handleShowDetai(record)}>
                查看
              </Button>
              <Button type="link" onClick={() => this.handleAddDetai(record)}>
                添加
              </Button>
            </Space>
          );
        },
      },
    ];
    const helpDetailColumns = [
      {
        title: '时间',
        dataIndex: 'helpDate',
        key: 'helpDate',
        align: 'center',
      },
      {
        title: '描述',
        dataIndex: 'helpDesc',
        key: 'helpDesc',
        align: 'center',
      },
    ];
    const warningInfoColumns = [
      {
        title: '帮扶人',
        dataIndex: 'helpUserName',
        key: 'helpUserName',
        align: 'center',
      },
      {
        title: '帮扶人学号',
        dataIndex: 'helpUserId',
        key: 'helpUserId',
        align: 'center',
      },
      {
        title: '挂科数',
        dataIndex: 'failCount',
        key: 'failCount',
        align: 'center',
      },
      {
        title: '预警等级',
        dataIndex: 'warnLevel',
        key: 'warnLevel',
        align: 'center',
      },
      {
        title: '学期',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          return (
            <Space>
              {record.warnYear}年{record.warnSeason}
            </Space>
          );
        },
      },
      {
        title: '详情',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          return (
            <Space size="middle">
              <Button type="link" onClick={() => this.handleShowDetai(record)}>
                查看
              </Button>
            </Space>
          );
        },
      },
    ];
    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        {/* <Button onClick={() => {
          console.log(helper)
          console.log(warner)
        }}>asd</Button> */}
        <div style={{marginBottom: 20, backgroundColor: 'white'}}>
          <PageHeader
            title="学业预警与帮扶记录"
            subTitle=" "
            tags={<Tag color="blue">运行中</Tag>}
            avatar={{src: require('@/assets/picture/学籍预警.png')}}
          >
            <Content>{content}</Content>
          </PageHeader>
        </div>
        <Row>
          <Col span={12}>
            <div
              style={{
                marginBottom: 20,
                marginRight: 5,
                height: 454,
                backgroundColor: 'white',
              }}
            >
              {stuDetail?.warn != '' ? (
                <Card
                  title="预警科目"
                  extra={
                    <div>
                      <Tag color="red">
                        {' '}
                        {stuDetail?.info.warnYear}年{stuDetail?.info.warnSeason}{' '}
                      </Tag>
                      <Tag color="red"> {stuDetail?.info.warnLevel} </Tag>
                    </div>
                  }
                >
                  <Table
                    dataSource={stuDetail?.warn}
                    columns={xueqicolumns}
                    rowKey={(record) => record.COURSEID}
                    pagination={{
                      pageSize: 3,
                    }}
                  />
                </Card>
              ) : (
                <Card title="暂无预警科目">
                  <div style={{textAlign: 'center'}}>
                    <img style={{height: 314}} src={MuGe} alt=""/>
                  </div>
                </Card>
              )}
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                marginBottom: 20,
                marginLeft: 5,
                height: 454,
                backgroundColor: 'white',
              }}
            >
              {stuDetail?.stil != '' ? (
                <Card title="累计挂科科目">
                  <Table
                    dataSource={stuDetail?.stil}
                    columns={leijiguake}
                    rowKey={(record) => record.COURSEID}
                    pagination={{
                      pageSize: 3,
                    }}
                  />
                </Card>
              ) : (
                <Card title="暂无累计挂科科目">
                  <div style={{textAlign: 'center'}}>
                    <img style={{height: 314}} src={MuGe} alt=""/>
                  </div>
                </Card>
              )}
            </div>
          </Col>
        </Row>
        <div style={{marginBottom: 20, backgroundColor: 'white'}}>
          {helper?.length ? (
            <Card title="帮扶记录">
              <Table
                dataSource={helper}
                // rowSelection={rowSelection}
                columns={helpInfoColumns}
                pagination={{
                  pageSize: 5,
                }}
              />
            </Card>
          ) : (
            <Card title="暂无帮扶记录">
              <Skeleton/>
            </Card>
          )}
        </div>
        <div style={{backgroundColor: 'white'}}>
          {warner?.length ? (
            <Card title="被帮扶记录">
              <Table
                dataSource={warner}
                // rowSelection={rowSelection}
                columns={warningInfoColumns}
                pagination={{
                  pageSize: 5,
                }}
              />
            </Card>
          ) : (
            <Card title="暂无被帮扶记录">
              <Skeleton/>
            </Card>
          )}
        </div>

        <ConfigProvider locale={zhCN}>
          {/* 申诉 */}
          <Modal
            // title='申诉课程'
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText={'申诉'}
          >
            <div>
              <Descriptions title="申诉课程" bordered>
                <Descriptions.Item label="课程名称" span={3}>
                  {this.state.record.EXAMCOURSENAME}
                </Descriptions.Item>
                <Descriptions.Item label="课程编号" span={3}>
                  {this.state.record.COURSEID}
                </Descriptions.Item>
                <Descriptions.Item label="考试时间" span={3}>
                  {this.state.record.TIME}
                </Descriptions.Item>
                <Descriptions.Item label="接收者" span={3}>
                  {stuDetail?.teacher.name}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Modal>
          {/* 帮扶详情 */}
          <Modal
            title="查看帮扶详情"
            visible={showHelpDetailVisible}
            // onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={
              [
                // <Button type="primary" onClick={this.handleCancel}>
                //   确认
                // </Button>,
              ]
            }
          >
            <Table
              dataSource={helpDetail}
              columns={helpDetailColumns}
              pagination={{
                pageSize: 5,
              }}
            />
          </Modal>
          {/* 添加帮扶信息 */}
          <Modal
            title="添加帮扶信息"
            visible={addHelpDetailVisible}
            onOk={this.addHelpDetail}
            onCancel={this.handleCancel}
            footer={null}
          >
            <Form
              name="添加帮扶信息"
              onFinish={this.onFinish}
              ref={this.addFormRef}
              labelCol={{span: 4}}
            >
              <Form.Item label="帮扶人" name="helpUserName">
                <Input
                  disabled
                  bordered
                  defaultValue={helpRecord.helpUserName}
                  style={{width: '100%'}}
                />
              </Form.Item>
              <Form.Item label="预警学生" name="userName">
                <Input
                  disabled
                  bordered
                  defaultValue={helpRecord.userName}
                  style={{width: '100%'}}
                />
              </Form.Item>
              <Form.Item label="预警编号" name="semeWarnId">
                <Input
                  disabled
                  bordered
                  defaultValue={helpRecord.semeWarnId}
                  style={{width: '100%'}}
                />
              </Form.Item>
              <Form.Item label="预警等级" name="warnLevel">
                <Input
                  disabled
                  bordered
                  defaultValue={helpRecord.warnLevel}
                  style={{width: '100%'}}
                />
              </Form.Item>
              <Form.Item label="描述" name="helpDesc">
                <TextArea rows={4}/>
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

export default connect(({user, studentwarning, loading}: any) => ({
  ...user,
  ...studentwarning,
  sendReportMailLoading: loading.effects['studentwarning/warningStuDetail'],
}))(StuStudentWarningHelp);
