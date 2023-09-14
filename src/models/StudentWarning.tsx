import {
  addHelp,
  addHelpRecord,
  getAllFailTests,
  getHelp,
  getMyHelpSemeWarn,
  getWarnDetail,
  getWarnListByType,
  getWarnQues,
  handleWarnQues,
  questWarn,
  warningStuDetail,
} from '@/services/StudentWarning';
import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {Link} from 'umi';
import {isLoginExpired, isLoginStatus} from '@/utils/loginStatusChecker';

export type StateType = {
  AllFailTests?: object[]; //累计挂科
  stuDetail?: object[]; //学生界面 学业预警所有信息
  FirstLevelWarning?: any; //一级预警 学生名单
  HelpCandidate?: any; //待选帮扶人
  WarnQues?: any; //待选帮扶人
  WarnDetail?: any; //帮扶详情
  stuWarningMsg?: object[]; //学生的学期预警记录
  helper?: object[]; //帮扶信息
  warner?: object[]; //被帮扶信息
};

export type StrategyType = {
  namespace: string;
  state: StateType;
  effects: {
    getWarnListByType: Effect;
    getHelp: Effect;
    addHelp: Effect;
    getWarnQues: Effect;
    handleWarnQues: Effect;
    getWarnDetail: Effect;
    getAllFailTests: Effect;
    questWarn: Effect;
    warningStuDetail: Effect;
    getMyHelpSemeWarn: Effect;
    addHelpRecord: Effect;
  };
  reducers: {
    setAllFailTests: Reducer<StateType>;
    setWarningStuDetail: Reducer<StateType>;
    setFirstLevelWarning: Reducer<StateType>;
    setHelpCandidate: Reducer<StateType>;
    setWarnQues: Reducer<StateType>;
    setWarnDetail: Reducer<StateType>;
    setMyHelpSemeWarn: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: StrategyType = {
  namespace: 'studentwarning',
  state: {
    AllFailTests: [], //所有挂科学生的课程信息
    FirstLevelWarning: undefined, //一级预警 学生名单
    HelpCandidate: undefined, //待选帮扶人
    WarnQues: undefined, //辅导员的消息列表
    WarnDetail: undefined, //帮扶详情
    stuWarningMsg: [], //学生的学期预警记录
    helper: [], //帮扶信息
    warner: [], //被帮扶信息
  },
  effects: {
    * getWarnListByType({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getWarnListByType, token, payload);
      console.log(response);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setFirstLevelWarning',
          payload: response,
        });
      } else {
        message.error('获取一级预警失败！！！');
      }
    },
    * getHelp({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getHelp, token, payload);
      console.log(response);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setHelpCandidate',
          payload: response,
        });
      } else {
        message.error('获取帮扶人列表失败！！！');
      }
    },
    * getAllFailTests({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getAllFailTests, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setAllFailTests',
          payload: response,
        });
      } else {
        message.error('挂科信息失败！！！');
      }
    },
    * questWarn({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(questWarn, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        message.success('申诉请求已发送至老师！');
      } else {
        message.error('申诉失败！！！');
      }
    },
    * warningStuDetail({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(warningStuDetail, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setWarningStuDetail',
          payload: response,
        });
      }
    },
    * addHelp({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(addHelp, token, payload);
      console.log(response);
      // if (isLoginExpired(response)) return;
      // if (response.data.code === 200) {
      //   yield put({
      //     type: 'setHelpCandidate',
      //     payload: response,
      //   });
      // } else {
      //   message.error('获取站内信失败！！！');
      // }
    },

    * getWarnQues({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getWarnQues, token, payload);
      console.log(response);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setWarnQues',
          payload: response,
        });
      } else {
        message.error('问题列表失败！！！');
      }
    },
    * handleWarnQues({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(handleWarnQues, token, payload);
      console.log(response);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        message.success('申诉处理成功！！！');
      } else {
        message.error('申诉处理失败！！！');
      }
    },
    * getWarnDetail({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getWarnDetail, token, payload);
      console.log(response);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setWarnDetail',
          payload: response,
        });
      } else {
        message.error('获取站内信失败！！！');
      }
    },
    * getMyHelpSemeWarn({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getMyHelpSemeWarn, token, payload);
      console.log(response);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setMyHelpSemeWarn',
          payload: response,
        });
      } else {
        message.error('获取站内信失败！！！');
      }
    },
    * addHelpRecord({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(addHelpRecord, token, payload);
      console.log(response);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        message.success('添加成功');
      } else {
        message.error('添加失败！！！');
      }
    },
  },

  reducers: {
    setFirstLevelWarning(state, {payload}) {
      let temp: any = [];
      JSON.parse(payload.data.data).map((element: any, index: any) => {
        element.key = element.SEMEWARNID;
        temp.push(element);
      });
      console.log(temp);

      return {...state, FirstLevelWarning: temp};
    },
    setHelpCandidate(state, {payload}) {
      return {...state, HelpCandidate: JSON.parse(payload.data.data)};
    },
    setWarnQues(state, {payload}) {
      console.log(JSON.parse(payload.data.data));
      return {...state, WarnQues: JSON.parse(payload.data.data)};
    },
    setWarnDetail(state, {payload}) {
      return {...state, WarnDetail: JSON.parse(payload.data.data)};
    },

    setAllFailTests(state, {payload}) {
      return {...state, AllFailTests: JSON.parse(payload.data.data)};
    },
    setWarningStuDetail(state, {payload}) {
      return {...state, stuDetail: JSON.parse(payload.data.data)};
    },
    setMyHelpSemeWarn(state, {payload}) {
      return {
        ...state,
        helper: payload.data.data.helper,
        warner: payload.data.data.warner,
      };
    },
  },

  subscriptions: {},
};

export default Model;
