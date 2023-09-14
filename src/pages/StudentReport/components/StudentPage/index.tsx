import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {Badge, Card, Col, Collapse, ConfigProvider, Descriptions, Divider, Row, Spin, Table, Typography,} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import LineChart from '../LineChart/index';
import LinkageChart from '../LinkageChart/index';
import CompareRadarChart from '../CompareRadarChart/index';
import UnderSixtyChart from './components/UnderSixtyChart/index';
import Reword from './components/Reword';

const {Panel} = Collapse;
const {Title} = Typography;

export type Props = {
  dispatch?: Dispatch;
  location?: any;
  studentReport?: {
    baseInfo?:
      | {
      姓名: string;
      平均绩点: string;
      辅导员: string;
      入学年份: string;
      专业: string;
      性别: string;
      班级职务: string;
      民族: string;
      班级: string;
      学院: string;
      政治面貌: string;
      学生会职务: string;
      学号: string;
      班级排名: string;
      专业排名: string;
    }
      | undefined; //学生基本属性
    examDataMap?: any; //第一课堂数据
    activityData?: any; //第二课堂数据
    gpaTrend?: any; //gpa曲线数据
    fiveStar?: any; //雷达图数据
    evaluateWords?: any; //评语
    underSixty?: any; //不及格科目
    underSixtyGraph?: any; //不及格科目 柱状图
  };
  allLoading?: boolean;
  userId?: any;
  identifyDataInProfileData?: any;
};

class StudentPage extends Component<Props> {
  state = {};
  formRef = React.createRef<FormInstance>();
  componentDidMount = () => {
    const {dispatch, userId} = this.props;
    const roleTag = localStorage.getItem('roles');
    const userAllMessage = JSON.parse(
      localStorage.getItem('userAllMessage') as string,
    );
    let userid: any;
    if (roleTag === '2') {
      userid = userAllMessage.account;
    } else {
      userid = userId || '181418';
    }
    if (dispatch) {
      dispatch({
        type: 'trainingplan/personalProfile',
        payload: {
          userid: userid,
        },
      });
      dispatch({
        type: 'trainingplan/identifyDataInProfile',
        payload: {
          userid: userid,
        },
      });
    }
  };

  render() {
    const {studentReport, allLoading, userId, identifyDataInProfileData} =
      this.props;
    const {} = this.state;
    const examDataMapColumns = [
      {
        title: '课程编号',
        dataIndex: 'courseid',
        key: 'courseid',
      },
      {
        title: '课程名称',
        dataIndex: 'examcoursename',
        key: 'examcoursename',
      },
      {
        title: '课程学分',
        dataIndex: 'credit',
        key: 'credit',
      },
      {
        title: '课程得分',
        dataIndex: 'score',
        key: 'score',
        sorter: {
          compare: (a: { score: number }, b: { score: number }) =>
            a.score - b.score,
          multiple: 3,
        },
      },
    ];
    const activityColumns = [
      {
        title: '活动名称',
        dataIndex: 'activityname',
        key: 'activityname',
      },
      {
        title: '获得学分',
        dataIndex: 'rewardresult',
        key: 'rewardresult',
      },
      {
        title: '活动举办学期',
        dataIndex: 'yearandseme',
        key: 'yearandseme',
      },
    ];
    const roleTag = localStorage.getItem('roles');
    const columns = [
      {
        title: '课程编号',
        dataIndex: 'courseid',
        key: 'courseid',
      },
      {
        title: '课程名称',
        dataIndex: 'examcoursename',
        key: 'examcoursename',
      },
      {
        title: '课程学分',
        dataIndex: 'credit',
        key: 'credit',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (record !== null) {
            return <span>{text + '分'}</span>;
          }
        },
      },
      {
        title: '课程学期',
        dataIndex: 'yearandseme',
        key: 'yearandseme',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (record !== null) {
            if (text === '1-1') {
              return <span>{'第一学年第一学期'}</span>;
            }
            if (text === '1-2') {
              return <span>{'第一学年第二学期'}</span>;
            }
            if (text === '2-1') {
              return <span>{'第二学年第一学期'}</span>;
            }
            if (text === '2-2') {
              return <span>{'第二学年第二学期'}</span>;
            }

            if (text === '3-1') {
              return <span>{'第三学年第一学期'}</span>;
            }
            if (text === '3-2') {
              return <span>{'第三学年第二学期'}</span>;
            }
            if (text === '4-1') {
              return <span>{'第四学年第一学期'}</span>;
            }
            if (text === '4-2') {
              return <span>{'第四学年第二学期'}</span>;
            }
          }
        },
      },
      {
        title: '考试时间',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (record !== null) {
            return <span>{moment(text).format('YYYY-MM-DD')}</span>;
          }
        },
      },

      {
        title: '考试分数',
        dataIndex: 'score',
        key: 'score',
        align: 'center',
      },
    ];
    return (
      <div>
        {/* <Button onClick={() => {
          console.log(identifyDataInProfileData);
        }}>ceshi</Button> */}
        <Spin spinning={allLoading ? allLoading : false}>
          {roleTag === '2' ? null : (
            <Card style={{marginBottom: 30}}>
              <Descriptions title="学生基本信息" bordered column={3}>
                <Descriptions.Item label="姓名（Name）">
                  {studentReport?.baseInfo?.姓名}
                </Descriptions.Item>
                <Descriptions.Item label="性别（Gender）">
                  {studentReport?.baseInfo?.性别}
                </Descriptions.Item>
                <Descriptions.Item label="民族（Nation）">
                  {studentReport?.baseInfo?.民族}
                </Descriptions.Item>
                <Descriptions.Item label="学号（Number）">
                  {studentReport?.baseInfo?.学号}
                </Descriptions.Item>
                <Descriptions.Item label="专业（Major）" span={2}>
                  {studentReport?.baseInfo?.专业}
                </Descriptions.Item>
                <Descriptions.Item label="学院（Unit）" span={3}>
                  {studentReport?.baseInfo?.学院}
                </Descriptions.Item>
                <Descriptions.Item label="班级（Class）">
                  {studentReport?.baseInfo?.班级}
                </Descriptions.Item>
                <Descriptions.Item label="班级职务（Class position）">
                  {studentReport?.baseInfo?.班级职务}
                </Descriptions.Item>
                <Descriptions.Item label="辅导员（Counsellor）">
                  {studentReport?.baseInfo?.辅导员}
                </Descriptions.Item>
                <Descriptions.Item label="政治面貌（Politics）">
                  {studentReport?.baseInfo?.政治面貌}
                </Descriptions.Item>
                <Descriptions.Item label="学生会职务（Unit position）" span={2}>
                  {studentReport?.baseInfo?.学生会职务}
                </Descriptions.Item>
                <Descriptions.Item label="班级排名（Class rank）" span={1}>
                  <Badge
                    status="processing"
                    text={studentReport?.baseInfo?.班级排名}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="专业排名（Major rank）" span={2}>
                  <Badge
                    status="processing"
                    text={studentReport?.baseInfo?.专业排名}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="绩点（GPA）" span={3}>
                  <Badge
                    status="processing"
                    text={studentReport?.baseInfo?.平均绩点}
                  />
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
          <Card
            title={'第一课堂' + ' ' + '课程信息'}
            style={{marginBottom: 30}}
          >
            <Row gutter={8}>
              {studentReport?.examDataMap
                ? Object.keys(studentReport?.examDataMap).map((key) => {
                  return (
                    <Col span={12} key={key}>
                      <Collapse>
                        <Panel header={'学期：' + key} key="1">
                          <ConfigProvider locale={zhCN}>
                            <Table
                              dataSource={studentReport?.examDataMap[key]}
                              columns={examDataMapColumns}
                              rowKey={() => Math.random()}
                            />
                          </ConfigProvider>
                        </Panel>
                      </Collapse>
                    </Col>
                  );
                })
                : null}
            </Row>
            <Divider/>
            <Row gutter={8}>
              <Col span={12}>
                {studentReport?.examDataMap ? (
                  <Collapse defaultActiveKey={['1']}>
                    <Panel header={'成绩分布图——学期'} key="1">
                      <LinkageChart examDataMap={studentReport?.examDataMap}/>
                    </Panel>
                  </Collapse>
                ) : null}
              </Col>
              <Col span={12}>
                {studentReport?.gpaTrend ? (
                  <Collapse defaultActiveKey={['1']}>
                    <Panel header={'绩点趋势图'} key="1" forceRender>
                      <LineChart
                        GPATrend={this.props.GPATrend}
                        gpaTrend={studentReport?.gpaTrend}
                        type={'student'}
                      />
                    </Panel>
                  </Collapse>
                ) : null}
              </Col>
            </Row>
            {/* {
                            studentReport?.underSixty ?
                                <Collapse  >
                                    <Panel header={'挂科科目'} key="1" forceRender >
                                        <Table dataSource={studentReport?.underSixty} columns={columns} rowKey={(item: any) => item.courseid} />
                                    </Panel>
                                </Collapse> : null
                        } */}
            <Row gutter={8}>
              <Col span={12}>
                {studentReport?.underSixtyGraph ? (
                  <Collapse>
                    <Panel header={'挂科科目'} key="1" forceRender>
                      <UnderSixtyChart
                        underSixtyGraph={studentReport.underSixtyGraph}
                      />
                    </Panel>
                  </Collapse>
                ) : null}
              </Col>
              <Col span={12}>
                {identifyDataInProfileData ? (
                  <Collapse>
                    <Panel
                      header={'助学金与奖学金'}
                      key="助学金与奖学金"
                      forceRender
                    >
                      <Reword
                        identifyDataInProfileData={identifyDataInProfileData}
                      />
                    </Panel>
                  </Collapse>
                ) : null}
              </Col>
            </Row>
          </Card>
          <Card
            title={'第二课堂' + ' ' + '活动信息'}
            style={{marginBottom: 30}}
          >
            <Row gutter={8}>
              {studentReport?.activityData
                ? Object.keys(studentReport?.activityData).map((key) => {
                  return (
                    <Col span={12} key={key}>
                      <Collapse>
                        <Panel header={'类型：' + key} key="1">
                          <Table
                            dataSource={studentReport?.activityData[key]}
                            columns={activityColumns}
                            rowKey={() => Math.random()}
                          />
                        </Panel>
                      </Collapse>
                    </Col>
                  );
                })
                : null}
            </Row>
            <Divider/>
            <Row gutter={8}>
              <Col span={8}>
                {studentReport?.fiveStar && studentReport?.activityData ? (
                  <Collapse defaultActiveKey={['1']}>
                    <Panel header={'“五育”雷达图'} key="1" forceRender>
                      <CompareRadarChart
                        fiveStar={studentReport?.fiveStar}
                        fiveStarBase64={this.props.fiveStarBase64}
                      />
                      {/* <RadarChart fiveStar={studentReport?.fiveStar} /> */}
                    </Panel>
                  </Collapse>
                ) : null}
              </Col>
              {/* <Col span={8}>
                {studentReport?.fiveStar && studentReport?.activityData ? (
                  <Collapse defaultActiveKey={['1']}>
                    <Panel header={'“五育”雷达图'} key="1" forceRender>
                      <EchartRadar fiveStar={studentReport?.fiveStar} />
                    </Panel>
                  </Collapse>
                ) : null}
              </Col> */}
              <Col span={16}>
                {studentReport?.evaluateWords ? (
                  <Collapse defaultActiveKey={['1']}>
                    <Panel header={'学生评语'} key="1" forceRender>
                      <Title level={4}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {studentReport?.evaluateWords}
                      </Title>
                    </Panel>
                  </Collapse>
                ) : null}
              </Col>
            </Row>
          </Card>
          {/* <Card title='' >
                        {
                            studentReport?.evaluateWords ?
                                <Title level={4}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{studentReport?.evaluateWords}</Title>
                                : null
                        }

                    </Card> */}
        </Spin>
      </div>
    );
  }
}

export default connect(({trainingplan, loading, user}: any) => ({
  ...trainingplan,
  ...user,
  allLoading: loading.effects['trainingplan/personalProfile'],
}))(StudentPage);
