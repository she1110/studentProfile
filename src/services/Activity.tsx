import {assemble1QueryParams, methods, request, request_address_cjx, request_address_dsl,} from '../utils/request';

const actions = {
  getAllAct: {
    name: 'getAllAct',
    url: '/activity/getAll',
    source: 'cjx',
  },
  getOneAct: {
    name: 'getOneAct',
    url: '/getOneAct',
    source: 'cjx',
  },
  getActByLevel: {
    name: 'getActByLevel',
    url: '/activity/getAllByLevel',
    source: 'cjx',
  },
  addAct: {
    name: 'addAct',
    url: '/activity/addAct',
    source: 'cjx',
  },
  getLike: {
    name: 'getLike',
    url: '/getLike',
    source: 'cjx',
  },
  updateAct: {
    name: 'updateAct',
    url: '/activity/updateAct',
    source: 'cjx',
  },
  delAct: {
    name: 'delAct',
    url: '/activity/delAct',
    source: 'cjx',
  },
  downloadFile: {
    name: 'downloadFile',
    url: '/downloadFile',
    source: 'cjx',
  },

  getAllStrategy: {
    name: 'getAllStrategy',
    url: '/getAllStrategy',
    source: 'dsl',
  },
  getAllTag: {
    name: 'getAllTag',
    url: '/tag/getAllTag',
    source: 'cjx',
  },
  addTag: {
    name: 'addTag',
    url: '/tag/addTag',
    source: 'cjx',
  },
  getActSorceByUser: {
    name: 'getActSorceByUser',
    url: '/getActSorceByUser',
    source: 'cjx',
  },
  evaluateOneActivity: {
    name: 'evaluateOneActivity',
    url: '/evaluateOneActivity',
    source: 'dsl',
  },

  getAllStuScoreInActivity: {
    name: 'getAllStuScoreInActivity',
    url: '/getAllStuScoreInActivity',
    source: 'dsl',
  },
  getAllByName: {
    name: 'getAllByName',
    url: '/activity/getAllByName',
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
    case actions.getAllAct.name:
      options['method'] = methods.post;
      break;
    case actions.getOneAct.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getActByLevel.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.addAct.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getLike.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.updateAct.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.delAct.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.downloadFile.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getAllStrategy.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getAllTag.name:
      options['method'] = methods.post;
      break;
    case actions.addTag.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getActSorceByUser.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.evaluateOneActivity.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getAllStuScoreInActivity.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getAllByName.name:
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

export function getAllAct(token: string = '', formdata: any = null) {
  return customRequest(actions.getAllAct, token, formdata);
}

export function getOneAct(token: string = '', formdata: any = null) {
  return customRequest(actions.getOneAct, token, formdata);
}

export function getActByLevel(token: string = '', formdata: any = null) {
  return customRequest(actions.getActByLevel, token, formdata);
}

export function addAct(token: string = '', formdata: any = null) {
  return customRequest(actions.addAct, token, formdata);
}

export function getLike(token: string = '', formdata: any = null) {
  return customRequest(actions.getLike, token, formdata);
}

export function updateAct(token: string = '', formdata: any = null) {
  return customRequest(actions.updateAct, token, formdata);
}

export function delAct(token: string = '', formdata: any = null) {
  return customRequest(actions.delAct, token, formdata);
}

export function downloadFile(token: string = '', formdata: any = null) {
  return customRequest(actions.downloadFile, token, formdata);
}

export function getAllStrategy(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllStrategy, token, formdata);
}

export function getAllTag(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllTag, token, formdata);
}

export function addTag(token: string = '', formdata: any = {}) {
  return customRequest(actions.addTag, token, formdata);
}

export function getActSorceByUser(token: string = '', formdata: any = {}) {
  return customRequest(actions.getActSorceByUser, token, formdata);
}

export function evaluateOneActivity(token: string = '', formdata: any = {}) {
  return customRequest(actions.evaluateOneActivity, token, formdata);
}

export function getAllStuScoreInActivity(
  token: string = '',
  formdata: any = {},
) {
  return customRequest(actions.getAllStuScoreInActivity, token, formdata);
}

export function getAllByName(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllByName, token, formdata);
}
