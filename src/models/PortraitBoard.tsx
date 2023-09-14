import {
  addBoard,
  addPersonasIntoBoard,
  deleteBoard,
  getMyAllBoard,
  removePersonasFromBoard,
} from '@/services/PortraitBoard';
import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {history, Link} from 'umi';
import {isLoginExpired, isLoginStatus} from '@/utils/loginStatusChecker';

export type StateType = {
  allboard?: object[];
};

export type StrategyType = {
  namespace: string;
  state: StateType;
  effects: {
    getMyAllBoard: Effect;
    addBoard: Effect;
    deleteBoard: Effect;
    addPersonasIntoBoard: Effect;
    removePersonasFromBoard: Effect;
  };
  reducers: {
    setAllBoard: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: StrategyType = {
  namespace: 'portraitboard',
  state: {
    allboard: [], //自己看板列表
  },
  effects: {
    * getMyAllBoard({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getMyAllBoard, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setAllBoard',
          payload: response,
        });
      } else {
        message.error('添加看板失败！！');
        return;
      }
    },
    * addBoard({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(addBoard, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('添加看板成功！！');
        return;
      } else {
        message.error('添加看板失败！！');
        return;
      }
    },
    * deleteBoard({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(deleteBoard, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('删除看板成功！！');
        return;
      } else {
        message.error('删除看板失败！！');
        return;
      }
    },

    * addPersonasIntoBoard({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(addPersonasIntoBoard, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('看板添加画像成功！！');
        history.goBack();
        return;
      } else {
        message.error('看板添加画像失败！！');
        return;
      }
    },

    * removePersonasFromBoard({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(removePersonasFromBoard, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('画像移除成功！！');
        return;
      } else {
        message.error('画像移除失败！！');
        return;
      }
    },
  },

  reducers: {
    setAllBoard(state, {payload}) {
      let allboardtemp: any = JSON.parse(payload.data.data);
      return {...state, allboard: allboardtemp};
    },
  },

  subscriptions: {},
};

export default Model;
