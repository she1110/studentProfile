import {
  addPersons,
  checkName,
  createPreferenceLabelSQL,
  createProfileSQL,
  deletePersonsById,
  getCardLabel,
  getclusterdetail,
  getLabel,
  getLike,
  getMyPersons,
  getPrimaryInfo,
  getUserGroupResult,
  personDataProcess,
  personsgetOne,
  themePersonDataProcess,
  userProfileDataMult,
} from '@/services/Portrait';

import {message} from 'antd';
import type {Effect, Reducer} from 'umi';
import {history} from 'umi';
import {isLoginExpired, isLoginStatus} from '@/utils/loginStatusChecker';

export type StateType = {
  attrLabel?: object[];
  actionLabel?: object[];
  fuzzyOptions?: object[];
  clusterDetail?: object[];
  primaryInfo?: object;
  tempid?: string;
  cardLabel?: object[];
  UserGroupResult?: object[];
  SQL?: string;
  OriginalJSON?: string;
  Param?: string;
  MyPersons?: object[];
  FormState?: {};
  GroupResultRequestParameters?: object[];
};
export type ApplicationType = {
  namespace: string;
  state: StateType;
  effects: {
    getLabel: Effect;
    getLike: Effect;
    createProfileSQL: Effect;
    getUserGroupResult: Effect;
    getCardLabel: Effect;
    deleteGroupResult: Effect;
    getOriginalJSON: Effect;
    checkName: Effect;
    getMyPersons: Effect;
    personsgetOne: Effect;
    deletePersonsById: Effect;
    createPreferenceLabelSQL: Effect;
    deleteGetPrimaryInfo: Effect;
    clearPortraitModal: Effect;
  };
  reducers: {
    setLable: Reducer<StateType>;
    setFuzzyOptions: Reducer<StateType>;
    setClusterDetail: Reducer<StateType>;
    setPrimaryInfo: Reducer<StateType>;
    setTempId: Reducer<StateType>;
    setCardLabel: Reducer<StateType>;
    setUserGroupResult: Reducer<StateType>;
    setGroupResultRequestParameters: Reducer<StateType>;
    setDeleteGroupResult: Reducer<StateType>;
    setSQL: Reducer<StateType>;
    setOriginalJSON: Reducer<StateType>;
    setParam: Reducer<StateType>;
    setMyPersons: Reducer<StateType>;
    setFormState: Reducer<StateType>;
    setDeleteGroupResultRequestParameters: Reducer<StateType>;
    setDeletePrimaryInfo: Reducer<StateType>;
    setClearPortraitModal: Reducer<StateType>;
  };
  subscriptions: {};
};
const Model: ApplicationType = {
  namespace: 'portrait',
  state: {
    attrLabel: [], //用户属性列表
    actionLabel: [], //用户行为列表
    fuzzyOptions: [], //模糊搜索下拉框
    primaryInfo: {}, //getprimaryInfo结果
    clusterDetail: [], //getclusterDetail结果
    tempid: undefined, //临时ID
    cardLabel: [], //每个主题的用户画像标签不一致
    UserGroupResult: [], //每次新建用户画像 保存cards
    SQL: undefined, //根据条件拼好的SQL
    OriginalJSON: undefined, //选择框原始条件
    Param: undefined, //原始条件经过形式变换之后的标准参数 switch list……
    MyPersons: [], //当前用户能看见的画像列表
    FormState: {}, //画像表单的state
    GroupResultRequestParameters: [], //新建画像请求参数 数组需要保存
  },
  effects: {
    * getLabel({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getLabel, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setLable',
          payload: response,
        });
      } else {
        message.error('获取label失败！！');
        return;
      }
    },
    * getLike({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getLike, token, payload.payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        payload.callback(response.data.data);
      } else {
        message.error('模糊查询失败！！');
        return;
      }
    },
    //createProfileSQL和createPreferenceLabelSQL写成了两条路 防止后面请求顺序变化
    * createProfileSQL({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(createProfileSQL, token, payload);
      if (isLoginExpired(response)) return;
      if ('data' in response && response.data.code === 200) {
        const theme = payload.theme;
        const tempId = String(+new Date());
        //保存tempid
        yield put({
          type: 'setTempId',
          payload: tempId,
        });
        //保存sql
        yield put({
          type: 'setSQL',
          payload: response.data.data,
        });
        //保存标准条件Param
        yield put({
          type: 'setParam',
          payload: payload,
        });
        //保存formstate
        yield put({
          type: 'setFormState',
          payload: payload.formState,
        });
        let parameter = {
          tempId: tempId,
          theme: 'studentprofile',
          sql: response.data.data,
        };
        const result = yield call(personDataProcess, token, parameter);
        if (result.data.code === 200 && result.data.data === true) {
          let getPrimaryInfoParameter = {
            personasId: tempId,
            theme: theme,
            tpConstraint: 'count',
            tpRelation: '>',
            tpValue: '0',
          };
          if (theme !== 'studentprofile') {
            getPrimaryInfoParameter.tpConstraint = payload.tpConstraint;
            getPrimaryInfoParameter.tpRelation = payload.tpRelation;
            getPrimaryInfoParameter.tpValue = payload.tpValue;
          }
          const getPrimaryInfoResponse = yield call(
            getPrimaryInfo,
            token,
            getPrimaryInfoParameter,
          );
          if (getPrimaryInfoResponse.data.code === 200) {
            yield put({
              type: 'setPrimaryInfo',
              payload: getPrimaryInfoResponse,
            });
            if (theme === 'studentprofile') {
              let clusterDetailParameter = {
                portraitid: tempId,
                theme: theme,
              };
              const clusterDetailResponse = yield call(
                getclusterdetail,
                token,
                clusterDetailParameter,
              );
              if (clusterDetailResponse.data.code === 200) {
                yield put({
                  type: 'setClusterDetail',
                  payload: clusterDetailResponse,
                });
              } else {
                message.error('学生主题获取分群详细信息失败!!');
                return;
              }
            } else {
              let themePersonDataProcessParameter = {
                realId: tempId,
                theme: theme,
                sql: JSON.parse(getPrimaryInfoResponse.data.data).sql,
              };
              const themePersonDataProcessResponse = yield call(
                themePersonDataProcess,
                token,
                themePersonDataProcessParameter,
              );
              if (
                themePersonDataProcessResponse.data.code === 200 &&
                themePersonDataProcessResponse.data.data === true
              ) {
                //进行getclusterdetail
                let clusterDetailParameter = {
                  portraitid: tempId,
                  theme: theme,
                };
                const clusterDetailResponse = yield call(
                  getclusterdetail,
                  token,
                  clusterDetailParameter,
                );
                if (clusterDetailResponse.data.code === 200) {
                  yield put({
                    type: 'setClusterDetail',
                    payload: clusterDetailResponse,
                  });
                } else {
                  message.error('非学生主题获取分群详细信息失败!!');
                  return;
                }
              } else {
                message.error('非学生主题第二次插数据表失败！！！');
                return;
              }
            }
          } else {
            message.error('获取符合条件学生失败！！');
            return;
          }
        } else {
          message.info('数据主表锁定，请稍后再试~');
          history.goBack();
          return;
        }
      } else {
        message.error('拼写查询条件失败 请检查！');
        return;
      }
    },
    * createPreferenceLabelSQL({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(createPreferenceLabelSQL, token, payload);
      if (isLoginExpired(response)) return;
      if ('data' in response && response.data.code === 200) {
        const theme = payload.theme;
        const tempId = String(+new Date());
        //保存tempid
        yield put({
          type: 'setTempId',
          payload: tempId,
        });
        //保存sql
        yield put({
          type: 'setSQL',
          payload: response.data.data,
        });
        //保存标准条件Param
        yield put({
          type: 'setParam',
          payload: payload,
        });
        //保存formstate
        yield put({
          type: 'setFormState',
          payload: payload.formState,
        });
        let parameter = {
          tempId: tempId,
          theme: 'studentprofile',
          sql: response.data.data,
        };
        const result = yield call(personDataProcess, token, parameter);
        if (result.data.code === 200 && result.data.data === true) {
          let getPrimaryInfoParameter = {
            personasId: tempId,
            theme: theme,
            tpConstraint: 'count',
            tpRelation: '>',
            tpValue: '0',
          };
          if (theme !== 'studentprofile') {
            getPrimaryInfoParameter.tpConstraint = payload.tpConstraint;
            getPrimaryInfoParameter.tpRelation = payload.tpRelation;
            getPrimaryInfoParameter.tpValue = payload.tpValue;
          }
          const getPrimaryInfoResponse = yield call(
            getPrimaryInfo,
            token,
            getPrimaryInfoParameter,
          );
          if (getPrimaryInfoResponse.data.code === 200) {
            yield put({
              type: 'setPrimaryInfo',
              payload: getPrimaryInfoResponse,
            });
            if (theme === 'studentprofile') {
              let clusterDetailParameter = {
                portraitid: tempId,
                theme: theme,
              };
              const clusterDetailResponse = yield call(
                getclusterdetail,
                token,
                clusterDetailParameter,
              );
              if (clusterDetailResponse.data.code === 200) {
                yield put({
                  type: 'setClusterDetail',
                  payload: clusterDetailResponse,
                });
              } else {
                message.info('学生主题获取分群详细信息失败！！');
                return;
              }
            } else {
              let themePersonDataProcessParameter = {
                realId: tempId,
                theme: theme,
                sql: JSON.parse(getPrimaryInfoResponse.data.data).sql,
              };
              const themePersonDataProcessResponse = yield call(
                themePersonDataProcess,
                token,
                themePersonDataProcessParameter,
              );
              if (
                themePersonDataProcessResponse.data.code === 200 &&
                themePersonDataProcessResponse.data.data === true
              ) {
                //进行getclusterdetail
                let clusterDetailParameter = {
                  portraitid: tempId,
                  theme: theme,
                };
                const clusterDetailResponse = yield call(
                  getclusterdetail,
                  token,
                  clusterDetailParameter,
                );
                if (clusterDetailResponse.data.code === 200) {
                  yield put({
                    type: 'setClusterDetail',
                    payload: clusterDetailResponse,
                  });
                } else {
                  message.info('非学生主题获取分群详细信息失败！！');
                  return;
                }
              } else {
                message.info('非学生主题数据表插入失败！！');
                return;
              }
            }
          } else {
            message.info('获取符合条件学生失败！！');
            return;
          }
        } else {
          message.info('数据主表锁定，请稍后再试~');
          history.goBack();
          return;
        }
      } else {
        message.info('查询条件有误！！');
        return;
      }
    },
    * getUserGroupResult({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getUserGroupResult, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        console.log(response.data.data);
        yield put({
          type: 'setUserGroupResult',
          payload: {
            response: response,
            chart: payload.chart,
          },
        });
        yield put({
          type: 'setGroupResultRequestParameters',
          payload: payload,
        });
      } else {
        message.error('新建用户画像失败！');
        return;
      }
    },
    * getCardLabel({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(getCardLabel, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setCardLabel',
          payload: response,
        });
      } else {
        message.error('获取CardLabel失败！');
        return;
      }
    },
    * deleteGroupResult({payload}, {call, put}) {
      yield put({
        type: 'setDeleteGroupResult',
        payload: payload.UserGroupResultTemp,
      });
      yield put({
        type: 'setDeleteGroupResultRequestParameters',
        payload: payload.GroupResultRequestParametersTemp,
      });
    },
    * getOriginalJSON({payload}, {call, put}) {
      yield put({
        type: 'setOriginalJSON',
        payload: payload,
      });
    },
    * checkName({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(checkName, token, {name: payload.name});
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.error('用户画像重名！！请更改');
        return;
      } else if (response.data.code === 200 && response.data.data === false) {
        const result = yield call(addPersons, token, payload);
        if (result.data.code === 200) {
          let personDataProcessParam: any = {
            realId: result.data.data.id,
            tempId: payload.tempid,
            theme: payload.theme,
          };
          const personDataProcessResult = yield call(
            personDataProcess,
            token,
            personDataProcessParam,
          );
          if (personDataProcessResult.data.code === 200) {
            const theme = payload.theme;
            const clusterLabelGroup = {
              studentprofile: 'xs',
              dormitoryprofile: 'ss',
              classprofile: 'bj',
              majorprofile: 'zy',
              courseprofile: 'kc',
              unitprofile: 'xy',
            };
            let payloadTemp: any = {
              theme: theme,
              clusterLabel: clusterLabelGroup[theme],
            };
            const userProfileDataMultResult = yield call(
              userProfileDataMult,
              token,
              payloadTemp,
            );
            if (userProfileDataMultResult.data.code === 200) {
              message.success('用户画像保存成功！！');
              history.goBack();
            } else {
              message.error('用户画像保存失败！！!');
              return;
            }
          } else {
            message.error('用户画像插入小表失败！！');
            return;
          }
        } else {
          message.error('用户画像保存失败！！?');
          return;
        }
      } else {
        message.error('用户画像保存失败！！');
        return;
      }
    },
    * getMyPersons({payload}, {call, put}) {
      if (!isLoginStatus()) return;
      const token = localStorage.getItem('token');
      const response = yield call(getMyPersons, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200) {
        yield put({
          type: 'setMyPersons',
          payload: response,
        });
      } else {
        message.error('获取用户群画像失败！！');
        return;
      }
    },
    //personsgetOne暂时没用到
    * personsgetOne({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(personsgetOne, token, payload);
      if (isLoginExpired(response)) return;
    },
    * deletePersonsById({payload}, {call, put}) {
      const token = localStorage.getItem('token');
      const response = yield call(deletePersonsById, token, payload);
      if (isLoginExpired(response)) return;
      if (response.data.code === 200 && response.data.data === true) {
        message.success('删除成功！！！');
      } else {
        message.error('删除失败！！！');
      }
    },
    * deleteGetPrimaryInfo({payload}, {call, put}) {
      yield put({
        type: 'setDeletePrimaryInfo',
      });
    },
    * clearPortraitModal({payload}, {call, put}) {
      yield put({
        type: 'setClearPortraitModal',
      });
    },
  },
  reducers: {
    setLable(state, {payload}) {
      const datatemp: any = JSON.parse(payload.data.data);
      return {
        ...state,
        attrLabel: datatemp[0].children,
        actionLabel: datatemp[1].children,
      };
    },
    setFuzzyOptions(state, {payload}) {
      return {...state, fuzzyOptions: payload.data.data};
    },
    setPrimaryInfo(state, {payload}) {
      const primaryInfotemp: any = JSON.parse(payload.data.data);
      return {...state, primaryInfo: primaryInfotemp};
    },

    setDeletePrimaryInfo(state, {payload}) {
      return {...state, primaryInfo: {}};
    },
    setClusterDetail(state, {payload}) {
      const ClusterDetailtemp: any = JSON.parse(payload.data.data);
      return {...state, clusterDetail: ClusterDetailtemp};
    },
    setTempId(state, {payload}) {
      return {...state, tempid: payload};
    },
    setCardLabel(state, {payload}) {
      const CardLabeltemp: any = JSON.parse(payload.data.data);
      return {...state, cardLabel: CardLabeltemp};
    },

    //保存的是前端图表显示的数据
    setUserGroupResult(state, {payload}) {
      let current: any = deepClone(state);
      let tempdata: any = JSON.parse(payload.response.data.data);
      tempdata.chart = payload.chart;
      const UserGroupResulttemp: any = tempdata;
      current.UserGroupResult.push(UserGroupResulttemp);
      return {...state, UserGroupResult: current.UserGroupResult};
    },
    setGroupResultRequestParameters(state, {payload}) {
      let current: any = deepClone(state);
      current.GroupResultRequestParameters.push(payload);
      return {
        ...state,
        GroupResultRequestParameters: current.GroupResultRequestParameters,
      };
    },

    setDeleteGroupResult(state, {payload}) {
      return {...state, UserGroupResult: payload};
    },
    setDeleteGroupResultRequestParameters(state, {payload}) {
      return {...state, GroupResultRequestParameters: payload};
    },
    setSQL(state, {payload}) {
      return {...state, SQL: payload};
    },
    setOriginalJSON(state, {payload}) {
      return {...state, OriginalJSON: payload};
    },
    setParam(state, {payload}) {
      return {...state, Param: payload};
    },
    setMyPersons(state, {payload}) {
      return {...state, MyPersons: payload.data.data};
    },
    setFormState(state, {payload}) {
      return {...state, FormState: payload};
    },
    setClearPortraitModal(state, {payload}) {
      return {
        attrLabel: [], //用户属性列表
        actionLabel: [], //用户行为列表
        fuzzyOptions: [], //模糊搜索下拉框
        primaryInfo: {}, //getprimaryInfo结果
        clusterDetail: [], //getclusterDetail结果
        tempid: undefined, //临时ID
        cardLabel: [], //每个主题的用户画像标签不一致
        UserGroupResult: [], //每次新建用户画像 保存cards
        SQL: undefined, //根据条件拼好的SQL
        OriginalJSON: undefined, //选择框原始条件
        Param: undefined, //原始条件经过形式变换之后的标准参数 switch list……
        MyPersons: [], //当前用户能看见的画像列表
        FormState: {}, //画像表单的state
        GroupResultRequestParameters: [], //新建画像请求参数 数组需要保存
      };
    },
  },
  subscriptions: {},
};

export default Model;

function deepClone(arr: any) {
  let _obj = JSON.stringify(arr);
  return JSON.parse(_obj);
}
