import {
  appAdd,
  appDelete,
  appGet,
  appGetAll,
  appUpdate,
  getAll,
  getClusterDetail,
  getMajor,
  getRolesByUnit,
  getSchool,
  getUnit,
  getUserByRoles,
  sendMail,
} from '@/services/Application';
import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {isLoginExpired} from '@/utils/loginStatusChecker';

export type StateType = {
  allapplist?: object[];
  oneappmessage?: object;
  picturelist?: object[];
  clusterdetail?: object[];
  creatorlist?: object[];
  majorlist?: object[];
  schoollist?: object[];
  unitlist?: object[];
  rolesbyunit?: object[];
  userbyroles?: object[];
};
export type ApplicationType = {
  namespace: string;
  state: StateType;
  effects: {
    getAll: Effect;
    appGet: Effect;
    appGetAll: Effect;
    appAdd: Effect;
    appDelete: Effect;
    getClusterDetail: Effect;
    resetClusterDetail: Effect;
    getMajor: Effect;
    sendMail: Effect;
    getSchool: Effect;
    getUnit: Effect;
    getRolesByUnit: Effect;
    getUserByRoles: Effect;
    appUpdate: Effect;
    // getClusterDetailTemp: Effect;
  };
  reducers: {
    setAllAppList: Reducer<StateType>;
    setAllPictureList: Reducer<StateType>;
    setClusterDetail: Reducer<StateType>;
    setCreatorList: Reducer<StateType>;
    setMajorList: Reducer<StateType>;
    reset: Reducer<StateType>;
    setSchoolList: Reducer<StateType>;
    setUnitList: Reducer<StateType>;
    setRolesByUnit: Reducer<StateType>;
    setUserByRoles: Reducer<StateType>;
  };
  subscriptions: {};
};
const Model: ApplicationType = {
  namespace: 'application',
  state: {
    allapplist: [], //所有应用的列表
    oneappmessage: {}, //一个应用的信息
    picturelist: [], //所有画像的列表
    clusterdetail: [], //一个画像的具体信息
    creatorlist: [], //去重后的用户列表
    majorlist: [], //专业列表
    schoollist: [], //所有学校列表
    unitlist: [], //所有学院列表
    rolesbyunit: [],
    userbyroles: [],
  },
  effects: {
    * getAll({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getAll, token, payload);
      if (isLoginExpired(response)) return;
      if (response) {
        yield put({
          type: 'setAllPictureList',
          payload: response,
        });
      }
    },
    * appGetAll({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(appGetAll, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setAllAppList',
          payload: response,
        });
        let creatorlist = [''];
        response.data.data.map((element: any, index: any) => {
          creatorlist[index] = element.creator;
        });
        let creatorlistUnique = [...new Set(creatorlist)]; //creatorlist去重
        yield put({
          type: 'setCreatorList',
          payload: creatorlistUnique,
        });
      } else {
        message.error('应用获取失败！');
      }
    },
    * appGet({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(appGet, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setAllAppList',
          payload: response,
        });
      } else {
        message.error('查询应用失败！');
      }
    },
    * appUpdate({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(appUpdate, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        if (payload.ispush !== '0') {
          const result = yield call(sendMail, token, {
            appid: response.data.data.id,
          });
          if (result.data.code === 200) {
            message.success('更新并发送成功！！');
          } else {
            message.error('发送失败！！');
          }
        } else {
          message.success('更新应用成功！！');
        }
      } else {
        message.error('更新应用失败！！');
      }
    },
    * appAdd({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(appAdd, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        if (payload.ispush !== '0') {
          const result = yield call(sendMail, token, {
            appid: response.data.data.id,
          });
          if (result.data.code === 200) {
            message.success('添加并发送成功！！');
          } else {
            message.error('发送失败！！');
          }
        } else {
          message.success('添加应用成功！！');
        }
      } else {
        message.error('添加应用失败！！');
      }
    },
    * appDelete({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(appDelete, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        message.success('删除成功！！！');
      } else {
        message.error('删除失败！！！');
      }
    },
    * getClusterDetail({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getClusterDetail, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setClusterDetail',
          payload: response,
        });
      } else {
        message.error('获取分群失败！！');
      }
    },

    * resetClusterDetail({payload}, {call, put}) {
      yield put({
        type: 'reset',
      });
    },
    * getMajor({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getMajor, token, payload);
      if (isLoginExpired(response)) return;
      if (response) {
        yield put({
          type: 'setMajorList',
          payload: response,
        });
      }
    },
    * sendMail({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(sendMail, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        message.success(response.data.msg);
      } else {
        message.error(response.data.error);
      }
    },
    * getSchool({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(getSchool, token, payload);
      if (isLoginExpired(response)) return;
      if (response) {
        yield put({
          type: 'setSchoolList',
          payload: response,
        });
      }
    },
    * getUnit({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(getUnit, token, payload);
      if (isLoginExpired(response)) return;
      if (response) {
        yield put({
          type: 'setUnitList',
          payload: response,
        });
      }
    },
    * getRolesByUnit({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(getRolesByUnit, token, payload);
      if (isLoginExpired(response)) return;
      if (response) {
        yield put({
          type: 'setRolesByUnit',
          payload: response,
        });
      }
    },
    * getUserByRoles({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(getUserByRoles, token, payload);
      if (isLoginExpired(response)) return;
      if (response) {
        yield put({
          type: 'setUserByRoles',
          payload: JSON.parse(response.data.data),
        });
      }
    },
  },
  reducers: {
    setAllAppList(state, {payload}) {
      return {...state, allapplist: payload.data.data};
    },
    setAllPictureList(state, {payload}) {
      return {...state, picturelist: payload.data.data};
    },
    setClusterDetail(state, {payload}) {
      return {...state, clusterdetail: JSON.parse(payload.data.data)};
    },
    setCreatorList(state, {payload}) {
      return {...state, creatorlist: payload};
    },
    reset(state, {payload}) {
      return {...state, clusterdetail: []};
    },
    setMajorList(state, {payload}) {
      return {...state, majorlist: payload.data.data};
    },
    setSchoolList(state, {payload}) {
      return {...state, schoollist: payload.data.data};
    },
    setUnitList(state, {payload}) {
      return {...state, unitlist: payload.data.data};
    },
    setRolesByUnit(state, {payload}) {
      return {...state, rolesbyunit: payload.data.data};
    },
    setUserByRoles(state, {payload}) {
      return {...state, userbyroles: payload};
    },
  },
  subscriptions: {},
};

export default Model;
