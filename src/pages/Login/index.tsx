// import styles from './index.less';
import './index.css';
import React from 'react';
import {Button, Col, Form, Input, Layout, Modal, Row,} from 'antd';
import userImg from './images/icon-user.png';
import passImg from './images/icon-pass.png';
import logoImg from './images/hebut.png';
import type {Dispatch} from 'umi';
import {connect} from 'umi';
// import { connect } from 'dva';

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};

const tailLayout = {
  wrapperCol: {offset: 8, span: 16},
};

export type LoginType = {
  dispatch: Dispatch;
};

class LoginView extends React.Component<LoginType> {
  state = {
    loading: false,
    checked: false,
    userName: '',
    password: '',
    version: 2,
  };

  onFinish = (values: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/login',
      payload: {
        values,
      },
    });
  };

  onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // handleSubmit = (value: any) => {
  //     console.log(value);
  //     window.location.href = '/Dashboard'
  //     // const loginUser = {
  //     // }
  //     // this.setDataStore(loginUser);
  // }

  // setDataStore = (value: any) => {
  //     if (result !== 'failure' && result !== 'locked' && result !== 'permission') {
  //       sessionStorage.setItem('login', 'true')
  //       sessionStorage.setItem('controll', result.controllList)
  //       sessionStorage.setItem('userRole', result.roleList)
  //       sessionStorage.setItem('serverTime', result.serverTime)
  //       sessionStorage.setItem('version', this.state.version)
  //       browserHistory.push('/Dashboard')
  //     } else if (result === 'locked') {
  //       this.setState({ loading: false })
  //       this.islocked()
  //     } else if (result === 'permission') {
  //       this.setState({ loading: false })
  //       this.isPermission()
  //     } else {
  //       this.setState({ loading: false })
  //       this.failure()
  //     }
  // }

  // islocked() {
  //     Modal.error({
  //         title: '登录失败',
  //         content: '该用户被锁定'
  //     })
  // }

  // isPermission() {
  //     Modal.error({
  //         title: '登录失败',
  //         content: '权限错误,请联系管理员'
  //     })
  // }

  failure() {
    Modal.error({
      title: '登录失败',
      content: '用户名或密码输入错误',
    });
  }

  render() {
    // const { getFieldDecorator } = this.props.form

    return (
      <Layout className="content-login" style={{width: '100%', height: 1000}}>
        <div className="l-loading">
          <div className="logo-div">
            <img src={logoImg}/>
          </div>
          <div className="loginBox">
            <Form
              {...layout}
              name="basic"
              initialValues={{remember: true}}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
              <div className="wel-title">欢&nbsp;迎&nbsp;登&nbsp;录</div>
              <div className="input-div" style={{marginTop: 20}}>
                <Row>
                  <Col>
                    <Form.Item
                      name="account"
                      rules={[
                        {required: true, message: 'Please input your username!'},
                      ]}
                    >
                  <span>
                    <Input
                      style={{width: 300}}
                      prefix={<img src={userImg}/>}
                      className="login-input"
                    />
                    {/* <span className='border-span' /> */}
                  </span>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Item
                      name="password"
                      rules={[
                        {required: true, message: 'Please input your password!'},
                      ]}
                    >
                      <Input.Password
                        style={{width: 300}}
                        prefix={<img src={passImg}/>}
                        className="login-input"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify="center" align="middle">
                  <Col span={14}>
                  </Col>
                  <Col>
                    <a href={"/#/"}>使用邮箱验证登录</a>
                  </Col>
                </Row>

              </div>
              {/* <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                                <Checkbox>Remember me</Checkbox>this
                            </Form.Item> */}
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" style={{width: 100}}>
                  <span>登&nbsp;&nbsp;&nbsp;&nbsp;录</span>
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Layout>
    );
  }
}

export default connect(({user}: any) => ({
  user,
}))(LoginView);
