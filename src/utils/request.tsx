//请求
// import fetch from 'dva';
require('es6-promise').polyfill();
require('isomorphic-fetch');


const serverDomain_local = 'http://localhost:7775';
export const request_address_local = serverDomain_local;
export const request_address_cjx = serverDomain_local;

const serverDomain_dsl = 'http://localhost:7777';
export const request_address_dsl = serverDomain_dsl;

const serverDomain_cjx_workflow = 'http://10.1.40.84:7778';
export const request_address_cjx_workflow = serverDomain_cjx_workflow;

const serverDomain_local_oa = 'http://10.1.40.84:7779';
export const request_address_local_oa = serverDomain_local_oa;
export const request_address_htb= serverDomain_local_oa;
export const request_address_dsl_workflow = serverDomain_local_oa;
export const request_address_psychology = serverDomain_local_oa;










export const methods = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  patch: 'PATCH',
  delete: 'DELETE',
};

export const assemble1QueryParams = (formdata: any) => {
  let url = '';
  let count = 0;
  Object.keys(formdata).map((value: any, index: any) => {
    // console.log(value);
    let key_temp = value;
    let value_temp = formdata[value];
    if (formdata[value]) {
      // console.log(formdata[value]);
      if (count == 0) {
        url = url + '?' + key_temp + '=' + value_temp;
      } else {
        url = url + '&' + key_temp + '=' + value_temp;
      }
      count++;
    }
  });
  return url;
};

function parseJSON(response: any) {
  // console.log(response.json());

  return response.json();
}

function checkStatus(response: any) {
  // console.log(response);
  if (response.status >= 200 && response.status < 300) {
    let token = response.headers.get('Authorization');
    if (token) {
      localStorage.setItem('token', token);
    }
    return response;
  } else {
    // console.log(response);

    // response.code = response.status;
    // response.msg = response.error;
    // console.log(response);

    return response;
  }
  // const error = new Error(response.statusText);
  // error.response = response.json();
  // // return error.response;
  // throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function request(url: any, options: any) {
  console.log(url, options)
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => ({data}))
    .catch((err) => ({err}));
}

// .then(parseJSON)
