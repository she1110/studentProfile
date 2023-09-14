import {assemble1QueryParams, methods, request, request_address_cjx, request_address_dsl,} from '../utils/request';

const actions = {
  submitTrainPlan: {
    name: 'submitTrainPlan',
    url: '/submitTrainPlan',
    source: 'dsl',
  },
  identifyDataInProfile: {
    name: 'identifyDataInProfile',
    url: '/identifyDataInProfile',
    source: 'dsl',
  },
  getTrainPlan: {
    name: 'getTrainPlan',
    url: '/getTrainPlan',
    source: 'dsl',
  },
  deleteTrainPlan: {
    name: 'deleteTrainPlan',
    url: '/deleteTrainPlan',
    source: 'dsl',
  },
  getAllCourseByTrain: {
    name: 'getAllCourseByTrain',
    url: '/getAllCourseByTrain',
    source: 'dsl',
  },
  getAllTagByCourse: {
    name: 'getAllTagByCourse',
    url: '/tag/getAllTagByCourse',
    source: 'cjx',
  },
  addTag: {
    name: 'addTag',
    url: '/tag/addTag',
    source: 'cjx',
  },
  personalProfile: {
    name: 'personalProfile',
    url: '/personalProfile',
    source: 'dsl',
  },
  updateCourseTag: {
    name: 'updateCourseTag',
    url: '/updateCourseTag',
    source: 'dsl',
  },
  dormAndClassProfile: {
    name: 'dormAndClassProfile',
    url: '/dormAndClassProfile',
    source: 'dsl',
  },

  sendReportMail: {
    name: 'sendReportMail',
    url: '/persons/sendMessage',
    source: 'cjx',
  },

  sendReportMail2: {
    name: 'sendReportMail2',
    url: '/persons/sendMessage3',
    source: 'cjx',
  },
  DownloadReport: {
    name: 'DownloadReport',
    url: '/user/DownloadReport',
    source: 'cjx',
  },
  downloadFile: {
    name: 'downloadFile',
    url: '/user/downloadFile',
    source: 'cjx',
  },
  getGrade: {
    name: 'getGrade',
    url: '/getClass',
    source: 'cjx',
  },

  getStackData: {
    name: 'getStackData',
    url: '/getStackData',
    source: 'dsl',
  },

  getDataByGpaAndFive: {
    name: 'getDataByGpaAndFive',
    url: '/getDataByGpaAndFive',
    source: 'dsl',
  },
  getScatterPicture: {
    name: 'getScatterPicture',
    url: '/getScatterPicture',
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
    case actions.submitTrainPlan.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getTrainPlan.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.deleteTrainPlan.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getAllCourseByTrain.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getAllTagByCourse.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.addTag.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.personalProfile.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.updateCourseTag.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.dormAndClassProfile.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.sendReportMail.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.DownloadReport.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.downloadFile.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getGrade.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getStackData.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getDataByGpaAndFive.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.identifyDataInProfile.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getScatterPicture.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;

    default:
  }
  if (action.source == 'cjx') {
    if (action.name == 'downloadFile') {
      window.open(request_address_cjx + url);
      return 0;
    }
    return request(request_address_cjx + url, options);
  }
  if (action.source == 'dsl') {
    return request(request_address_dsl + url, options);
  }
};

const customRequest2 = (
  action: any,
  token: string = '',
  formdata: any = null,
) => {
  let options: any = {
    headers: {
      Authorization: token ? token : '',
    },
  };
  let url = action.url;
  switch (action.name) {
    case actions.sendReportMail2.name:
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

export function submitTrainPlan(token: string = '', formdata: any = {}) {
  return customRequest(actions.submitTrainPlan, token, formdata);
}

export function getTrainPlan(token: string = '', formdata: any = {}) {
  return customRequest(actions.getTrainPlan, token, formdata);
}

export function deleteTrainPlan(token: string = '', formdata: any = {}) {
  return customRequest(actions.deleteTrainPlan, token, formdata);
}

export function getAllCourseByTrain(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllCourseByTrain, token, formdata);
}

export function getAllTagByCourse(token: string = '', formdata: any = {}) {
  return customRequest(actions.getAllTagByCourse, token, formdata);
}

export function addTag(token: string = '', formdata: any = {}) {
  return customRequest(actions.addTag, token, formdata);
}

export function personalProfile(token: string = '', formdata: any = {}) {
  return customRequest(actions.personalProfile, token, formdata);
}

export function updateCourseTag(token: string = '', formdata: any = {}) {
  return customRequest(actions.updateCourseTag, token, formdata);
}

export function dormAndClassProfile(token: string = '', formdata: any = {}) {
  return customRequest(actions.dormAndClassProfile, token, formdata);
}

export function sendReportMail(token: string = '', formdata: any = {}) {
  return customRequest(actions.sendReportMail, token, formdata);
}

export function sendReportMail2(token: string = '', formdata: any = {}) {
  return customRequest2(actions.sendReportMail2, token, formdata);
}

export function DownloadReport(token: string = '', formdata: any = {}) {
  return customRequest(actions.DownloadReport, token, formdata);
}

export function downloadFile(token: string = '', formdata: any = {}) {
  return customRequest(actions.downloadFile, token, formdata);
}

export function getGrade(token: string = '', formdata: any = {}) {
  return customRequest(actions.getGrade, token, formdata);
}

export function getStackData(token: string = '', formdata: any = {}) {
  return customRequest(actions.getStackData, token, formdata);
}

export function getDataByGpaAndFive(token: string = '', formdata: any = {}) {
  return customRequest(actions.getDataByGpaAndFive, token, formdata);
}

export function getScatterPicture(token: string = '', formdata: any = {}) {
  return customRequest(actions.getScatterPicture, token, formdata);
}

export function identifyDataInProfile(token: string = '', formdata: any = {}) {
  return customRequest(actions.identifyDataInProfile, token, formdata);
}
