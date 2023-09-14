import React from 'react';
import {Col, Row, Tabs} from 'antd';

import TotalLine from './components/TotalLine';
import StaffChart from './components/StaffChart';
import StudentChart from './components/StudentChart';
import {WebsiteBaseTable} from '@/components/DarkTable';

import './index.less';
import {BorderBox12,} from '@jiaminghi/data-view-react';

const {TabPane} = Tabs;

class Left extends React.Component {
  render() {
    const columns = [
      {
        code: 'GANTRYNAME',
        name: '党支部名称',
        width: 150,
        // className: 'table-item',
      },
      {
        code: 'VOLUME',
        name: '支部类别',
        width: 100,
        // className: 'table-item',
      },
      {
        code: 'trend',
        name: '支部人数',
        width: 50,
      },
      {
        code: 'trend1',
        name: '正式党员',
        width: 50,
      },
      {
        code: 'trend2',
        name: '预备党员',
        width: 50,
      },
    ];
    const data = [
      {
        VOLUME: '学生支部（研究生支部）',
        DAYTIME: '2021-01-01 00:00:00',
        GANTRYID: 'G000413001001910010',
        GANTRYNAME: '数据科学与大数据技术研究生党支部',
        trend: 13,
        trend1: 9,
        trend2: 4,
      },
      {
        VOLUME: '学生支部（研究生支部）',
        DAYTIME: '2021-01-01 00:00:00',
        GANTRYID: 'G000413001002020010',
        GANTRYNAME: '视觉处理与智能计算研究生党支部',
        trend: 12,
        trend1: 7,
        trend2: 5,
      },
      {
        VOLUME: '学生支部（研究生支部）',
        DAYTIME: '2021-01-01 00:00:00',
        GANTRYID: 'G000413001002110010',
        GANTRYNAME: '图像处理与模式识别研究生党支部',
        trend: 25,
        trend1: 18,
        trend2: 7,
      },
      {
        VOLUME: '学生支部（研究生支部）',
        DAYTIME: '2021-01-01 00:00:00',
        GANTRYID: 'G000413001002310010',
        GANTRYNAME: '知识发现与模式识别研究生党支部',
        trend: 16,
        trend1: 12,
        trend2: 4,
      },
      {
        VOLUME: '学生支部（研究生支部）',
        DAYTIME: '2021-01-01 00:00:00',
        GANTRYID: 'G000413001002420010',
        GANTRYNAME: '网络化控制与信息安全研究生党支部',
        trend: 11,
        trend1: 7,
        trend2: 4,
      },
    ];
    return (
      <div>
        <Row>
          <Col span={12}>
            <BorderBox12 style={{height: '250px', paddingLeft: 20}}>
              <div
                style={{
                  fontSize: '120%',
                  color: 'rgb(103, 250, 247)',
                  paddingTop: 10,
                }}
              >
                学院教职工（134人）
              </div>
              <StaffChart/>
            </BorderBox12>
          </Col>
          <Col span={12}>
            <BorderBox12 style={{height: '250px', paddingLeft: 20}}>
              <div
                style={{
                  fontSize: '120%',
                  color: 'rgb(103, 250, 247)',
                  paddingTop: 10,
                }}
              >
                学生（3708人）
              </div>
              <StudentChart/>
            </BorderBox12>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <BorderBox12 style={{height: '350px', paddingLeft: 20}}>
              <div
                style={{
                  fontSize: '120%',
                  color: 'rgb(103, 250, 247)',
                  paddingTop: 10,
                }}
              >
                党支部（TOP 5）
              </div>
              <WebsiteBaseTable
                dataSource={data}
                columns={columns}
                style={{height: 120, width: 750, paddingTop: 10}}
                // className={'dark'}
              />
            </BorderBox12>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <BorderBox12 style={{height: '350px', paddingLeft: 20}}>
              <div style={{}}>
                <Tabs
                  defaultActiveKey="1"
                  tabBarStyle={{
                    fontSize: '120%',
                    color: 'rgb(103, 250, 247)',
                    paddingTop: 10,
                  }}
                >
                  <TabPane tab="班级（TOP 5）" key="1">
                    <TotalLine/>
                  </TabPane>
                  <TabPane tab="专业（TOP 5）" key="2">
                    <TotalLine/>
                  </TabPane>
                  <TabPane tab="系（TOP 5）" key="3">
                    <TotalLine/>
                  </TabPane>
                </Tabs>
              </div>
            </BorderBox12>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Left;
