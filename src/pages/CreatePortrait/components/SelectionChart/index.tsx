import React from 'react';
import {Button, Card, Col, Divider, Drawer, Form, Input, message, Row, Select, Skeleton, Spin,} from 'antd';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import PieChart from './components/PieChart';
import ColumnChart from './components/ColumnChart';

const {Option, OptGroup} = Select;

export type SelectionChartType = {
  dispatch?: Dispatch;
  location?: any;
  theme: string;
  createMethod: string;

  UserGroupResult?: object[];
  chartLoading?: boolean;
  Loading?: boolean;
  SQL?: string;
  OriginalJSON?: string;
  Param?: string;
  tempid?: string;
  FormState?: object;
  GroupResultRequestParameters?: object[];
  tempID?: string;
  portrait?: any;
};

class SelectionChart extends React.Component<SelectionChartType> {
  state = {
    preservationVisible: false, //保存 Drawer
  };
  componentDidMount = () => {
    const {location, dispatch, portrait, tempID} = this.props;
    if (portrait) {
      for (let i = 0; i < portrait.cards.length; i++) {
        let cardsParmTemp = {
          personasId: tempID,
          requst: JSON.parse(portrait.cards[i].requst),
          theme: portrait.cards[i].theme,
          type: '1',
          chart: portrait.cards[i].chart,
          name: portrait.cards[i].name,
        };
        if (dispatch) {
          dispatch({
            type: 'portrait/getUserGroupResult',
            payload: cardsParmTemp,
          });
        }
      }
    }
  };
  showDrawer = () => {
    this.setState({
      preservationVisible: true,
    });
  };
  onClose = () => {
    this.setState({
      preservationVisible: false,
    });
  };
  onFinish = (value: any) => {
    const {
      theme,
      SQL,
      UserGroupResult,
      OriginalJSON,
      Param,
      dispatch,
      tempid,
      FormState,
      GroupResultRequestParameters,
    } = this.props;
    let originalJsonCards: any = []; //前端用于回显 写在originaljson里面的参数
    let cardsTemp: any = []; //参数中cards
    let originaljosn: any = '';
    let sql: any = '';
    let param: any = '';
    if (GroupResultRequestParameters) {
      cardsTemp = JSON.parse(JSON.stringify(GroupResultRequestParameters));
      cardsTemp.map((element: any, index: any) => {
        element.requst = JSON.stringify(element.requst);
      });
    } else {
      message.info('画像图表出错！请检查！');
      return;
    }

    if (UserGroupResult) {
      originalJsonCards = JSON.parse(JSON.stringify(UserGroupResult));
    } else {
      message.info('画像图表出错！请检查！');
      return;
    }
    if (OriginalJSON) {
      originaljosn = JSON.parse(JSON.stringify(OriginalJSON));
    } else {
      message.info('查询条件出错！请检查！！');
      return;
    }
    if (SQL) {
      sql = JSON.parse(JSON.stringify(SQL));
    } else {
      message.info('查询条件出错！请检查');
      return;
    }
    if (Param) {
      param = JSON.parse(JSON.stringify(Param));
    } else {
      message.info('查询条件出错！请检查！');
      return;
    }
    if (!tempid) {
      message.error('临时ID不存在！！');
      return;
    }

    let savePersonsPerson: any = {
      attr: JSON.stringify({sql: sql}),
      auth: value.auth,
      author: localStorage.getItem('userName'),
      cards: cardsTemp,
      name: value.name,
      originaljson: JSON.stringify({
        originaljson: originaljosn,
        originalcards: originalJsonCards,
        FormState: FormState,
      }),
      param: JSON.stringify(param),
      theme: theme,
      run_finish_state: '0',
      run_state: '0',
      tempid: tempid,
    };
    if (dispatch) {
      dispatch({
        type: 'portrait/checkName',
        payload: savePersonsPerson,
      }).then(() => {
        this.setState({
          preservationVisible: false,
        });
      });
    }
  };

  deleteGroupResult = (value: any) => {
    const {UserGroupResult, dispatch, GroupResultRequestParameters} =
      this.props;
    let GroupResultRequestParametersTemp: any = JSON.parse(
      JSON.stringify(GroupResultRequestParameters),
    );
    GroupResultRequestParametersTemp.splice(value, 1);
    let UserGroupResultTemp: any = JSON.parse(JSON.stringify(UserGroupResult));
    UserGroupResultTemp.splice(value, 1);
    if (dispatch) {
      dispatch({
        type: 'portrait/deleteGroupResult',
        payload: {
          GroupResultRequestParametersTemp,
          UserGroupResultTemp,
        },
      });
    }
  };

  render() {
    const {
      theme,
      createMethod,
      UserGroupResult,
      chartLoading,
      SQL,
      FormState,
      Loading,
    } = this.props;
    const {preservationVisible} = this.state;
    const opLevel = localStorage.getItem('opLevel');

    return (
      <>
        <Spin spinning={chartLoading ? chartLoading : false}>
          <Card
            title="用户画像"
            bordered={false}
            extra={
              <Button type="primary" onClick={this.showDrawer}>
                保存
              </Button>
            }
          >
            <Row gutter={8}>
              {UserGroupResult?.map((element: any, index: any) => {
                if (element.chart === 'pieChart') {
                  return (
                    <Col span={12} key={index}>
                      <Card
                        title={element.name}
                        type="inner"
                        extra={
                          <Button
                            type="primary"
                            onClick={() => {
                              this.deleteGroupResult(index);
                            }}
                          >
                            删除
                          </Button>
                        }
                      >
                        <PieChart detail={element.detail}/>
                      </Card>
                    </Col>
                  );
                } else if (element.chart === 'columnChart') {
                  return (
                    <Col span={12} key={index}>
                      <Card
                        title={element.name}
                        type="inner"
                        extra={
                          <Button
                            type="primary"
                            onClick={() => {
                              this.deleteGroupResult(index);
                            }}
                          >
                            删除
                          </Button>
                        }
                      >
                        <ColumnChart detail={element.detail}/>
                      </Card>
                    </Col>
                  );
                }
              })}
              {UserGroupResult?.length !== 0 ? null : <Skeleton/>}
            </Row>
          </Card>
        </Spin>

        <Drawer
          title="保存用户画像"
          width={450}
          onClose={this.onClose}
          visible={preservationVisible}
          bodyStyle={{paddingBottom: 80}}
        >
          <Spin spinning={Loading ? Loading : false}>
            <Form layout="vertical" onFinish={this.onFinish}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="name"
                    label="用户画像名称"
                    rules={[{required: true, message: '请输入用户画像名称'}]}
                  >
                    <Input placeholder="用户画像名称"/>
                  </Form.Item>
                </Col>
                {opLevel === '0' ? (
                  <Col span={24}>
                    <Form.Item
                      name="auth"
                      label="用户画像权限"
                      rules={[
                        {required: true, message: '请输入用户画像权限'},
                      ]}
                    >
                      <Select placeholder="用户画像权限">
                        <Option value="0">仅自己可见</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                ) : null}
                {opLevel === '1' ? (
                  <Col span={24}>
                    <Form.Item
                      name="auth"
                      label="用户画像权限"
                      rules={[
                        {required: true, message: '请输入用户画像权限'},
                      ]}
                    >
                      <Select placeholder="用户画像权限">
                        <Option value="0">仅自己可见</Option>
                        <Option value="1">校级</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                ) : null}
                {opLevel === '2' ? (
                  <Col span={24}>
                    <Form.Item
                      name="auth"
                      label="用户画像权限"
                      rules={[
                        {required: true, message: '请输入用户画像权限'},
                      ]}
                    >
                      <Select placeholder="用户画像权限">
                        <Option value="0">仅自己可见</Option>
                        <Option value="1">校级</Option>
                        <Option value="2">院级</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                ) : null}

                <Col span={24}>
                  <Form.Item
                    name="owner"
                    label="用户画像主题"
                    rules={[{required: true, message: '请输入用户画像主题'}]}
                    initialValue={theme}
                  >
                    <Select disabled>
                      <Option value="studentprofile">学生主题</Option>
                      <Option value="dormitoryprofile">宿舍主题</Option>
                      <Option value="classprofile">班级主题</Option>
                      <Option value="majorprofile">专业主题</Option>
                      <Option value="courseprofile">课程主题</Option>
                      <Option value="unitprofile">学院主题</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="type"
                    label="用户画像创建人"
                    rules={[{required: true, message: '用户画像创建人'}]}
                    initialValue={localStorage.getItem('userName')}
                  >
                    <Input disabled></Input>
                  </Form.Item>
                </Col>
              </Row>

              <Divider/>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      保存用户画像
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Drawer>
      </>
    );
  }
}

export default connect(({portrait, loading}: any) => ({
  ...portrait,
  chartLoading: loading.effects['portrait/getUserGroupResult'],
  Loading: loading.effects['portrait/checkName'],
}))(SelectionChart);
