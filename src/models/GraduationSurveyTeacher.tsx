import { Reducer, Effect, Subscription } from "umi";
import { getRoleListByTeacherId } from "@/services/CrowdManagement";
import {
  getColumnList,
  getDimensionDataList,
  getLineData,
  getPieData,
  getStudentData,
  getStudentListData,
} from "@/services/GraduationSurvey";
/*
-----------------------------------------------------------------------------------------------------------------
本model用来演示简便的流程，即不通过reducers和state仓库直接在effects中返回
①组件连接仓库；
②组件通过connect连接后给组件自动传的参数dispatch访问仓库中的异步函数effects；
③effects获取到数据后调用callBack回调函数返回数据
④组件通过callback获取回调数据
-----------------------------------------------------------------------------------------------------------------
 */


/*
-----------------------------------------------------------------------------------------------------------------
ts规范：对变量进行声明
 */
//对state声明，state用于仓库存储数据，也就是说state就是仓库
export type StateType = {
  accountId?: any;
  currentRoleId?: any;
  dimensionDataList?: any;//通过教师角色获取的各个维度的信息
  columnDataList?: any;//叠状图数据
  pieDataList?: any;//饼状图数据
  intentionData?: any;//毕业意向数据
  studentList?: any;
};
//对model声明
export type GraduationSurveyTeacherModelType = {
  namespace: string;
  state: StateType;
  effects: {
    getRoleListByTeacherIdFromServices: Effect;
    getColumnListFromServices: Effect;
    getStudentListFromSerices: Effect;
    getDimensionDataListFromSerices: Effect;
    getLineDataFromSerices: Effect;
    getPieDataFromSerices: Effect;
    getStudentFromSerices:Effect;
  };
  reducers: {
    setAccountIdReducer: Reducer;
    setCurrentRoleIdReducer: Reducer;
    setcolumnDataListReducer: Reducer;
    setStudentListReducer: Reducer;
    setDimensionDataListReducer: Reducer;
    setIntentionData: Reducer;
  };
  subscriptions: {
  }
};
/*
ts规范：对变量进行声明
-----------------------------------------------------------------------------------------------------------------
 */

/*
-----------------------------------------------------------------------------------------------------------------
model结构：namespace，state（仓库，用来存储数据），
effects异步处理，reducers同步操作（用于接收effects的结果并存到state中），subscription订阅（用于监听页面的跳转）
state变化后，连接此model的组件所接收到的参数会自动渲染
 */
const GraduationSurveyTeacherModel: GraduationSurveyTeacherModelType = {
  //本model唯一标识，命名标准：不能有'-'，可以有'_'，可以有大写
  //个人标准：以后都以'Model_'开头
  namespace: 'Model_GraduationSurveyTeacherModel',//Model_ExampleModel里面存的是state
  state: {
    accountId: '',
    currentRoleId: '',
    columnDataList: [],
    dimensionDataList: [],
    intentionData: [],
    studentList: [],
  },
  //命名规范（个人）：函数功能+FromServices+Effects
  effects: {
    *getRoleListByTeacherIdFromServices({ payload }: any, { call, put }: any): Generator {//: Generator解决yield报红
      console.log("getRoleListByTeacherIdFromServices")
      let token = localStorage.getItem('token');
      const result: any = yield call(getRoleListByTeacherId, token, payload.value);
      const list: any = [];
      for (let i = 0; i < result.data.data.length; i++) {
        let item = {
          value: "",
          label: ""
        }
        item.value = result.data.data[i].roleId
        item.label = result.data.data[i].roleName
        list.push(item)
      }
      payload.callback(list)
    },
    *getColumnListFromServices({ payload }: any, { call, put }: any): Generator {//: Generator解决yield报红
      console.log("getColumnListFromServices")
      console.log(payload)
      let token = localStorage.getItem('token');
      const result: any = yield call(getColumnList, token, payload.value);
      yield put({
        type: 'setcolumnDataListReducer',
        payload: result.data.data,
      });
    },
    *getStudentListFromSerices({ payload }: any, { call, put }: any): Generator {
      console.log("getStudentListFromSerices")
      //console.log(payload)
      let token = localStorage.getItem('token');
      let list = ([
        {
          key:'181418',
          studentName:'佘甲帅',
          studentId:'181418',
          studentClass:'计183',
          studentMajor:'计算机科学与技术专业'
        },
        {
          key:'185853',
          studentName:'周佳丽',
          studentId:'185853',
          studentClass:'计181',
          studentMajor:'计算机科学与技术专业'
         }
       ])
      const result: any = yield call(getStudentListData, token, payload.value);
      //console.log(result)
      yield put({
        type: 'setStudentListReducer',
        payload: result.data.data,
      });

    },
    *getStudentFromSerices({ payload }: any, { call, put }: any): Generator {
    console.log("getStudentFromSerices")
    let token = localStorage.getItem('token');
    const result: any = yield call(getStudentData, token, payload.value);
     console.log(result);
    payload.callback(result.data.data)
  },
    *getDimensionDataListFromSerices({ payload }: any, { call, put }: any): Generator {
      console.log("getDimensionDataListFromSerices")
      let token = localStorage.getItem('token');
      const result: any = yield call(getDimensionDataList, token, payload.value);
      yield put({
        type: 'setDimensionDataListReducer',
        payload: result.data.data,
      });
    },
    *getLineDataFromSerices({ payload }: any, { call, put }: any): Generator {
      console.log("getLineDataFromSerices")
      let token = localStorage.getItem('token');
      const result: any = yield call(getLineData, token, payload.value);
      payload.callback(result.data.data)
    },
    *getPieDataFromSerices({ payload }: any, { call, put }: any): Generator {
      console.log("getPieDataFromSerices")
      let token = localStorage.getItem('token');
      const result: any = yield call(getPieData, token, payload.value);
      payload.callback(result.data.data)
    },
  },
  //命名规范（个人）：函数功能+Reducers
  reducers: {
    setAccountIdReducer(state, { payload }) {
      return { ...state, accountId: payload.value };
    },
    setCurrentRoleIdReducer(state, { payload }) {
      return { ...state, currentRoleId: payload.value };
    },
    setcolumnDataListReducer(state, { payload }) {
      console.log(payload)
      return { ...state, columnDataList: payload };
    },
    setStudentListReducer(state, { payload }) {
      console.log(payload)
      return { ...state, studentList: payload };
    },
    setDimensionDataListReducer(state, { payload }) {
      console.log(payload)
      return { ...state, dimensionDataList: payload };
    },
    setIntentionData(state, { payload }) {
      let list = [
        {value: "1",label:"找工作"},
        {value: "2",label:"出国留学"},
        {value: "3",label:"考公"},
        {value: "4",label:"灵活就业"},
        {value: "5",label:"考研"},
        {value: "6",label:"应征入伍"},
        {value: "7",label:"自主创业"},
        {value: "8",label:"迷茫"},
      ]
      return { ...state, intentionData: list };
    }
  },

  subscriptions: {
  }
};
/*
model结构
-----------------------------------------------------------------------------------------------------------------
 */


export default GraduationSurveyTeacherModel;
