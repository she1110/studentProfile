import {
  assemble1QueryParams,
  methods,
  request,
  request_address_cjx,
  request_address_cjx_workflow,
  request_address_dsl, request_address_local,request_address_local_oa,
} from '../utils/request';

const actions = {
  login: {
    name: 'login',
    url: '/user/login',
    source: 'cjx',
  },
  getcurrentuserinfo: {
    name: 'getcurrentuserinfo',
    url: '/user/info',
    source: 'cjx',
  },
  getAllUser: {
    name: 'getAllUser',
    url: '/user/getAll',
    source: 'cjx',
  },
  userAdd: {
    name: 'userAdd',
    url: '/user/add',
    source: 'cjx',
  },
  userDelete: {
    name: 'userDelete',
    url: '/user/delUser',
    source: 'cjx',
  },
  userupdate: {
    name: 'userupdate',
    url: '/user/change',
    source: 'cjx',
  },
  usersearch: {
    name: 'usersearch',
    url: '/user/userSearch',
    source: 'cjx',
  },
  logout: {
    name: 'logout',
    url: '/user/logOut',
    source: 'cjx',
  },
  userchange: {
    name: 'userchange',
    url: '/user/change',
    source: 'cjx',
  },
  getAllLog: {
    name: 'getAllLog',
    url: '/log/getAllLog',
    source: 'cjx',
  },
  getBaseInfo: {
    name: 'getBaseInfo',
    url: '/user/getBaseInfo',
    source: 'cjx',
  },
  getHullTree: {
    name: 'getHullTree',
    url: '/department/getHullTree',
    source: 'cjxworkflow',
  },
  getAll: {
    name: 'getAll',
    url: '/user/getAll',
    source: 'cjxworkflow',
  },
  getTreeByFlow: {
    name: 'getTreeByFlow',
    url: '/user/getTreeByFlow',
    source: 'cjxworkflow',
  },
  getTreeByRole: {
    name: 'getTreeByRole',
    url: '/department/getTreeByRole',
    source: 'cjxworkflow',
  },
  changePassword: {
    name: 'changePassword',
    url: '/user/userchange',
    source: 'cjx',
  },
  getOneUserByAccount: {
    name: 'getOneUserByAccount',
    url: '/user/getOneUserByAccount',
    source: 'cjx',
  },
  checkMail:{
    name: 'checkMail',
    url: '/user/verification',
    source: 'local_oa',
  },
  loginEmail:{
    name: 'loginEmail',
    url: '/user/codeLogin',
    source: 'local_oa',
  },
};
const customRequest = (
  action: any,
  token: string = '',
  formdata: any = null,
) => {
  let options: any = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
      Authorization: token ? token : '',
    },
  };
  let url = action.url;
  switch (action.name) {
    case actions.login.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getAllUser.name:
      options['method'] = methods.get;
      break;
    case actions.userAdd.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.userDelete.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.userupdate.name:
      options['method'] = methods.put;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.usersearch.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.logout.name:
      options['method'] = methods.delete;
      break;
    case actions.userchange.name:
      options['method'] = methods.put;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getcurrentuserinfo.name:
      options['method'] = methods.get;
      break;
    case actions.getAllLog.name:
      options['method'] = methods.get;
      break;
    case actions.getBaseInfo.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getHullTree.name:
      options['method'] = methods.post;
      break;
    case actions.getAll.name:
      options['method'] = methods.post;
      break;
    case actions.getTreeByFlow.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getTreeByRole.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.changePassword.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getOneUserByAccount.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.checkMail.name:
      options['method'] = methods.get;
      url += "?email=" + formdata.email;
      console.log(url);

      break;
    case actions.loginEmail.name:
      options['method'] = methods.post;
      //options['body'] = JSON.stringify(formdata);
      url += "?email=" + formdata.email+"&code=" + formdata.code;
      break;
    default:
  }
  if (action.source == 'cjx') {
    return request(request_address_cjx + url, options);
  }
  if (action.source == 'local') {
    return request(request_address_local + url, options);
  }
  if (action.source == 'cjxworkflow') {
    return request(request_address_cjx_workflow + url, options);
  }
  if (action.source == 'local_oa') {
   return request(request_address_local_oa + url, options);
  }
};

export function login(formdata: any = null) {
  return customRequest(actions.login, '', formdata);
}

export function getAllUser(token: string = '', formdata: any = null) {
  return customRequest(actions.getAllUser, token, '');
}

export function userAdd(token: string = '', formdata: any = null) {
  return customRequest(actions.userAdd, token, formdata);
}

export function userDelete(token: string = '', formdata: any = null) {
  return customRequest(actions.userDelete, token, formdata);
}

export function userupdate(token: string = '', formdata: any = null) {
  return customRequest(actions.userupdate, token, formdata);
}

export function usersearch(token: string = '', formdata: any = null) {
  return customRequest(actions.usersearch, token, formdata);
}

export function logout(token: string = '', formdata: any = null) {
  return customRequest(actions.logout, token, formdata);
}

export function userchange(token: string = '', formdata: any = null) {
  return customRequest(actions.userchange, token, formdata);
}

export function getcurrentuserinfo(token: string = '', formdata: any = null) {
  return customRequest(actions.getcurrentuserinfo, token, formdata);
}

export function getAllLog(token: string = '', formdata: any = null) {
  return customRequest(actions.getAllLog, token, formdata);
}

export function getBaseInfo(token: string = '', formdata: any = null) {
  return customRequest(actions.getBaseInfo, token, formdata);
}

export function getHullTree(token: string = '', formdata: any = {}) {
  return customRequest(actions.getHullTree, token, formdata);
}

export function getAll(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAll, token, formdata);
}

export function getTreeByFlow(token: string = '', formdata: any = {}) {
  return customRequest(actions.getTreeByFlow, token, formdata);
}

export function getTreeByRole(token: string = '', formdata: any = {}) {
  return customRequest(actions.getTreeByRole, token, formdata);
}

export function changePassword(token: string = '', formdata: any = {}) {
  return customRequest(actions.changePassword, token, formdata);
}

export function getOneUserByAccount(token: string = '', formdata: any = {}) {
  return customRequest(actions.getOneUserByAccount, token, formdata);
}
export function checkMail( formdata: any) {
  console.log(formdata);
  return customRequest(actions.checkMail,'', formdata);
}
export function loginEmail(  formdata: any = {}) {
  console.log(formdata);
  return customRequest(actions.loginEmail, '', formdata);
}
