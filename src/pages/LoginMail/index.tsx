// import styles from './index.less';
import './index.css';
import React from 'react';
import {Button, Col, Form, Input, Layout, message, Modal, Row,} from 'antd';
import userImg from './images/icon-mail.png';
import passImg from './images/icon-pass.png';
import logoImg from './images/hebut.png';
import type {Dispatch} from 'umi';
import {connect} from 'umi';
import useCountdown from 'ahooks/lib/useCountDown';
import { useNavigate } from 'react-router-dom'
// import { connect } from 'dva';
let a =''
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
const { Search } = Input;
class LoginViewMail extends React.Component<LoginType> {
  state = {
    loading: false,
    checked: false,
    userEmail: '',
    verificationCode: '',
    tip1:"获取验证码",
    tip:"获取验证码",
    version: 2,
  };


  onFinish = (values: any) => {
    // console.log(values)
    const {dispatch} = this.props;
    let email=values.email;
    let code=values.verificationCode;
    var emailKey = { email, code };
    console.log(emailKey);
    dispatch({
      type: 'user/loginEmail',
      payload: {
        values:emailKey
      },
    });

  };

  onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  failure() {
    Modal.error({
      title: '登录失败',
      content: '邮箱或验证码输入错误',
    });
  }
  getVerificationCode=()=>{
    console.log("2023年3月30日21:28:15")
    if((this.state.userEmail)=='') {
      message.warn("请输入邮箱")
      return
    }
    else{
      let a=60;
      this.changeLoading(true);
      this.countdown(a)
      setTimeout(()=>{
        this.changeLoading(false);this.setState({tip:this.state.tip1})
      },61000)
      //console.log(this.state.userEmail);
      const {dispatch} = this.props;
      let value=this.state.userEmail
      console.log(value)
      dispatch({
        type: 'user/checkMail',
        payload: {
          email:value
        },
      });

    }
  }
  valueChange=(value:any)=>{
    // console.log(value);
    this.setState({userEmail:value})
  }
  changeLoading=(value:boolean)=>{
    this.setState({loading:value})

  }
  // 一秒后递归
  countdown (value:any) {
    //console.log(value)
    this.setState({tip:"请于"+value+"s后重新获取"})
    value--;
    if(value<0){
      this.setState({num:60})
      return
    }
    else
      setTimeout( () => {
        this.countdown(value)
      }, 1000)
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
              id='basic'
              initialValues={{remember: true}}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
              <div className="wel-title">欢&nbsp;迎&nbsp;登&nbsp;录</div>
              <div className="input-div" style={{marginTop: 20}}>
                <Row>
                  <Col>
                    <Form.Item name="email" rules={[
                      {required: true, message: 'Please input your e-mail!'},
                    ]} >
                      <span>
                    <Input style={{width: 300}} className="login-input" placeholder="请输入邮箱"
                           onChange={event=>this.valueChange(event.target.value)} />
                  </span>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Item name="verificationCode" rules={[
                      {required: true, message: 'Please input verification code!'},
                    ]} >
                      <Search className="login-input" style={{width: 300}} placeholder="请输入验证码" enterButton={this.state.tip} size="large" loading={this.state.loading} onSearch={()=>{this.getVerificationCode()}}/>
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify="center" align="middle">
                  <Col span={14}>
                  </Col>
                  <Col>
                    <a href={"/#/login"}>使用账号密码登录</a>
                  </Col>
                </Row>
              </div>

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
}))(LoginViewMail);
