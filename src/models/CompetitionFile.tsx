import {downSppcExcel, getLike, getSoftPaperPatentComp,} from '@/services/CompetitionFile';

import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {isLoginExpired, isLoginStatus} from '@/utils/loginStatusChecker';

export type StateType = {
  softwareList?: object[]; //软件著作权信息列表
  paperList?: object[]; //论文信息列表
  patentList?: object[]; //专利信息列表
  competitionList?: object[]; //竞赛信息列表
};

export type ActivityType = {
  namespace: string;
  state: StateType;
  effects: {
    getSoftPaperPatentComp: Effect;
    getLike: Effect;
    downSppcExcel: Effect;
  };
  reducers: {
    setSoftware: Reducer<StateType>;
    setPaper: Reducer<StateType>;
    setPatent: Reducer<StateType>;
    setCompetition: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: ActivityType = {
  namespace: 'competition',
  state: {
    softwareList: [], //软件著作权信息列表
    paperList: [], //论文信息列表
    patentList: [], //专利信息列表
    competitionList: [], //竞赛信息列表
  },
  effects: {
    * getSoftPaperPatentComp({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getSoftPaperPatentComp, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        // console.log(response.data.data)
        if (payload.type == 2) {
          yield put({
            type: 'setSoftware',
            payload: response,
          });
        }
        if (payload.type == 0) {
          yield put({
            type: 'setPaper',
            payload: response,
          });
        }
        if (payload.type == 1) {
          yield put({
            type: 'setPatent',
            payload: response,
          });
        }
        if (payload.type == 3) {
          // console.log(response.data.data.data)
          yield put({
            type: 'setCompetition',
            payload: response,
          });
        }
      } else {
        message.error('获取竞赛档案信息失败！！');
        return;
      }
    },
    * getLike({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getLike, token, payload.payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        payload.callback(response.data.data);
      }
      // else {
      //   message.error('模糊查询失败！！');
      //   return;
      // }
    },
    * downSppcExcel({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(downSppcExcel, token, payload);

      // if (isLoginExpired(response)) return;
      // if (response.data.code === 200) {
      //   payload.callback(response.data.data);
      // }
      // else {
      //   message.error('模糊查询失败！！');
      //   return;
      // }
    },
  },
  reducers: {
    setSoftware(state, {payload}) {
      return {...state, softwareList: payload.data.data.data};
    },
    setPaper(state, {payload}) {
      return {...state, paperList: payload.data.data.data};
    },
    setPatent(state, {payload}) {
      return {...state, patentList: payload.data.data.data};
    },
    setCompetition(state, {payload}) {
      return {...state, competitionList: payload.data.data.data};
    },
  },
  subscriptions: {},
};

export default Model;
