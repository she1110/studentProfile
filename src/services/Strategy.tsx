import {assemble1QueryParams, methods, request, request_address_cjx, request_address_dsl,} from '../utils/request';

const actions = {
  strategyGetOne: {
    name: 'strategyGetOne ',
    url: '/strategyGetOne ',
    source: 'cjx',
  },
  strategyGetOneByName: {
    name: 'strategyGetOneByName ',
    url: '/strategyGetOneByName ',
    source: 'cjx',
  },
  strategyJob: {
    name: 'strategyJob',
    url: '/strategyJob',
    source: 'cjx',
  },

  getAll: {
    name: 'getAll',
    url: '/persons/getAll',
    source: 'cjx',
  },
  findrole: {
    name: 'findrole',
    url: '/role/getAll',
    source: 'cjx',
  },

  getAllStrategy: {
    name: 'getAllStrategy',
    url: '/getAllStrategy',
    source: 'dsl',
  },
  getOneStrategy: {
    name: 'getOneStrategy',
    url: '/getOneStrategy',
    source: 'dsl',
  },
  deleteStrategy: {
    name: 'deleteStrategy',
    url: '/deleteStrategy',
    source: 'dsl',
  },
  addStrategyBySelf: {
    name: 'addStrategyBySelf',
    url: '/addStrategyBySelf',
    source: 'dsl',
  },
  updateStrategy: {
    name: 'updateStrategy',
    url: '/updateStrategy',
    source: 'dsl',
  },
  getAllCondition: {
    name: 'getAllCondition',
    url: '/getAllCondition',
    source: 'dsl',
  },
  addStrategyByCollect: {
    name: 'addStrategyByCollect',
    url: '/addStrategyByCollect',
    source: 'dsl',
  },
  writeMessage: {
    name: 'writeMessage',
    url: '/writeMessage',
    source: 'dsl',
  },
  calculateCollect: {
    name: 'calculateCollect',
    url: '/calculateCollect',
    source: 'dsl',
  },
  evaluateAllActivity: {
    name: 'evaluateAllActivity',
    url: '/evaluateAllActivity',
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
    case actions.findrole.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getAll.name:
      options['method'] = methods.post;
      break;
    case actions.strategyGetOne.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.strategyGetOneByName.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.strategyJob.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;

    case actions.getAllStrategy.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getOneStrategy.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.deleteStrategy.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.addStrategyBySelf.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.updateStrategy.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getAllCondition.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.addStrategyByCollect.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.writeMessage.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.calculateCollect.name:
      options['method'] = methods.get;
      break;
    case actions.evaluateAllActivity.name:
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

export function strategyGetOne(token: string = '', formdata: any = null) {
  return customRequest(actions.strategyGetOne, token, formdata);
}

export function strategyGetOneByName(token: string = '', formdata: any = null) {
  return customRequest(actions.strategyGetOneByName, token, formdata);
}

export function strategyJob(token: string = '', formdata: any = null) {
  return customRequest(actions.strategyJob, token, formdata);
}

export function getAll(token: string = '', formdata: any = null) {
  return customRequest(actions.getAll, token, formdata);
}

export function findrole(token: string = '', formdata: any = {}) {
  return customRequest(actions.findrole, token, formdata);
}

export function getAllStrategy(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllStrategy, token, formdata);
}

export function getOneStrategy(token: string = '', formdata: any = {}) {
  return customRequest(actions.getOneStrategy, token, formdata);
}

export function deleteStrategy(token: string = '', formdata: any = {}) {
  return customRequest(actions.deleteStrategy, token, formdata);
}

export function addStrategyBySelf(token: string = '', formdata: any = {}) {
  return customRequest(actions.addStrategyBySelf, token, formdata);
}

export function updateStrategy(token: string = '', formdata: any = {}) {
  return customRequest(actions.updateStrategy, token, formdata);
}

export function getAllCondition(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllCondition, token, formdata);
}

export function addStrategyByCollect(token: string = '', formdata: any = {}) {
  return customRequest(actions.addStrategyByCollect, token, formdata);
}

export function writeMessage(token: string = '', formdata: any = {}) {
  return customRequest(actions.writeMessage, token, formdata);
}

export function calculateCollect(token: string = '', formdata: any = {}) {
  return customRequest(actions.calculateCollect, token, formdata);
}

export function evaluateAllActivity(token: string = '', formdata: any = {}) {
  return customRequest(actions.evaluateAllActivity, token, formdata);
}
