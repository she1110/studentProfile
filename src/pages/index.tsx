import React, {Component} from 'react';
import LoginView from './Login';
import LoginViewMail from './LoginMail'
import CaptchaLoginForm from './SEFA'
export default class IndexPage extends Component {
  render() {
    //return <LoginView/>;
    return <LoginViewMail/>
  }
}

// export default connect(({ user }: any) => ({
//   user,
// }))(IndexPage);
