import {methods, request, request_address_cjx_workflow, request_address_dsl_workflow,} from '../utils/request';

const actions = {
  getTree: {
    name: 'getTree',
    url: '/department/getTree',
    source: 'cjx',
  },
  add: {
    name: 'getTree',
    url: '/department/add',
    source: 'cjx',
  },
  del: {
    name: 'getTree',
    url: '/department/del',
    source: 'cjx',
  },
  update: {
    name: 'getTree',
    url: '/department/update',
    source: 'cjx',
  },
  getOnlyDepTree: {
    name: 'getOnlyDepTree',
    url: '/department/getOnlyDepTree',
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
    case actions.getTree.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.add.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.del.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.update.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getOnlyDepTree.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;

    default:
  }

  if (action.source == 'cjx') {
    return request(request_address_cjx_workflow + url, options);
  }
  if (action.source == 'dsl') {
    return request(request_address_dsl_workflow + url, options);
  }
};

export function getTree(token: string = '', formdata: any = {}) {
  return customRequest(actions.getTree, token, formdata);
}

export function add(token: string = '', formdata: any = {}) {
  return customRequest(actions.add, token, formdata);
}

export function del(token: string = '', formdata: any = {}) {
  return customRequest(actions.del, token, formdata);
}

export function update(token: string = '', formdata: any = {}) {
  return customRequest(actions.update, token, formdata);
}

export function getOnlyDepTree(token: string = '', formdata: any = {}) {
  return customRequest(actions.getOnlyDepTree, token, formdata);
}
