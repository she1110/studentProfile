import {assemble1QueryParams, methods, request, request_address_cjx, request_address_dsl,} from '../utils/request';

const actions = {
  getLabel: {
    name: 'getLabel',
    url: '/label/getLabel',
    source: 'cjx',
  },
  getLike: {
    name: 'getLike',
    url: '/label/getLike',
    source: 'cjx',
  },
  createProfileSQL: {
    name: 'createProfileSQL',
    url: '/createProfileSQL',
    source: 'dsl',
  },
  personDataProcess: {
    name: 'personDataProcess',
    url: '/persons/personDataProcess',
    source: 'cjx',
  },
  getPrimaryInfo: {
    name: 'getPrimaryInfo',
    url: '/getPrimaryInfo',
    source: 'dsl',
  },
  themePersonDataProcess: {
    name: 'themePersonDataProcess',
    url: '/persons/themePersonDataProcess',
    source: 'cjx',
  },
  getclusterdetail: {
    name: 'getclusterdetail',
    url: '/getclusterdetail',
    source: 'dsl',
  },
  getUserGroupResult: {
    name: 'getUserGroupResult',
    url: '/getUserGroupResult',
    source: 'dsl',
  },
  getCardLabel: {
    name: 'getCardLabel',
    url: '/label/getCardLabel',
    source: 'cjx',
  },
  addPersons: {
    name: 'addPersons',
    url: '/persons/addPersons',
    source: 'cjx',
  },
  checkName: {
    name: 'checkName',
    url: '/persons/checkName',
    source: 'cjx',
  },
  userProfileDataMult: {
    name: 'userProfileDataMult',
    url: '/userProfileDataMult',
    source: 'dsl',
  },
  getMyPersons: {
    name: 'getMyPersons',
    url: '/persons/getMyPersons',
    source: 'cjx',
  },
  personsgetOne: {
    name: 'getOne',
    url: '/persons/getOne',
    source: 'cjx',
  },
  deletePersonsById: {
    name: 'deletePersonsById',
    url: '/persons/deletePersonsById',
    source: 'cjx',
  },

  createPreferenceLabelSQL: {
    name: 'createPreferenceLabelSQL',
    url: '/createPreferenceLabelSQL',
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
    case actions.getLabel.name:
      options['method'] = methods.post;
      break;
    case actions.getLike.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.createProfileSQL.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.personDataProcess.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getPrimaryInfo.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.themePersonDataProcess.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getclusterdetail.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getUserGroupResult.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getCardLabel.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.addPersons.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.checkName.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.userProfileDataMult.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getMyPersons.name:
      options['method'] = methods.post;
      break;
    case actions.personsgetOne.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.deletePersonsById.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.createPreferenceLabelSQL.name:
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

export function getLabel(token: string = '', formdata: any = null) {
  return customRequest(actions.getLabel, token, formdata);
}

export function getLike(token: string = '', formdata: any = null) {
  return customRequest(actions.getLike, token, formdata);
}

export function createProfileSQL(token: string = '', formdata: any = null) {
  return customRequest(actions.createProfileSQL, token, formdata);
}

export function personDataProcess(token: string = '', formdata: any = null) {
  return customRequest(actions.personDataProcess, token, formdata);
}

export function getPrimaryInfo(token: string = '', formdata: any = null) {
  return customRequest(actions.getPrimaryInfo, token, formdata);
}

export function themePersonDataProcess(
  token: string = '',
  formdata: any = null,
) {
  return customRequest(actions.themePersonDataProcess, token, formdata);
}

export function getclusterdetail(token: string = '', formdata: any = null) {
  return customRequest(actions.getclusterdetail, token, formdata);
}

export function getUserGroupResult(token: string = '', formdata: any = null) {
  return customRequest(actions.getUserGroupResult, token, formdata);
}

export function getCardLabel(token: string = '', formdata: any = null) {
  return customRequest(actions.getCardLabel, token, formdata);
}

export function addPersons(token: string = '', formdata: any = null) {
  return customRequest(actions.addPersons, token, formdata);
}

export function checkName(token: string = '', formdata: any = null) {
  return customRequest(actions.checkName, token, formdata);
}

export function userProfileDataMult(token: string = '', formdata: any = null) {
  return customRequest(actions.userProfileDataMult, token, formdata);
}

export function getMyPersons(token: string = '', formdata: any = null) {
  return customRequest(actions.getMyPersons, token, formdata);
}

export function personsgetOne(token: string = '', formdata: any = null) {
  return customRequest(actions.personsgetOne, token, formdata);
}

export function deletePersonsById(token: string = '', formdata: any = null) {
  return customRequest(actions.deletePersonsById, token, formdata);
}

export function createPreferenceLabelSQL(
  token: string = '',
  formdata: any = null,
) {
  return customRequest(actions.createPreferenceLabelSQL, token, formdata);
}
