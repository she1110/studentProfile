import {
  Badge,
  Button,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Modal,
  PageHeader,
  Row,
  Select,
  Space,
  Table,
  Transfer,
  TreeSelect,
} from 'antd';
import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect} from 'umi';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import {ColumnsType} from 'antd/es/table';

const {Option} = Select;
const layout = {labelCol: {span: 4}, wrapperCol: {span: 16}};
const tailLayout = {wrapperCol: {offset: 4, span: 16}};
export type user = {
  account: string;
  id: string;
  opLevel: string;
  name: string;
  schoolID: string;
  unitId: string;
};

export type Props = {
  dispatch: Dispatch;
  userlist: user[];
  schoollist: object[];
  unitlist: object[];
  Tableloading: boolean;
  HullTree: object[];
};

class UserManagement extends Component<Props> {
  state = {
    visible: false, //添加角色的Modal
    editvisible: false, //编辑角色的Modal
    targetKeys: [], //角色穿梭框目标KEY,右侧
    selectedKeys: [], //角色穿梭框已选KEY,左侧
    roleList: [], //角色穿梭框列表
  };
  searchFormRef = React.createRef<FormInstance>();
  formRef = React.createRef<FormInstance>();
  componentDidMount = () => {
    const {dispatch} = this.props;
    dispatch({type: 'user/getAllUser'});
    dispatch({
      type: 'role/findroletemp',
      payload: {callback: this.findroletemp},
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
    dispatch({
      type: 'user/getHullTree',
    });
  };
  onChange = (nextTargetKeys: any) => {
    this.setState({targetKeys: nextTargetKeys});
  };
  onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    this.setState({
      selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys],
    });
  };
  showModal = () => {
    this.setState({targetKeys: [], visible: true});
  };
  findroletemp = (value: any) => {
    let roleTransfer: any = [];
    value.map((element: any, index: any) => {
      let temp: any = {};
      temp.key = element.id;
      temp.title = element.name;
      temp.description = element.name;
      roleTransfer.push(temp);
    });
    this.setState({roleList: roleTransfer});
  };
  editshowModal = (value: any) => {
    let ljhh: any = [];
    value.roles?.map((element: any) => {
      ljhh.push(element.id + '');
    });
    this.formRef.current?.setFieldsValue({
      account: value.account,
      password: value.password,
      userName: value.userName,
      unitId: value.unitId,
      schoolId: value.schoolId,
      opLevel: value.opLevel,
      id: value.id,
      roles: ljhh,
      email: value.email,
      department: value.department,
    });
    this.setState({editvisible: true, targetKeys: ljhh});
  };
  handleCancel = () => {
    this.setState({visible: false});
  };
  edithandleCancel = () => {
    this.setState({editvisible: false});
  };
  onFinish = (values: any) => {
    const {dispatch} = this.props;
    this.setState({visible: false});
    dispatch({type: 'user/userAdd', payload: values}).then(() => {
      dispatch({type: 'user/getAllUser'});
    });
  };
  editonFinish = (values: any) => {
    const {dispatch} = this.props;
    this.setState({editvisible: false});
    dispatch({
      type: 'user/userupdate',
      payload: values,
    }).then(() => {
      dispatch({
        type: 'user/getAllUser',
      });
    });
  };
  onSearchFinish = (value: any) => {
    const {dispatch} = this.props;
    dispatch({type: 'user/usersearch', payload: value});
  };
  resetSearchForm = () => {
    this.searchFormRef.current?.resetFields();
    const {dispatch} = this.props;
    dispatch({type: 'user/getAllUser'});
  };
  deleteuser = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/userDelete',
      payload: {
        id: value.id,
      },
    }).then(() => {
      dispatch({type: 'user/getAllUser'});
    });
  };

  render() {
    const {userlist, unitlist, schoollist, Tableloading, HullTree} =
      this.props;

    const columns: ColumnsType<user> = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '账号',
        dataIndex: 'account',
        key: 'account',
        align: 'center',
      },
      {
        title: '昵称',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
      },
      {
        title: '学校名称',
        dataIndex: 'schoolName',
        key: 'schoolName',
      },
      {
        title: '学院名称',
        dataIndex: 'unitName',
        key: 'unitName',
        align: 'center',
      },
      {
        title: '操作等级',
        dataIndex: 'opLevel',
        key: 'opLevel',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          switch (text) {
            case '0':
              return <Badge color="red" text="管理员"/>;
            case '2':
              return <Badge color="gold" text="院级"/>;
            case '1':
              return <Badge color="pink" text="校级"/>;
            default:
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text: any, value: any) => {
          return (
            <>
              <Button type="link" onClick={() => this.editshowModal(value)}>
                编辑
              </Button>
              <Button type="link" onClick={() => this.deleteuser(value)}>
                删除
              </Button>
            </>
          );
        },
      },
    ];
    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        <Space direction="vertical" style={{width: '100%'}}>
          <PageHeader
            className="site-page-header"
            // onBack={() => null}
            ghost={false}
            title="用户管理"
          >
            <Divider/>
            <Form onFinish={this.onSearchFinish} ref={this.searchFormRef}>
              <Row gutter={[16, 0]}>
                <Col>
                  <Form.Item label="账号" name="account">
                    <Input/>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="昵称" name="userName">
                    <Input/>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="学校名字" name="schoolId">
                    <Select style={{width: 170}}>
                      {schoollist.map((element: any, index: any) => {
                        return (
                          <Option value={element.ID} key={index}>
                            {element.SCHOOL_NAME}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="学院名字" name="unitId">
                    <Select style={{width: 170}}>
                      {unitlist.map((element: any, index: any) => {
                        return (
                          <Option value={element.UNIT_ID} key={index}>
                            {element.UNIT_NAME}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="用户部门" name="department">
                    <TreeSelect
                      style={{width: '220px'}}
                      treeData={HullTree}
                      treeLine={true}
                      treeIcon={false}
                      // multiple={true}
                      // suffixIcon={<UserAddOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={this.resetSearchForm}>
                    重置
                  </Button>
                </Col>
              </Row>
            </Form>
          </PageHeader>
          <Card
            title="用户列表"
            extra={
              <Button type="primary" onClick={this.showModal}>
                添加用户
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={userlist}
              rowKey={() => Math.random()}
              loading={Tableloading}
            />
          </Card>
        </Space>

        <ConfigProvider locale={zhCN}>
          <Modal
            width="650px"
            title="添加用户"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={null}
            forceRender={true}
          >
            <Form name="control-ref" onFinish={this.onFinish} {...layout}>
              <Form.Item
                label="用户名"
                name="account"
                rules={[{required: true, message: '请输入用户名!'}]}
              >
                <Input/>
              </Form.Item>
              <Form.Item
                label="密码"
                name="password"
                rules={[{required: true, message: '请输入密码!'}]}
              >
                <Input.Password/>
              </Form.Item>
              <Form.Item
                label="邮箱"
                name="email"
                rules={[{required: true, message: '请输入邮箱!'}]}
              >
                <Input/>
              </Form.Item>
              <Form.Item
                label="昵称"
                name="userName"
                rules={[{required: true, message: '请输入昵称!'}]}
              >
                <Input/>
              </Form.Item>
              <Form.Item
                label="学院名称"
                name="unitId"
                rules={[{required: true, message: '请输入学院名称!'}]}
              >
                <Select>
                  {unitlist.map((element: any, index: any) => {
                    return (
                      <Option value={element.UNIT_ID} key={index}>
                        {element.UNIT_NAME}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="学校名称"
                name="schoolId"
                rules={[{required: true, message: '请输入学校名称!'}]}
              >
                <Select>
                  {schoollist.map((element: any, index: any) => {
                    return (
                      <Option value={element.ID} key={index}>
                        {element.SCHOOL_NAME}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="部门"
                name="department"
                rules={[{required: true, message: '请输入部门!'}]}
              >
                <TreeSelect
                  style={{width: '100%'}}
                  treeData={HullTree}
                  treeLine={true}
                  treeIcon={false}
                  // multiple={true}
                  // suffixIcon={<UserAddOutlined />}
                />
              </Form.Item>
              <Form.Item
                label="操作等级"
                name="opLevel"
                rules={[{required: true, message: '请输入操作等级!'}]}
              >
                <Select>
                  <Option value="0">管理员</Option>
                  <Option value="1">校级</Option>
                  <Option value="2">院级</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="roles"
                label="角色"
                rules={[{required: true, message: '请选择角色!'}]}
              >
                <Transfer
                  dataSource={this.state.roleList}
                  titles={['角色列表', '已选角色']}
                  listStyle={{
                    width: 200,
                    height: 200,
                  }}
                  targetKeys={this.state.targetKeys}
                  selectedKeys={this.state.selectedKeys}
                  onChange={this.onChange}
                  onSelectChange={this.onSelectChange}
                  render={(item) => item.title}
                />
              </Form.Item>
              <Form.Item {...tailLayout}>
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
            width="650px"
            title="编辑用户"
            visible={this.state.editvisible}
            onCancel={this.edithandleCancel}
            footer={null}
            forceRender={true}
          >
            <Form
              ref={this.formRef}
              name="control-ref-edit"
              onFinish={this.editonFinish}
              {...layout}
            >
              <Form.Item name="id" hidden>
                <Input/>
              </Form.Item>
              <Form.Item
                label="用户名"
                name="account"
                rules={[{required: true, message: '请输入用户名!'}]}
              >
                <Input/>
              </Form.Item>
              {/* <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
              >
                <Input type="password" />
              </Form.Item> */}
              <Form.Item
                label="邮箱"
                name="email"
                rules={[{required: true, message: '请输入邮箱!'}]}
              >
                <Input/>
              </Form.Item>
              <Form.Item
                label="昵称"
                name="userName"
                rules={[{required: true, message: '请输入昵称!'}]}
              >
                <Input/>
              </Form.Item>
              <Form.Item
                label="学院名称"
                name="unitId"
                rules={[{required: true, message: '请输入学院名称!'}]}
              >
                <Select>
                  {unitlist.map((element: any, index: any) => {
                    return (
                      <Option value={element.UNIT_ID} key={index}>
                        {element.UNIT_NAME}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="学校名称"
                name="schoolId"
                rules={[{required: true, message: '请输入学校名称!'}]}
              >
                <Select>
                  {schoollist.map((element: any, index: any) => {
                    return (
                      <Option value={element.ID} key={index}>
                        {element.SCHOOL_NAME}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="部门"
                name="department"
                rules={[{required: true, message: '请输入部门!'}]}
              >
                <TreeSelect
                  style={{width: '100%'}}
                  treeData={HullTree}
                  treeLine={true}
                  treeIcon={false}
                  // multiple={true}
                  // suffixIcon={<UserAddOutlined />}
                />
              </Form.Item>
              <Form.Item
                label="操作等级"
                name="opLevel"
                rules={[{required: true, message: '请输入操作等级!'}]}
              >
                <Select>
                  <Option value="0">管理员</Option>
                  <Option value="1">校级</Option>
                  <Option value="2">院级</Option>
                </Select>
              </Form.Item>
              <Form.Item name="roles" label="角色">
                <Transfer
                  dataSource={this.state.roleList}
                  titles={['角色列表', '已选角色']}
                  listStyle={{
                    width: 200,
                    height: 200,
                  }}
                  targetKeys={this.state.targetKeys}
                  selectedKeys={this.state.selectedKeys}
                  onChange={this.onChange}
                  onSelectChange={this.onSelectChange}
                  render={(item) => item.title}
                />
              </Form.Item>
              <Form.Item {...tailLayout}>
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

export default connect(({user, role, loading}: any) => ({
  ...user,
  Tableloading: loading.effects['user/getAllUser'],
  role,
}))(UserManagement);
