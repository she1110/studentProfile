import {
  add,
  addWorkFlow,
  checkUserCanTask,
  closeWorkFlow,
  createTask,
  downloadFile,
  getAll,
  getAllColumnType,
  getAllDataTableName,
  getAllOperation,
  getAllWfType,
  getAllWorkFlow,
  getFLowFlag,
  getMyUserTask,
  getOneTask,
  getWorkFlowByName,
  labeladd,
  lableget,
  moduleDel,
  openWorkFlow,
  updateTask,
} from '@/services/workFlow';
import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {isLoginExpired, isLoginStatus} from '@/utils/loginStatusChecker';

export type StateType = {
  roleList?: object[];
  workFlowList?: object[];
  columnTypeList?: object[];
  dataTableList?: object[];
  lableList?: object[];
  myWorkFlowlist?: object[];
  getOneTask?: object[];
  AllOperation?: object[];
  desktopworkflow?: object[];
  desktopcountersign?: object[];
  needDealList?: object[];
  doneList?: object[];
  copyList?: object[];
  indesktopworkflow?: object[];
  indesktopcountersign?: object[];
  wfTypeList?: object[];
  needDoneCopyList?: object[];
};
export type RoleType = {
  namespace: string;
  state: StateType;
  effects: {
    getAllWorkFlow: Effect;
    addWorkFlow: Effect;
    // getAllRole: Effect;
    getAllColumnType: Effect;
    getAllDataTableName: Effect;
    openWorkFlow: Effect;
    closeWorkFlow: Effect;
    getWorkFlowByName: Effect;
    checkUserCanTask: Effect;
    lableget: Effect;
    createTask: Effect;
    getMyUserTask: Effect;
    getOneTask: Effect;
    updateTask: Effect;
    getAllOperation: Effect;
    downloadFile: Effect;
    getAll: Effect;
    add: Effect;
    labeladd: Effect;
    getFLowFlag: Effect;
    getAllWfType: Effect;
    moduleDel: Effect;
  };
  reducers: {
    setWorkFlowList: Reducer<StateType>;
    setRoleList: Reducer<StateType>;
    setColumnTypeList: Reducer<StateType>;
    setDataTableList: Reducer<StateType>;
    setLableList: Reducer<StateType>;
    setMyWorkFlowlist: Reducer<StateType>;
    setGetOneTask: Reducer<StateType>;
    setAllOperation: Reducer<StateType>;
    setDesktopWorkFlow: Reducer<StateType>;
    setDesktopCounterSign: Reducer<StateType>;

    setNeedDealList: Reducer<StateType>;
    setDoneList: Reducer<StateType>;
    setCopyList: Reducer<StateType>;
    setInDesktopWorkFlow: Reducer<StateType>;
    setInDesktopCounterSign: Reducer<StateType>;
    setWfTypeList: Reducer<StateType>;
    setNeedDoneCopyList: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: RoleType = {
  namespace: 'workflow',
  state: {
    workFlowList: [], //工作流列表
    roleList: [], //角色列表
    columnTypeList: [], //输入框类型 列表
    dataTableList: [], //录入方式绑定数据 列表
    lableList: [], //lable 列表
    myWorkFlowlist: [], //我的流程 列表
    getOneTask: [], //流程实例getone 列表
    AllOperation: [], //审批操作列表  同意或拒绝
    desktopworkflow: [], //我的桌面 工作流列表
    desktopcountersign: [], //我的桌面 会签列表
    needDealList: [], //待办列表
    doneList: [], //已办列表
    copyList: [], //抄送列表
    needDoneCopyList: [], //待办已办抄送列表
    indesktopworkflow: [], //抽屉 工作流列表
    indesktopcountersign: [], //抽屉 会签列表
    wfTypeList: [], //工作流类别
  },
  effects: {
    * getAllWorkFlow({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(getAllWorkFlow, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        yield put({
          type: 'setWorkFlowList',
          payload: result,
        });
      } else {
        message.error('获取类别下的事务失败！！');
        return;
      }
    },
    * addWorkFlow({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(addWorkFlow, token, payload);
      if (isLoginExpired(result)) return;
    },
    * getAllColumnType({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(getAllColumnType, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        result.data.data.push({
          ID: '8',
          REMARK: '时间选择框',
          NAME: 'singledatepicker',
        });
        yield put({
          type: 'setColumnTypeList',
          payload: result,
        });
      } else {
        message.error('获取输入框类别失败！！！');
      }
    },
    * getAllDataTableName({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(getAllDataTableName, token, payload);
      if (isLoginExpired(result)) return;
      if (result) {
        yield put({
          type: 'setDataTableList',
          payload: result,
        });
      }
    },
    * openWorkFlow({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(openWorkFlow, token, payload);
      if (isLoginExpired(result)) return;
    },
    * closeWorkFlow({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(closeWorkFlow, token, payload);
      if (isLoginExpired(result)) return;
    },
    * getWorkFlowByName({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(getWorkFlowByName, token, payload);
      if (isLoginExpired(result)) return;
      if (result) {
        yield put({
          type: 'setWorkFlowList',
          payload: result,
        });
      }
    },
    * checkUserCanTask({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(checkUserCanTask, token, payload.workFlowId);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        payload.callback(result.data.data);
      } else {
        message.error('资格校验失败！！！');
        return;
      }
    },
    * lableget({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(lableget, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        yield put({
          type: 'setLableList',
          payload: result,
        });
      } else {
        message.error('获取信息源标签失败！！');
      }
    },
    * createTask({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(createTask, token, payload);
      if (isLoginExpired(result)) return;
    },
    * getMyUserTask({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(getMyUserTask, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        if (payload.state === '0') {
          yield put({
            type: 'setNeedDealList',
            payload: result,
          });
        } else if (payload.state === '1') {
          yield put({
            type: 'setDoneList',
            payload: result,
          });
        } else if (payload.state === '2') {
          yield put({
            type: 'setCopyList',
            payload: result,
          });
        } else {
          yield put({
            type: 'setNeedDoneCopyList',
            payload: result,
          });
        }
      } else {
        message.error('获取个人事务失败！！！');
      }
    },
    * getOneTask({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(getOneTask, token, payload.taskId);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        payload.callback(result.data.data);
        yield put({
          type: 'setGetOneTask',
          payload: result,
        });
      } else {
        message.error('获取事务失败！！！');
        return;
      }
    },
    * getAllOperation({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(getAllOperation, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        yield put({
          type: 'setAllOperation',
          payload: result,
        });
      } else {
        message.error('获取操作类型失败 ！！');
      }
    },
    * updateTask({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(updateTask, token, payload);
      if (isLoginExpired(result)) return;
    },
    * downloadFile({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(downloadFile, token, payload);
      if (isLoginExpired(result)) return;
    },
    * getAll({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(getAll, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        if (payload.flowType === '0') {
          yield put({
            type: 'setDesktopWorkFlow',
            payload: result,
          });
        }
        if (payload.flowType === '1') {
          yield put({
            type: 'setDesktopCounterSign',
            payload: result,
          });
        }
      } else {
        message.error('获取事务桌面失败！！！');
        return;
      }
    },
    * add({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(add, token, payload);
    },
    * labeladd({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(labeladd, token, payload);
      if (isLoginExpired(result)) return;
    },

    * getFLowFlag({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(getFLowFlag, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        if (payload.type === '0') {
          yield put({
            type: 'setInDesktopWorkFlow',
            payload: result,
          });
        }
        if (payload.type === '1') {
          yield put({
            type: 'setInDesktopCounterSign',
            payload: result,
          });
        }
      } else {
        message.error('获取类别下的事务 失败！！！');
        return;
      }
    },
    * getAllWfType({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(getAllWfType, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        yield put({
          type: 'setWfTypeList',
          payload: result,
        });
      } else {
        message.error('获取事务类别失败！！！');
        return;
      }
    },

    * moduleDel({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(moduleDel, token, payload);
      if (isLoginExpired(result)) return;
    },
  },
  reducers: {
    setWorkFlowList(state, {payload}) {
      return {...state, workFlowList: payload.data.data};
    },
    setRoleList(state, {payload}) {
      return {...state, roleList: payload.data};
    },
    setColumnTypeList(state, {payload}) {
      return {...state, columnTypeList: payload.data.data};
    },
    setDataTableList(state, {payload}) {
      return {...state, dataTableList: payload.data.data};
    },
    setLableList(state, {payload}) {
      return {...state, lableList: payload.data.data};
    },
    setMyWorkFlowlist(state, {payload}) {
      return {...state, myWorkFlowlist: payload.data.data};
    },
    setGetOneTask(state, {payload}) {
      return {...state, getOneTask: payload.data.data};
    },
    setAllOperation(state, {payload}) {
      return {...state, AllOperation: payload.data.data};
    },
    setDesktopWorkFlow(state, {payload}) {
      return {...state, desktopworkflow: payload.data.data};
    },
    setDesktopCounterSign(state, {payload}) {
      return {...state, desktopcountersign: payload.data.data};
    },
    setNeedDealList(state, {payload}) {
      return {...state, needDealList: payload.data.data};
    },
    setDoneList(state, {payload}) {
      return {...state, doneList: payload.data.data};
    },
    setCopyList(state, {payload}) {
      return {...state, copyList: payload.data.data};
    },
    setInDesktopWorkFlow(state, {payload}) {
      return {...state, indesktopworkflow: payload.data.data};
    },
    setInDesktopCounterSign(state, {payload}) {
      return {...state, indesktopcountersign: payload.data.data};
    },
    setWfTypeList(state, {payload}) {
      return {...state, wfTypeList: payload.data.data};
    },
    setNeedDoneCopyList(state, {payload}) {
      return {...state, needDoneCopyList: payload.data.data};
    },
  },
  subscriptions: {},
};
export default Model;
