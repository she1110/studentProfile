import {addpermission, deletepermission, findpermission, updatepermission,} from '@/services/Authority';
import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {isLoginExpired, isLoginStatus} from '@/utils/loginStatusChecker';

export type StateType = {
  permissionlist?: object[];
};

export type AuthorityType = {
  namespace: string;
  state: StateType;
  effects: {
    findpermission: Effect;
    findpermissiontemp: Effect;
    addpermission: Effect;
    deletepermission: Effect;
    updatepermission: Effect;
  };
  reducers: {
    setPermissionlist: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: AuthorityType = {
  namespace: 'authority',
  state: {
    permissionlist: [], //所有权限列表
  },
  effects: {
    * findpermission({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(findpermission, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        let responsetemp = JSON.parse(response.data.data);
        responsetemp.map((element: any, index: any) => {
          element.key = index;
        });
        yield put({
          type: 'setPermissionlist',
          payload: responsetemp,
        });
      } else {
        message.error('获取权限失败！');
      }
    },

    * findpermissiontemp({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(findpermission, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        payload.callback(JSON.parse(result.data.data));
      } else {
        message.error('获取权限失败！！');
      }
    },

    * addpermission({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(addpermission, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        message.success('增加成功！！！');
      } else {
        message.error('增加失败！！！');
        return;
      }
    },

    * deletepermission({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(deletepermission, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        message.success('删除成功！！！');
      } else {
        message.error('删除失败！！！');
        return;
      }
    },
    * updatepermission({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(updatepermission, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        message.success('更新成功！！！');
      } else if (result.data.code === 401) {
        message.error('更新失败 PerCode重复！！！');
      } else {
        message.error('更新失败！！！');
        return;
      }
    },
  },
  reducers: {
    setPermissionlist(state, {payload}) {
      return {...state, permissionlist: payload};
    },
  },
  subscriptions: {},
};

export default Model;
