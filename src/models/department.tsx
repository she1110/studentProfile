import {add, del, getOnlyDepTree, getTree, update,} from '@/services/department';

import type {Effect, Reducer} from 'umi';
import {Link} from 'umi';

export type StateType = {
  treeDataList?: object[];
  OnlyDepTree?: object[];
};
export type RoleType = {
  namespace: string;
  state: StateType;
  effects: {
    getTree: Effect;
    add: Effect;
    del: Effect;
    update: Effect;
    getOnlyDepTree: Effect;
  };
  reducers: {
    setTreeDataList: Reducer<StateType>;
    setOnlyDepTree: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: RoleType = {
  namespace: 'department',
  state: {
    treeDataList: [], //树结构
  },
  effects: {
    * getTree({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(getTree, token, payload);
      if (result) {
        yield put({
          type: 'setTreeDataList',
          payload: result,
        });
      }
    },
    * add({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(add, token, payload);
    },
    * del({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(del, token, payload);
    },
    * update({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(update, token, payload);
    },
    * getOnlyDepTree({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(getOnlyDepTree, token, payload);
      if (result) {
        yield put({
          type: 'setOnlyDepTree',
          payload: result,
        });
      }
    },
  },
  reducers: {
    setTreeDataList(state, {payload}) {
      let treeDataListtemp: any = [];
      treeDataListtemp.push(JSON.parse(payload.data.data));
      return {...state, treeDataList: treeDataListtemp};
    },
    setOnlyDepTree(state, {payload}) {
      let OnlyDepTreeListtemp: any = [];
      OnlyDepTreeListtemp.push(payload.data.data);
      return {...state, OnlyDepTree: OnlyDepTreeListtemp};
    },
  },
  subscriptions: {},
};
export default Model;
