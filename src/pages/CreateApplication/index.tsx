import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Modal,
  PageHeader,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import moment from 'moment';
import {ColumnsType} from 'antd/es/table';

const {Search} = Input;
const {Option} = Select;
const {Paragraph} = Typography;

export type APP = {
  id: number;
  name: string;
  creator: string;
  creatTime: string;
  personsInfo: string;
};

export type Props = {
  dispatch: Dispatch;
  allapplist: APP[];
  picturelist: object[];
  creatorlist: object[];
  tag: boolean;
  schoollist: object[];
  unitlist: object[];
  rolesbyunit: object[];
  userbyroles: object[];
  MyPersons?: object[];
  rolelist?: object[];
  AddLoading?: boolean;
  UpdateLoading?: boolean;
};

class CreateApplication extends Component<Props> {
  state = {
    visible: false,
    editvisible: false, //编辑modal
    tag: false, //false BTN显示个人应用 true显示全部应用
    pushTag: false, //是否显示推送用户
  };
  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'application/appGetAll',
      });
      dispatch({
        type: 'application/getAll',
      });
      dispatch({
        type: 'user/getBaseInfo',
        payload: {
          type: 'school',
        },
      });
      dispatch({
        type: 'user/getBaseInfo',
        payload: {
          type: 'unit',
        },
      });
      dispatch({type: 'role/findrole'});
      dispatch({
        type: 'portrait/getMyPersons',
      });
    }
  };

  showModal = () => {
    this.setState({visible: true});
  };
  handleCancel = () => {
    this.setState({visible: false});
  };
  handleOk = () => {
    this.setState({visible: false});
  };
  editshowModal = (value: any) => {
    const {dispatch} = this.props;
    if (value.ispush !== '0') {
      this.setState({
        pushTag: true,
      });
      if (value.unit !== null) {
        dispatch({
          type: 'application/getRolesByUnit',
          payload: {unitid: value.unit},
        });
      }
      if (value.role !== null) {
        dispatch({
          type: 'application/getUserByRoles',
          payload: {roleid: value.role},
        });
      }
    }
    let persons_infotemp = this.handlePersons_info(value.personsInfo);
    this.formRef.current?.setFieldsValue({
      name: value.name,
      id: value.id,
      ispush: value.ispush,
      unit: value.unit,
      role: value.role,
      userid: value.userid,
      personsInfo: persons_infotemp,
    });
    this.setState({editvisible: true});
  };
  handlePersons_info = (value: any) => {
    if (value === null) {
      return null;
    }
    let persons_infotemp = JSON.parse(value);
    persons_infotemp.map((element: any, index: any) => {
      element.fieldKey = index;
    });
    return persons_infotemp;
  };
  edithandleCancel = () => {
    this.setState({editvisible: false});
  };
  edithandleOk = () => {
    this.setState({editvisible: false});
  };
  onFinish = (values: any) => {
    const {dispatch} = this.props;
    this.setState({visible: false});
    values.creator = localStorage.getItem('userName');
    values.creatTime = moment().format('YYYY-MM-DD HH:mm:ss');
    values.personsInfo = JSON.stringify(values.personsInfo);
    dispatch({
      type: 'application/appAdd',
      payload: values,
    }).then(() => {
      this.props.dispatch({
        type: 'application/appGetAll',
      });
    });
  };
  editonFinish = (value: any) => {
    const {dispatch} = this.props;
    value.creator = localStorage.getItem('userName');
    value.creatTime = moment().format('YYYY-MM-DD HH:mm:ss');
    value.personsInfo = JSON.stringify(value.personsInfo);
    dispatch({
      type: 'application/appUpdate',
      payload: value,
    }).then(() => {
      this.props.dispatch({
        type: 'application/appGetAll',
      });
    });
    this.setState({editvisible: false});
  };
  onSearch = (value: any) => {
    const {dispatch} = this.props;
    if (value.length === 0) {
      dispatch({
        type: 'application/appGetAll',
      });
    }
    if (value.length !== 0) {
      dispatch({
        type: 'application/appGet',
        payload: {
          creator: value,
        },
      });
    }
  };
  getByCreator = (tag: boolean) => {
    const {dispatch} = this.props;
    if (tag) {
      dispatch({
        type: 'application/appGetAll',
      }).then(() => {
        this.setState({
          tag: false,
        });
      });
    } else {
      dispatch({
        type: 'application/appGet',
        payload: {
          creator: localStorage.getItem('userName'),
        },
      }).then(() => {
        this.setState({
          tag: true,
        });
      });
    }
  };
  pushonChange = (value: any) => {
    if (value !== '0') {
      this.setState({
        pushTag: true,
      });
    } else {
      this.setState({
        pushTag: false,
      });
    }
  };
  UnitonChange = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'application/getRolesByUnit',
      payload: {unitid: value},
    });
  };
  RoleonChange = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'application/getUserByRoles',
      payload: {roleid: value},
    });
  };
  delete = (record: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'application/appDelete',
      payload: {
        id: record.id,
      },
    }).then(() => {
      dispatch({
        type: 'application/appGetAll',
      });
    });
  };

  render() {
    const {
      dispatch,
      allapplist,
      MyPersons,
      unitlist,
      rolesbyunit,
      userbyroles,
      rolelist,
      AddLoading,
      UpdateLoading,
    } = this.props;
    const {tag, pushTag} = this.state;
    const columns: ColumnsType<APP> = [
      {
        title: '应用ID',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '应用名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'creatTime',
        align: 'center',
        sorter: {
          compare: (a: { creatTime: string }, b: { creatTime: string }) =>
            a.creatTime.localeCompare(b.creatTime),
          multiple: 2,
        },
      },
      {
        title: '查看',
        align: 'center',
        render: (text: any, record: any) => (
          <Link to={{pathname: '/ApplicationContent', state: {...record}}}>
            查看结果
          </Link>
        ),
      },
      {
        title: '操作',
        dataIndex: 'english',
        align: 'center',
        render: (text: any, record: any) => (
          <Space>
            <Button
              type="link"
              onClick={() => {
                this.editshowModal(record);
              }}
            >
              编辑
            </Button>

            <Popconfirm
              title="您确定要删除该应用吗？"
              onConfirm={() => this.delete(record)}
              okText="是"
              cancelText="否"
            >
              <Button type="link">删除</Button>
            </Popconfirm>

            {/* <Button
              type="link"
              onClick={() => {
                this.delete(record);
              }}
            >
              删除
            </Button> */}
          </Space>
        ),
      },
    ];

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
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        <div style={{marginBottom: 30, backgroundColor: 'white'}}>
          <PageHeader
            title="应用任务"
            subTitle="应用包含多个场景"
            tags={<Tag color="blue">运行中</Tag>}
            extra={[
              <Search
                key={'Search'}
                placeholder="创建者"
                onSearch={this.onSearch}
                style={{width: 208}}
              />,
              // <Button type="primary" onClick={() => this.getByCreator(tag)} key={'p'}>
              //   {tag ? <span>全部应用</span> : <span>个人应用</span>}
              // </Button>,
              <Button type="primary" onClick={this.showModal} key={'create'}>
                创建应用
              </Button>,
            ]}
            avatar={{src: require('@/assets/picture/应用.png')}}
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
          <Card
            title="应用列表"
            // extra={
            //   <Space>
            //     <Search
            //       placeholder="创建者"
            //       onSearch={this.onSearch}
            //       style={{ width: 208 }}
            //     />
            //     <Button type="primary" onClick={() => this.getByCreator(tag)}>
            //       {tag ? <span>全部应用</span> : <span>个人应用</span>}
            //     </Button>
            //     <Button type="primary" onClick={this.showModal}>
            //       创建应用
            //     </Button>
            //   </Space>
            // }
          >
            <Table
              columns={columns}
              dataSource={allapplist}
              rowKey={() => Math.random()}
              loading={AddLoading || UpdateLoading}
              style={{height: 800}}
            />
          </Card>

          <Modal
            width="900px"
            title="创建应用"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
          >
            <Form name="appForm" onFinish={this.onFinish}>
              <Form.Item
                label="应用名称"
                name="name"
                rules={[{required: true, message: '请输入应用名称'}]}
              >
                <Row>
                  <Col span={24}>
                    <Input style={{width: '100%'}}/>
                  </Col>
                </Row>
              </Form.Item>

              <Form.List name="personsInfo">
                {(fields, {add, remove}) => (
                  <>
                    <Row align="middle">
                      <Col span={3}>
                        <span style={{marginTop: 10, marginLeft: 10}}>
                          关联分群
                        </span>
                      </Col>
                      <Col span={1}>
                        <Form.Item>
                          <Button
                            type="primary"
                            style={{marginTop: 20}}
                            shape="circle"
                            size="small"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined/>}
                          ></Button>
                        </Form.Item>
                      </Col>
                    </Row>
                    {fields.map(({key, name, fieldKey, ...restField}) => (
                      <Space
                        key={key}
                        style={{
                          display: 'flex',
                          marginBottom: 8,
                          marginLeft: 40,
                        }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          // label="应用关联名称"
                          name={[name, 'key']}
                          fieldKey={[fieldKey, 'index']}
                          hidden
                          initialValue={fieldKey}
                        >
                          <Input/>
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          label="应用关联名称"
                          name={[name, 'name']}
                          fieldKey={[fieldKey, 'name']}
                          rules={[
                            {required: true, message: 'Missing first name'},
                          ]}
                        >
                          <Input placeholder="Name"/>
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          label="绑定分群"
                          name={[name, 'usergroup']}
                          fieldKey={[fieldKey, 'usergroup']}
                          // rules={[{ required: true, message: 'Missing last name' }]}
                        >
                          <Select
                            placeholder="UserGroup"
                            style={{width: 200}}
                          >
                            {MyPersons?.length != 0 ? (
                              MyPersons?.map((element: any, index: any) => {
                                return (
                                  <Option value={element.id} key={index}>
                                    {element.name}
                                  </Option>
                                );
                              })
                            ) : (
                              <div></div>
                            )}
                          </Select>
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)}/>
                      </Space>
                    ))}
                  </>
                )}
              </Form.List>
              <Divider/>
              <Row>
                <Col span={7}>
                  <Form.Item
                    label="推送"
                    name="ispush"
                    rules={[{required: true, message: '请输入推送情况'}]}
                  >
                    <Select
                      style={{width: '100%'}}
                      onChange={this.pushonChange}
                    >
                      <Option value="0">不推送</Option>
                      <Option value="1">推送一次</Option>
                      <Option value="2">实时推送</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              {pushTag ? (
                <Row>
                  {/* <Col span={8}>
                    <Form.Item
                      label="选择学院"
                      name="unit"
                      rules={[{ required: true, message: '请输入学院' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        onChange={this.UnitonChange}
                      >
                        {unitlist.map((element: any, index: any) => {
                          return (
                            <Option value={element.UNIT_ID} key={index}>
                              {element.UNIT_NAME}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col> */}
                  <Col span={7}>
                    <Form.Item
                      label="角色"
                      name="role"
                      rules={[{required: true, message: '请输入角色'}]}
                    >
                      <Select
                        style={{width: '100%'}}
                        onChange={this.RoleonChange}
                      >
                        {rolelist?.map((element: any, index: any) => {
                          return (
                            <Option value={element.id} key={index}>
                              {element.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={7} offset={1}>
                    <Form.Item label="用户" name="userid">
                      <Select style={{width: '100%'}}>
                        {userbyroles.map((element: any, index: any) => {
                          return (
                            <Option value={element.id} key={index}>
                              {element.userName}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              ) : (
                <div></div>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{width: '100%'}}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            width="900px"
            title="编辑应用"
            visible={this.state.editvisible}
            onOk={this.edithandleOk}
            onCancel={this.edithandleCancel}
            footer={null}
            forceRender
          >
            <Form
              ref={this.formRef}
              name="control-ref"
              onFinish={this.editonFinish}
            >
              <Form.Item
                label="应用名称"
                name="name"
                rules={[{required: true, message: '请输入应用名称'}]}
              >
                <Input style={{width: '100%'}}/>
              </Form.Item>
              <Form.Item name="id" hidden>
                <Input style={{width: '100%'}}/>
              </Form.Item>

              <Form.List name="personsInfo">
                {(fields, {add, remove}) => (
                  <>
                    <Row align="middle">
                      <Col span={3}>
                        <span style={{marginTop: 10, marginLeft: 10}}>
                          关联分群
                        </span>
                      </Col>
                      <Col span={1}>
                        <Form.Item>
                          <Button
                            type="primary"
                            style={{marginTop: 20}}
                            shape="circle"
                            size="small"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined/>}
                          ></Button>
                        </Form.Item>
                      </Col>
                    </Row>
                    {fields.map(({key, name, fieldKey, ...restField}) => (
                      <Space
                        key={key}
                        style={{
                          display: 'flex',
                          marginBottom: 8,
                          marginLeft: 40,
                        }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          // label="应用关联名称"
                          name={[name, 'key']}
                          fieldKey={[fieldKey, 'index']}
                          hidden
                          initialValue={fieldKey}
                        >
                          <Input/>
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          label="应用关联名称"
                          name={[name, 'name']}
                          fieldKey={[fieldKey, 'name']}
                          rules={[
                            {required: true, message: 'Missing first name'},
                          ]}
                        >
                          <Input placeholder="Name"/>
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          label="绑定分群"
                          name={[name, 'usergroup']}
                          fieldKey={[fieldKey, 'usergroup']}
                          // rules={[{ required: true, message: 'Missing last name' }]}
                        >
                          <Select
                            placeholder="UserGroup"
                            style={{width: 200}}
                          >
                            {MyPersons?.length != 0 ? (
                              MyPersons?.map((element: any, index: any) => {
                                return (
                                  <Option value={element.id} key={index}>
                                    {element.name}
                                  </Option>
                                );
                              })
                            ) : (
                              <div></div>
                            )}
                          </Select>
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)}/>
                      </Space>
                    ))}
                  </>
                )}
              </Form.List>
              <Divider/>
              <Row>
                <Col span={7}>
                  <Form.Item
                    label="推送"
                    name="ispush"
                    rules={[{required: true, message: '请输入推送情况'}]}
                  >
                    <Select
                      style={{width: '100%'}}
                      onChange={this.pushonChange}
                    >
                      <Option value="0">不推送</Option>
                      <Option value="1">推送一次</Option>
                      <Option value="2">实时推送</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              {pushTag ? (
                <Row>
                  {/* <Col span={8}>
                    <Form.Item
                      label="选择学院"
                      name="unit"
                      rules={[{ required: true, message: '请输入学院' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        onChange={this.UnitonChange}
                      >
                        {unitlist.map((element: any, index: any) => {
                          return (
                            <Option value={element.UNIT_ID} key={index}>
                              {element.UNIT_NAME}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col> */}
                  <Col span={7}>
                    <Form.Item
                      label="角色"
                      name="role"
                      rules={[{required: true, message: '请输入角色'}]}
                    >
                      <Select
                        style={{width: '100%'}}
                        onChange={this.RoleonChange}
                      >
                        {rolelist?.map((element: any, index: any) => {
                          return (
                            <Option value={element.id} key={index}>
                              {element.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={7} offset={1}>
                    <Form.Item label="用户" name="userid">
                      <Select style={{width: '100%'}}>
                        {userbyroles.map((element: any, index: any) => {
                          return (
                            <Option value={element.id} key={index}>
                              {element.userName}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              ) : (
                <div></div>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{width: '100%'}}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </ConfigProvider>
      </div>
    );
  }
}

export default connect(
  ({application, portrait, user, role, loading}: any) => ({
    ...application,
    ...portrait,
    ...user,
    ...role,
    AddLoading: loading.effects['application/appAdd'],
    UpdateLoading: loading.effects['application/appUpdate'],
  }),
)(CreateApplication);
