import {
  addTag,
  deleteTrainPlan,
  dormAndClassProfile,
  downloadFile,
  DownloadReport,
  getAllCourseByTrain,
  getAllTagByCourse,
  getDataByGpaAndFive,
  getGrade,
  getScatterPicture,
  getStackData,
  getTrainPlan,
  identifyDataInProfile,
  personalProfile,
  sendReportMail,
  sendReportMail2,
  submitTrainPlan,
  updateCourseTag,
} from '@/services/TrainingPlan';
import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {isLoginExpired, isLoginStatus} from '@/utils/loginStatusChecker';

export type StateType = {
  trainPlanList?: object[]; //培养计划列表
  courseInPlan?: object[]; //培养计划的课程列表
  studentReport?: {
    baseInfo?: object; //学生基本属性
    examDataMap?: object; //第一课堂数据
    activityData?: object; //第二课堂数据
    gpaTrend?: object; //gpa曲线数据
    fiveStar?: object; //雷达图数据
  };
  courseAllTag?: object[]; //课程绑定的所有标签
  dormitoryReport?: any; //宿舍报表
  classReport?: any; //班级报表
  gradeReport?: any; //年级报表
  stackData?: any; //堆叠图数据
  gpa5yuData?: any; //gpa5yu专题 数据
  ScatterData?: any; //散点图 数据
  identifyDataInProfileData?: any; //散点图 数据
};
export type TrainingPlanType = {
  namespace: string;
  state: StateType;
  effects: {
    submitTrainPlan: Effect;
    getTrainPlan: Effect;
    deleteTrainPlan: Effect;
    getAllCourseByTrain: Effect;
    getAllTagByCourse: Effect;
    addTag: Effect;
    personalProfile: Effect;
    updateCourseTag: Effect;
    dormAndClassProfile: Effect;
    sendReportMail: Effect;
    sendReportMail2: Effect;
    DownloadReport: Effect;
    getGrade: Effect;
    getStackData: Effect;
    getDataByGpaAndFive: Effect;
    getScatterPicture: Effect;
    identifyDataInProfile: Effect;
  };
  reducers: {
    setTrainPlanList: Reducer<StateType>;
    setCourseInPlan: Reducer<StateType>;
    setStudentReport: Reducer<StateType>;
    setCourseAllTag: Reducer<StateType>;
    setDormitoryReport: Reducer<StateType>;
    setClassReport: Reducer<StateType>;
    setGradeReport: Reducer<StateType>;
    setStackData: Reducer<StateType>;
    setgpa5yuData: Reducer<StateType>;
    setScatterData: Reducer<StateType>;
    setIdentifyDataInProfile: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: TrainingPlanType = {
  namespace: 'trainingplan',
  state: {
    trainPlanList: [], //培养计划列表
    courseInPlan: [], //某个培养计划里所有的课程

    gradeReport: undefined, //年级报表
    stackData: undefined, //堆叠图数据
    gpa5yuData: undefined, //堆叠图数据

    identifyDataInProfileData: undefined, //四种奖学金助学金数据
  },
  effects: {
    * submitTrainPlan({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(submitTrainPlan, token, payload);
      if (isLoginExpired(result)) return;
      // console.log(result);
    },
    * getTrainPlan({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(getTrainPlan, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        yield put({
          type: 'setTrainPlanList',
          payload: result.data.data,
        });
      } else {
        message.error('获取培养计划失败！！');
      }
    },
    * deleteTrainPlan({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(deleteTrainPlan, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200 && result.data.data === true) {
        message.success('删除培养计划成功！！');
      } else {
        message.error('删除培养计划失败！！');
      }
    },
    * getAllCourseByTrain({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(getAllCourseByTrain, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        yield put({
          type: 'setCourseInPlan',
          payload: result.data.data,
        });
      } else {
        message.error('获取培养计划课程失败！！');
      }
    },
    * getAllTagByCourse({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(getAllTagByCourse, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        yield put({
          type: 'setCourseAllTag',
          payload: result.data.data,
        });
      } else {
        message.error('获取课程标签失败！！');
      }
    },
    * addTag({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(addTag, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200 && result.data.data === true) {
        message.success('课程标签新建成功！！');
      } else {
        message.error('课程标签新建失败！！');
      }
    },
    * personalProfile({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(personalProfile, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        // console.log(result.data.data);
        // console.log(JSON.parse(result.data.data));
        yield put({
          type: 'setStudentReport',
          payload: JSON.parse(result.data.data),
        });
      } else {
        message.error('获取学生报告失败！！');
      }
    },
    * updateCourseTag({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(updateCourseTag, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200 && result.data.data === true) {
        if (payload.type === '1') {
          message.success('标签添加成功！！！');
        }
        if (payload.type === '0') {
          message.success('标签删除成功！！！');
        }
      } else {
        if (payload.type === '1') {
          message.error('标签添加失败！！！');
        }
        if (payload.type === '0') {
          message.error('标签删除失败！！！');
        }
      }
    },
    * dormAndClassProfile({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(dormAndClassProfile, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        if (payload.type === 'dormitory') {
          yield put({
            type: 'setDormitoryReport',
            payload: JSON.parse(result.data.data),
          });
        }
        if (payload.type === 'classid') {
          yield put({
            type: 'setClassReport',
            payload: JSON.parse(result.data.data),
          });
        }
      }
    },
    * sendReportMail({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(sendReportMail, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200 && result.data.data === true) {
        message.success('邮件已发送到指定邮箱！！');
      } else {
        message.error('邮件发送失败 请联系管理员！！');
      }
    },
    //虽然是接口2但是services调用的是接口3  测试 json加文件
    * sendReportMail2({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(sendReportMail2, token, payload);
    },

    * DownloadReport({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(DownloadReport, token, payload);
      if (result.data.code === 200) {
        const response = yield call(downloadFile, token, {
          fileName: result.data.data,
        });
        if (response !== 0) {
          message.error('下载失败！！！！！');
        }
      }
      if (result.data.code === 200) {
        message.success('下载成功！！！！');
      } else {
        message.error('下载失败！！！！！');
      }
    },

    * getGrade({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(getGrade, token, payload);

      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        yield put({
          type: 'setGradeReport',
          payload: result.data.data,
        });
      } else {
        message.error('课程标签新建失败！！');
      }
    },

    * getStackData({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(getStackData, token, payload);
      console.log(result);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        yield put({
          type: 'setStackData',
          payload: result.data.data,
        });
      } else {
        message.error('获取堆叠图数据失败！！');
      }
    },

    * getDataByGpaAndFive({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(getDataByGpaAndFive, token, payload);
      console.log(result);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        yield put({
          type: 'setgpa5yuData',
          payload: result.data.data,
        });
      } else {
        message.error('获取学生列表失败！！');
      }
    },

    * getScatterPicture({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(getScatterPicture, token, payload);
      console.log(result);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        yield put({
          type: 'setScatterData',
          payload: result.data.data,
        });
      } else {
        message.error('获取学生列表失败！！');
      }
    },
    * identifyDataInProfile({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(identifyDataInProfile, token, payload);
      console.log(result);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        yield put({
          type: 'setIdentifyDataInProfile',
          payload: result.data.data,
        });
      } else {
        message.error('获取学生列表失败！！');
      }
    },
  },
  reducers: {
    setTrainPlanList(state, {payload}) {
      return {...state, trainPlanList: payload};
    },
    setCourseInPlan(state, {payload}) {
      return {...state, courseInPlan: payload};
    },
    setStudentReport(state, {payload}) {
      return {...state, studentReport: payload};
    },
    setCourseAllTag(state, {payload}) {
      return {...state, courseAllTag: payload};
    },
    setDormitoryReport(state, {payload}) {
      if (payload && payload.stus) {
        payload.stus.map((element: any, index: any) => {
          element.key = element.userid;
        });
      }
      return {...state, dormitoryReport: payload};
    },
    setClassReport(state, {payload}) {
      if (payload && payload.stus) {
        payload.stus.map((element: any, index: any) => {
          element.key = element.userid;
        });
      }
      if (payload && payload.dormitoryInfo) {
        payload.dormitoryInfo.map((element: any, index: any) => {
          element.key = element.DORMITORY;
        });
      }
      return {...state, classReport: payload};
    },

    setGradeReport(state, {payload}) {
      payload.gradeClassData.map((element: any, index: any) => {
        element.key = element.classId;
      });
      return {...state, gradeReport: payload};
    },
    setStackData(state, {payload}) {
      console.log(JSON.parse(payload));

      return {...state, stackData: JSON.parse(payload)};
    },
    setgpa5yuData(state, {payload}) {
      return {...state, gpa5yuData: JSON.parse(payload)};
    },
    setScatterData(state, {payload}) {
      return {...state, ScatterData: JSON.parse(payload)};
    },
    setIdentifyDataInProfile(state, {payload}) {
      return {...state, identifyDataInProfileData: payload};
    },
  },
  subscriptions: {},
};
export default Model;
