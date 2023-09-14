import {Button, Card, Col, ConfigProvider, Form, Input, Modal, Row, Select, Space, Tree, TreeSelect,} from 'antd';
import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect} from 'umi';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';

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

  treeDataList: object[]; //页面展示树结构
  treeData: object[]; //输入框输入
  HullTree: object[]; //输入框输入
  OnlyDepTree: object[]; //输入框输入 仅仅部门的树
};

class DepartmentManagement extends Component<Props> {
  state = {
    addvisible: false, //add modal
    deletevisible: false, //delete modal
    updatevisible: false, //update modal

    value: undefined,
  };
  searchFormRef = React.createRef<FormInstance>();
  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'department/getTree',
      payload: {
        node: '1001',
      },
    });
    dispatch({
      type: 'department/getOnlyDepTree',
      payload: {
        node: '1001',
      },
    });
    dispatch({
      type: 'user/getHullTree',
    });
  };

  addShowModal = () => {
    this.setState({addvisible: true});
  };
  addHandleOk = () => {
    this.setState({addvisible: false});
  };
  addHandleCancel = () => {
    this.setState({addvisible: false});
  };

  deleteShowModal = () => {
    this.setState({deletevisible: true});
  };
  deleteHandleOk = () => {
    this.setState({deletevisible: false});
  };
  deleteHandleCancel = () => {
    this.setState({deletevisible: false});
  };

  updateShowModal = (value: any) => {
    this.setState({updatevisible: true});
  };
  updateHandleOk = () => {
    this.setState({updatevisible: false});
  };
  updateHandleCancel = () => {
    this.setState({updatevisible: false});
  };

  addOnFinish = (values: any) => {
    this.setState({addvisible: false});
    let departmenttemp: any = {};
    departmenttemp.name = values.name;
    values.department = departmenttemp;
    const {dispatch} = this.props;
    dispatch({
      type: 'department/add',
      payload: values,
    }).then(() => {
      dispatch({
        type: 'user/getHullTree',
      });
      dispatch({
        type: 'department/getTree',
        payload: {
          node: '1001',
        },
      });
    });
  };
  deleteOnFinish = (values: any) => {
    this.setState({deletevisible: false});
    const {dispatch} = this.props;
    dispatch({
      type: 'department/del',
      payload: values,
    }).then(() => {
      dispatch({
        type: 'user/getHullTree',
      });
      dispatch({
        type: 'department/getTree',
        payload: {
          node: '1001',
        },
      });
    });
  };
  updateOnFinish = (values: any) => {
    this.setState({
      updatevisible: false,
    });
    const {dispatch} = this.props;
    dispatch({
      type: 'department/update',
      payload: values,
    }).then(() => {
      dispatch({
        type: 'user/getHullTree',
      });
      dispatch({
        type: 'department/getTree',
        payload: {
          node: '1001',
        },
      });
    });
  };

  render() {
    const {treeDataList, treeData, HullTree, OnlyDepTree} = this.props;
    const {addvisible, deletevisible, updatevisible} = this.state;
    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        <ConfigProvider locale={zhCN}>
          <Row>
            <Col span={16}>
              <Card
                title="部门树"
                extra={
                  <>
                    <Space>
                      <Button type="primary" onClick={this.addShowModal}>
                        添加部门
                      </Button>
                      <Button type="primary" onClick={this.deleteShowModal}>
                        删除部门
                      </Button>
                      <Button type="primary" onClick={this.updateShowModal}>
                        更新部门
                      </Button>
                    </Space>
                  </>
                }
              >
                <Tree
                  showLine
                  defaultExpandedKeys={['1630720816079']}
                  treeData={treeDataList}
                  style={{fontSize: 20}}
                />
              </Card>
            </Col>
          </Row>

          <Modal
            width="600px"
            title="添加部门"
            visible={addvisible}
            onOk={this.addHandleOk}
            onCancel={this.addHandleCancel}
            footer={null}
            forceRender
          >
            <Form name="control-ref" onFinish={this.addOnFinish} {...layout}>
              <Form.Item
                label="父节点名称"
                name="parent"
                rules={[{required: true, message: '请输入父节点!'}]}
              >
                <TreeSelect
                  style={{width: '100%'}}
                  // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={OnlyDepTree}
                  treeLine={true}
                  treeIcon={false}
                />
              </Form.Item>
              <Form.Item
                label="部门名称"
                name="name"
                rules={[{required: true, message: '请输入部门名称!'}]}
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
            width="650px"
            title="修改部门"
            visible={updatevisible}
            onOk={this.updateHandleOk}
            onCancel={this.updateHandleCancel}
            footer={null}
            forceRender={true}
          >
            <Form name="修改部门" onFinish={this.updateOnFinish} {...layout}>
              <Form.Item
                label="修改节点"
                name="id"
                rules={[{required: true, message: '请输入父节点!'}]}
              >
                <TreeSelect
                  style={{width: '100%'}}
                  // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={OnlyDepTree}
                  treeLine={true}
                  treeIcon={false}
                />
              </Form.Item>
              <Form.Item
                label="修改名称"
                name="name"
                rules={[{required: true, message: '请输入部门名称!'}]}
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
            width="600px"
            title="删除部门"
            visible={deletevisible}
            onOk={this.deleteHandleOk}
            onCancel={this.deleteHandleCancel}
            footer={null}
          >
            <Form name="删除部门" onFinish={this.deleteOnFinish} {...layout}>
              <Form.Item
                label="选择节点"
                name="id"
                rules={[{required: true, message: '请输入删除节点!'}]}
              >
                <TreeSelect
                  style={{width: '100%'}}
                  // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={OnlyDepTree}
                  treeLine={true}
                  treeIcon={false}
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

export default connect(({department, user}: any) => ({
  ...department,
  ...user,
}))(DepartmentManagement);
