import {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, history} from 'umi';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  ConfigProvider,
  Divider,
  Input,
  Modal,
  notification,
  PageHeader,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import DownloadExcel from '@/utils/DownloadExcel.js';

const {Panel} = Collapse;
const {Option} = Select;
const {Paragraph} = Typography;

export type dataType = {
  classid: string;
  classposition: string;
  counselorid: string;
  cultivatetype1: string;
  cultivatetype2: string;
  cultivatetype3: string;
  cultivatetype4: string;
  dormblock: string;
  dormbuilding: string;
  dormcampus: string;
  dormitory: string;
  dormregion: string;
  enrollyear: string;
  entityid: string;
  majorid: string;
  nation: string;
  nativecity: string;
  nativeprovince: string;
  politics: string;
  sex: string;
  sourcecity: string;
  sourceprovince: string;
  unionposition: string;
  united: string;
  userid: string;
  username: string;
};
export type Props = {
  dispatch: Dispatch;
  picturelist: object[];
  clusterdetail: {
    column?: object[];
    data: dataType[];
  };
  Tableloading: boolean;
  AddLoading: boolean;
  UpdateLoading: boolean;
  location: {
    state?:
      | {
      creatTime?: string | undefined;
      creator?: string | undefined;
      id?: number | undefined;
      name?: string | undefined;
      personsInfo?: any;
    }
      | undefined;
  };
  stateColumn?: object[];
  Sendloading: boolean;
};

class ApplicationContent extends Component<Props> {
  state = {
    visible: false,
    personsInfo: [], //location.state传过来的 规则详细信息
    stateColumn: [
      {
        dataIndex: 'userid',
        title: '学号',
        key: 'userid',
      },
      {
        dataIndex: 'username',
        title: '姓名',
        key: 'username',
      },
      {
        dataIndex: 'classid',
        title: '班级',
        key: 'classid',
      },
      {
        dataIndex: 'enrollyear',
        title: '入学年份',
        key: 'enrollyear',
      },
      {
        dataIndex: 'majorid',
        title: '专业',
        key: 'majorid',
      },
      {
        dataIndex: 'sex',
        title: '性别',
        key: 'sex',
      },
      {
        dataIndex: 'nativeprovince',
        title: '籍贯所在省',
        key: 'nativeprovince',
      },
      {
        dataIndex: 'nativecity',
        title: '籍贯所在市',
        key: 'nativecity',
      },
      {
        dataIndex: 'nation',
        title: '民族',
        key: 'nation',
      },
      {
        dataIndex: 'politics',
        title: '政治面貌',
        key: 'politics',
      },
      {
        dataIndex: 'classposition',
        title: '班级职务',
        key: 'classposition',
      },
      {
        dataIndex: 'unionposition',
        title: '学生会职务',
        key: 'unionposition',
      },
    ],
    appsubname: '',
  };
  componentDidMount = () => {
    const {location, dispatch} = this.props;
    if (location.state === undefined) {
      history.goBack();
    } else {
      this.setState({
        personsInfo: JSON.parse(location.state.personsInfo),
      });
      dispatch({
        type: 'application/resetClusterDetail',
      }); //清空上次保存在Table中的数据
    }
  };
  handleDownloadExcel = () => {
    const {clusterdetail} = this.props;
    DownloadExcel(
      this.state.stateColumn,
      clusterdetail.data,
      `画像详细信息${moment().format('YYYYMMDDHHmmss')}`,
      [],
      () => {
        setTimeout(() => {
          notification.success({message: '导出成功!'});
        }, 300);
      },
    );
  };
  onChange = (value: any) => {
    const {dispatch, picturelist} = this.props;
    const {personsInfo} = this.state;
    personsInfo.map((element: any, index: any) => {
      if (element.usergroup === value) {
        this.setState({
          appsubname: element.name,
        });
      }
    });
    let theme: any;
    picturelist.map((element: any, index: any) => {
      if (element.id === value) {
        theme = element.theme;
      }
    });
    dispatch({
      type: 'application/getClusterDetail',
      payload: {
        theme: theme,
        portraitid: value,
      },
    });
  };
  showModal = () => {
    this.setState({visible: true});
  };
  handleOk = () => {
    this.setState({visible: false});
  };
  handleCancel = () => {
    this.setState({visible: false});
  };
  CheckboxonChange = (checkedValues: any) => {
    let column = [
      {
        dataIndex: 'userid',
        title: '学号',
        key: 'userid',
      },
      {
        dataIndex: 'username',
        title: '姓名',
        key: 'username',
      },
      {
        dataIndex: 'classid',
        title: '班级',
        key: 'classid',
      },
      {
        dataIndex: 'enrollyear',
        title: '入学年份',
        key: 'enrollyear',
      },
      {
        dataIndex: 'majorid',
        title: '专业',
        key: 'majorid',
      },
      {
        dataIndex: 'sex',
        title: '性别',
        key: 'sex',
      },
      {
        dataIndex: 'nativeprovince',
        title: '籍贯所在省',
        key: 'nativeprovince',
      },
      {
        dataIndex: 'nativecity',
        title: '籍贯所在市',
        key: 'nativecity',
      },
      {
        dataIndex: 'nation',
        title: '民族',
        key: 'nation',
      },
      {
        dataIndex: 'politics',
        title: '政治面貌',
        key: 'politics',
      },
      {
        dataIndex: 'classposition',
        title: '班级职务',
        key: 'classposition',
      },
      {
        dataIndex: 'unionposition',
        title: '学生会职务',
        key: 'unionposition',
      },
      {
        dataIndex: 'sourceprovince',
        title: '生源地所在省',
        key: 'sourceprovince',
      },
      {
        dataIndex: 'sourcecity',
        title: '生源地所在市',
        key: 'sourcecity',
      },
      {
        dataIndex: 'dormitory',
        title: '宿舍',
        key: 'dormitory',
      },
      {
        dataIndex: 'dormcampus',
        title: '宿舍校区',
        key: 'dormcampus',
      },
      {
        dataIndex: 'dormregion',
        title: '宿舍划片',
        key: 'dormregion',
      },
      {
        dataIndex: 'dormbuilding',
        title: '宿舍楼',
        key: 'dormbuilding',
      },
      {
        dataIndex: 'dormblock',
        title: '宿舍ab栋',
        key: 'dormblock',
      },
      {
        dataIndex: 'counselorid',
        title: '辅导员',
        key: 'counselorid',
      },
      {
        dataIndex: 'united',
        title: '学院',
        key: 'united',
      },
      {
        dataIndex: 'cultivatetype1',
        key: 'cultivatetype1',
      },
      {
        dataIndex: 'cultivatetype2',
        key: 'cultivatetype2',
      },
      {
        dataIndex: 'cultivatetype3',
        key: 'cultivatetype3',
      },
      {
        dataIndex: 'cultivatetype4',
        key: 'cultivatetype4',
      },
    ];
    let columntemp: any = [];
    checkedValues.map((element: any, index: any) => {
      column.map((elementsub: any, indexsub: any) => {
        if (element == elementsub.title) {
          columntemp.push(elementsub);
        }
      });
    });
    this.setState({
      stateColumn: columntemp,
    });
  };
  sendMail = () => {
    const {clusterdetail, dispatch, location} = this.props;
    // const { stateColumn, appsubname } = this.state;
    // let arrtemp: any = [];
    // clusterdetail.data.map((element: any, index: any) => {
    //     let objtemp: any = {};
    //     stateColumn.map((elementsub: any, indexsub: any) => {
    //         if (elementsub.dataIndex in element) {
    //             objtemp[elementsub.title] = element[elementsub.dataIndex];
    //         }
    //     })
    //     arrtemp.push(objtemp);
    // })
    // let realvalue = {
    //     data: arrtemp,
    //     // data: [{ '学号': '202032803124', '班级': 'S20Z2859', '姓名': '李靖涵' },
    //     // { '学号': '202032803123', '班级': 'S20Z2858', '姓名': '曹嘉玺' },],
    //     filename: location.state?.name,
    //     title: appsubname,
    //     // title: 'HGNB',
    //     appid: location.state?.id,
    // }
    dispatch({
      type: 'application/sendMail',
      payload: {
        appid: location.state?.id,
      },
    });
  };

  render() {
    const {personsInfo} = this.state;
    const {
      picturelist,
      clusterdetail,
      Tableloading,
      location,
      dispatch,
      Sendloading,
      AddLoading,
      UpdateLoading,
    } = this.props;

    const content = (
      <>
        <Paragraph>
          应用通过场景条件拆分，与分群进行绑定，组合形成业务应用。
        </Paragraph>
        <Paragraph>
          业务场景可分层表述，如学业预警应用可分为红色预警、橙色预警、黄色预警和蓝色预警。
        </Paragraph>
        <Paragraph>
          每一个业务场景分层可通过创建并绑定分群进行表述，这样即可创建出符合用户需求的画像应用。
        </Paragraph>
      </>
    );

    const Content = ({children, extraContent}: any) => (
      <Row>
        <div style={{flex: 1}}>{children}</div>
        <div className="image">{extraContent}</div>
      </Row>
    );

    return (
      <>
        <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
          <div style={{marginBottom: 30, backgroundColor: 'white'}}>
            <PageHeader
              title={'应用任务' + '/' + location.state?.name}
              subTitle="应用详情"
              tags={<Tag color="blue">运行中</Tag>}
              extra={
                <Space>
                  <Select
                    style={{width: 150}}
                    placeholder="应用分层"
                    onChange={this.onChange}
                  >
                    {personsInfo.map((element: any, index: any) => {
                      return (
                        <Option value={element.usergroup} key={index}>
                          {element.name}
                        </Option>
                      );
                    })}
                  </Select>
                  <Button type="primary" onClick={this.showModal}>
                    列目显示
                  </Button>
                  <Button type="primary" onClick={this.handleDownloadExcel}>
                    下载
                  </Button>
                  <Button type="primary" onClick={this.sendMail}>
                    发送
                  </Button>
                </Space>
              }
              avatar={{src: require('@/assets/picture/任务详情.png')}}
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
            <Card>
              {/* <Spin spinning={!Sendloading}> */}
              <Row>
                <Col span={12}>
                  <Collapse>
                    <Panel header="规则详细信息" key="1">
                      {personsInfo.map((element: any, index: any) => {
                        return (
                          <div key={index}>
                            <Row gutter={[16, 24]} align="middle">
                              <Col span={6}>
                                <Input defaultValue={element.name} disabled/>
                              </Col>
                              <Col span={3}>
                                <span style={{fontSize: 16}}>绑定分群:</span>
                              </Col>
                              <Col span={8}>
                                <Select
                                  style={{width: '100%'}}
                                  defaultValue={element.usergroup}
                                  disabled
                                >
                                  {picturelist.length != 0 ? (
                                    picturelist.map(
                                      (element: any, index: any) => {
                                        return (
                                          <Option
                                            value={element.id}
                                            key={index}
                                          >
                                            {element.name}
                                          </Option>
                                        );
                                      },
                                    )
                                  ) : (
                                    <div></div>
                                  )}
                                </Select>
                              </Col>
                            </Row>
                            <Divider/>
                          </div>
                        );
                      })}
                    </Panel>
                  </Collapse>
                </Col>
                <Col span={12}></Col>
              </Row>
              <Divider/>

              <Table
                loading={
                  Tableloading || Sendloading || AddLoading || UpdateLoading
                }
                columns={this.state.stateColumn}
                dataSource={clusterdetail.data}
                rowKey={() => Math.random()}
              />
              {/* </Spin> */}
            </Card>

            <Modal
              title="列目显示"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <Checkbox.Group
                style={{width: '100%'}}
                onChange={this.CheckboxonChange}
                defaultValue={[
                  '学号',
                  '姓名',
                  '班级',
                  '入学年份',
                  '专业',
                  '性别',
                  '籍贯所在省',
                ]}
              >
                <Row>
                  <Col span={8}>
                    <Checkbox value="学号">学号</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="姓名">姓名</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="班级">班级</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="入学年份">入学年份</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="专业">专业</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="性别">性别</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="籍贯所在省">籍贯所在省</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="籍贯所在市">籍贯所在市</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="民族">民族</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="政治面貌">政治面貌</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="班级职务">班级职务</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="学生会职务">学生会职务</Checkbox>
                  </Col>

                  <Col span={8}>
                    <Checkbox value="生源地所在省">生源地所在省</Checkbox>
                  </Col>

                  <Col span={8}>
                    <Checkbox value="生源地所在市">生源地所在市</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="宿舍">宿舍</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="宿舍校区">宿舍校区</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="宿舍划片">宿舍划片</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="宿舍楼">宿舍楼</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="宿舍ab栋">宿舍ab栋</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="辅导员">辅导员</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="学院">学院</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Modal>
          </ConfigProvider>
        </div>
      </>
    );
  }
}

export default connect(({application, loading}: any) => ({
  ...application,
  Tableloading: loading.effects['application/getClusterDetail'],
  Sendloading: loading.effects['application/sendMail'],
  AddLoading: loading.effects['application/appAdd'],
  UpdateLoading: loading.effects['application/appUpdate'],
}))(ApplicationContent);
