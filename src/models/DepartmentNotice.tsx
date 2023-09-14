import {
  addTemplate,
  answerQuestion,
  askQuestion,
  changeNoticeState,
  delNotice,
  getAllClassAndTemplate,
  getAllStuNotice,
  getAllTeacherNotice,
  getOneTemplate,
  leaderSendMail,
  noticeStuTree,
  publishNotice,
  updateTemplate,
} from '@/services/DepartmentNotice';
import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {isLoginExpired} from '@/utils/loginStatusChecker';

export type StateType = {
  noticestutree?: any;
  teachernoticelist?: any;
  stunoticelist?: any;
  classandtemplate?: any;
  onetemplate?: any;
};

export type DepartmentNoticeModelType = {
  namespace: string;
  state: StateType;
  effects: {
    noticeStuTree: Effect;
    publishNotice: Effect;
    getAllTeacherNotice: Effect;
    getAllStuNotice: Effect;
    changeNoticeState: Effect;
    askQuestion: Effect;
    answerQuestion: Effect;
    delNotice: Effect;
    leaderSendMail: Effect;
    addTemplate: Effect;
    getAllClassAndTemplate: Effect;
    getOneTemplate: Effect;
    updateTemplate: Effect;
  };
  reducers: {
    setNoticeStuTree: Reducer<StateType>;
    setTeacherNoticeList: Reducer<StateType>;
    setStuNoticeList: Reducer<StateType>;
    setClassAndTemplate: Reducer<StateType>;
    setOneTemplate: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: DepartmentNoticeModelType = {
  namespace: 'departmentnotice',
  state: {
    noticestutree: undefined, //院系通知 目标人群的树
    teachernoticelist: undefined, //老师的通知列表
    stunoticelist: undefined, //学生的通知列表
    classandtemplate: undefined, //班级和全部模板
  },
  effects: {
    * noticeStuTree({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(noticeStuTree, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setNoticeStuTree',
          payload: response.data.data,
        });
      } else {
        message.error('获取院系目标人群树结构失败！！！！！');
        return;
      }
    },
    * publishNotice({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(publishNotice, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        message.success('发布院校通知成功！！！！！');
      } else {
        message.error('发布院校通知失败！！！！！');
        return;
      }
    },
    * getAllTeacherNotice({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getAllTeacherNotice, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setTeacherNoticeList',
          payload: response.data.data,
        });
      } else {
        message.error('获取老师通知列表失败！！！！！');
        return;
      }
    },
    * getAllStuNotice({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getAllStuNotice, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setStuNoticeList',
          payload: response.data.data,
        });
      } else {
        message.error('获取学生通知列表失败！！！！！');
        return;
      }
    },
    * changeNoticeState({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(changeNoticeState, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        message.success('已阅读通知且无疑问！！');
      } else {
        message.error('确认通知失败！！');
        return;
      }
    },
    * askQuestion({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(askQuestion, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        message.success('问题发送成功！！！！！');
      } else {
        message.error('问题发送失败！！！！！');
        return;
      }
    },
    * answerQuestion({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(answerQuestion, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('解答疑问成功！！！！！');
      } else {
        message.error('解答疑问失败！！！！！');
        return;
      }
    },
    * delNotice({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(delNotice, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('删除通知成功！！');
      } else {
        message.error('删除通知失败！！！');
        return;
      }
    },
    * leaderSendMail({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(leaderSendMail, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('已通知老师！！');
      } else {
        message.error('通知失败！！！');
        return;
      }
    },
    * addTemplate({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(addTemplate, token, payload);
      console.log(response);

      // if (isLoginExpired(response)) return;
      // if (response.data.code === 200 && response.data.data === true) {
      //   message.success('已通知老师！！');
      // } else {
      //   message.error('通知失败！！！');
      //   return;
      // }
    },
    * getAllClassAndTemplate({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getAllClassAndTemplate, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setClassAndTemplate',
          payload: response.data.data,
        });
      } else {
        message.error('获取分组模板失败！！！');
        return;
      }
    },
    * getOneTemplate({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getOneTemplate, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setOneTemplate',
          payload: response.data.data,
        });
      } else {
        message.error('获取分组模板失败！！！');
        return;
      }
    },
    * updateTemplate({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(updateTemplate, token, payload);
      // if (isLoginExpired(response)) return;
      // if (response.data.code === 200) {
      //   yield put({
      //     type: 'setOneTemplate',
      //     payload: response.data.data,
      //   });
      // } else {
      //   message.error('获取分组模板失败！！！');
      //   return;
      // }
    },
  },

  reducers: {
    setNoticeStuTree(state, {payload}) {
      return {...state, noticestutree: payload};
    },
    setTeacherNoticeList(state, {payload}) {
      payload.map((element: any, index: any) => {
        let unProblemNumberTemp: any = 0;
        element.taskQuestions.map((elementsub: any, indexsub: any) => {
          if (elementsub.states === 0) {
            unProblemNumberTemp = unProblemNumberTemp + 1;
          }
        });
        element.unProblemNumber = unProblemNumberTemp;
      });
      return {...state, teachernoticelist: payload};
    },
    setStuNoticeList(state, {payload}) {
      return {...state, stunoticelist: payload};
    },
    setClassAndTemplate(state, {payload}) {
      return {...state, classandtemplate: payload};
    },
    setOneTemplate(state, {payload}) {
      return {...state, onetemplate: payload};
    },
  },
  subscriptions: {},
};
export default Model;
