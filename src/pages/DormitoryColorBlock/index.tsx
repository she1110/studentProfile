import React, {useEffect, useState} from 'react';
import {Card, Empty, PageHeader, Row, Select, Spin, Tabs, Tag, Typography,} from 'antd';
import type {Dispatch} from 'umi';
import {connect} from 'umi';
import ColorBlock from './components/ColorBlock/index';

export type DormitoryColorBlockProps = {
  dispatch: Dispatch;
  counseloranddormblock: number[];
  colorblockloading: boolean;
};
const {TabPane} = Tabs;
const {Option} = Select;
const {Paragraph} = Typography;

const DormitoryColorBlock: React.FC<DormitoryColorBlockProps> = (props) => {
  const {dispatch, counseloranddormblock, colorblockloading} = props;
  const [charttype, SetChartType] = useState('cartesian');

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'evaluateinstructor/changeLoading',
        payload: true,
      }).then(() => {
        dispatch({
          type: 'evaluateinstructor/getCounselorAndDorm',
          payload: {
            flag: 'block',
          },
        });
        dispatch({
          type: 'evaluateinstructor/getCounselorAndDorm',
          payload: {
            flag: 'round',
          },
        });
      });
    }
  }, []);

  const handleChange = (value: any) => {
    SetChartType(value);
  };

  const content = (
    <>
      <Paragraph>直角块图，按照直角坐标将颜色块堆叠排列生成矩形图。</Paragraph>
      <Paragraph>
        极坐标原图，按照极坐标系将颜色块旋转排列生成圆形图。
      </Paragraph>
      <Paragraph>
        根据各辅导员下辖宿舍中挂科人次显示不同的状态，宿舍挂科人数由低到高控制颜色也由浅到深。
      </Paragraph>
    </>
  );

  const Content = ({children, extraContent}: any) => (
    <Row>
      <div style={{flex: 1}}>{children}</div>
      {/* <div className="image">{extraContent}</div> */}
    </Row>
  );

  return (
    <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
      <div style={{marginBottom: 30, backgroundColor: 'white'}}>
        <PageHeader
          title="宿舍分布"
          subTitle="宿舍挂科色块图"
          tags={<Tag color="blue">运行中</Tag>}
          avatar={{src: require('@/assets/picture/宿舍.png')}}
          extra={
            <Select
              defaultValue="cartesian"
              style={{width: 120}}
              onChange={handleChange}
            >
              <Option value="cartesian">直角块图</Option>
              <Option value="polar">极坐圆图</Option>
            </Select>
          }
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
      <Card style={{height: 2000}}>
        <Spin spinning={colorblockloading}>
          {counseloranddormblock == undefined ? (
            <div style={{marginTop: 200}}>
              <Empty/>
            </div>
          ) : (
            <div>
              {/* <Row>
                <Select
                  defaultValue="cartesian"
                  style={{ width: 120 }}
                  onChange={handleChange}
                >
                  <Option value="cartesian">直角块图</Option>
                  <Option value="polar">极坐圆图</Option>
                </Select>
              </Row> */}

              <ColorBlock charttype={charttype}/>
            </div>
          )}
        </Spin>

        {/* <Tabs defaultActiveKey="1">
          <TabPane tab="宿舍挂科分布" key="1">
            <Spin spinning={colorblockloading}>
              {counseloranddormblock == undefined ? (
                <div style={{ marginTop: 200 }}>
                  <Empty />
                </div>
              ) : (
                <div>
                  <Row>
                    <Select
                      defaultValue="cartesian"
                      style={{ width: 120 }}
                      onChange={handleChange}
                    >
                      <Option value="cartesian">直角块图</Option>
                      <Option value="polar">极坐圆图</Option>
                    </Select>
                  </Row>

                  <ColorBlock charttype={charttype} />
                </div>
              )}
            </Spin>
          </TabPane>

        </Tabs> */}
      </Card>
    </div>
  );
};

export default connect(({evaluateinstructor}: any) => ({
  ...evaluateinstructor,
}))(DormitoryColorBlock);
