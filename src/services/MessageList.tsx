import {assemble1QueryParams, methods, request, request_address_cjx, request_address_dsl,} from '../utils/request';

const actions = {
  getAllMessage: {
    name: 'getAllMessage',
    url: '/getAllMessage',
    source: 'dsl',
  },
  updateMessageStatus: {
    name: 'updateMessageStatus',
    url: '/updateMessageStatus',
    source: 'dsl',
  },
  deleteMessage: {
    name: 'deleteMessage',
    url: '/deleteMessage',
    source: 'dsl',
  },
  getStrategyTemp: {
    name: 'getStrategyTemp',
    url: '/getStrategyTemp',
    source: 'dsl',
  },
  collectStrategy: {
    name: 'collectStrategy',
    url: '/collectStrategy',
    source: 'dsl',
  },

  getAllStrategy: {
    name: 'getAllStrategy',
    url: '/getAllStrategy',
    source: 'dsl',
  },
  getAllCondition: {
    name: 'getAllCondition',
    url: '/getAllCondition',
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
    case actions.getAllMessage.name:
      options['method'] = methods.get;
      // options['body'] = JSON.stringify(formdata);
      break;
    case actions.updateMessageStatus.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.deleteMessage.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getStrategyTemp.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.collectStrategy.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getAllStrategy.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getAllCondition.name:
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

export function getAllMessage(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllMessage, token, formdata);
}

export function updateMessageStatus(token: string = '', formdata: any = {}) {
  return customRequest(actions.updateMessageStatus, token, formdata);
}

export function deleteMessage(token: string = '', formdata: any = {}) {
  return customRequest(actions.deleteMessage, token, formdata);
}

export function getStrategyTemp(token: string = '', formdata: any = {}) {
  return customRequest(actions.getStrategyTemp, token, formdata);
}

export function collectStrategy(token: string = '', formdata: any = {}) {
  return customRequest(actions.collectStrategy, token, formdata);
}

export function getAllStrategy(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllStrategy, token, formdata);
}

export function getAllCondition(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllCondition, token, formdata);
}
