import {getCounselorAndDorm} from '@/services/DormitoryBlock';
import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {isLoginExpired, isLoginStatus} from '@/utils/loginStatusChecker';

export type StateType = {
  counseloranddormblock?: number[];
  counseloranddormround?: number[];
  colorblockloading?: boolean;
};

export type EvaluateInstructorModelType = {
  namespace: string;
  state: StateType;
  effects: {
    getCounselorAndDorm: Effect;
    changeLoading: Effect;
  };
  reducers: {
    setCounselorAndDormBlock: Reducer<StateType>;
    setCounselorAndDormRound: Reducer<StateType>;
    changeColorBlockLoading: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: EvaluateInstructorModelType = {
  namespace: 'evaluateinstructor',
  state: {
    counseloranddormblock: undefined, //辅导员 所管理的学生宿舍 挂科情况
    colorblockloading: false, //色块 loading
    counseloranddormround: undefined,
  },
  effects: {
    * getCounselorAndDorm({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getCounselorAndDorm, token, payload);
      console.log(response);
      console.log(JSON.parse(response.data.data));

      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        if (payload.flag === 'block') {
          yield put({
            type: 'setCounselorAndDormBlock',
            payload: response,
          });
        }
        if (payload.flag === 'round') {
          yield put({
            type: 'setCounselorAndDormRound',
            payload: response,
          });
        }
      } else {
        message.error('获取色块数据失败！！！');
      }
    },
    * changeLoading({payload}, {call, put}) {
      yield put({
        type: 'changeColorBlockLoading',
        payload,
      });
    },
  },

  reducers: {
    setCounselorAndDormBlock(state, {payload}) {
      return {
        ...state,
        counseloranddormblock: payload.data,
        colorblockloading: false,
      };
    },
    setCounselorAndDormRound(state, {payload}) {
      return {...state, counseloranddormround: payload.data};
    },

    changeColorBlockLoading(state, {payload}) {
      return {...state, colorblockloading: payload};
    },
  },

  subscriptions: {},
};

export default Model;
