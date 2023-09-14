import React from 'react';
import type {Dispatch} from 'umi';
import {connect, history, Link} from 'umi';
import {Card, Col, ConfigProvider, Divider, Input, Row, Select, Table,} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import DemoLine from './components/Line/index';
import {ColumnsType} from 'antd/es/table';
import TotalLine from './components/TotalChart/index';

export type chartDataType = {
  avggpa: number;
  classid: string;
  headpercent: string;
  peoplecount: number;
  ranking: number;
  tailpercent: string;
  totalscore: number;
  undersixty: number;
};
export type Props = {
  dispatch: Dispatch;
  picturelist: object[]; //画像列表
  strategylist: object[]; //策略列表
  jobresult: {
    chartData: chartDataType[];
    headPercentTrend: object[];
    tailPercentTrend: object[];
    avgGpaTrend: object[];
    totalScoreTrend: object[];
    itselfTrend: object;
    dimArray: object[];
  }; //任务结果
  location: {
    state?: {
      creator?: string;
      dim?: string;
      jobId?: number;
      jobName?: string;
      personsId?: number;
      result?: string;
      state?: number;
      time?: string;
      iiid?: number;
    };
  };
  Tableloading: boolean;
};
const {Option} = Select;

class JobResult extends React.Component<Props> {
  componentDidMount = () => {
    const {location, dispatch} = this.props;
    // console.log(location.state);
    if (location.state === undefined) {
      history.goBack();
    } else {
      dispatch({
        type: 'job/getAll',
      });
      dispatch({
        type: 'job/getAllStrategy',
        payload: {type: '0'},
      });
      dispatch({
        type: 'job/getJobResult',
        payload: {
          jobId: location.state.jobId,
        },
      });
    }
  };

  render() {
    const {location, picturelist, strategylist, jobresult, Tableloading} =
      this.props;
    const columns: ColumnsType<chartDataType> = [
      {
        title: '排名',
        dataIndex: 'ranking',
        align: 'center',
      },
      {
        title: '班级',
        dataIndex: 'classid',
        align: 'center',
      },
      {
        title: '人数',
        dataIndex: 'peoplecount',
        align: 'center',
      },
      {
        title: '平均绩点',
        dataIndex: 'avggpa',
        align: 'center',
      },
      {
        title: '头部学生占比',
        dataIndex: 'headpercent',
        align: 'center',
      },
      {
        title: '尾部学生占比',
        dataIndex: 'tailpercent',
        align: 'center',
      },
      {
        title: '不及格人次',
        dataIndex: 'undersixty',
        align: 'center',
      },
      {
        title: '综合评分',
        dataIndex: 'totalscore',
        align: 'center',
      },
      {
        title: '头部班干部',
        dataIndex: 'headCadres',
        align: 'center',
      },
      {
        title: '头部党员',
        dataIndex: 'headPartyMem',
        align: 'center',
      },
      {
        title: '尾部班干部',
        dataIndex: 'tailCadres',
        align: 'center',
      },
      {
        title: '尾部党员',
        dataIndex: 'tailPartyMem',
        align: 'center',
      },
    ];
    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        <ConfigProvider locale={zhCN}>
          <Card>
            <Row align="middle">
              <Col span={2}>
                <span>任务名称</span>
              </Col>
              <Col span={3}>
                <Input defaultValue={location.state?.jobName} disabled></Input>
              </Col>
              <Col span={1}></Col>
              <Col span={2}>
                <span>任务关联分群</span>
              </Col>
              <Col span={4}>
                <Select
                  style={{width: '100%'}}
                  defaultValue={location.state?.personsId}
                  disabled
                >
                  {picturelist.map((element: any, index: any) => {
                    return (
                      <Option value={element.id} key={element.id}>
                        {element.name}
                      </Option>
                    );
                  })}
                </Select>
              </Col>
            </Row>
            <Divider/>
            <Row align="middle">
              <Col span={2}>
                <span>任务评价维度</span>
              </Col>
              <Col span={3} style={{width: '100%'}}>
                <Select
                  style={{width: '100%'}}
                  defaultValue={location.state?.dim}
                  disabled
                >
                  <Option value="majorid">专业</Option>
                  <Option value="classid">班级</Option>
                  <Option value="userid">学生</Option>
                  <Option value="dormitory">宿舍</Option>
                </Select>
              </Col>
              <Col span={1}></Col>
              <Col span={2}>
                <span>任务评价策略</span>
              </Col>
              <Col span={4}>
                <Select
                  style={{width: '100%'}}
                  defaultValue={location.state?.iiid}
                  disabled
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
              </Col>
            </Row>
            <Divider/>
            <Table
              loading={Tableloading}
              columns={columns}
              rowKey={() => Math.random()}
              dataSource={jobresult.chartData}
            />
            <Divider/>
            {jobresult.totalScoreTrend ? (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <Card title="综合评分趋势">
                      <DemoLine chartdata={jobresult?.totalScoreTrend}/>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="平均绩点趋势">
                      <DemoLine chartdata={jobresult?.avgGpaTrend}/>
                    </Card>
                  </Col>
                </Row>
                <Divider/>
                <Row gutter={16}>
                  <Col span={12}>
                    <Card title="头部学生占比趋势">
                      <DemoLine chartdata={jobresult?.headPercentTrend}/>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="尾部学生占比趋势">
                      <DemoLine chartdata={jobresult?.tailPercentTrend}/>
                    </Card>
                  </Col>
                </Row>
                <Divider/>
                <Row gutter={16}>
                  <Col span={24}>
                    <Card title="头中尾、党员班干部详情">
                      <TotalLine
                        chartdata={jobresult?.itselfTrend}
                        classname={jobresult?.dimArray}
                      />
                    </Card>
                  </Col>
                </Row>
              </>
            ) : (
              <div></div>
            )}
          </Card>
        </ConfigProvider>
      </div>
    );
  }
}

export default connect(({job, loading}: any) => ({
  ...job,
  Tableloading: loading.effects['job/getJobResult'],
}))(JobResult);
