import {
  methods,
  request,
  request_address_htb,
  request_address_local_oa,
} from '../utils/request';

const actions = {
  submitGraduationSurvey: {
    name: 'submitGraduationSurvey',
    url: '/addstuallinfo',//后端可存入数据库
    // url: '/addstuallinfo',//后端接收后不存储而是直接打印
    source: 'local_oa',
  },
  submitGraduationSurveyChange: {
    name: 'submitGraduationSurveyChange',
    url: '/updatestuallinfo',//后端可存入数据库
    // url: '/addstuallinfo',//后端接收后不存储而是直接打印
    source: 'local_oa',
  },
  getGraduationIntentionReport: {
    name: 'getGraduationIntentionReport',
    url: '/getReportList',
    source: 'local_oa',
  },
  downloadReport: {
    name: 'downloadReport',
    url: '/testdownload',
    source: 'local_oa',
  },
  getPersonalGraduationIntentionReport: {
    name: 'getPersonalGraduationIntentionReport',
    url: '/getstuallinfo',
    source: 'local_oa',
  },
  getColumnList: {
    name: 'getColumnList',
    url: '/zhftemp/horiztontalhistogram',
    source: 'local_oa',
  },
  getDimensionDataList: {
    name: 'getDimensionDataList',
    url: '/horizontalContrast/dimensionList',
    source: 'local_oa',
  },
  getLineData: {
    name: 'getLineData',
    url: '/zhftemp/horiztontallinechart',
    source: 'local_oa',
  },
  getPieData: {
    name: 'getPieData',
    url: '/zhftemp/horiztontalpiechart',
    source: 'local_oa',
  },
  getStudentListData: {
    name: 'getStudentListData',
    url: '/zhftemp/getstudentlistdata',
    source: 'local_oa'
  },
  getStudentData: {
    name: 'getStudentData',
    url: '/zhftemp/getstudentdata',
    source: 'local_oa'
  }

}
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
    case actions.submitGraduationSurvey.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.submitGraduationSurveyChange.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getGraduationIntentionReport.name:
      options['method'] = methods.get;
      break;
    case actions.downloadReport.name:
      options['method'] = methods.get;
      url += "?year=" + formdata;
      break;
    case actions.getPersonalGraduationIntentionReport.name:
      options['method'] = methods.get;
      url += "?stuId=" + formdata
      console.log(url)
      break;
    case actions.getColumnList.name:
      options['method'] = methods.get;
      url += "?accountId=" + formdata.accountId + "&roleId=" + formdata.roleId
      break;
    case actions.getDimensionDataList.name:
      options['method'] = methods.get;
      url += "?accountId=" + formdata.accountId + "&roleId=" + formdata.roleId
      break;
    case actions.getLineData.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getPieData.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getStudentListData.name:
      options['method'] = methods.get;
      url += "?accountId=" + formdata.accountId + "&roleId=" + formdata.roleId
      break;
      case actions.getStudentData.name:
        options['method'] = methods.get;
        url += "?accountId=" + formdata.accountId + "&roleId=" + formdata.roleId + "&studentName=" + formdata.studentName
        break;
    default:
      break;
  }
  if (action.source == 'local_oa') {
    if (action.name === actions.downloadReport.name){
      //如果是下载文件功能需要写一个a标签dom
      //实现a连接标签<a>，不然不能触发下载
      var a = document.createElement('a');
      a.href = request_address_local_oa + url;
      a.click()
      return
    }else {
      return request(request_address_local_oa + url, options);
    }
  } else if (action.source == 'htb') {
    return request(request_address_htb + url, options);
  }

};

export function submitGraduationSurvey(token: string, formdata: any = null) {
  return customRequest(actions.submitGraduationSurvey, token, formdata);
}
export function submitGraduationSurveyChange(token: string, formdata: any = null) {
  return customRequest(actions.submitGraduationSurveyChange, token, formdata);
}
export function getGraduationIntentionReport(token: string, formdata: any = null) {
  return customRequest(actions.getGraduationIntentionReport, token, formdata);
}
export function downloadReport(token:any,formdata: any = null) {
  return customRequest(actions.downloadReport, token, formdata);
}
export function getPersonalGraduationIntentionReport(token: string, formdata: any = null) {
  return customRequest(actions.getPersonalGraduationIntentionReport, token, formdata)
}
export function getColumnList(token: string, formdata: any = null) {
  return customRequest(actions.getColumnList, token, formdata)
}
export function getDimensionDataList(token: string, formdata: any = null) {
  return customRequest(actions.getDimensionDataList, token, formdata)
}
export function getLineData(token: string, formdata: any = null) {
  return customRequest(actions.getLineData, token, formdata)
}
export function getPieData(token: string, formdata: any = null) {
  return customRequest(actions.getPieData, token, formdata)
}
export function getStudentListData(token: string, formdata: any = null) {
  return customRequest(actions.getStudentListData, token, formdata)
}
export function getStudentData(token: string, formdata: any = null) {
  return customRequest(actions.getStudentData, token, formdata)
}

