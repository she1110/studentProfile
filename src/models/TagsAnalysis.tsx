import {
  getAllClassInfo,
  getAllCourseInfo,
  getAllDorInfo,
  getAllStuInfo,
  getAllTagInfo,
  getCreateTags,
  getDelTag,
  getentityAddTag,
  getFindClassInfo,
  getFindCourseInfo,
  getFindDorInfo,
  getFindStuInfo,
  getLike,
  getPoint,
} from '@/services/TagsAnalysis';

import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {isLoginExpired, isLoginStatus} from '@/utils/loginStatusChecker';

export type StateType = {
  allCourseInfo?: object[]; //课程信息-标签列表
  allTagInfo?: object[]; //所有标签信息
  allStuInfo?: object[]; //学生信息
  allDorInfo?: object[]; //宿舍信息
  allPointInfo?: object[]; //积分信息
  allClassInfo?: object[]; //班级信息
};

export type ActivityType = {
  namespace: string;
  state: StateType;
  effects: {
    getAllCourseInfo: Effect;
    getCreateTags: Effect;
    getentityAddTag: Effect;
    getAllTagInfo: Effect;
    getAllStuInfo: Effect;
    getAllDorInfo: Effect;
    getFindCourseInfo: Effect;
    getDelTag: Effect;
    getPoint: Effect;
    getFindStuInfo: Effect;
    getFindDorInfo: Effect;
    getAllClassInfo: Effect;
    getFindClassInfo: Effect;
    getLike: Effect;
  };
  reducers: {
    setAllCourseInfo: Reducer<StateType>;
    setAllTagInfo: Reducer<StateType>;
    setFindCourseInfo: Reducer<StateType>;
    setAllStuInfo: Reducer<StateType>;
    setAllDorInfo: Reducer<StateType>;
    setPointInfo: Reducer<StateType>;
    setClassInfo: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: ActivityType = {
  namespace: 'tags',
  state: {
    allCourseInfo: [], //软件著作权信息列表
  },
  effects: {
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
    * getAllCourseInfo({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getAllCourseInfo, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        // console.log(response.data.data);
        yield put({
          type: 'setAllCourseInfo',
          payload: response,
        });
      }
    },
    * getFindCourseInfo({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getFindCourseInfo, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        // console.log(response.data.data);
        yield put({
          type: 'setFindCourseInfo',
          payload: response,
        });
      }
    },
    * getCreateTags({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getCreateTags, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        // payload.callback(response.data.msg);
        message.success('添加成功');
      }
    },
    * getentityAddTag({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getentityAddTag, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        message.success('更新活动成功！！！！');
      }
    },
    * getAllTagInfo({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getAllTagInfo, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        // console.log(response.data.data);
        yield put({
          type: 'setAllTagInfo',
          payload: response,
        });
      }
    },
    * getAllStuInfo({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getAllStuInfo, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        // console.log(response.data.data);
        yield put({
          type: 'setAllStuInfo',
          payload: response,
        });
      }
    },
    * getAllDorInfo({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getAllDorInfo, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        // console.log(response.data.data);
        yield put({
          type: 'setAllDorInfo',
          payload: response,
        });
      }
    },
    * getDelTag({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getDelTag, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
      }
    },
    * getPoint({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getPoint, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setPointInfo',
          payload: response,
        });
      }
    },
    * getFindStuInfo({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getFindStuInfo, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setAllStuInfo',
          payload: response,
        });
      }
    },
    * getFindDorInfo({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getFindDorInfo, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setAllDorInfo',
          payload: response,
        });
      }
    },
    * getAllClassInfo({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getAllClassInfo, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setClassInfo',
          payload: response,
        });
      }
    },
    * getFindClassInfo({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getFindClassInfo, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setClassInfo',
          payload: response,
        });
      }
    },
  },
  reducers: {
    setAllCourseInfo(state, {payload}) {
      return {...state, allCourseInfo: payload.data.data};
    },
    setFindCourseInfo(state, {payload}) {
      return {...state, allCourseInfo: payload.data.data};
    },
    setAllTagInfo(state, {payload}) {
      return {...state, allTagInfo: payload.data.data};
    },
    setAllStuInfo(state, {payload}) {
      return {...state, allStuInfo: payload.data.data};
    },
    setAllDorInfo(state, {payload}) {
      return {...state, allDorInfo: payload.data.data};
    },
    setPointInfo(state, {payload}) {
      return {...state, allPointInfo: payload.data.data};
    },
    setClassInfo(state, {payload}) {
      return {...state, allClassInfo: payload.data.data};
    },
  },
  subscriptions: {},
};

export default Model;
