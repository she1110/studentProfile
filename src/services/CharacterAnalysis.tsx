import {
  methods,
  request,
  request_address_local_oa,
  request_address_psychology,
} from '../utils/request';//设置自己的request路径
let address = request_address_local_oa
const actions = {
  getQuestionnaireUrl: {
    name: 'getQuestionnaireUrl',
    url: '/questionnaire/createQuestionnaireLink',//后端接口
    source: 'request_address_psychology',
  },
  getQuestionnaireList: {
    name: 'getQuestionnaireList',
    url: '/questionnaire/getAllQuestionnaireResultOverview',//后端接口
    source: 'request_address_psychology',
  },
  getPreview: {
    name: 'getPreview',
    url: '/questionnaire/getQuestionnaireResult/1',//后端接口
    source: 'request_address_psychology',
  },
  getReport: {
    name: 'getReport',
    url: '/questionnaire/getQuestionnaireResult/0',//后端接口
    source: 'request_address_psychology',
  },
  getQuestionnaireListForTeacher: {
    name: 'getQuestionnaireListForTeacher',
    url: '/questionnaire/getAllQuestionnaireStuInfo',//后端接口
    source: 'request_address_psychology',
  }
};
const customRequest = ( action: any, formdata: any = null) => {
  let options: any = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json'},
  };
  let url = action.url;
  switch (action.name) {
    case actions.getQuestionnaireUrl.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getQuestionnaireList.name:
      options['method'] = methods.get;
      url += "?PersonCode=" + formdata
      break;
    case actions.getQuestionnaireListForTeacher.name:
      options['method'] = methods.get;
      url += "?flag=" + formdata
      break;
    default:
  }
  if (action.source == 'local') address = request_address_local_oa
  else if (action.source == 'request_address_psychology') address = request_address_psychology
  switch (action.name) {
    case actions.getPreview.name:
      options['method'] = methods.get;
      url = address + url + "?Time="+ formdata.Time + "&Name="+ formdata.Name + "&PersonCode="+ formdata.PersonCode + "&ProductCode=" + formdata.ProductCode + "&ProductName=" + formdata.ProductName
      window.open(url)
      break;
    case actions.getReport.name:
      options['method'] = methods.get;
      url = address + url + "?Time="+ formdata.Time + "&Name="+ formdata.Name + "&PersonCode="+ formdata.PersonCode + "&ProductCode=" + formdata.ProductCode + "&ProductName=" + formdata.ProductName
      window.open(url)
      break;
    default:return request(address + url, options);
  }
};

export function getQuestionnaireUrl(token:any,formdata: any) {
  console.log(formdata)
  return customRequest(actions.getQuestionnaireUrl,formdata);
}

export function getQuestionnaireList(token:any,formdata: any) {
  console.log(formdata)
  return customRequest(actions.getQuestionnaireList,formdata);
}

export function getPreview(token:any,formdata: any) {
  console.log(formdata)
  return customRequest(actions.getPreview,formdata);
}

export function getReport(token:any,formdata: any) {
  console.log(formdata)
  return customRequest(actions.getReport,formdata);
}

export function getQuestionnaireListForTeacher(token:any,formdata: any) {
  console.log(formdata)
  return customRequest(actions.getQuestionnaireListForTeacher,formdata);
}

