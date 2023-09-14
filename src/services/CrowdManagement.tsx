import {
  assemble1QueryParams,
  methods,
  request,
  request_address_cjx,
  request_address_cjx_workflow,
  request_address_dsl, request_address_local,
} from '../utils/request';

const actions = {
  getTeacherList: {
    name: 'getTeacherList',
    url: '/profile/getTeacherList',
    source: 'local',
  },
  getRoleListByTeacherId: {
    name: 'getRoleListByTeacherId',
    url: '/profile/getTeacherRole',
    source: 'local',
  },
  getDashBoardHaveInList: {
    name: 'getDashBoardHaveInList',
    url: '/profile/getProfiles',
    source: 'local',
  },
  getDashBoardList: {
    name: 'getDashBoardList',
    url: '/profile/getUnusedProfiles',
    source: 'local',
  },
  deleteDashBoardHaveIn: {
    name: 'deleteDashBoardHaveIn',
    url: '/profile/delProfile',
    source: 'local',
  },
  addDashBoardToTeacher: {
    name: 'addDashBoardToTeacher',
    url: '/profile/insertProfile',
    source: 'local',
  }
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
      Authorization: token ? token : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXJyZW50VGltZU1pbGxpcyI6IjE2Njc0NzM0MzIwOTUiLCJleHAiOjE2Njc1NDU0MzIsImFjY291bnQiOiIyMDExMDYzIn0.1ZfIOYXn8fLM9ifLXSW7pu1XdchqV-lGlHSkOU_j1K0',
    },
  };
  let url = action.url;
  switch (action.name) {
    case actions.getTeacherList.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getRoleListByTeacherId.name:
      options['method'] = methods.get;
      url += "?accountId="+formdata
      break;
    case actions.getDashBoardHaveInList.name:
      options['method'] = methods.get;
      url += "?accountId="+formdata.accountId+"&&roleId="+formdata.roleId
      break;
    case actions.getDashBoardList.name:
      options['method'] = methods.get;
      url += "?accountId="+formdata.accountId+"&&roleId="+formdata.roleId+"&&profileId="+formdata.profileId
      break;
    case actions.deleteDashBoardHaveIn.name:
      options['method'] = methods.get;
      url += "?accountId="+formdata.accountId+"&&roleId="+formdata.roleId+"&&profileId="+formdata.profileId
      break;
    case actions.addDashBoardToTeacher.name:
      options['method'] = methods.get;
      url += "?accountId="+formdata.accountId+"&&roleId="+formdata.roleId+"&&profileId="+formdata.profileId
      break;
    default:
  }
  if (action.source == 'local') {
    return request(request_address_local + url, options);
  }
};

export function getTeacherList(token: string, formdata: any = null) {
  return customRequest(actions.getTeacherList, token, formdata);
}

export function getRoleListByTeacherId(token: string, formdata: any = null) {
  return customRequest(actions.getRoleListByTeacherId, token, formdata);
}

export function getDashBoardHaveInList(token: string, formdata: any = null) {
  return customRequest(actions.getDashBoardHaveInList, token, formdata);
}

export function getDashBoardList(token: string, formdata: any = null) {
  return customRequest(actions.getDashBoardList, token, formdata);
}

export function deleteDashBoardHaveIn(token: string, formdata: any = null) {
  return customRequest(actions.deleteDashBoardHaveIn, token, formdata);
}

export function addDashBoardToTeacher(token: string, formdata: any = null) {
  return customRequest(actions.addDashBoardToTeacher, token, formdata);
}
