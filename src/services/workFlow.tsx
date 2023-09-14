import {
  assemble1QueryParams,
  methods,
  request,
  request_address_cjx_workflow,
  request_address_dsl_workflow,
} from '../utils/request';

const actions = {
  getAllWorkFlow: {
    name: 'getAllWorkFlow',
    url: '/getAllWorkFlow',
    source: 'dsl',
  },
  addWorkFlow: {
    name: 'addWorkFlow',
    url: '/addWorkFlow',
    source: 'dsl',
  },
  getAllRole: {
    name: 'getAllRole',
    url: '/getAllRole',
    source: 'dsl',
  },
  getAllColumnType: {
    name: 'getAllColumnType',
    url: '/getAllColumnType',
    source: 'dsl',
  },
  getAllDataTableName: {
    name: 'getAllDataTableName',
    url: '/getAllDataTableName',
    source: 'dsl',
  },
  openWorkFlow: {
    name: 'openWorkFlow',
    url: '/openWorkFlow',
    source: 'dsl',
  },
  closeWorkFlow: {
    name: 'closeWorkFlow',
    url: '/closeWorkFlow',
    source: 'dsl',
  },
  getWorkFlowByName: {
    name: 'getWorkFlowByName',
    url: '/getWorkFlowByName',
    source: 'dsl',
  },
  checkUserCanTask: {
    name: 'checkUserCanTask',
    url: '/checkUserCanTask',
    source: 'dsl',
  },

  lableget: {
    name: 'lableget',
    url: '/label/get',
    source: 'cjx',
  },
  createTask: {
    name: 'createTask',
    url: '/createTask',
    source: 'dsl',
  },
  getMyUserTask: {
    name: 'getMyUserTask',
    url: '/getMyUserTask',
    source: 'dsl',
  },
  getOneTask: {
    name: 'getOneTask',
    url: '/getOneTask',
    source: 'dsl',
  },
  updateTask: {
    name: 'updateTask',
    url: '/updateTask',
    source: 'dsl',
  },
  getAllOperation: {
    name: 'getAllOperation',
    url: '/getAllOperation',
    source: 'dsl',
  },
  downloadFile: {
    name: 'downloadFile',
    url: '/downloadFile',
    source: 'dsl',
  },
  getAll: {
    name: 'getAll',
    url: '/module/getAll',
    source: 'cjx',
  },

  add: {
    name: 'add',
    url: '/module/add',
    source: 'cjx',
  },

  labeladd: {
    name: 'labeladd',
    url: '/label/add',
    source: 'cjx',
  },

  getFLowFlag: {
    name: 'getFLowFlag',
    url: '/module/getFLowFlag',
    source: 'cjx',
  },

  getAllWfType: {
    name: 'getAllWfType',
    url: '/getAllWfType',
    source: 'dsl',
  },

  moduleDel: {
    name: 'moduleDel',
    url: '/module/del',
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
    case actions.getAllWorkFlow.name:
      options['method'] = methods.get;
      break;
    case actions.addWorkFlow.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getAllRole.name:
      options['method'] = methods.get;
      break;
    case actions.getAllColumnType.name:
      options['method'] = methods.get;
      break;
    case actions.getAllDataTableName.name:
      options['method'] = methods.get;
      break;
    case actions.openWorkFlow.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.closeWorkFlow.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getWorkFlowByName.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.checkUserCanTask.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.lableget.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.createTask.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getMyUserTask.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getOneTask.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.updateTask.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getAllOperation.name:
      options['method'] = methods.get;
      break;
    case actions.downloadFile.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getAll.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.add.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.labeladd.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getFLowFlag.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getAllWfType.name:
      options['method'] = methods.get;
      break;
    case actions.moduleDel.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;

    default:
  }

  if (action.source == 'cjx') {
    return request(request_address_cjx_workflow + url, options);
  }
  if (action.source == 'dsl') {
    if (action.name == 'downloadFile') {
      window.open(request_address_dsl_workflow + url);
      return 0;
    }
    return request(request_address_dsl_workflow + url, options);
  }
};

export function getAllWorkFlow(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllWorkFlow, token, formdata);
}

export function addWorkFlow(token: string = '', formdata: any = {}) {
  return customRequest(actions.addWorkFlow, token, formdata);
}

export function getAllRole(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllRole, token, formdata);
}

export function getAllColumnType(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllColumnType, token, formdata);
}

export function getAllDataTableName(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllDataTableName, token, formdata);
}

export function openWorkFlow(token: string = '', formdata: any = {}) {
  return customRequest(actions.openWorkFlow, token, formdata);
}

export function closeWorkFlow(token: string = '', formdata: any = {}) {
  return customRequest(actions.closeWorkFlow, token, formdata);
}

export function getWorkFlowByName(token: string = '', formdata: any = {}) {
  return customRequest(actions.getWorkFlowByName, token, formdata);
}

export function checkUserCanTask(token: string = '', formdata: any = {}) {
  return customRequest(actions.checkUserCanTask, token, formdata);
}

export function lableget(token: string = '', formdata: any = {}) {
  return customRequest(actions.lableget, token, formdata);
}

export function createTask(token: string = '', formdata: any = {}) {
  return customRequest(actions.createTask, token, formdata);
}

export function getMyUserTask(token: string = '', formdata: any = {}) {
  return customRequest(actions.getMyUserTask, token, formdata);
}

export function getOneTask(token: string = '', formdata: any = {}) {
  return customRequest(actions.getOneTask, token, formdata);
}

export function updateTask(token: string = '', formdata: any = {}) {
  return customRequest(actions.updateTask, token, formdata);
}

export function getAllOperation(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllOperation, token, formdata);
}

export function downloadFile(token: string = '', formdata: any = {}) {
  return customRequest(actions.downloadFile, token, formdata);
}

export function getAll(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAll, token, formdata);
}

export function add(token: string = '', formdata: any = {}) {
  return customRequest(actions.add, token, formdata);
}

export function labeladd(token: string = '', formdata: any = {}) {
  return customRequest(actions.labeladd, token, formdata);
}

export function getFLowFlag(token: string = '', formdata: any = {}) {
  return customRequest(actions.getFLowFlag, token, formdata);
}

export function getAllWfType(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllWfType, token, formdata);
}

export function moduleDel(token: string = '', formdata: any = {}) {
  return customRequest(actions.moduleDel, token, formdata);
}
