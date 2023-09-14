import { submitGraduationSurvey, submitGraduationSurveyChange, getGraduationIntentionReport, getPersonalGraduationIntentionReport, downloadReport } from '@/services/GraduationSurvey';
import type { Effect, Reducer } from 'umi';
import { isLoginExpired, isLoginStatus } from "@/utils/loginStatusChecker";
import { message } from "antd";

export type StateType = {
  graduationSurveyStudentType?: any[];
  graduationSurveyStudentChange?: any[];
  graduationIntentionReportType?: any;
  personalGraduationIntentionReportType?: any[];
};
export type GraduationSurveyStudentType = {
  namespace: string;
  state: StateType;
  effects: {
    graduationSurveyStudent: Effect,
    graduationSurveyStudentChange: Effect,
    getGraduationIntentionReport: Effect,
    getPersonalGraduationIntentionReport: Effect
    downloadReport: Effect,
  };
  reducers: {
    setGraduationSurveyStudent: Reducer<StateType>;
    setGraduationIntentionReport: Reducer<StateType>;
  };
  subscriptions: {};
};
const Model: GraduationSurveyStudentType = {
  namespace: 'graduationsurvey',
  state: {
    graduationSurveyStudentType: [],
    graduationSurveyStudentChange: [],
    graduationIntentionReportType: [],
    personalGraduationIntentionReportType: []
  },
  effects: {
    //上传学生报表
    * graduationSurveyStudent({ payload }: any, { call, put }: any) {
      console.log("进入")
      let token = localStorage.getItem('token');
      const result = yield call(submitGraduationSurvey, token, payload.values);
      console.log("出来")
      if (result.data.code === 200) {
        console.log("毕业学生意向调查上传成功")
        message.success("毕业学生意向调查上传成功")
      } else {
        message.error("请勿重复提交")
      }
    },
    //上传更改的学生报表
    *graduationSurveyStudentChange({ payload }: any, { call, put }: any) {
      console.log("进入")
      console.log(payload.giKeyVo )
      console.log(payload.gisai )
      let list=
        {
          giKeyVo:payload.giKeyVo,
          gisai:payload.gisai,
        }

      console.log(list)
      let token = localStorage.getItem('token');
      const result = yield call(submitGraduationSurveyChange, token,list );
      console.log("出来")
      if (result.data.code === 200) {
        console.log("毕业学生意向调查上传成功")
        message.success("毕业学生意向调查上传成功")
      } else {
        message.error("请勿重复提交")
      }
    },
    //获取全部学生最新报表（未改）
    * getGraduationIntentionReport({ payload }: any, { call, put }: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(getGraduationIntentionReport, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        payload.callback((result.data.data));
      }
    },
    //获取学生个人报表
    * getPersonalGraduationIntentionReport({ payload }: any, { call, put }: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      console.log('个人报表' + payload.stuId)
      const result = yield call(getPersonalGraduationIntentionReport, token, payload.stuId);
      console.log(result)
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        console.log(result.data.data)
        payload.callback((result.data.data));
      }
      // const result =[{
      //   stuId: '2020066',
      //   majorId: undefined,
      //   intentionId: '1',
      //   intentionSecId: '2',
      //   intentionCity: '北京市/北京市',
      //   abroadSchool: undefined,
      //   abroadState: undefined,
      //   country: undefined,
      //   intentionSalary: '3',
      //   major: undefined,
      //   postgraduateSchool: undefined,
      //   postgraduateState: undefined,
      //   publicState: undefined,
      //   reason: undefined,
      //   schoolType: undefined,
      //   updateTime: "2022-10-01 16:48:50"
      // },{
      //   stuId: '2020066',
      //   majorId: undefined,
      //   intentionId: '1',
      //   intentionSecId:'1',
      //   intentionCity: '天津市/天津市',
      //   abroadSchool: undefined,
      //   abroadState: undefined,
      //   country: undefined,
      //   intentionSalary: '1',
      //   major: undefined,
      //   postgraduateSchool: undefined,
      //   postgraduateState: undefined,
      //   publicState: undefined,
      //   reason: undefined,
      //   schoolType: undefined,
      //   updateTime: "2022-11-04 16:48:50"
      // }]
      // payload.callback(result)
    },
    //下载学生报表
    * downloadReport({ payload }: any, { call, put }: any) : Generator {
      console.log("downloadReport")
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(downloadReport, token, payload.value);
      // if (result.data.code === 200) {
      //   console.log("下载成功")
      //   message.success("下载成功")
      // }
    },
  },
  reducers: {
    setGraduationSurveyStudent(state, { payload }) {
      return { ...state, graduationSurveyStudentType: payload };
    },
    setGraduationIntentionReport(state, { payload }) {
      return { ...state, graduationIntentionReportType: payload };
    },
  },
  subscriptions: {}
};

export default Model;
