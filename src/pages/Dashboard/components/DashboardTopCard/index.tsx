import React from 'react';
import {Card, Col, Divider, Image, Row, Space} from 'antd';
import {Link} from 'umi';

export default class DashboardTopCard extends React.Component {
  render() {
    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        <Card title="用户群画像" bordered={false}>
          <Row>
            <Col span={6} offset={4}>
              <div>
                <p>使用标签、用户行为、用户属性进行筛选，获得目标群体</p>
                <p>观察目标群体的 标签分布、行为指标 和 用户构成</p>
                <p>将目标群体保存为 用户群标签 或 导出人群列表</p>
              </div>
            </Col>
            <Col span={2} offset={1}>
              <Divider type="vertical" style={{height: '100%'}}></Divider>
            </Col>
            <Col span={10}>
              <Space align="center" size={40}>
                <Link
                  to={{
                    pathname: '/CreatePortrait',
                    state: {theme: 'studentprofile', createMethod: '0'},
                  }}
                >
                  <Image
                    src={require('@/assets/picture/学生.png')}
                    style={{height: '64px', width: '64px'}}
                    preview={false}
                  />
                  <div
                    style={{
                      overflow: 'hidden',
                      color: '#00000073',
                      fontWeight: 'bolder',
                      fontSize: '15px',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      marginLeft: 3,
                    }}
                  >
                    学生主题
                  </div>
                </Link>
                {/* <Link
                  to={{
                    pathname: '/CreatePortrait',
                    state: { theme: 'dormitoryprofile', createMethod: '0' },
                  }}
                >
                  <Image
                    src={require('@/assets/picture/宿舍.png')}
                    style={{ height: '64px', width: '64px' }}
                    preview={false}
                  >

                  </Image>
                  <div
                    style={{
                      overflow: 'hidden',
                      color: '#00000073',
                      fontWeight: 'bolder',
                      fontSize: '15px',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      marginLeft: 3
                    }}
                  >宿舍主题</div>
                </Link>

                <Link
                  to={{
                    pathname: '/CreatePortrait',
                    state: { theme: 'classprofile', createMethod: '0' },
                  }}
                >
                  <Image
                    src={require('@/assets/picture/班级.png')}
                    style={{ height: '64px', width: '64px' }}
                    preview={false}
                  >

                  </Image>
                  <div
                    style={{
                      overflow: 'hidden',
                      color: '#00000073',
                      fontWeight: 'bolder',
                      fontSize: '15px',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      marginLeft: 3
                    }}
                  >班级主题</div>
                </Link>

                <Link
                  to={{
                    pathname: '/CreatePortrait',
                    state: { theme: 'majorprofile', createMethod: '0' },
                  }}
                >
                  <Image
                    src={require('@/assets/picture/专业.png')}
                    style={{ height: '64px', width: '64px' }}
                    preview={false}
                  >

                  </Image>
                  <div
                    style={{
                      overflow: 'hidden',
                      color: '#00000073',
                      fontWeight: 'bolder',
                      fontSize: '15px',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      marginLeft: 3
                    }}
                  >专业主题</div>
                </Link> */}

                {/* <Link
                  to={{
                    pathname: '/CreatePortrait',
                    state: { theme: 'unitprofile', createMethod: '0' },
                  }}
                >
                  <Image
                    src={require('@/assets/picture/学院.png')}
                    style={{ height: '64px', width: '64px' }}
                    preview={false}
                  >
                  </Image>
                  <div
                    style={{
                      overflow: 'hidden',
                      color: '#00000073',
                      fontWeight: 'bolder',
                      fontSize: '15px',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      marginLeft: 3
                    }}
                  >学院主题</div>
                </Link>

                <Link
                  to={{
                    pathname: '/CreatePortrait',
                    state: { theme: 'courseprofile', createMethod: '0' },
                  }}
                >
                  <Image
                    src={require('@/assets/picture/课程.png')}
                    style={{ height: '64px', width: '64px' }}
                    preview={false}
                  >

                  </Image>
                  <div
                    style={{
                      overflow: 'hidden',
                      color: '#00000073',
                      fontWeight: 'bolder',
                      fontSize: '15px',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      marginLeft: 3
                    }}
                  >课程主题</div>
                </Link> */}
              </Space>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
