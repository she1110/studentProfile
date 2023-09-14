import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect} from 'umi';
import {Avatar, Button, Card, Col, Divider, Form, Input, message, Row, Select, Tabs, Upload,} from 'antd';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  InsertRowAboveOutlined,
  MailOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {FormInstance} from 'antd/lib/form';
import {isLoginStatus} from '@/utils/loginStatusChecker';

const {Option} = Select;
const {TabPane} = Tabs;
const {Dragger} = Upload;
const layout = {labelCol: {span: 2}, wrapperCol: {span: 8}};
const tailLayout = {wrapperCol: {offset: 2, span: 8}};
export type user = {
  username: string;
  schoolId: string;
  unitId: string;
  opLevel: string;
};
export type Props = {
  dispatch: Dispatch;
  currentUserInfo: object[];
  currrentuser: user;
};

class UserCenter extends Component<Props> {
  state = {
    currentUserInfo: {}, //之前系统带的
    pictureSrc: undefined, //picture src地址
  };
  resetPasswordFormRef = React.createRef<FormInstance>();
  modifyProfileFormRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    if (!isLoginStatus()) return;
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/getcurrentuserinfo',
        payload: {
          callback: (value: any) => {
            this.setCurrentUserInfo(JSON.parse(value));
          },
        },
      });
    }
  };
  setCurrentUserInfo = (value: any) => {
    if ('picPath' in value) {
      this.setState({
        pictureSrc: value.picPath,
      });
    }
    this.modifyProfileFormRef.current?.setFieldsValue({
      id: value.id,
      username: value.userName,
      schoolId: value.schoolId,
      unitId: value.unitId,
      opLevel: value.opLevel,
      email: value.email,
      account: value.account,
      phone: value.phone,
    });
  };
  onFinish = (value: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/userupdateAndLogOut',
      payload: {
        id: value.id,
        account: value.account,
        email: value.email,
        userName: value.username,
        phone: value.phone,
      },
    }).then(() => {
      dispatch({
        type: 'user/getcurrentuserinfo',
        payload: {
          callback: (value: any) => {
            this.setCurrentUserInfo(JSON.parse(value));
          },
        },
      });
    });
  };
  passwordChangeSuccessful = () => {
    this.resetPasswordFormRef.current?.resetFields();
  };
  onChangepassword = (value: any) => {
    const userAllMessage = JSON.parse(
      localStorage.getItem('userAllMessage') as string,
    );
    const {dispatch} = this.props;
    if (value.password_confirm == value.password) {
      dispatch({
        type: 'user/changePassword',
        payload: {
          account: userAllMessage.account,
          oldpassword: value.old_password,
          password: value.password_confirm,
        },
      });
    } else {
      message.error('新密码不一致！');
    }
  };

  upLoadPicture = (info: any) => {
    const {status} = info.file;
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      if (info.file.response.code === 200) {
        this.setState({
          pictureSrc: info.file.response.data,
        });
      } else {
        message.error('上传失败！！！！');
      }
      message.success(`${info.file.name} 图片上传成功！`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  checkPictureType = (file: any) => {
    //Tag true代表格式正确 可以上传
    const Tag: boolean =
      file.type === 'image/png' || file.type === 'image/jpeg';
    if (Tag) {
      return true;
    } else {
      message.error(`${file.name} 不是jpg或png格式！`);
      return false;
    }
  };

  render() {
    const {currrentuser} = this.props;
    const userAllMessage = JSON.parse(
      localStorage.getItem('userAllMessage') as string,
    );
    const {pictureSrc} = this.state;
    const props = {
      name: 'file',
      multiple: true,
      action: 'http://10.1.40.84:7878/user/uploadLogo',
      headers: {
        Authorization: localStorage.getItem('token') as string,
      },
      showUploadList: false,
      onDrop(e) {
        // console.log('Dropped files', e.dataTransfer.files);
      },
    };
    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        <Row gutter={[16, 16]}>
          <Col span={7}>
            <Card style={{width: '100%', height: 800}}>
              <Row gutter={16} justify="center">
                <Col>
                  <Dragger
                    {...props}
                    onChange={this.upLoadPicture}
                    beforeUpload={this.checkPictureType}
                  >
                    {pictureSrc ? (
                      <Avatar size={300} src={pictureSrc}/>
                    ) : (
                      <Avatar
                        shape="square"
                        size={300}
                        icon={<UserOutlined/>}
                      />
                    )}
                    <p className="ant-upload-hint" style={{marginTop: 10}}>
                      在此处可以上传用户头像，单击或拖动文件到此区域以上传，请使用.png
                      .jpg或者.jpeg格式
                    </p>
                  </Dragger>
                </Col>
              </Row>
              <Divider orientation="left" plain>
                <span style={{fontSize: '24px', fontWeight: 'bold'}}>
                  {' '}
                  个人信息
                </span>
              </Divider>
              <Row gutter={[16, 16]} style={{marginTop: 30}}>
                <Col span={8} offset={3}>
                  <span style={{fontSize: '20px', fontWeight: 'bold'}}>
                    <UserOutlined/>
                    用户名称
                  </span>{' '}
                </Col>
                <Col span={10}>
                  <span style={{fontSize: '20px'}}>
                    {userAllMessage.userName}
                  </span>
                </Col>
              </Row>
              <Row gutter={[16, 16]} style={{marginTop: 10}}>
                <Col span={8} offset={3}>
                  <span style={{fontSize: '20px', fontWeight: 'bold'}}>
                    <MobileOutlined/>
                    手机号码
                  </span>{' '}
                </Col>
                <Col span={10}>
                  <span style={{fontSize: '20px'}}>
                    {userAllMessage.phone}
                  </span>
                </Col>
              </Row>
              <Row gutter={[16, 16]} style={{marginTop: 10}}>
                <Col span={8} offset={3}>
                  <span style={{fontSize: '20px', fontWeight: 'bold'}}>
                    <MailOutlined/>
                    用户邮箱
                  </span>{' '}
                </Col>
                <Col span={10}>
                  <span style={{fontSize: '20px'}}>
                    {userAllMessage.email}
                  </span>
                </Col>
              </Row>

              <Row gutter={[16, 16]} style={{marginTop: 10}}>
                <Col span={8} offset={3}>
                  <span style={{fontSize: '20px', fontWeight: 'bold'}}>
                    <InsertRowAboveOutlined/>
                    创建日期
                  </span>{' '}
                </Col>
                <Col span={12}>
                  <span style={{fontSize: '20px', width: '300px'}}>
                    {'2021年11月11日'}
                  </span>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={17}>
            <Card style={{width: '100%', height: 800}} title="基本资料">
              <Row>
                <Col span={10}>
                  <Form
                    // {...layout}
                    name={'modify_user'}
                    onFinish={this.onFinish}
                    ref={this.modifyProfileFormRef}
                  >
                    <Form.Item name={'id'} fieldKey={'id'} hidden>
                      <Input
                        style={{
                          width: '100%',
                          height: '40px',
                          fontSize: 'large',
                        }}
                        disabled
                      ></Input>
                    </Form.Item>
                    <Form.Item
                      name={'account'}
                      fieldKey={'account'}
                      label="&nbsp;&nbsp;&nbsp;&nbsp;用户名"
                    >
                      <Input
                        style={{
                          width: '100%',
                          height: '40px',
                          fontSize: 'large',
                        }}
                        disabled
                      ></Input>
                    </Form.Item>
                    <Form.Item
                      name={'username'}
                      fieldKey={'username'}
                      label="用户昵称"
                    >
                      <Input
                        style={{
                          width: '100%',
                          height: '40px',
                          fontSize: 'large',
                        }}
                      ></Input>
                    </Form.Item>
                    <Form.Item
                      name={'phone'}
                      fieldKey={'phone'}
                      label="手机号码"
                    >
                      <Input
                        style={{
                          width: '100%',
                          height: '40px',
                          fontSize: 'large',
                        }}
                      ></Input>
                    </Form.Item>

                    <Form.Item
                      name={'email'}
                      fieldKey={'email'}
                      label="用户邮箱"
                    >
                      <Input
                        style={{
                          width: '100%',
                          height: '40px',
                          fontSize: 'large',
                        }}
                      ></Input>
                    </Form.Item>
                    <Form.Item
                      name={'schoolId'}
                      fieldKey={'schoolId'}
                      label="学校名称"
                    >
                      <Select size={'large'} disabled>
                        <Option value="1001">河北工业大学</Option>
                        <Option value="1002">清华大学</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={'unitId'}
                      fieldKey={'unitId'}
                      label="学院名称"
                    >
                      <Select size={'large'} disabled>
                        <Option value="28">人工智能与数据科学学院</Option>
                        <Option value="29">外国语学院</Option>
                        <Option value="14">电气工程学院</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={'opLevel'}
                      fieldKey={'opLevel'}
                      label="操作等级"
                    >
                      <Select size={'large'} disabled>
                        <Option value="2">院级</Option>
                        <Option value="1">校级</Option>
                        <Option value="0">超级管理员</Option>
                      </Select>
                    </Form.Item>
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
                </Col>
                <Col span={2} offset={1}>
                  <Divider type="vertical" style={{height: '100%'}}></Divider>
                </Col>
                <Col span={10}>
                  <Form
                    name={'change_password'}
                    autoComplete="off"
                    onFinish={this.onChangepassword}
                    ref={this.resetPasswordFormRef}
                  >
                    <Form.Item
                      name={'old_password'}
                      fieldKey={'old_password'}
                      label=" 旧密码"
                      rules={[
                        {
                          required: true,
                          message: '请输入正确的旧密码!',
                        },
                      ]}
                    >
                      <Input.Password
                        style={{width: '100%', height: '40px'}}
                        placeholder="请输入旧密码"
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>
                        }
                      ></Input.Password>
                    </Form.Item>
                    <Form.Item
                      name={'password'}
                      fieldKey={'password'}
                      label=" 新密码"
                      rules={[
                        {
                          required: true,
                          message: '请输入6到20位密码!',
                          min: 6,
                          max: 20,
                        },
                      ]}
                    >
                      <Input.Password
                        style={{width: '100%', height: '40px'}}
                        placeholder="请输入新密码"
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>
                        }
                      ></Input.Password>
                    </Form.Item>
                    <Form.Item
                      name={'password_confirm'}
                      fieldKey={'password_confirm'}
                      label="确认密码"
                      rules={[{required: true, message: '输入密码不一致！'}]}
                    >
                      <Input.Password
                        style={{width: '100%', height: '40px'}}
                        placeholder="请确认密码"
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>
                        }
                      ></Input.Password>
                    </Form.Item>
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
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(({user}: any) => ({
  ...user,
}))(UserCenter);
