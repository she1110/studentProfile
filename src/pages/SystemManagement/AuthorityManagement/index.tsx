import {Button, Card, Form, Input, Modal, Select, Space, Table,} from 'antd';
import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect} from 'umi';
import {FormInstance} from 'antd/lib/form';
import {ColumnsType} from 'antd/es/table';

const {Option} = Select;
const layout = {labelCol: {span: 4}, wrapperCol: {span: 16}};
const tailLayout = {wrapperCol: {offset: 2, span: 18}};

interface TableType {
  id: string;
  name: string;
  perCode: string;
  schoolId: string;
  unitId: string;
}

export type Props = {
  dispatch: Dispatch;
  permissionlist: TableType[];
  Tableloading: boolean;
};

class AuthorityManagement extends Component<Props> {
  state = {
    visible: false,
    editvisible: false,
  };

  searchFormRef = React.createRef<FormInstance>();
  formRef = React.createRef<FormInstance>();
  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'authority/findpermission',
      });
    }
  };
  showModal = () => {
    this.setState({visible: true});
  };
  editshowModal = (value: any) => {
    this.formRef.current?.setFieldsValue({
      id: value.id,
      name: value.name,
      unitId: value.unitId,
      perCode: value.perCode,
      schoolId: value.schoolId,
    });
    this.setState({editvisible: true});
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
    if (dispatch) {
      dispatch({
        type: 'authority/addpermission',
        payload: values,
      }).then(() => {
        dispatch({
          type: 'authority/findpermission',
        });
      });
    }
  };
  editonFinish = (values: any) => {
    const {dispatch} = this.props;
    this.setState({editvisible: false});
    if (dispatch) {
      dispatch({
        type: 'authority/updatepermission',
        payload: values,
      }).then(() => {
        dispatch({
          type: 'authority/findpermission',
        });
      });
    }
  };
  onSearchFinish = (value: any) => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'authority/findpermission',
        payload: value,
      });
    }
  };
  resetSearchForm = () => {
    const {dispatch} = this.props;
    this.searchFormRef.current?.resetFields();
    dispatch({
      type: 'authority/findpermission',
    });
  };
  deleteuser = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'authority/deletepermission',
      payload: {
        id: value.id,
      },
    }).then(() => {
      dispatch({
        type: 'authority/findpermission',
      });
    });
  };

  render() {
    const {permissionlist, Tableloading} = this.props;
    const columns: ColumnsType<TableType> = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '权限名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '操作',
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
          {/* <PageHeader
            className="site-page-header"
            // onBack={() => null}
            ghost={false}
            title="权限管理"
          >
            <Divider />
            <Form onFinish={this.onSearchFinish} ref={this.searchFormRef}>
              <Row gutter={[16, 0]}>
                <Col>
                  <Form.Item label="权限ID" name="id">
                    <Input />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="权限名称" name="name">
                    <Input />
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
          </PageHeader> */}

          <Card
            title="权限列表"
            extra={
              <Button type="primary" onClick={this.showModal}>
                添加权限
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={permissionlist}
              loading={Tableloading}
            />
          </Card>
        </Space>

        <Modal
          title="添加权限"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Form
            // ref={this.formRef}
            name="control-ref"
            onFinish={this.onFinish}
            {...layout}
          >
            <Form.Item
              label="权限名称"
              name="name"
              rules={[{required: true, message: '请输入用户名!'}]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="perCode"
              name="perCode"
              rules={[{required: true, message: '请输入perCode!'}]}
            >
              <Input/>
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
          title="编辑权限"
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
              label="权限名称"
              name="name"
              rules={[{required: true, message: '请输入用户名!'}]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="perCode"
              name="perCode"
              rules={[{required: true, message: '请输入密码!'}]}
            >
              <Input/>
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
      </div>
    );
  }
}

export default connect(({authority, loading, user}: any) => ({
  ...authority,
  ...user,
  Tableloading: loading.effects['authority/findpermission'],
}))(AuthorityManagement);
