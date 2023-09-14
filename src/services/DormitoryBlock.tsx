import {assemble1QueryParams, methods, request, request_address_cjx, request_address_dsl,} from '../utils/request';

const actions = {
  getCounselorAndDorm: {
    name: 'getCounselorAndDorm',
    url: '/getCounselorAndDorm',
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
    // case actions.findrole.name:
    //     options['method'] = methods.post;
    //     options['body'] = JSON.stringify(formdata);
    //     break;
    case actions.getCounselorAndDorm.name:
      options['method'] = methods.get;
      url = url + assemble1QueryParams(formdata);
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

export function getCounselorAndDorm(token: string = '', formdata: any = null) {
  return customRequest(actions.getCounselorAndDorm, token, formdata);
}
