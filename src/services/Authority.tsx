import {methods, request, request_address_cjx, request_address_dsl,} from '../utils/request';

const actions = {
  findpermission: {
    name: 'findpermission',
    url: '/permission/findAllPermission',
    source: 'cjx',
  },
  addpermission: {
    name: 'addpermission',
    url: '/permission/addPermission',
    source: 'cjx',
  },
  deletepermission: {
    name: 'deletepermission',
    url: '/permission/deletePermission',
    source: 'cjx',
  },
  updatepermission: {
    name: 'updatepermission',
    url: '/permission/updatePermission',
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
    case actions.findpermission.name:
      options['method'] = methods.get;
      break;
    case actions.addpermission.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.deletepermission.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.updatepermission.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
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

export function findpermission(token: string = '', formdata: any = {}) {
  return customRequest(actions.findpermission, token, formdata);
}

export function addpermission(token: string = '', formdata: any = null) {
  return customRequest(actions.addpermission, token, formdata);
}

export function deletepermission(token: string = '', formdata: any = null) {
  return customRequest(actions.deletepermission, token, formdata);
}

export function updatepermission(token: string = '', formdata: any = null) {
  return customRequest(actions.updatepermission, token, formdata);
}
