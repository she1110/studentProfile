import React from 'react';
import type {Dispatch} from 'umi';
import {connect, history, Link} from 'umi';
import {Button, Card, Col, ConfigProvider, Divider, Input, Row, Select, Table,} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import DemoLine from './components/Line/index';
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons';

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
    state?:
      | {
      creator?: string;
      dim?: string;
      jobId?: number;
      jobName?: string;
      personsId?: number;
      result?: string;
      state?: number;
      time?: string;
    }
      | any;
  };
};

const {Option} = Select;

class JobResultUser extends React.Component<Props> {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
  };
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
  onSelectChange = (selectedRowKeys: any) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({selectedRowKeys});
  };

  render() {
    const {location, picturelist, strategylist, jobresult} = this.props;
    const {selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: '排名',
        dataIndex: 'ranking',
        align: 'center',
      },
      {
        title: '学号',
        dataIndex: 'userid',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'username',
        align: 'center',
      },
      {
        title: '班级',
        dataIndex: 'classid',
        align: 'center',
      },
      {
        title: '1-1绩点',
        dataIndex: 'gpa11',
        align: 'center',
      },
      {
        title: '1-2绩点',
        dataIndex: 'gpa12',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if ('gpa12' in record) {
            if (record.gpa12 >= record.gpa11) {
              return (
                <>
                  <span>{text}</span>
                  <ArrowUpOutlined style={{color: 'red'}}/>
                </>
              );
            } else {
              return (
                <>
                  <span>{text}</span>
                  <ArrowDownOutlined style={{color: 'green'}}/>
                </>
              );
            }
          }
        },
      },
      {
        title: '2-1绩点',
        dataIndex: 'gpa21',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if ('gpa21' in record) {
            if (record.gpa21 >= record.gpa12) {
              return (
                <>
                  <span>{text}</span>
                  <ArrowUpOutlined style={{color: 'red'}}/>
                </>
              );
            } else {
              return (
                <>
                  <span>{text}</span>
                  <ArrowDownOutlined style={{color: 'green'}}/>
                </>
              );
            }
          }
        },
      },
      {
        title: '2-2绩点',
        dataIndex: 'gpa22',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if ('gpa22' in record) {
            if (record.gpa22 >= record.gpa21) {
              return (
                <>
                  <span>{text}</span>
                  <ArrowUpOutlined style={{color: 'red'}}/>
                </>
              );
            } else {
              return (
                <>
                  <span>{text}</span>
                  <ArrowDownOutlined style={{color: 'green'}}/>
                </>
              );
            }
          }
        },
      },
      {
        title: '3-1绩点',
        dataIndex: 'gpa31',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if ('gpa31' in record) {
            if (record.gpa31 >= record.gpa22) {
              return (
                <>
                  <span>{text}</span>
                  <ArrowUpOutlined style={{color: 'red'}}/>
                </>
              );
            } else {
              return (
                <>
                  <span>{text}</span>
                  <ArrowDownOutlined style={{color: 'green'}}/>
                </>
              );
            }
          }
        },
      },
      {
        title: '3-2绩点',
        dataIndex: 'gpa32',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if ('gpa32' in record) {
            if (record.gpa32 >= record.gpa31) {
              return (
                <>
                  <span>{text}</span>
                  <ArrowUpOutlined style={{color: 'red'}}/>
                </>
              );
            } else {
              return (
                <>
                  <span>{text}</span>
                  <ArrowDownOutlined style={{color: 'green'}}/>
                </>
              );
            }
          }
        },
      },
      {
        title: '4-1绩点',
        dataIndex: 'gpa41',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if ('gpa41' in record) {
            if (record.gpa41 >= record.gpa32) {
              return (
                <>
                  <span>{text}</span>
                  <ArrowUpOutlined style={{color: 'red'}}/>
                </>
              );
            } else {
              return (
                <>
                  <span>{text}</span>
                  <ArrowDownOutlined style={{color: 'green'}}/>
                </>
              );
            }
          }
        },
      },
      {
        title: '4-2绩点',
        dataIndex: 'gpa42',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if ('gpa42' in record) {
            if (record.gpa42 >= record.gpa41) {
              return (
                <>
                  <span>{text}</span>
                  <ArrowUpOutlined style={{color: 'red'}}/>
                </>
              );
            } else {
              return (
                <>
                  <span>{text}</span>
                  <ArrowDownOutlined style={{color: 'green'}}/>
                </>
              );
            }
          }
        },
      },
      {
        title: '综合评分',
        dataIndex: 'totalscore',
        align: 'center',
      },
    ];
    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        <Button
          onClick={() => {
            console.log(jobresult.chartData);
          }}
        >
          测试
        </Button>
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
              rowSelection={rowSelection}
              columns={columns}
              dataSource={jobresult.chartData}
            />
            <Divider/>

            {jobresult.avgGpaTrend ? (
              <>
                <Card title="学生绩点趋势对比图">
                  <DemoLine
                    selectedRowKeys={selectedRowKeys}
                    chartdata={jobresult.avgGpaTrend}
                  />
                </Card>
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
}))(JobResultUser);
