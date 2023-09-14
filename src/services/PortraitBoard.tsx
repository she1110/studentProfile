import {assemble1QueryParams, methods, request, request_address_cjx, request_address_dsl,} from '../utils/request';

const actions = {
  getMyAllBoard: {
    name: 'getMyAllBoard',
    url: '/getMyAllBoard',
    source: 'dsl',
  },
  addBoard: {
    name: 'addBoard',
    url: '/addBoard',
    source: 'dsl',
  },
  deleteBoard: {
    name: 'deleteBoard',
    url: '/deleteBoard',
    source: 'dsl',
  },

  addPersonasIntoBoard: {
    name: 'addPersonasIntoBoard',
    url: '/addPersonasIntoBoard',
    source: 'dsl',
  },
  removePersonasFromBoard: {
    name: 'removePersonasFromBoard',
    url: '/removePersonasFromBoard',
    source: 'dsl',
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
    case actions.getMyAllBoard.name:
      options['method'] = methods.get;
      break;
    case actions.addBoard.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.deleteBoard.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.addPersonasIntoBoard.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.removePersonasFromBoard.name:
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

export function getMyAllBoard(token: string = '', formdata: any = null) {
  return customRequest(actions.getMyAllBoard, token, formdata);
}

export function addBoard(token: string = '', formdata: any = null) {
  return customRequest(actions.addBoard, token, formdata);
}

export function deleteBoard(token: string = '', formdata: any = null) {
  return customRequest(actions.deleteBoard, token, formdata);
}

export function addPersonasIntoBoard(token: string = '', formdata: any = null) {
  return customRequest(actions.addPersonasIntoBoard, token, formdata);
}

export function removePersonasFromBoard(
  token: string = '',
  formdata: any = null,
) {
  return customRequest(actions.removePersonasFromBoard, token, formdata);
}
