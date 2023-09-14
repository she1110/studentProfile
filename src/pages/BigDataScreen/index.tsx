import React from 'react';
import {Carousel, Col, Image, Row, Tabs} from 'antd';

import Top from './components/Top';
import Left from './components/Left';
import './index.less';
import {BorderBox13,} from '@jiaminghi/data-view-react';
import {WebsiteBaseTable} from '@/components/DarkTable';
import WorkRatio from './components/WorkRatio/index';

const doctorData = [
  {
    name: '控制科学与工程博士点',
    total: '23',
  },
  {
    name: '智能康复装置与检测技术教育部工程研究中心',
    total: '37',
  },
  {
    name: '河北省控制工程技术研究中心',
    total: '16',
  },
  {
    name: '河北省大数据计算重点实验室',
    total: '53',
  },
  {
    name: '河北省数据驱动工业智能工程研究中心',
    total: '47',
  },
];
const masterData = [
  {
    name: '计算机科学与技术硕士点',
    type: '学术型硕士',
    total: '143',
    expect: '30',
  },
  {
    name: '控制科学与工程硕士点',
    type: '学术型硕士',
    total: '173',
    expect: '30',
  },
  {
    name: '计算机技术专业硕士点',
    type: '专业型硕士',
    total: '488',
    expect: '60',
  },
  {
    name: '软件工程专业硕士点',
    type: '专业型硕士',
    total: '332',
    expect: '60',
  },
  {
    name: '控制工程专业学位硕士点',
    type: '专业型硕士',
    total: '361',
    expect: '60',
  },
];
const {TabPane} = Tabs;

class BigDataScreen extends React.Component {
  render() {
    const masterColumns = [
      {
        code: 'name',
        name: '名称',
      },
      {
        code: 'type',
        name: '类型',
        width: 100,
      },
      {
        code: 'total',
        name: '总人数',
        width: 100,
      },
      {
        code: 'expect',
        name: '拟招收',
        width: 100,
        // render: (value: any, record: any, rowIndex: any) => {
        //     return value == 'up' ? <ArrowUpOutlined rotate={45} style={{ color: 'red' }} /> : <ArrowDownOutlined rotate={-45} style={{ color: 'green' }} />
        // }
      },
    ];
    const doctorColumns = [
      {
        code: 'name',
        name: '名称',
        width: 150,
      },
      {
        code: 'total',
        name: '总人数',
        width: 100,
      },
    ];
    return (
      <div className="big-data-screen">
        <Top/>
        <Row>
          <Col span={10}>
            <Left/>
          </Col>
          <Col span={14}>
            <Row>
              <Col span={12}>
                <BorderBox13
                  style={{width: '100%', height: '400px', paddingLeft: 20}}
                >
                  <div className="sub-title" style={{paddingTop: 20}}>
                    本科就业率（Top 5）
                  </div>
                  <WorkRatio/>
                </BorderBox13>
              </Col>
              <Col span={12}>
                <BorderBox13 style={{width: '550px', height: '400px'}}>
                  <Tabs
                    defaultActiveKey="1"
                    tabBarStyle={{
                      fontSize: '120%',
                      color: 'rgb(103, 250, 247)',
                      paddingLeft: 20,
                      paddingTop: 10,
                    }}
                  >
                    <TabPane tab="硕士点" key="1">
                      <WebsiteBaseTable
                        dataSource={masterData}
                        columns={masterColumns}
                        style={{
                          height: 380,
                          width: 520,
                          paddingLeft: 20,
                          paddingTop: 20,
                        }}
                      />
                    </TabPane>
                    <TabPane tab="博士点及省部级科研平台" key="2">
                      <WebsiteBaseTable
                        dataSource={doctorData}
                        columns={doctorColumns}
                        style={{
                          height: 380,
                          width: 520,
                          paddingLeft: 20,
                          paddingTop: 20,
                        }}
                      />
                    </TabPane>
                  </Tabs>
                </BorderBox13>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BorderBox13
                  style={{width: '100%', height: '550px', paddingLeft: 10}}
                >
                  <Carousel style={{height: 550}} autoplay>
                    <div>
                      <Image
                        src={require('@/assets/picture/学校风景图.jpg')}
                        alt="content"
                        style={{
                          paddingTop: 20,
                          paddingLeft: 5,
                          width: 1080,
                          height: 535,
                        }}
                        preview={false}
                      />
                    </div>
                    <div>
                      <Image
                        src={require('@/assets/picture/学校风景图1.jpg')}
                        alt="content"
                        style={{
                          paddingTop: 20,
                          paddingLeft: 5,
                          width: 1080,
                          height: 535,
                        }}
                        preview={false}
                      />
                    </div>
                    <div>
                      <Image
                        src={require('@/assets/picture/建校100年.jpg')}
                        alt="content"
                        style={{
                          paddingTop: 20,
                          paddingLeft: 5,
                          width: 1080,
                          height: 535,
                        }}
                        preview={false}
                      />
                    </div>
                  </Carousel>
                </BorderBox13>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default BigDataScreen;
