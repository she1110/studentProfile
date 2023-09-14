/*
reducer配置
 */
import {
  changePassword,
  getAll,
  getAllLog,
  getAllUser,
  getBaseInfo,
  getcurrentuserinfo,
  getHullTree,
  getOneUserByAccount,
  getTreeByFlow,
  getTreeByRole,
  login,
  logout,
  userAdd,
  userchange,
  userDelete,
  usersearch,
  userupdate,
  checkMail,
  loginEmail
} from '@/services/User';
import {message} from 'antd';
import {isLoginExpired, isLoginStatus} from '@/utils/loginStatusChecker';
import type {Effect, Reducer} from 'umi';
import {history} from 'umi';

export type StateType = {
  userList?: object[];
  login?: object[];
  userlist?: object[];
  currrentuser?: object[];
  logs?: object[];
  schoollist?: object[];
  unitlist?: object[];
  HullTree?: object[];
  treeData?: object[];
  phoneAndEmail?: object[];
};

export type UserType = {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getAllUser: Effect;
    userAdd: Effect;
    userDelete: Effect;
    userupdate: Effect;
    usersearch: Effect;
    logout: Effect;
    userchange: Effect;
    getcurrentuserinfo: Effect;
    getAllLog: Effect;
    getHullTree: Effect;
    getBaseInfo: Effect;
    getAll: Effect;
    getTreeByFlow: Effect;
    getTreeByRole: Effect;
    changePassword: Effect;
    getOneUserByAccount: Effect;
    userupdateAndLogOut: Effect;
    checkMail:Effect;//检查邮箱是否存在
    loginEmail:Effect;//通过邮箱验证码登录
  };
  reducers: {
    setLogin: Reducer<StateType>;
    setLogs: Reducer<StateType>;
    setUserList: Reducer<StateType>;
    setCurrrentUser: Reducer<StateType>;
    setSchoolList: Reducer<StateType>;
    setUnitList: Reducer<StateType>;
    setHullTree: Reducer<StateType>;
    setUserList_workflow: Reducer<StateType>;
    setTreeData: Reducer<StateType>;
    setPhoneAndEmail: Reducer<StateType>;
  };
  subscriptions: {};
};

const Model: UserType = {
  namespace: 'user',
  state: {
    login: [],
    userlist: [], //所有用户的列表
    currrentuser: [], //当前登录用户的信息
    logs: [], //系统登录日志
    schoollist: [], //所有学校列表
    unitlist: [], //所有学院列表

    userList: [], //用户列表workflow
    treeData: [], //树的数据workflow
    HullTree: [], //部门树页面的数据workflow
    phoneAndEmail: [], //学生 手机号和邮件
  },
  effects: {
    * login({payload}: any, {call, put}: any) {
      const result = yield call(login, payload.values);
      if (result.data.code === 200) {
        localStorage.setItem('userName', JSON.parse(result.data.data).userName);
        localStorage.setItem('opLevel', JSON.parse(result.data.data).opLevel);
        localStorage.setItem('userAllMessage', result.data.data);
        let rolestemp: any = JSON.parse(result.data.data).roles;
        let roleTag: string = '0';
        rolestemp.map((element: any, index: any) => {
          if (element.id === '1633508010263') {
            roleTag = '0'; //超级管理员
          }
          if (element.id === '1397533427003101186') {
            roleTag = '1'; //辅导员
          }
          if (element.id === '1397551221723697153') {
            roleTag = '2'; //学生
          }
        });
        localStorage.setItem('roles', roleTag);
        //遍历所有权限 去重 排序 保存到浏览器
        let permissionstemp: any = [];

        rolestemp.map((element: any, index: any) => {
          element.permissions.map((elementsub: any, indexsub: any) => {
            permissionstemp.push(elementsub);
          });
        });

        permissionstemp.sort((a: { id: string }, b: { id: string }) => {
          return a.id.localeCompare(b.id);
        });

        const res = new Map();
        let permissionsTempTemp: any = permissionstemp.filter(
          (item: any) => !res.has(item.id) && res.set(item.id, 1),
        );
        let permissions: string = JSON.stringify(permissionsTempTemp);
        localStorage.setItem('permissions', permissions);
        if (permissionsTempTemp.length === 0) {
          message.error('此账号无登录权限！！请联系管理员');
        } else {

           if (permissionsTempTemp[0].name === '分群评价') {
             history.push('/StrategyManagement');
           } else if (permissionsTempTemp[0].name === '第二课堂') {
             history.push('/ActivityStrategyManagement');
           } else if (permissionsTempTemp[0].name === '事务管理') {
             history.push('/WorkFlow/WorkFlowManage');
           } else if (permissionsTempTemp[0].name === '系统管理') {
             history.push('/UserManagement');
           } else {
             history.push(permissionsTempTemp[0].perCode);
           }
         
        }
      } else {
        message.error(result.data.msg);
      }
    },
    * logout({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(logout, token, '');
      if (result) {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('opLevel');
        localStorage.removeItem('roles');
        localStorage.removeItem('userAllMessage');
      }
    },
    * getAllUser({payload}: any, {call, put}: any) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const result = yield call(getAllUser, token, '');
      if (isLoginExpired(result)) return;
      if (result) {
        yield put({
          type: 'setUserList',
          payload: JSON.parse(result.data.data),
        });
      } else {
        message.error('获取用户失败！！！');
      }
    },
    * userAdd({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(userAdd, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200 && result.data.data === true) {
        message.success('添加用户成功！！！');
      } else {
        message.error('添加用户失败！！！');
      }
    },
    * userDelete({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(userDelete, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200 && result.data.data === true) {
        message.success('删除用户成功！！！');
      } else {
        message.error('删除用户失败！！！');
      }
    },
    * userupdate({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(userupdate, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200 && result.data.data === true) {
        message.success('更新用户成功！！！');
      } else {
        message.error('更新用户失败！！！');
      }
    },
    * userupdateAndLogOut({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(userupdate, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200 && result.data.data === true) {
        const response = yield call(logout, token, '');
        if (response.data.code === 200) {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('opLevel');
          localStorage.removeItem('roles');
          localStorage.removeItem('userAllMessage');
          message.success('更改个人信息后请重新登录！！！');
        } else {
          message.error('更改信息后跳转失败！！！');
        }
      } else {
        message.error('更新用户失败！！！');
      }
    },
    * changePassword({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(changePassword, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200 && result.data.data === true) {
        const response = yield call(logout, token, '');
        if (response.data.code === 200) {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('opLevel');
          localStorage.removeItem('roles');
          localStorage.removeItem('userAllMessage');
          message.success('更改个人信息后请重新登录！！！');
          history.push('/');
        } else {
          message.error('更改信息后跳转失败！！！');
        }
      } else {
        message.error('更新用户失败！！！');
      }
    },
    * usersearch({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(usersearch, token, payload);
      if (isLoginExpired(result)) return;
      if (result.data.code === 200) {
        yield put({
          type: 'setUserList',
          payload: JSON.parse(result.data.data),
        });
        message.success('查找用户成功！！！');
      } else {
        message.error('查找用户失败！！！');
      }
    },
    * userchange({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(userchange, token, payload);
      if (isLoginExpired(result)) return;
    },
    * getcurrentuserinfo({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(getcurrentuserinfo, token, payload);
      if (isLoginExpired(result)) return;
      if (result) {
        yield put({
          type: 'setCurrrentUser',
          payload: result.data.data,
        });
        payload.callback(result.data.data);
      } else {
        message.error('获取用户信息失败！！！');
      }
    },
    * getAllLog({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(getAllLog, token, payload);
      if (isLoginExpired(result)) return;
      if (result) {
        yield put({
          type: 'setLogs',
          payload: result,
        });
      } else {
        message.error('失败');
      }
    },
    * getTreeByRole({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(getTreeByRole, token, payload);
      if (result) {
        yield put({
          type: 'setTreeData',
          payload: result,
        });
      }
    },
    * getBaseInfo({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const response = yield call(getBaseInfo, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        if (payload.type === 'unit') {
          yield put({
            type: 'setUnitList',
            payload: response,
          });
        }
        if (payload.type === 'school') {
          yield put({
            type: 'setSchoolList',
            payload: response,
          });
        }
      }
    },
    * getHullTree({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(getHullTree, token, payload);
      if (result) {
        yield put({
          type: 'setHullTree',
          payload: result,
        });
      }
    },
    * getAll({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(getAll, token, payload);
      if (result) {
        yield put({
          type: 'setUserList_workflow',
          payload: result,
        });
      }
    },
    * getTreeByFlow({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(getTreeByFlow, token, payload.valuetemp);
      if (result) {
        payload.callback(result.data.data);
      }
    },
    * getOneUserByAccount({payload}: any, {call, put}: any) {
      const token = localStorage.getItem('token');
      const result = yield call(getOneUserByAccount, token, payload);
      if (result.data.code === 200) {
        yield put({
          type: 'setPhoneAndEmail',
          payload: JSON.parse(result.data.data),
        });
      } else {
        message.error('获取学生手机号、邮箱失败！！！ 请联系管理员');
      }
    },
    *checkMail({payload}: any, {call, put}: any) {
      //const token = localStorage.getItem('token');
      console.log(payload.email)
      const result = yield call(checkMail, payload);
      console.log("检查邮箱信息")
      if (result.data.code === 200) {
        message.success('已发送验证码');
      } else {
        message.error('邮箱不在名单中，请仔细检查或与管理员联系！');
      }
    },
    *loginEmail({payload}: any, {call, put}: any) {
      console.log("登录检查");
      console.log(payload.values);
      const result = yield call(loginEmail, payload.values);
      if (result.data.code === 200) {
        localStorage.setItem('userName', JSON.parse(result.data.data).userName);
        localStorage.setItem('opLevel', JSON.parse(result.data.data).opLevel);
        localStorage.setItem('userAllMessage', result.data.data);
        let rolestemp: any = JSON.parse(result.data.data).roles;
        let roleTag: string = '0';
        rolestemp.map((element: any, index: any) => {
          if (element.id === '1633508010263') {
            roleTag = '0'; //超级管理员
          }
          if (element.id === '1397533427003101186') {
            roleTag = '1'; //辅导员
          }
          if (element.id === '1397551221723697153') {
            roleTag = '2'; //学生
          }
        });
        localStorage.setItem('roles', roleTag);
        //遍历所有权限 去重 排序 保存到浏览器
        let permissionstemp: any = [];

        rolestemp.map((element: any, index: any) => {
          element.permissions.map((elementsub: any, indexsub: any) => {
            permissionstemp.push(elementsub);
          });
        });

        permissionstemp.sort((a: { id: string }, b: { id: string }) => {
          return a.id.localeCompare(b.id);
        });

        const res = new Map();
        let permissionsTempTemp: any = permissionstemp.filter(
          (item: any) => !res.has(item.id) && res.set(item.id, 1),
        );
        let permissions: string = JSON.stringify(permissionsTempTemp);
        localStorage.setItem('permissions', permissions);
        if (permissionsTempTemp.length === 0) {
          message.error('此账号无登录权限！！请联系管理员');
        } else {

           if (permissionsTempTemp[0].name === '分群评价') {
             history.push('/StrategyManagement');
           } else if (permissionsTempTemp[0].name === '第二课堂') {
             history.push('/ActivityStrategyManagement');
           } else if (permissionsTempTemp[0].name === '事务管理') {
             history.push('/WorkFlow/WorkFlowManage');
           } else if (permissionsTempTemp[0].name === '系统管理') {
             history.push('/UserManagement');
           } else {
             history.push(permissionsTempTemp[0].perCode);
           }
         
        }
      } else {
        message.error(result.data.msg);
      }
    },
  },
  reducers: {
    setPhoneAndEmail(state, {payload}) {
      return {...state, phoneAndEmail: payload};
    },
    setLogin(state, {payload}) {
      return {...state, login: payload};
    },
    setLogs(state, {payload}) {
      return {...state, logs: payload.data.data};
    },
    setUserList(state, {payload}) {
      return {...state, userlist: payload};
    },
    setCurrrentUser(state, {payload}) {
      return {...state, currrentuser: payload};
    },
    setSchoolList(state, {payload}) {
      return {...state, schoollist: payload.data.data};
    },
    setUnitList(state, {payload}) {
      return {...state, unitlist: payload.data.data};
    },
    setHullTree(state, {payload}) {
      let treetemp: any = [];
      treetemp.push(payload.data.data);
      return {...state, HullTree: treetemp};
    },
    setUserList_workflow(state, {payload}) {
      return {...state, userList: payload.data.data};
    },
    setTreeData(state, {payload}) {
      let treetemp: any = [];
      treetemp.push(JSON.parse(payload.data.data));
      return {...state, treeData: treetemp};
    },
  },
  subscriptions: {},
};

export default Model;
