import {
  evaluateClassOrMajor,
  evaluateStudent,
  getAll,
  getAllStrategy,
  getJobResult,
  jobAdd,
  jobDel,
  jobGet,
  jobGetAllByName,
  jobGetByState,
  update,
} from '@/services/Job';
import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {isLoginExpired, isLoginStatus} from '@/utils/loginStatusChecker';

interface User {
  key: number;
  id: number;
  name: string;
  state: string;
  persons_id: number;
  persons_name: string;
  result: string;
  creator: string;
  time: string;
  dim: string;
  strategy_id: number;
  strategy_name: string;
}

export type StateType = {
  joblist?: User[];
  strategylist?: object[];
  picturelist?: object[];
  jobresult?: object;
};

export type StrategyType = {
  namespace: string;
  state: StateType;
  effects: {
    jobGet: Effect;
    jobAdd: Effect;
    getAll: Effect;
    jobDel: Effect;
    jobGetByState: Effect;

    jobGetAllByName: Effect;
    getJobResult: Effect;
    evaluateClassOrMajor: Effect;
    evaluateStudent: Effect;
    getAllStrategy: Effect;
    update: Effect;
  };
  reducers: {
    setAllJobList: Reducer<StateType>;
    setAllPictureList: Reducer<StateType>;
    setAllStrategyList: Reducer<StateType>;
    setJobResult: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: StrategyType = {
  namespace: 'job',
  state: {
    joblist: [], //所有任务的列表
    picturelist: [], //所有画像的列表
    strategylist: [], //所有策略的列表
    jobresult: [], //任务结果页面
  },
  effects: {
    * jobGet({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(jobGet, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        let responsetemp = response;
        if (responsetemp.data.data.length !== 0) {
          responsetemp.data.data.map((element: any, index: any) => {
            element.persons_id = parseInt(element.persons_id);
          });
        }
        yield put({
          type: 'setAllJobList',
          payload: response,
        });
      } else {
        message.error('获取活动列表失败！！！');
        return;
      }
    },
    * getAllStrategy({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getAllStrategy, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setAllStrategyList',
          payload: response,
        });
      } else {
        message.error('获取策略失败！！');
        return;
      }
    },
    * jobAdd({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(jobAdd, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('添加任务成功！！！');
      } else {
        message.error('添加任务失败！！！');
      }
    },

    //获取的是超越权限的所有画像
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

    * jobDel({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(jobDel, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('删除任务成功！！！');
      } else {
        message.error('删除任务失败！！！');
        return;
      }
    },
    * jobGetByState({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(jobGetByState, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setAllJobList',
          payload: response,
        });
        message.success('查找成功！！！');
      } else {
        message.error('查找失败！！！');
        return;
      }
    },

    * jobGetAllByName({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(jobGetAllByName, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setAllJobList',
          payload: response,
        });
        message.success('查找成功！！！');
      } else {
        message.error('查找失败！！！');
      }
    },
    * getJobResult({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getJobResult, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        let result = JSON.parse(response.data.data);
        result.chartData.map((element: any, index: any) => {
          element.key = element.userid;
          element.ranking = index + 1;
          element.headpercent = element.headpercent + '%';
          element.tailpercent = element.tailpercent + '%';
        });
        if ('dimArray' in result) {
          let selecttemp: any = [];
          for (let i = 0; i < result.dimArray.length; i++) {
            let temp = {value: '', name: ''};
            temp.value = result.dimArray[i];
            temp.name = result.dimArray[i];
            selecttemp.push(temp);
          }
          result.dimArray = selecttemp;
        }
        yield put({
          type: 'setJobResult',
          payload: result,
        });
        message.success('获取任务结果数据成功！！！');
      } else {
        message.error('获取任务结果数据失败！！！');
      }
    },
    * evaluateClassOrMajor({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      message.info('任务计算中！请稍等！');
      const response = yield call(evaluateClassOrMajor, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('任务计算成功！！！');
      } else {
        message.error('任务计算失败！！！');
      }
    },
    * evaluateStudent({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      message.info('任务计算中！请稍等！');
      const response = yield call(evaluateStudent, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('任务计算成功！！！');
      } else {
        message.error('任务计算失败！！！');
      }
    },
    * update({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(update, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('任务更新成功！！');
      } else {
        message.error('任务更新失败！！！');
        return;
      }
    },
  },

  reducers: {
    setAllStrategyList(state, {payload}) {
      return {...state, strategylist: JSON.parse(payload.data.data)};
    },
    setAllJobList(state, {payload}) {
      return {...state, joblist: payload.data.data};
    },
    setAllPictureList(state, {payload}) {
      return {...state, picturelist: payload.data.data};
    },
    setJobResult(state, {payload}) {
      return {...state, jobresult: payload};
    },
  },

  subscriptions: {},
};

export default Model;
