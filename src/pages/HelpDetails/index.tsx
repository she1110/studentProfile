import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, history, Link} from 'umi';
import {
  Avatar,
  Card,
  Col,
  Collapse,
  Descriptions,
  Empty,
  Input,
  PageHeader,
  Row,
  Select,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import {UserOutlined,} from '@ant-design/icons';
import 'rc-texty/assets/index.css';
// import FirstWarning from "./components/FirstWarning";

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
  studentReport?: any;
  sendReportMailLoading?: boolean;
  location?: any;
  WarnDetail?: any;
};

class HelpDetails extends Component<Props> {
  state = {
    TabsVisible: '1', //标签页
    picPath: undefined, //头像地址
    selectedRowKeys: [], // Check here to configure the default column
  };

  formRef = React.createRef<FormInstance>();
  GPATrend = React.createRef<Function>();
  fiveStarBase64 = React.createRef<Function>();

  componentDidMount = () => {
    const {dispatch, location} = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/getcurrentuserinfo',
        payload: {
          callback: (value: any) => {
            this.setCurrentUserInfo(JSON.parse(value));
          },
        },
      });
      console.log(location);

      if (location.state === undefined) {
        history.goBack();
      } else {
        dispatch({
          type: 'studentwarning/getWarnDetail',
          payload: {
            semeWarnId: location.state.SEMEWARNID,
            userid: location.state.USERID,
            helpUserid: location.state.HELP_USERID,
            warnYear: location.state.WARN_YEAR,
            failCount: location.state.FAIL_COUNT,
            warnSeason: location.state.WARN_SEASON,
          },
        });
      }
    }
  };
  //获取 用户头像
  setCurrentUserInfo = (value: any) => {
    this.setState({
      picPath: value.picPath,
    });
  };
  //各个主题间切换
  TabsOnChange = (value: any) => {
    this.setState({
      TabsVisible: value,
    });
  };
  onSelectChange = (selectedRowKeys: any) => {
    this.setState({selectedRowKeys});
  };

  render() {
    const {studentReport, WarnDetail} = this.props;
    const {} = this.state;
    const Content = ({children, extraContent}: any) => (
      <Row>
        <div style={{flex: 1}}>{children}</div>
        <div className="image">{extraContent}</div>
      </Row>
    );
    const FailCourseColumns = [
      {
        title: '课程号',
        dataIndex: 'COURSEID',
        key: 'COURSEID',
        align: 'center',
      },
      {
        title: '课程名称',
        dataIndex: 'EXAMCOURSENAME',
        key: 'EXAMCOURSENAME',
        align: 'center',
      },

      {
        title: '课程学分',
        dataIndex: 'CREDIT',
        key: 'CREDIT',
        align: 'center',
      },
      {
        title: '课程分数',
        dataIndex: 'SCORE',
        key: 'SCORE',
        align: 'center',
      },
      {
        title: '课程时间',
        dataIndex: 'TIME',
        key: 'TIME',
        align: 'center',
      },
    ];
    const HelpColumns = [
      {
        title: '帮扶时间',
        dataIndex: 'helpDate',
        key: 'helpDate',
        align: 'center',
      },
      {
        title: '帮扶备注',
        dataIndex: 'helpDesc',
        key: 'helpDesc',
        align: 'center',
      },
    ];
    const WarningColumns = [
      {
        title: '预警年份',
        dataIndex: 'warnYear',
        key: 'warnYear',
        align: 'center',
      },
      {
        title: '预警学期',
        dataIndex: 'warnSeason',
        key: 'warnSeason',
        align: 'center',
      },
      {
        title: '预警等级',
        dataIndex: 'warnLevel',
        key: 'warnLevel',
        align: 'center',
      },
      {
        title: '帮扶人姓名',
        dataIndex: 'helpUserid',
        key: 'helpUserid',
        align: 'center',
      },
      {
        title: '挂科科目数',
        dataIndex: 'failCount',
        key: 'failCount',
        align: 'center',
      },
    ];
    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        {studentReport?.picPath ? (
          <img src={require('@/assets/picture/任务详情.png')} id="ljh111"/>
        ) : null}
        <div style={{marginBottom: 30, backgroundColor: 'white'}}>
          {/* <Button onClick={() => {
                        console.log(WarnDetail);
                    }}>ceshi</Button> */}
          <PageHeader
            title="帮扶详情"
            subTitle="包含学生属性和学生行为"
            tags={<Tag color="blue">运行中</Tag>}
            avatar={{src: require('@/assets/picture/帮扶详情.png')}}
          >
            <Content
              extraContent={
                studentReport?.picPath ? (
                  <Avatar
                    size={120}
                    src={studentReport.picPath}
                    style={{marginRight: 20}}
                  />
                ) : (
                  <Avatar
                    size={120}
                    icon={<UserOutlined/>}
                    style={{marginRight: 20}}
                  />
                )
              }
            >
              <Paragraph>
                针对受到学业预警的同学为其制订符合学院实际情况的帮扶计划，从而帮助学生顺利完成学业。
              </Paragraph>
              <Paragraph>
                辅导员组织本班级学习成绩优异学生与受学业预警学生结对子，进行一对一帮扶，采取有效措施，制定帮扶计划、帮扶目标。
              </Paragraph>
              <Paragraph>
                {WarnDetail?.nowWarn ? (
                  <>
                    <Descriptions
                      title="当前学期预警记录"
                      size="small"
                      bordered
                    >
                      {/* <Descriptions.Item label="预警学生">
                                                {WarnDetail.nowWarn.helpUserid}
                                            </Descriptions.Item> */}
                      <Descriptions.Item label="预警时间">
                        {WarnDetail.nowWarn.warnYear}{' '}
                        {WarnDetail.nowWarn.warnSeason}
                      </Descriptions.Item>
                      <Descriptions.Item label="预警等级">
                        {WarnDetail.nowWarn.warnLevel}
                      </Descriptions.Item>
                    </Descriptions>
                  </>
                ) : null}
              </Paragraph>
              {/* <Tabs size="large">
                                <TabPane key="1" />
                            </Tabs> */}
            </Content>
          </PageHeader>
        </div>

        <div style={{marginBottom: 30, backgroundColor: '#ececec'}}>
          <Row gutter={30}>
            <Col span={12}>
              {WarnDetail ? (
                <div
                  style={{
                    // marginBottom: 20,
                    // marginRight: 5,
                    height: 610,
                    backgroundColor: 'white',
                  }}
                >
                  <Card title={'帮扶详情'}>
                    <Card title="帮扶人信息" type="inner">
                      <Descriptions bordered>
                        <Descriptions.Item label="帮扶人学号">
                          {WarnDetail.helpDetail.helpUserid}
                        </Descriptions.Item>
                        <Descriptions.Item label="帮扶人姓名">
                          {WarnDetail.helpDetail.helpUsername}
                        </Descriptions.Item>
                        <Descriptions.Item label="帮扶人班级">
                          {WarnDetail.helpDetail.helpClassName}
                        </Descriptions.Item>
                        <Descriptions.Item label="帮扶人专业">
                          {WarnDetail.helpDetail.helpMajorName}
                        </Descriptions.Item>
                        {/* <Descriptions.Item label="帮扶人联系方式" span={2}>
                                                18032713255
                                            </Descriptions.Item> */}
                      </Descriptions>
                    </Card>
                    <Card title="被帮扶记录" type="inner">
                      {'helpDetail' in WarnDetail &&
                      'records' in WarnDetail.helpDetail &&
                      WarnDetail.helpDetail.records.length !== 0 ? (
                        <Table
                          dataSource={WarnDetail.helpDetail.records}
                          // rowSelection={rowSelection}
                          columns={HelpColumns}
                          pagination={{
                            pageSize: 2,
                          }}
                        />
                      ) : (
                        <Empty/>
                      )}
                    </Card>
                  </Card>
                </div>
              ) : null}
            </Col>
            <Col span={12}>
              {WarnDetail ? (
                <div
                  style={{
                    // marginBottom: 20,
                    // marginRight: 5,
                    height: 600,
                    backgroundColor: 'white',
                  }}
                >
                  <Card title={'被预警科目'}>
                    <Table
                      dataSource={WarnDetail.exam}
                      rowKey={(record) => record.COURSEID}
                      columns={FailCourseColumns}
                      pagination={{
                        pageSize: 7,
                      }}
                    />
                  </Card>
                </div>
              ) : null}
            </Col>
          </Row>
        </div>
        <div style={{marginBottom: 30, backgroundColor: '#ececec'}}>
          <Card title={'历史预警信息'}>
            {WarnDetail &&
            'beforeAndAfter' in WarnDetail &&
            WarnDetail.beforeAndAfter ? (
              <Table
                dataSource={WarnDetail.beforeAndAfter}
                // rowSelection={rowSelection}
                columns={WarningColumns}
              />
            ) : (
              <Empty/>
            )}
          </Card>
        </div>
      </div>
    );
  }
}

export default connect(({studentwarning, loading}: any) => ({
  ...studentwarning,
}))(HelpDetails);
