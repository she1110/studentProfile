import React, {Component} from 'react';
import LoginView from './Login';
import CaptchaLoginForm from './SEFA'
export default class IndexPage extends Component {
  render() {
    return <LoginView/>;
  }
}

// export default connect(({ user }: any) => ({
//   user,
// }))(IndexPage);
