import React from 'react';
import {Button, Card, Col, Divider, Form, Image, Input, Modal, Radio, Row, Select, Spin, Table,} from 'antd';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import ResultRingProgress from './components/RingProgress/index';
import ThemeResultWords from './components/ThemeResultWords/index';

const {Option} = Select;

export type SelectionResultType = {
  dispatch?: Dispatch;
  location?: any;
  theme: string;
  createMethod: string;
  primaryInfo?: object;
  resultLoading?: boolean; //创建sql
  resultLoading1?: boolean; //公式计算 创建sql
  clusterDetail?: {
    column?: object[];
    data?: object[];
  };
  tempid?: string;
  cardLabel?: object[];
};

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

class SelectionResult extends React.Component<SelectionResultType> {
  state = {
    seeVisible: false, //查看 moadl
  };

  componentDidMount = () => {
    const {dispatch, theme} = this.props;
    if (dispatch) {
      dispatch({
        type: 'portrait/getCardLabel',
        payload: {theme: theme},
      });
    }
  };

  showModal = () => {
    this.setState({seeVisible: true});
  };
  handleOk = () => {
    this.setState({seeVisible: false});
  };
  handleCancel = () => {
    this.setState({seeVisible: false});
  };

  onFinish = (value: any) => {
    const {dispatch, tempid, theme} = this.props;
    let getUserGroupResultParm = {
      chart: value.chart,
      name: value.name,
      personasId: tempid,
      requst: {
        by: value.labelAttr,
        type: 'attr',
      },
      type: '1',
      theme: theme,
    };
    if (dispatch) {
      dispatch({
        type: 'portrait/getUserGroupResult',
        payload: getUserGroupResultParm,
      });
    }
  };

  render() {
    const {
      theme,
      primaryInfo,
      resultLoading,
      clusterDetail,
      tempid,
      cardLabel,
      resultLoading1,
    } = this.props;
    const {seeVisible} = this.state;
    const SelectionResultLoading: boolean =
      resultLoading || resultLoading1 || false;

    return (
      <>
        {/* <Button onClick={()=>{
                console.log(clusterDetail);
            }}>asd</Button> */}
        <Spin spinning={SelectionResultLoading}>
          <Card
            title="查询结果"
            bordered={false}
            extra={
              <Button
                type="primary"
                onClick={this.showModal}
                disabled={resultLoading}
              >
                查看
              </Button>
            }
          >
            <Row style={{marginLeft: 30}}>
              <Col span={2} style={{marginTop: 20}}>
                <ResultRingProgress/>
              </Col>
              <Col span={6} style={{fontSize: 15, marginTop: 20}}>
                <ThemeResultWords theme={theme}/>
              </Col>
              <Col span={1}>
                <Divider type="vertical" style={{height: '100%'}}></Divider>
              </Col>
              <Col span={2}>
                <Image
                  src={require('@/assets/picture/用户画像.png')}
                  style={{height: '100px', width: '100px'}}
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
                  创建用户画像
                </div>
              </Col>
              <Col span={12} style={{marginTop: 20}}>
                <Form name="createPortrait" onFinish={this.onFinish}>
                  <div>
                    <Row>
                      <Col span={10}>
                        <Form.Item
                          label={'画像名称'}
                          name={'name'}
                          rules={[{required: true, message: '缺少名称'}]}
                        >
                          <Input
                            style={{width: '100%'}}
                            placeholder={'画像名称'}
                            className="pictureName"
                          ></Input>
                        </Form.Item>
                      </Col>
                      <Col span={8} offset={1}>
                        <Form.Item
                          label={'画像图表'}
                          name={'chart'}
                          rules={[{required: true, message: '缺少图形'}]}
                        >
                          <Radio.Group buttonStyle="solid">
                            <Radio.Button value="columnChart">
                              条形图
                            </Radio.Button>
                            <Radio.Button value="pieChart">环形图</Radio.Button>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Form.Item name={'type'} initialValue={'1'} hidden>
                          <Input></Input>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <Form.Item
                          label={'标签属性'}
                          name={'labelAttr'}
                          rules={[{required: true, message: '请选择标签'}]}
                        >
                          <Select
                            style={{width: '100%'}}
                            placeholder={'标签'}
                          >
                            {cardLabel?.map((element: any, index: any) => {
                              return (
                                <Option value={element.value} key={index}>
                                  {element.name}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={3} offset={1}>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            创建画像
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card>
        </Spin>

        <Modal
          width="900"
          title="分群详细信息"
          visible={seeVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={false}
        >
          <Table
            dataSource={clusterDetail?.data}
            columns={clusterDetail?.column}
          />
        </Modal>
      </>
    );
  }
}

export default connect(({portrait, loading}: any) => ({
  ...portrait,
  resultLoading: loading.effects['portrait/createProfileSQL'],
  resultLoading1: loading.effects['portrait/createPreferenceLabelSQL'],
}))(SelectionResult);
