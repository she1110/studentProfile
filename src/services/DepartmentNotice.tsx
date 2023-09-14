import {methods, request, request_address_cjx, request_address_dsl,} from '../utils/request';

const actions = {
  noticeStuTree: {
    name: 'noticeStuTree',
    url: '/task/getUserTree',
    source: 'cjx',
  },
  publishNotice: {
    name: 'publishNotice',
    url: '/task/addTask',
    source: 'cjx',
  },
  getAllTeacherNotice: {
    name: 'getAllTeacherNotice',
    url: '/task/getAllTeacherTask',
    source: 'cjx',
  },
  getAllStuNotice: {
    name: 'getAllStuNotice',
    url: '/task/getAllStuTask',
    source: 'cjx',
  },
  changeNoticeState: {
    name: 'changeNoticeState',
    url: '/task/updateState',
    source: 'cjx',
  },
  askQuestion: {
    name: 'askQuestion',
    url: '/task/addQuestion',
    source: 'cjx',
  },
  answerQuestion: {
    name: 'answerQuestion',
    url: '/task/answerQuestion',
    source: 'cjx',
  },
  delNotice: {
    name: 'delNotice',
    url: '/task/delTask',
    source: 'cjx',
  },
  leaderSendMail: {
    name: 'leaderSendMail',
    url: '/task/sendTeacher',
    source: 'cjx',
  },
  addTemplate: {
    name: 'addTemplate',
    url: '/task/addTemplate',
    source: 'cjx',
  },
  getAllClassAndTemplate: {
    name: 'getAllClassAndTemplate',
    url: '/task/getAllClassAndTemplate',
    source: 'cjx',
  },
  getOneTemplate: {
    name: 'getOneTemplate',
    url: '/task/getOneTemplate',
    source: 'cjx',
  },
  updateTemplate: {
    name: 'updateTemplate',
    url: '/task/updateTemplate',
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
    case actions.noticeStuTree.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.publishNotice.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getAllTeacherNotice.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getAllStuNotice.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.changeNoticeState.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.askQuestion.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.answerQuestion.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.delNotice.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.leaderSendMail.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.addTemplate.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getAllClassAndTemplate.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getOneTemplate.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.updateTemplate.name:
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

export function noticeStuTree(token: string = '', formdata: any = {}) {
  return customRequest(actions.noticeStuTree, token, formdata);
}

export function publishNotice(token: string = '', formdata: any = {}) {
  return customRequest(actions.publishNotice, token, formdata);
}

export function getAllTeacherNotice(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllTeacherNotice, token, formdata);
}

export function getAllStuNotice(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllStuNotice, token, formdata);
}

export function changeNoticeState(token: string = '', formdata: any = {}) {
  return customRequest(actions.changeNoticeState, token, formdata);
}

export function askQuestion(token: string = '', formdata: any = {}) {
  return customRequest(actions.askQuestion, token, formdata);
}

export function answerQuestion(token: string = '', formdata: any = {}) {
  return customRequest(actions.answerQuestion, token, formdata);
}

export function delNotice(token: string = '', formdata: any = {}) {
  return customRequest(actions.delNotice, token, formdata);
}

export function leaderSendMail(token: string = '', formdata: any = {}) {
  return customRequest(actions.leaderSendMail, token, formdata);
}

export function addTemplate(token: string = '', formdata: any = {}) {
  return customRequest(actions.addTemplate, token, formdata);
}

export function getAllClassAndTemplate(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllClassAndTemplate, token, formdata);
}

export function getOneTemplate(token: string = '', formdata: any = {}) {
  return customRequest(actions.getOneTemplate, token, formdata);
}

export function updateTemplate(token: string = '', formdata: any = {}) {
  return customRequest(actions.updateTemplate, token, formdata);
}
