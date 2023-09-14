import {
  collectStrategy,
  deleteMessage,
  getAllCondition,
  getAllMessage,
  getStrategyTemp,
  updateMessageStatus,
} from '@/services/MessageList';
import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {history, Link} from 'umi';
import {isLoginExpired, isLoginStatus} from '@/utils/loginStatusChecker';

export type StateType = {
  MessageList?: object[];
  StrategyTemp?: object[];
  PictureStrategyList?: object[];
  ActivityStrategyList?: object[];
};

export type StrategyType = {
  namespace: string;
  state: StateType;
  effects: {
    getAllMessage: Effect;
    updateMessageStatus: Effect;
    deleteMessage: Effect;
    getStrategyTemp: Effect;
    collectStrategy: Effect;
    strategyTempClear: Effect;
    getAllCondition: Effect;
  };
  reducers: {
    setMessageList: Reducer<StateType>;
    setStrategyTemp: Reducer<StateType>;
    setStrategyTempClear: Reducer<StateType>;
    setPictureStrategy: Reducer<StateType>;
    setActivityStrategy: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: StrategyType = {
  namespace: 'messagelist',
  state: {
    MessageList: [], //所有消息的列表
    StrategyTemp: [], //策略的具体条件
    PictureStrategyList: [], //画像策略条件列表，例 头部尾部
    ActivityStrategyList: [], //第二课堂策略条件列表，例 德智体美劳
  },
  effects: {
    * getAllMessage({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getAllMessage, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setMessageList',
          payload: response,
        });
      } else {
        message.error('获取站内信失败！！！');
      }
    },
    * updateMessageStatus({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      yield call(updateMessageStatus, token, payload);
    },
    * deleteMessage({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(deleteMessage, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('该消息已删除！！');
      } else {
        message.error('消息删除失败！！');
      }
    },
    * getStrategyTemp({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getStrategyTemp, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        if (
          'reuslt' in JSON.parse(response.data.data) &&
          JSON.parse(response.data.data).reuslt === '活动已结束'
        ) {
          message.warning('活动已结束!!!!!!!!');
          history.goBack();
        } else {
          yield put({
            type: 'setStrategyTemp',
            payload: response,
          });
        }
      } else {
        message.error('活动信息获取失败！！');
      }
    },
    * collectStrategy({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(collectStrategy, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        yield put({
          type: 'setStrategyTempClear',
        });
        message.success('征集意见提交成功！！！');
        history.goBack();
      } else {
        message.error('征集意见提交失败！！！');
        return;
      }
    },
    * strategyTempClear({payload}, {call, put}) {
      yield put({
        type: 'setStrategyTempClear',
      });
    },
    * getAllCondition({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getAllCondition, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        if (payload.type === '0') {
          yield put({
            type: 'setPictureStrategy',
            payload: response,
          });
        }
        if (payload.type === '1') {
          yield put({
            type: 'setActivityStrategy',
            payload: response,
          });
        }
      } else {
        message.error('获取策略失败！！！');
      }
    },
  },

  reducers: {
    setMessageList(state, {payload}) {
      return {...state, MessageList: JSON.parse(payload.data.data)};
    },
    setStrategyTemp(state, {payload}) {
      return {...state, StrategyTemp: JSON.parse(payload.data.data)[0]};
    },
    setStrategyTempClear(state, {payload}) {
      return {...state, StrategyTemp: undefined};
    },
    setPictureStrategy(state, {payload}) {
      return {...state, PictureStrategyList: JSON.parse(payload.data.data)};
    },
    setActivityStrategy(state, {payload}) {
      return {...state, ActivityStrategyList: JSON.parse(payload.data.data)};
    },
  },

  subscriptions: {},
};

export default Model;
