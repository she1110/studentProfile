import {message} from 'antd';
import {history} from 'umi';

export function isLoginStatus() {
  if (localStorage.getItem('token')) {
    return true;
  } else {
    message.error('无登录状态，请登录！');
    history.push('/');
    return false;
  }
}

export function isLoginExpired(result: any) {
  if (result?.data?.code === 401) {
    message.error('登录状态过期，请重新登录！');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('opLevel');
    localStorage.removeItem('roles');
    history.push('/');
    return true;
  } else {
    return false;
  }
}
