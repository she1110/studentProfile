import {assemble1QueryParams, methods, request, request_address_cjx, request_address_dsl,} from '../utils/request';

const actions = {
  getAll: {
    name: 'getAll',
    url: '/persons/getAll',
    source: 'cjx',
  },

  appGetAll: {
    name: 'appGetAll',
    url: '/appGetAll',
    source: 'cjx',
  },
  appGet: {
    name: 'appGet',
    url: '/appGet',
    source: 'cjx',
  },
  appAdd: {
    name: 'appAdd',
    url: '/appAdd',
    source: 'cjx',
  },
  appUpdate: {
    name: 'appUpdate',
    url: '/appUpdate',
    source: 'cjx',
  },
  appDelete: {
    name: 'appDelete',
    url: '/appDelete',
    source: 'cjx',
  },

  getClusterDetail: {
    name: 'getclusterdetail',
    url: '/getclusterdetail',
    source: 'dsl',
  },
  getMajor: {
    name: 'getMajor',
    url: '/getMajor',
    source: 'cjx',
  },
  sendMail: {
    name: 'sendMail',
    url: '/sendMail',
    source: 'cjx',
  },
  getSchool: {
    name: 'getSchool',
    url: '/getSchool',
    source: 'cjx',
  },
  getUnit: {
    name: 'getUnit',
    url: '/getUnit',
    source: 'cjx',
  },
  getRolesByUnit: {
    name: 'getRolesByUnit',
    url: '/role/getRolesByUnit',
    source: 'cjx',
  },
  getUserByRoles: {
    name: 'getUserByRoles',
    url: '/role/getUserByRoles',
    source: 'cjx',
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
    case actions.getAll.name:
      options['method'] = methods.post;
      break;
    case actions.appGet.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.appUpdate.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.appGetAll.name:
      options['method'] = methods.post;
      break;
    case actions.appAdd.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.appDelete.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getClusterDetail.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getMajor.name:
      options['method'] = methods.post;
      break;
    case actions.sendMail.name:
      options['method'] = methods.post;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getSchool.name:
      options['method'] = methods.post;
      break;
    case actions.getUnit.name:
      options['method'] = methods.post;
      break;
    case actions.getRolesByUnit.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getUserByRoles.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;

    default:
  }

  if (action.source == 'cjx') {
    return request(request_address_cjx + url, options);
  }
  if (action.source == 'dsl') {
    return request(request_address_dsl + url, options);
  }
};

export function getAll(token: string = '', formdata: any = null) {
  return customRequest(actions.getAll, token, formdata);
}

export function appGet(token: string = '', formdata: any = null) {
  return customRequest(actions.appGet, token, formdata);
}

export function appGetAll(token: string = '', formdata: any = null) {
  return customRequest(actions.appGetAll, token, formdata);
}

export function appAdd(token: string = '', formdata: any = null) {
  return customRequest(actions.appAdd, token, formdata);
}

export function appUpdate(token: string = '', formdata: any = null) {
  return customRequest(actions.appUpdate, token, formdata);
}

export function appDelete(token: string = '', formdata: any = null) {
  return customRequest(actions.appDelete, token, formdata);
}

export function getClusterDetail(token: string = '', formdata: any = null) {
  return customRequest(actions.getClusterDetail, token, formdata);
}

export function getMajor(token: string = '', formdata: any = null) {
  return customRequest(actions.getMajor, token, formdata);
}

export function sendMail(token: string = '', formdata: any = null) {
  return customRequest(actions.sendMail, token, formdata);
}

export function getSchool(token: string = '', formdata: any = null) {
  return customRequest(actions.getSchool, token, formdata);
}

export function getUnit(token: string = '', formdata: any = null) {
  return customRequest(actions.getUnit, token, formdata);
}

export function getRolesByUnit(token: string = '', formdata: any = null) {
  return customRequest(actions.getRolesByUnit, token, formdata);
}

export function getUserByRoles(token: string = '', formdata: any = null) {
  return customRequest(actions.getUserByRoles, token, formdata);
}
