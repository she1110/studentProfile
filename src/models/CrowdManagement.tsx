//import {submitGraduationSurvey,getGraduationIntentionReport,downloadReport} from '@/services/GraduationSurvey';
import type {Effect, Reducer} from 'umi';
import {message} from "antd";
import {dashBoardListType} from "@/pages/SystemManagement/CrowdManagement/components/ResponsibilityManageWindow";
import {
  addDashBoardToTeacher,
  deleteDashBoardHaveIn,
  getDashBoardHaveInList,
  getDashBoardList,
  getRoleListByTeacherId,
  getTeacherList
} from "@/services/CrowdManagement";
import {isLoginStatus} from "@/utils/loginStatusChecker";

export type StateType = {
};
export type CrowdManagementType = {
  namespace: string;
  state: StateType;
  effects: {
    getDashBoardListFromServices: Effect,
    getTeacherListFromServices: Effect,
    getDashBoardHaveInListFromServices: Effect,
    getRoleListByTeacherIdFromServices: Effect,
    deleteDashBoardHaveInFromServices: Effect,
    addDashBoardToTeacherFromServices: Effect,
  };
  reducers: {
  };
  subscriptions: {};
};
const Model: CrowdManagementType = {
  namespace: 'Model_CrowdManagementType',
  state: {
    dashBoardList: [],
    teacherList: [],
  },
  effects: {
    *getDashBoardListFromServices({payload}: any, {call, put}: any): Generator{//: Generator解决yield报红
      console.log("getDashBoardListFromServices")
      let token = localStorage.getItem('token');
      const result:any = yield call(getDashBoardList,token,payload.value);
      payload.callback(result.data.data)
    },
    *getDashBoardHaveInListFromServices({payload}: any, {call, put}: any): Generator{//: Generator解决yield报红
      console.log("getDashBoardHaveInListFromServices")
      let token = localStorage.getItem('token');
      const result:any = yield call(getDashBoardHaveInList,token,payload.value);
      payload.callback(result.data.data)
    },
    *getTeacherListFromServices({payload}: any, {call, put}: any): Generator{//: Generator解决yield报红
      console.log(payload.value)
      let token = localStorage.getItem('token');
      const result:any = yield call(getTeacherList,token,payload.value);
      const list = result.data.data;
      for (let i = 0; i < list.length; i++) {
        list[i].key = list[i].accountId
      }
      console.log(list)
      payload.callback(list)
      },
    *getRoleListByTeacherIdFromServices({payload}: any, {call, put}: any): Generator{//: Generator解决yield报红
      console.log("getRoleListByTeacherIdFromServices")
      let token = localStorage.getItem('token');
      const result:any = yield call(getRoleListByTeacherId,token,payload.value);
      const list:any = [];
      for (let i = 0; i < result.data.data.length; i++) {
        let item = {
          value : "",
          label : ""
        }
        item.value = result.data.data[i].roleId
        item.label = result.data.data[i].roleName
        list.push(item)
      }
      payload.callback(list)

    },
    *deleteDashBoardHaveInFromServices({payload}: any, {call, put}: any): Generator{//: Generator解决yield报红
      console.log('deleteDashBoardHaveInFromServices')
      let token = localStorage.getItem('token');
      const result:any = yield call(deleteDashBoardHaveIn,token,payload.value);
      if (result.data.code === 200) {
        message.success('成功删除分群！！！');
      } else {
        message.error('删除分群失败！！！');
      }
    },
    *addDashBoardToTeacherFromServices({payload}: any, {call, put}: any):Generator{//: Generator解决yield报红
      console.log('addDashBoardToTeacherFromServices')
      let token = localStorage.getItem('token');
      const result:any = yield call(addDashBoardToTeacher,token,payload.value);
      if (result.data.code === 200) {
        message.success('成功添加分群！！！');
      } else {
        message.error('添加分群失败！！！');
      }
    },
  },
  reducers: {

  },
  subscriptions: {}
};


export default Model;
