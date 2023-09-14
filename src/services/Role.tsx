import {methods, request, request_address_cjx, request_address_dsl,} from '../utils/request';

const actions = {
  findrole: {
    name: 'findrole',
    url: '/role/getAll',
    source: 'cjx',
  },
  addrole: {
    name: 'addrole',
    url: '/role/add',
    source: 'cjx',
  },
  deleterole: {
    name: 'deleterole',
    url: '/role/del',
    source: 'cjx',
  },
  updaterole: {
    name: 'updaterole',
    url: '/role/update',
    source: 'cjx',
  },
  getOneById: {
    name: 'getOneById',
    url: '/role/getOne',
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
    case actions.findrole.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.addrole.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.deleterole.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.updaterole.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getOneById.name:
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

export function findrole(token: string = '', formdata: any = {}) {
  return customRequest(actions.findrole, token, formdata);
}

export function addrole(token: string = '', formdata: any = null) {
  return customRequest(actions.addrole, token, formdata);
}

export function deleterole(token: string = '', formdata: any = null) {
  return customRequest(actions.deleterole, token, formdata);
}

export function updaterole(token: string = '', formdata: any = null) {
  return customRequest(actions.updaterole, token, formdata);
}

export function getOneById(token: string = '', formdata: any = null) {
  return customRequest(actions.getOneById, token, formdata);
}
