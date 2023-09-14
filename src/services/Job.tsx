import {assemble1QueryParams, methods, request, request_address_cjx, request_address_dsl,} from '../utils/request';

const actions = {
  getAll: {
    name: 'getAll',
    url: '/persons/getAll',
    source: 'cjx',
  },
  strategyGet: {
    name: 'strategyGet',
    url: '/strategyGet',
    source: 'cjx',
  },

  getAllStrategy: {
    name: 'getAllStrategy',
    url: '/getAllStrategy',
    source: 'dsl',
  },

  jobGet: {
    name: 'jobGet',
    url: '/job/getAllJob',
    source: 'cjx',
  },
  // jobGet: {
  //   name: 'jobGet',
  //   url: '/jobGet',
  //   source: 'cjx',
  // },
  jobAdd: {
    name: 'jobAdd',
    url: '/job/add',
    source: 'cjx',
  },
  jobDel: {
    name: 'jobDel',
    url: '/job/del',
    source: 'cjx',
  },
  jobGetByState: {
    name: 'jobGetByState',
    url: '/job/getByState',
    source: 'cjx',
  },
  jobGetAllByName: {
    name: 'jobGetAllByName',
    url: '/job/getAllByName',
    source: 'cjx',
  },
  getJobResult: {
    name: 'getJobResult',
    url: '/getJobResult',
    source: 'dsl',
  },
  evaluateClassOrMajor: {
    name: 'evaluateClassOrMajor',
    url: '/evaluateClassOrMajor',
    source: 'dsl',
  },
  evaluateStudent: {
    name: 'evaluateStudent',
    url: '/evaluateStudent',
    source: 'dsl',
  },

  update: {
    name: 'update',
    url: '/job/update',
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
    case actions.jobGet.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.strategyGet.name:
      options['method'] = methods.post;
      break;
    case actions.jobDel.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.jobAdd.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.jobGetByState.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;

    case actions.jobGetAllByName.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getJobResult.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.evaluateClassOrMajor.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.evaluateStudent.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getAllStrategy.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.update.name:
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

export function strategyGet(token: string = '', formdata: any = null) {
  return customRequest(actions.strategyGet, token, formdata);
}

export function getAll(token: string = '', formdata: any = null) {
  return customRequest(actions.getAll, token, formdata);
}

export function jobGet(token: string = '', formdata: any = null) {
  return customRequest(actions.jobGet, token, formdata);
}

export function jobAdd(token: string = '', formdata: any = null) {
  return customRequest(actions.jobAdd, token, formdata);
}

export function jobDel(token: string = '', formdata: any = null) {
  return customRequest(actions.jobDel, token, formdata);
}

export function jobGetByState(token: string = '', formdata: any = null) {
  return customRequest(actions.jobGetByState, token, formdata);
}

export function jobGetAllByName(token: string = '', formdata: any = null) {
  return customRequest(actions.jobGetAllByName, token, formdata);
}

export function getJobResult(token: string = '', formdata: any = null) {
  return customRequest(actions.getJobResult, token, formdata);
}

export function evaluateClassOrMajor(token: string = '', formdata: any = null) {
  return customRequest(actions.evaluateClassOrMajor, token, formdata);
}

export function evaluateStudent(token: string = '', formdata: any = null) {
  return customRequest(actions.evaluateStudent, token, formdata);
}

export function getAllStrategy(token: string = '', formdata: any = null) {
  return customRequest(actions.getAllStrategy, token, formdata);
}

export function update(token: string = '', formdata: any = null) {
  return customRequest(actions.update, token, formdata);
}
