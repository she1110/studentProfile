import {
  addStrategyByCollect,
  addStrategyBySelf,
  calculateCollect,
  deleteStrategy,
  evaluateAllActivity,
  findrole,
  getAll,
  getAllCondition,
  getAllStrategy,
  getOneStrategy,
  strategyGetOne,
  strategyGetOneByName,
  updateStrategy,
  writeMessage,
} from '@/services/Strategy';
import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {isLoginExpired, isLoginStatus} from '@/utils/loginStatusChecker';

export type StateType = {
  strategylist?: object[] | object;
  picturelist?: object[];
  rolelist?: object[];

  conditionlist?: object[];
};

export type StrategyType = {
  namespace: string;
  state: StateType;
  effects: {
    findrole: Effect;
    getAll: Effect;
    strategyGetOne: Effect;
    strategyGetOneByName: Effect;

    getAllStrategy: Effect;
    getOneStrategy: Effect;
    deleteStrategy: Effect;
    addStrategyBySelf: Effect;
    updateStrategy: Effect;
    getAllCondition: Effect;
    addStrategyByCollect: Effect;

    calculateCollect: Effect;
    evaluateAllActivity: Effect;
  };
  reducers: {
    setRoleList: Reducer<StateType>;
    setAllStrategyList: Reducer<StateType>;
    setConditionList: Reducer<StateType>;
    setAllPictureList: Reducer<StateType>;
    setAllStrategyListTemp: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: StrategyType = {
  namespace: 'strategy',
  state: {
    strategylist: [], //所有策略的列表
    picturelist: [], //画像列表
    rolelist: [], //角色列表
    conditionlist: [], //新建策略中的评价指标列表
  },
  effects: {
    * getAllStrategy({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getAllStrategy, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        let result = JSON.parse(response.data.data);
        result.map((element: any, index: any) => {
          if (element.jList.length !== 0) {
            element.jList.map((elementsub: any, indexsub: any) => {
              elementsub.personsId = parseInt(elementsub.personsId);
              elementsub.uuid = indexsub + 1;
            });
          }
        });
        yield put({
          type: 'setAllStrategyListTemp',
          payload: result,
        });
      } else {
        message.error('拉取策略失败！！');
        return;
      }
    },
    //20211010 getOneStrategy这个接口新项目好像没写
    * getOneStrategy({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getOneStrategy, token, payload);
      if (isLoginExpired(response)) return;
      if (response) {
        let temp: any = [];
        temp.push(response.data);
        let responsetemp = response;
        responsetemp.data = temp;
        yield put({
          type: 'setAllStrategyList',
          payload: responsetemp,
        });
      }
    },
    * deleteStrategy({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(deleteStrategy, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('删除策略成功！！！！');
      } else {
        message.error('删除策略失败！！！！');
        return;
      }
    },

    * addStrategyByCollect({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(addStrategyByCollect, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        const writeMessageResponse = yield call(
          writeMessage,
          token,
          JSON.parse(response.data.data),
        );
        if (
          writeMessageResponse.data.code === 200 &&
          writeMessageResponse.data.data === true
        ) {
          message.success('已发送站内信到相应用户！！！！');
        } else {
          message.error('站内信发送失败！！！！');
        }
      } else {
        message.error('征集创建失败！！！！');
        return;
      }
    },
    * addStrategyBySelf({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(addStrategyBySelf, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        message.success('添加自定义策略成功！！！');
      } else {
        message.error('添加自定义策略失败！！！');
      }
    },
    //20211010  将更新策略更改为查看策略 这个接口暂时没用到
    * updateStrategy({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(updateStrategy, token, payload);
      if (isLoginExpired(response)) return;
    },
    * getAllCondition({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getAllCondition, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setConditionList',
          payload: response,
        });
      } else {
        message.error('获取策略条件失败！！！');
        return;
      }
    },

    //20211010 getAll画像列表用于征集策略 分群征集部分 现在只有角色征集
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
    * findrole({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(findrole, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        yield put({
          type: 'setRoleList',
          payload: result.data.data,
        });
      } else {
        message.error('获取角色失败！！！');
      }
    },

    //20211010 strategyGetOne和strategyGetOneByName这俩接口新项目没有
    * strategyGetOne({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(strategyGetOne, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.data.length != 0) {
        let responsetemp = [];
        responsetemp.push(response.data.data);
        response.data.data = responsetemp;
        yield put({
          type: 'setAllStrategyList',
          payload: response,
        });
      }
      if (response.data.data.length === 0) {
        yield put({
          type: 'setAllStrategyList',
          payload: response,
        });
      }
    },
    * strategyGetOneByName({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(strategyGetOneByName, token, payload);
      if (isLoginExpired(response)) return;
      if (response) {
        yield put({
          type: 'setAllStrategyList',
          payload: response,
        });
      }
    },
    * calculateCollect({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(calculateCollect, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('计算完成！！！！');
      } else {
        message.error('计算失败！！！！');
        return;
      }
    },
    //20211010 evaluateAllActivity这接口新项目没有 注释掉计算策略的所有任务
    * evaluateAllActivity({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(evaluateAllActivity, token, payload);
      if (isLoginExpired(response)) return;
    },
  },

  reducers: {
    setAllStrategyList(state, {payload}) {
      return {...state, strategylist: JSON.parse(payload.data.data)};
    },
    setAllStrategyListTemp(state, {payload}) {
      return {...state, strategylist: payload};
    },
    setConditionList(state, {payload}) {
      return {...state, conditionlist: JSON.parse(payload.data.data)};
    },
    setAllPictureList(state, {payload}) {
      return {...state, picturelist: payload.data.data};
    },
    setRoleList(state, {payload}) {
      return {...state, rolelist: JSON.parse(payload)};
    },
  },

  subscriptions: {},
};

export default Model;
