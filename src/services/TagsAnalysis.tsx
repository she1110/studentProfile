import {assemble1QueryParams, methods, request, request_address_cjx, request_address_dsl,} from '../utils/request';

const actions = {
  getAllCourseInfo: {
    name: 'getAllCourseInfo',
    url: '/entityTag/getAllCourseInfo',
    source: 'cjx',
  },
  getFindCourseInfo: {
    name: 'getFindCourseInfo',
    url: '/entityTag/findCourseInfo',
    source: 'cjx',
  },
  getCreateTags: {
    name: 'getCreateTags',
    url: '/entityTag/addTagInfo',
    source: 'cjx',
  },
  getentityAddTag: {
    name: 'getentityAddTag',
    url: '/entityTag/entityAddTag',
    source: 'cjx',
  },
  getAllTagInfo: {
    name: 'getAllTagInfo',
    url: '/entityTag/getAllTagInfo',
    source: 'cjx',
  },
  getAllStuInfo: {
    name: 'getAllStuInfo',
    url: '/entityTag/getAllStuInfo',
    source: 'cjx',
  },
  getFindStuInfo: {
    name: 'getFindStuInfo',
    url: '/entityTag/findStuInfo',
    source: 'cjx',
  },
  getAllDorInfo: {
    name: 'getAllDorInfo',
    url: '/entityTag/getAllDorInfo',
    source: 'cjx',
  },
  getFindDorInfo: {
    name: 'getFindDorInfo',
    url: '/entityTag/findDorInfo',
    source: 'cjx',
  },
  getAllClassInfo: {
    name: 'getAllClassInfo',
    url: '/entityTag/getAllClassInfo',
    source: 'cjx',
  },
  getFindClassInfo: {
    name: 'getFindClassInfo',
    url: '/entityTag/findClassInfo',
    source: 'cjx',
  },

  getDelTag: {
    name: 'getDelTag',
    url: '/entityTag/entityDelTag',
    source: 'cjx',
  },
  getPoint: {
    name: 'getPoint',
    url: '/entityTag/getPoint',
    source: 'cjx',
  },
  getLike: {
    name: 'getLike',
    url: '/label/getLike',
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
    case actions.getAllCourseInfo.name:
      options['method'] = methods.get;
      //get post 坑
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getCreateTags.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getFindCourseInfo.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getentityAddTag.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getAllTagInfo.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getAllStuInfo.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getFindStuInfo.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getCreateTags.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getAllDorInfo.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getFindDorInfo.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getAllClassInfo.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.getFindClassInfo.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getDelTag.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getPoint.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getLike.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    default:
  }
  if (action.source == 'cjx') {
    return request(request_address_cjx + url, options);
  }
  if (action.source == 'dsl') {
    // if (action.name === "downSppcExcel") {
    //   console.log("?");
    //   fetch(request_address_dsl + url, options).then((data: any) => {
    //     console.log(data);
    //     return data;
    //   })
    // }
    return request(request_address_dsl + url, options);
  }
};

export function getLike(token: string = '', formdata: any = null) {
  return customRequest(actions.getLike, token, formdata);
}

export function getAllCourseInfo(token: string = '', formdata: any = null) {
  return customRequest(actions.getAllCourseInfo, token, formdata);
}

export function getFindCourseInfo(token: string = '', formdata: any = null) {
  return customRequest(actions.getFindCourseInfo, token, formdata);
}

export function getCreateTags(token: string = '', formdata: any = null) {
  return customRequest(actions.getCreateTags, token, formdata);
}

export function getentityAddTag(token: string = '', formdata: any = null) {
  return customRequest(actions.getentityAddTag, token, formdata);
}

export function getAllTagInfo(token: string = '', formdata: any = null) {
  return customRequest(actions.getAllTagInfo, token, formdata);
}

export function getAllStuInfo(token: string = '', formdata: any = null) {
  return customRequest(actions.getAllStuInfo, token, formdata);
}

export function getFindStuInfo(token: string = '', formdata: any = null) {
  return customRequest(actions.getFindStuInfo, token, formdata);
}

export function getAllDorInfo(token: string = '', formdata: any = null) {
  return customRequest(actions.getAllDorInfo, token, formdata);
}

export function getFindDorInfo(token: string = '', formdata: any = null) {
  return customRequest(actions.getFindDorInfo, token, formdata);
}

export function getAllClassInfo(token: string = '', formdata: any = null) {
  return customRequest(actions.getAllClassInfo, token, formdata);
}

export function getFindClassInfo(token: string = '', formdata: any = null) {
  return customRequest(actions.getFindClassInfo, token, formdata);
}

export function getDelTag(token: string = '', formdata: any = null) {
  return customRequest(actions.getDelTag, token, formdata);
}

export function getPoint(token: string = '', formdata: any = null) {
  return customRequest(actions.getPoint, token, formdata);
}
