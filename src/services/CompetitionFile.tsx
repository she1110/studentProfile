import {assemble1QueryParams, methods, request, request_address_cjx, request_address_dsl,} from '../utils/request';

const actions = {
  getSoftPaperPatentComp: {
    name: 'getSoftPaperPatentComp',
    url: '/softPaperPatentComp',
    source: 'dsl',
  },
  getLike: {
    name: 'getLike',
    url: '/label/getLike',
    source: 'cjx',
  },
  downSppcExcel: {
    name: 'downSppcExcel',
    url: '/downSppcExcel',
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
    case actions.getSoftPaperPatentComp.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
      break;
    case actions.getLike.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
      break;
    case actions.downSppcExcel.name:
      options['method'] = methods.post;
      options['body'] = JSON.stringify(formdata);
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

export function getSoftPaperPatentComp(token: string = '', formdata: any = {}) {
  return customRequest(actions.getSoftPaperPatentComp, token, formdata);
}

export function getLike(token: string = '', formdata: any = null) {
  return customRequest(actions.getLike, token, formdata);
}

export function downSppcExcel(token: string = '', formdata: any = null) {
  return customRequest(actions.downSppcExcel, token, formdata);
}
