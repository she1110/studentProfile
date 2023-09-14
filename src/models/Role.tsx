import {addrole, deleterole, findrole, getOneById, updaterole,} from '@/services/Role';
import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {isLoginExpired, isLoginStatus} from '@/utils/loginStatusChecker';

export type StateType = {
  rolelist?: object[];
  schoollist?: object[];
  unitlist?: object[];
};
export type RoleType = {
  namespace: string;
  state: StateType;
  effects: {
    findrole: Effect;
    findroletemp: Effect;
    addrole: Effect;
    deleterole: Effect;
    updaterole: Effect;
    getOneById: Effect;
  };
  reducers: {
    setRoleList: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: RoleType = {
  namespace: 'role',
  state: {
    rolelist: [], //角色列表
    schoollist: [], //所有学校列表
    unitlist: [], //所有学院列表
  },
  effects: {
    * findrole({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(findrole, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code == '200') {
        yield put({
          type: 'setRoleList',
          payload: JSON.parse(result.data.data),
        });
      } else {
        message.error('获取角色失败！！');
      }
    },

    * findroletemp({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(findrole, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        let findroletemp = JSON.parse(result.data.data);
        findroletemp.map((element: any, index: any) => {
          element.key = index;
        });
        payload.callback(findroletemp);
      } else {
        message.error('获取角色失败！！');
      }
    },

    * addrole({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(addrole, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200 && result.data.data === true) {
        message.success('添加角色成功！！！');
      } else {
        message.error('添加角色失败！！！');
        return;
      }
    },

    * deleterole({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(deleterole, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200 && result.data.data === true) {
        message.success('删除角色成功！！！');
      } else {
        message.error('删除角色失败！！！');
        return;
      }
    },

    * updaterole({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(updaterole, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200 && result.data.data === true) {
        message.success('更新角色成功！！！');
      } else {
        message.error('更新角色失败！！！');
        return;
      }
    },

    * getOneById({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(getOneById, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        yield put({
          type: 'setRoleList',
          payload: JSON.parse(result.data.data),
        });
      } else {
        message.error('查找角色失败！！！');
        return;
      }
    },
  },
  reducers: {
    setRoleList(state, {payload}) {
      return {...state, rolelist: payload};
    },
  },
  subscriptions: {},
};
export default Model;
