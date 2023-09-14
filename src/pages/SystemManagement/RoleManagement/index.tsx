import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  PageHeader,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Transfer,
} from 'antd';
import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect} from 'umi';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import {ColumnsType} from 'antd/es/table';
import DownloadExcel from '@/utils/DownloadExcel.js';
import moment from 'moment';

const {Option} = Select;
const layout = {labelCol: {span: 4}, wrapperCol: {span: 16}};
const tailLayout = {wrapperCol: {offset: 2, span: 18}};

interface TableType {
  id: string;
  name: string;
  permissionIdList?: object[];
  schoolId: string;
  unitId: string;
}

export type Props = {
  dispatch: Dispatch;
  rolelist?: TableType[];
  schoollist: object[];
  unitlist: object[];
  Tableloading: boolean;
};

class RoleManagement extends Component<Props> {
  state = {
    visible: false,
    editvisible: false,
    authorityvisible: false,
    innerlist: [], //权限列表
    permissionlisttemp: [], //权限穿梭框列表
    targetKeys: [], //权限穿梭框目标KEY,右侧
    selectedKeys: [], //权限穿梭框已选KEY,左侧
  };
  searchFormRef = React.createRef<FormInstance>();
  formRef = React.createRef<FormInstance>();
  onChange = (nextTargetKeys: any) => {
    this.setState({targetKeys: nextTargetKeys});
  };
  onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    this.setState({
      selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys],
    });
  };
  componentDidMount = () => {
    const {dispatch} = this.props;
    dispatch({type: 'role/findrole'});

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
      type: 'authority/findpermissiontemp',
      payload: {callback: this.findpermissiontemp},
    });
  };

  findpermissiontemp = (value: any) => {
    let roleTransfer: any = [];
    value.map((element: any, index: any) => {
      let temp: any = {};
      temp.key = element.id;
      temp.title = element.name;
      temp.description = element.name;
      roleTransfer.push(temp);
    });
    this.setState({permissionlisttemp: roleTransfer});
  };
  showModal = () => {
    this.setState({visible: true, targetKeys: []});
  };
  authorityshowModal = () => {
    this.setState({authorityvisible: true});
  };
  editshowModal = (value: any) => {
    let ljhh: any = [];
    value.permissions.map((element: any, index: any) => {
      ljhh.push(element.id);
    });
    this.formRef.current?.setFieldsValue({
      id: value.id,
      name: value.name,
      permissions: ljhh,
      charge: value.charge,
    });
    this.setState({editvisible: true, targetKeys: ljhh});
  };
  handleOk = () => {
    this.setState({visible: false});
  };
  edithandleOk = () => {
    this.setState({editvisible: false});
  };
  authorityhandleOk = () => {
    this.setState({authorityvisible: false});
  };
  authorityhandleCancel = () => {
    this.setState({authorityvisible: false});
  };
  handleCancel = () => {
    this.setState({visible: false});
  };
  edithandleCancel = () => {
    this.setState({editvisible: false});
  };
  onFinish = (values: any) => {
    this.setState({visible: false});
    const {dispatch} = this.props;
    dispatch({
      type: 'role/addrole',
      payload: values,
    }).then(() => {
      dispatch({
        type: 'role/findrole',
      });
    });
  };
  editonFinish = (values: any) => {
    this.setState({
      editvisible: false,
    });
    const {dispatch} = this.props;
    dispatch({
      type: 'role/updaterole',
      payload: values,
    }).then(() => {
      dispatch({
        type: 'role/findrole',
      });
    });
  };
  onSearchFinish = (value: any) => {
    if (value.id) {
      this.props.dispatch({
        type: 'role/getOneById',
        payload: {
          id: value.id,
        },
      });
    }
  };
  resetSearchForm = () => {
    this.searchFormRef.current?.resetFields();
    this.props.dispatch({type: 'role/findrole'});
  };
  deleteuser = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'role/deleterole',
      payload: {
        id: value.id,
      },
    }).then(() => {
      dispatch({
        type: 'role/findrole',
      });
    });
  };
  authoritydetails = (value: any) => {
    let ljhhh: any = deepClone(value.permissions);
    ljhhh.map((element: any, index: any) => {
      element.key = index;
    });
    this.setState({
      innerlist: ljhhh,
      authorityvisible: true,
    });
  };

  render() {
    const {schoollist, unitlist, rolelist, Tableloading} = this.props;
    const {innerlist} = this.state;
    const columns: ColumnsType<TableType> = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },

      {
        title: '权限列表',
        dataIndex: 'permissions',
        key: 'permissions',

        render: (text: any, value: any) => {
          return (
            <>
              <Button type="link" onClick={() => this.authoritydetails(value)}>
                权限详情
              </Button>
            </>
          );
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
              <Popconfirm
                title="您确定要删除该角色吗？"
                onConfirm={() => this.deleteuser(value)}
                okText="是"
                cancelText="否"
              >
                <Button type="link">删除</Button>
              </Popconfirm>
            </>
          );
        },
      },
    ];
    const innercolumns: ColumnsType<TableType> = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
    ];

    function handleDownloadExcel() {
      DownloadExcel(
        columns,
        rolelist,
        `画像详细信息${moment().format('YYYYMMDDHHmmss')}`,
        [],
        () => {
          setTimeout(() => {
            notification.success({message: '导出成功!'});
          }, 300);
        },
      );
    }

    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        <Space direction="vertical" style={{width: '100%'}}>
          <PageHeader
            className="site-page-header"
            // onBack={() => null}
            ghost={false}
            title="角色管理"
          >
            <Divider/>
            <Form onFinish={this.onSearchFinish} ref={this.searchFormRef}>
              <Row gutter={[16, 0]}>
                <Col>
                  <Form.Item label="ID" name="id">
                    <Input/>
                  </Form.Item>
                </Col>
                {/* <Col>
                  <Form.Item label="角色名称" name="name">
                    <Input />
                  </Form.Item>
                </Col> */}
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
            title="角色管理"
            extra={
              <>
                <Space>
                  {/* <Button type="primary" onClick={handleDownloadExcel}>
                    下载
                  </Button> */}
                  <Button type="primary" onClick={this.showModal}>
                    添加角色
                  </Button>
                </Space>
              </>
            }
          >
            <Table
              columns={columns}
              dataSource={rolelist}
              rowKey={() => Math.random()}
              loading={Tableloading}
            />
          </Card>
        </Space>

        <ConfigProvider locale={zhCN}>
          <Modal
            width="650px"
            title="添加角色"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
          >
            <Form name="control-ref" onFinish={this.onFinish} {...layout}>
              <Form.Item
                label="角色名称"
                name="name"
                rules={[{required: true, message: '请输入角色名称'}]}
              >
                <Input/>
              </Form.Item>
              <Form.Item
                label="是否主管"
                name="charge"
                rules={[{required: true, message: '请输入学院名称!'}]}
              >
                <Select>
                  <Option value={'1'}>主管</Option>
                  <Option value={'0'}>非主管</Option>
                </Select>
              </Form.Item>
              <Form.Item name="permissions" label="权限列表">
                <Transfer
                  dataSource={this.state.permissionlisttemp}
                  titles={['权限列表', '已选权限']}
                  listStyle={{
                    width: 200,
                    height: 200,
                  }}
                  targetKeys={this.state.targetKeys}
                  selectedKeys={this.state.selectedKeys}
                  onChange={this.onChange}
                  onSelectChange={this.onSelectChange}
                  render={(item: any) => item.title}
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
            title="编辑角色"
            visible={this.state.editvisible}
            onOk={this.edithandleOk}
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
                label="角色名称"
                name="name"
                rules={[{required: true, message: '请输入角色名称'}]}
              >
                <Input/>
              </Form.Item>

              <Form.Item
                label="是否主管"
                name="charge"
                rules={[{required: true, message: '请输入学院名称!'}]}
              >
                <Select>
                  <Option value={'1'}>主管</Option>
                  <Option value={'0'}>非主管</Option>
                </Select>
              </Form.Item>
              <Form.Item name="permissions" label="权限列表">
                <Transfer
                  dataSource={this.state.permissionlisttemp}
                  titles={['权限列表', '已选权限']}
                  listStyle={{
                    width: 200,
                    height: 200,
                  }}
                  targetKeys={this.state.targetKeys}
                  selectedKeys={this.state.selectedKeys}
                  onChange={this.onChange}
                  onSelectChange={this.onSelectChange}
                  render={(item: any) => item.title}
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
        <Modal
          width="1000px"
          title="权限列表"
          visible={this.state.authorityvisible}
          onOk={this.authorityhandleOk}
          onCancel={this.authorityhandleCancel}
        >
          <Table columns={innercolumns} dataSource={innerlist}/>
        </Modal>
      </div>
    );
  }
}

// export default UserManagement;
export default connect(({role, loading, user}: any, {authority}: any) => ({
  ...role,
  Tableloading: loading.effects['role/findrole'],
  authority,
  ...user,
}))(RoleManagement);

function deepClone(arr: any) {
  let _obj = JSON.stringify(arr);
  return JSON.parse(_obj);
}
