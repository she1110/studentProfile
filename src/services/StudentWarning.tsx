import {methods, request, request_address_cjx, request_address_dsl,} from '../utils/request';

const actions = {
  getWarnListByType: {
    name: 'getWarnListByType',
    url: '/getWarnListByType',
    source: 'dsl',
  },

  getHelp: {
    name: 'getHelp',
    url: '/getHelp',
    source: 'dsl',
  },
  addHelp: {
    name: 'addHelp',
    url: '/addHelp',
    source: 'dsl',
  },
  getWarnQues: {
    name: 'getWarnQues',
    url: '/getWarnQues',
    source: 'dsl',
  },
  handleWarnQues: {
    name: 'handleWarnQues',
    url: '/handleWarnQues',
    source: 'dsl',
  },
  getWarnDetail: {
    name: 'getWarnDetail',
    url: '/getWarnDetail',
    source: 'dsl',
  },
  //累计挂科
  warningStuDetail: {
    name: 'warningStuDetail',
    url: '/warning/warningStuDetail',
    source: 'cjx',
  },
  getAllFailTests: {
    name: 'getAllFailTests',
    url: '/warning/stuSearch',
    source: 'cjx',
  },
  questWarn: {
    //申诉
    name: 'questWarn',
    url: '/warning/questWarn',
    source: 'cjx',
  },
  //添加帮扶信息
  getMyHelpSemeWarn: {
    name: 'getMyHelpSemeWarn',
    url: '/warning/getMyHelpSemeWarn',
    source: 'cjx',
  },
  addHelpRecord: {
    name: 'addHelpRecord',
    url: '/warning/addHelpRecord',
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
    //全部挂科
    case actions.getAllFailTests.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.questWarn.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.warningStuDetail.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getMyHelpSemeWarn.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.addHelpRecord.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    // case actions.getWarnListByType.name:
    //   options['method'] = methods.get;
    //   // options['body'] = JSON.stringify(formdata);
    //   break;
    case actions.getWarnListByType.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getHelp.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.addHelp.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getWarnQues.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.handleWarnQues.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getWarnDetail.name:
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

export function getAllFailTests(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllFailTests, token, formdata);
}

export function questWarn(token: string = '', formdata: any = {}) {
  return customRequest(actions.questWarn, token, formdata);
}

export function warningStuDetail(token: string = '', formdata: any = {}) {
  return customRequest(actions.warningStuDetail, token, formdata);
}

export function getWarnListByType(token: string = '', formdata: any = {}) {
  return customRequest(actions.getWarnListByType, token, formdata);
}

export function getHelp(token: string = '', formdata: any = {}) {
  return customRequest(actions.getHelp, token, formdata);
}

export function addHelp(token: string = '', formdata: any = {}) {
  return customRequest(actions.addHelp, token, formdata);
}

export function getWarnQues(token: string = '', formdata: any = {}) {
  return customRequest(actions.getWarnQues, token, formdata);
}

export function handleWarnQues(token: string = '', formdata: any = {}) {
  return customRequest(actions.handleWarnQues, token, formdata);
}

export function getWarnDetail(token: string = '', formdata: any = {}) {
  return customRequest(actions.getWarnDetail, token, formdata);
}

export function getMyHelpSemeWarn(token: string = '', formdata: any = {}) {
  return customRequest(actions.getMyHelpSemeWarn, token, formdata);
}

export function addHelpRecord(token: string = '', formdata: any = {}) {
  return customRequest(actions.addHelpRecord, token, formdata);
}
