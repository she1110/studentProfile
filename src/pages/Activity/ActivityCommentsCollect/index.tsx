import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, history, Link} from 'umi';
import {
  Button,
  Card,
  Col,
  Collapse,
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  PageHeader,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import {RedoOutlined,} from '@ant-design/icons';

const {Search} = Input;
const {Option} = Select;
const {Panel} = Collapse;
const {TextArea} = Input;
const {Paragraph} = Typography;

export type strategyType = {
  strategyName: string;
  strategyRemark: string;
  stList: object[];
};

export type Props = {
  dispatch: Dispatch;
  location: {
    state?:
      | {
      messageLink: string;
    }
      | any;
  };
  StrategyTemp: {
    strategyName: string;
    strategyRemark: string;
    stList: object[];
    strategyType: string;
  };
  PictureStrategyList: object[];
  ActivityStrategyList: object[];
};

class ActivityCommentsCollect extends Component<Props> {
  state = {
    parameter: undefined, //当前信息需要请求的参数
    condition: [], //用于分群征集消息，判断是否有百分比的输入框
  };
  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {location, dispatch, StrategyTemp, PictureStrategyList} =
      this.props;
    if (location.state) {
      this.setState({
        parameter: JSON.parse(JSON.parse(location.state.messageLink).parameter)
          .strategyId,
      });
      if (dispatch) {
        dispatch({
          type: 'messagelist/getStrategyTemp',
          payload: JSON.parse(JSON.parse(location.state.messageLink).parameter),
        });
        dispatch({
          type: 'messagelist/getAllCondition',
          payload: {type: '0'},
        });
        dispatch({
          type: 'messagelist/getAllCondition',
          payload: {type: '1'},
        });
      }
    } else {
      history.goBack();
    }
  };

  componentDidUpdate = (nextProps: any, nextState: any) => {
    const {StrategyTemp, PictureStrategyList} = this.props;
    if (StrategyTemp && StrategyTemp.strategyType === '0') {
      let conditiontemp: any = [];
      StrategyTemp.stList.map((element: any, index: any) => {
        PictureStrategyList.map((elementsub: any, indexsub: any) => {
          if (element.conditionId === elementsub.conditionId) {
            conditiontemp[index] = elementsub.conditionAttr;
          }
        });
      });
      if (this.state === nextState) {
        this.setState({
          condition: conditiontemp,
        });
      }
      this.formRef.current?.setFieldsValue(StrategyTemp);
      this.formRef.current?.setFieldsValue({
        id: this.state.parameter,
      });
    }
  };

  onFinish = (value: any) => {
    const {location, dispatch, StrategyTemp} = this.props;
    let scListtempFin: any = [];
    StrategyTemp.stList.map((element: any, index: any) => {
      let scListtemp: any = {};
      scListtemp.conditionId = element.conditionId;
      scListtemp.weight = value['weight' + index];
      scListtempFin.push(scListtemp);
    });
    dispatch({
      type: 'messagelist/collectStrategy',
      payload: {
        strategyId: value.id,
        scList: scListtempFin,
      },
    });
  };

  pictureOnFinish = (value: any) => {
    const {location, dispatch} = this.props;
    dispatch({
      type: 'messagelist/collectStrategy',
      payload: {
        strategyId: value.id,
        scList: value.stList,
      },
    });
  };

  render() {
    const {
      StrategyTemp,
      location,
      PictureStrategyList,
      ActivityStrategyList,
    } = this.props;
    const {parameter, condition} = this.state;
    const content = (
      <>
        <Paragraph>
          目标人群：设置想要对哪些角色发起征集以及该角色意见权重占比。
        </Paragraph>
        <Paragraph>
          权重区间：设置每个规则的权重范围，避免用户在征集时填写不合理的数值。
        </Paragraph>
        <Paragraph>
          征集时间：在该活动的结束时间到达后，自动开始计算大家的意见，整合为最终的策略结果。
        </Paragraph>
      </>
    );

    const Content = ({children, extraContent}: any) => (
      <Row>
        <div style={{flex: 1}}>{children}</div>
      </Row>
    );

    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        <div style={{marginBottom: 30, backgroundColor: 'white'}}>
          <PageHeader
            title="征集策略填写"
            subTitle="向目标人群收集信息"
            tags={<Tag color="blue">运行中</Tag>}
            extra={[
              <Button
                // onClick={this.reset}
                icon={<RedoOutlined/>}
                key={'2123'}
              >
                刷新消息
              </Button>,
            ]}
            avatar={{src: require('@/assets/picture/征集.png')}}
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
        <ConfigProvider locale={zhCN}>
          {StrategyTemp &&
          parameter &&
          StrategyTemp.stList &&
          StrategyTemp.strategyType &&
          StrategyTemp.strategyType === '0' ? (
            <Card title="意见征集">
              <Row>
                <Col span={12}>
                  <Form
                    name="分群意见征集"
                    onFinish={this.pictureOnFinish}
                    ref={this.formRef}
                  >
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          name="id"
                          hidden
                          // initialValue={parameter}
                          // initialValue={JSON.parse(JSON.parse(location.state.messageLink).parameter).strategyId}
                        >
                          <Input style={{width: '100%'}} disabled/>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Collapse defaultActiveKey={['1', '2']}>
                      <Panel header="策略基本信息" key="1">
                        <Row>
                          <Col span={12}>
                            <Form.Item
                              label="策略名称&nbsp;&nbsp;"
                              name="strategyName"
                              // initialValue={StrategyTemp.strategyName}
                              // rules={[{ required: true, message: '请输入权重' }]}
                            >
                              <Input style={{width: '100%'}} disabled/>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={12}>
                            <Form.Item
                              label="策略备注&nbsp;&nbsp;"
                              name="strategyRemark"
                              // initialValue={StrategyTemp.strategyRemark}
                            >
                              <TextArea rows={4} disabled/>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Panel>
                      <Panel header="评价规则" key="2">
                        <Form.List name="stList">
                          {(fields, {add, remove}) => (
                            <>
                              {fields.map(
                                ({key, name, fieldKey, ...restField}) => (
                                  <Space
                                    key={key}
                                    style={{display: 'flex', marginBottom: 8}}
                                    align="baseline"
                                  >
                                    <Form.Item
                                      {...restField}
                                      name={[name, 'conditionId']}
                                      fieldKey={[fieldKey, 'conditionId']}
                                      rules={[
                                        {
                                          required: true,
                                          message: 'Missing conditionId',
                                        },
                                      ]}
                                    >
                                      <Select
                                        style={{width: '100%'}}
                                        disabled
                                      >
                                        {PictureStrategyList.map(
                                          (element: any, index: any) => {
                                            return (
                                              <Option
                                                value={element.conditionId}
                                                key={element.conditionId}
                                              >
                                                {element.conditionName}
                                              </Option>
                                            );
                                          },
                                        )}
                                      </Select>
                                    </Form.Item>
                                    {condition[fieldKey] === '1' ? (
                                      <>
                                        <Form.Item
                                          {...restField}
                                          name={[name, 'percent']}
                                          fieldKey={[fieldKey, 'percent']}
                                          rules={[
                                            {
                                              required: true,
                                              message: '请输入百分比',
                                            },
                                          ]}
                                        >
                                          <InputNumber
                                            min={
                                              StrategyTemp.stList[fieldKey]
                                                .percentMin
                                            }
                                            max={
                                              StrategyTemp.stList[fieldKey]
                                                .percentMax
                                            }
                                            step="1"
                                            placeholder="百分比"
                                            style={{width: 80}}
                                          />
                                        </Form.Item>
                                        <span>%&nbsp;&nbsp;&nbsp;</span>
                                      </>
                                    ) : (
                                      <>&nbsp;&nbsp;&nbsp;</>
                                    )}
                                    <span>权重</span>
                                    <Form.Item
                                      {...restField}
                                      name={[name, 'weight']}
                                      fieldKey={[fieldKey, 'weight']}
                                      rules={[
                                        {
                                          required: true,
                                          message: '请输入权重',
                                        },
                                      ]}
                                    >
                                      <InputNumber
                                        min={
                                          StrategyTemp.stList[fieldKey]
                                            .weightMin
                                        }
                                        max={
                                          StrategyTemp.stList[fieldKey]
                                            .weightMax
                                        }
                                        step="0.01"
                                        placeholder="权重"
                                        style={{width: 80}}
                                      />
                                    </Form.Item>
                                    {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                                  </Space>
                                ),
                              )}
                              {/* <Form.Item>
                                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add field
                                  </Button>
                                </Form.Item> */}
                            </>
                          )}
                        </Form.List>
                      </Panel>
                    </Collapse>
                    <Row>
                      <Col span={12}>
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{width: '100%'}}
                          >
                            提交
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
                <Col span={8}></Col>
              </Row>
            </Card>
          ) : (
            <></>
          )}
          {StrategyTemp &&
          parameter &&
          StrategyTemp.stList &&
          StrategyTemp.strategyType &&
          StrategyTemp.strategyType === '1' ? (
            <Card title="意见征集">
              <Row>
                <Col span={12}>
                  <Form
                    name="第二课堂意见征集"
                    onFinish={this.onFinish}
                    // ref={this.formRef}
                  >
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          name="id"
                          hidden
                          initialValue={parameter}
                          // initialValue={JSON.parse(JSON.parse(location.state.messageLink).parameter).strategyId}
                        >
                          <Input style={{width: '100%'}} disabled/>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Collapse defaultActiveKey={['1', '2']}>
                      <Panel header="策略基本信息" key="1">
                        <Row>
                          <Col span={12}>
                            <Form.Item
                              label="策略名称&nbsp;&nbsp;"
                              name="strategyName"
                              initialValue={StrategyTemp.strategyName}
                              // rules={[{ required: true, message: '请输入权重' }]}
                            >
                              <Input style={{width: '100%'}} disabled/>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={12}>
                            <Form.Item
                              label="策略备注&nbsp;&nbsp;"
                              name="strategyRemark"
                              initialValue={StrategyTemp.strategyRemark}
                            >
                              <TextArea rows={4} disabled/>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Panel>
                      <Panel header="评价规则" key="2">
                        {StrategyTemp.stList.map((element: any, index: any) => {
                          return (
                            <Row key={'Row' + index}>
                              <Col span={8}>
                                <Form.Item
                                  label={'征集条件' + (index + 1)}
                                  name={'sclist' + index}
                                  // rules={[{ required: true, message: '请输入活动名称' }]}
                                  initialValue={element.conditionId}
                                  key={'sclist' + index}
                                >
                                  <Select
                                    style={{width: '100%'}}
                                    disabled
                                    key={'selectS' + index}
                                  >
                                    {ActivityStrategyList.map(
                                      (element: any, index: any) => {
                                        return (
                                          <Option
                                            value={element.conditionId}
                                            key={element.conditionId}
                                          >
                                            {element.conditionName}
                                          </Option>
                                        );
                                      },
                                    )}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={3} offset={1}>
                                <Form.Item
                                  name={'weight' + index}
                                  rules={[
                                    {required: true, message: '请输入权重'},
                                  ]}
                                  key={'weight' + index}
                                >
                                  <InputNumber
                                    min={element.weightMin}
                                    max={element.weightMax}
                                    step="0.01"
                                    style={{width: '100%'}}
                                    placeholder={
                                      element.weightMin +
                                      '~' +
                                      element.weightMax
                                    }
                                    key={'weightI' + index}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          );
                        })}
                      </Panel>
                    </Collapse>
                    <Row>
                      <Col span={12}>
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{width: '100%'}}
                          >
                            提交
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
                <Col span={8}></Col>
              </Row>
            </Card>
          ) : (
            <></>
          )}
        </ConfigProvider>
      </div>
    );
  }
}

export default connect(({messagelist}: any) => ({
  ...messagelist,
}))(ActivityCommentsCollect);
