import {
  addAct,
  addTag,
  delAct,
  downloadFile,
  evaluateOneActivity,
  getActByLevel,
  getActSorceByUser,
  getAllAct,
  getAllByName,
  getAllStrategy,
  getAllStuScoreInActivity,
  getAllTag,
  updateAct,
} from '@/services/Activity';
import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {isLoginExpired, isLoginStatus} from '@/utils/loginStatusChecker';

export type StateType = {
  ActivityList?: object[];
  orgList?: object[];
  strategylist?: object[];
  tagList?: object[];
  // unitlist?: object[];
  UserActSorceList?: object[];
  StudentTotalScore?: number;
};

export type ActivityType = {
  namespace: string;
  state: StateType;
  effects: {
    getAllAct: Effect;
    getOneAct: Effect;
    getActByLevel: Effect;
    addAct: Effect;
    updateAct: Effect;
    delAct: Effect;
    downloadFile: Effect;
    getAllStrategy: Effect;
    getAllTag: Effect;
    addTag: Effect;
    getActSorceByUser: Effect;
    evaluateOneActivity: Effect;
    getAllStuScoreInActivity: Effect;
    // getAllByName: Effect;
  };
  reducers: {
    setActivityList: Reducer<StateType>;
    setAllStrategyList: Reducer<StateType>;
    setTagList: Reducer<StateType>;
    setUserActSorceList: Reducer<StateType>;
    setStudentTotalScore: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: ActivityType = {
  namespace: 'activity',
  state: {
    ActivityList: [], //所有活动列表
    strategylist: [], //所有策略列表
    tagList: [], //所有活动标签列表
    UserActSorceList: [], //学生所有活动和对应成绩 列表
    StudentTotalScore: 0, //学生在活动中获取的总加分
  },
  effects: {
    * downloadFile({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(downloadFile, token, payload);
    },
    * getAllAct({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getAllAct, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setActivityList',
          payload: response,
        });
      } else {
        message.error('获取活动列表失败！！！');
        return;
      }
    },
    * getOneAct({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(getAllByName, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setActivityList',
          payload: response,
        });
      } else {
        message.error('查找失败！！！！');
        return;
      }
    },
    * getActByLevel({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(getActByLevel, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setActivityList',
          payload: response,
        });
        message.success('查找成功！！！！');
      } else {
        message.error('查找失败！！！！');
        return;
      }
    },
    * addAct({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(addAct, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('添加活动成功！！！！');
      } else {
        message.error('添加活动失败！！！！');
        return;
      }
    },

    * updateAct({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(updateAct, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('更新活动成功！！！！');
      } else {
        message.error('更新活动失败！！！！');
        return;
      }
    },
    * delAct({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(delAct, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('删除活动成功！！！！');
      } else {
        message.error('删除活动失败！！！！');
        return;
      }
    },
    * getAllStrategy({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getAllStrategy, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        let result = response;
        JSON.parse(result.data.data).map((element: any, index: any) => {
          if (element.jList.length !== 0) {
            element.jList.map((elementsub: any, indexsub: any) => {
              elementsub.personsId = parseInt(elementsub.personsId);
              elementsub.uuid = indexsub + 1;
            });
          }
        });
        yield put({
          type: 'setAllStrategyList',
          payload: response,
        });
      } else {
        message.error('获取策略失败！！！');
        return;
      }
    },
    * getAllTag({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(getAllTag, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        let responsetemp: any = response;
        if (responsetemp.data.data.length !== 0) {
          responsetemp.data.data.map((element: any, index: any) => {
            element.key = element.id;
            element.title = element.name;
          });
        }
        yield put({
          type: 'setTagList',
          payload: responsetemp,
        });
      } else {
        message.error('获取标签失败！！！');
        return;
      }
    },
    * addTag({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(addTag, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('添加标签成功！！！！');
      } else {
        message.error('添加标签失败！！！！');
        return;
      }
    },
    //某个学生活动得分 1.0版本没用到
    * getActSorceByUser({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(getActSorceByUser, token, payload);
      if (isLoginExpired(response)) return;
      if (response) {
        let studenttotalscore: any = 0;
        response.data.data.map((element: any, index: any) => {
          studenttotalscore = studenttotalscore + element.rewardresult;
        });
        yield put({
          type: 'setUserActSorceList',
          payload: response,
        });
        yield put({
          type: 'setStudentTotalScore',
          payload: studenttotalscore,
        });
      }
    },
    * evaluateOneActivity({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(evaluateOneActivity, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        message.success('计算成功！！');
      } else {
        message.error('计算失败！！');
      }
    },
    * getAllStuScoreInActivity({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(getAllStuScoreInActivity, token, payload);
      if (isLoginExpired(response)) return;
      if (response) {
        window.open(
          'http://10.1.40.85:8087/getAllStuScoreInActivity?activityId=' +
          payload.activityId,
        );
        return 0;
      }
    },
  },
  reducers: {
    setActivityList(state, {payload}) {
      return {...state, ActivityList: payload.data.data};
    },
    setAllStrategyList(state, {payload}) {
      return {...state, strategylist: JSON.parse(payload.data.data)};
    },
    setTagList(state, {payload}) {
      return {...state, tagList: payload.data.data};
    },
    setUserActSorceList(state, {payload}) {
      return {...state, UserActSorceList: payload.data.data};
    },
    setStudentTotalScore(state, {payload}) {
      return {...state, StudentTotalScore: payload};
    },
  },
  subscriptions: {},
};

export default Model;
