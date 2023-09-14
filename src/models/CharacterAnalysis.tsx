import {Reducer, Effect, Subscription} from "umi";
import {
  getPreview,
  getQuestionnaireList,
  getQuestionnaireListForTeacher,
  getQuestionnaireUrl,
  getReport
} from "@/services/CharacterAnalysis";
import {message} from "antd";
/*
-----------------------------------------------------------------------------------------------------------------
本model用来演示正规的流程，即
①组件连接仓库；
②组件通过connect连接后给组件自动传的参数dispatch访问仓库中的异步函数effects；
③effects获取到数据后调用同步函数reducers存储数据到仓库state中
④组件自动更新参数并重新渲染
-----------------------------------------------------------------------------------------------------------------
 */


/*
-----------------------------------------------------------------------------------------------------------------
ts规范：对变量进行声明
 */
//对state声明，state用于仓库存储数据，也就是说state就是仓库
export type StateType = {
  list?: any[];
  listForTeacher?: any[];
};
//对model声明
export type CharacterAnalysisModelType = {
  namespace: string;
  state: StateType;
  effects: {
    getQuestionnaireUrlEffects: Effect;
    getPreviewEffects:Effect;
    getReportEffects:Effect;
    getQuestionnaireListEffects:Effect;
  };
  reducers: {
    getListReducers: Reducer<StateType>;
  };
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
const CharacterAnalysisModel: CharacterAnalysisModelType = {
  //本model唯一标识，命名标准：不能有'-'，可以有'_'，可以有大写
  //个人标准：以后都以'Model_'开头
  namespace: 'Model_CharacterAnalysisModel',//Model_ExampleModel里面存的是state
  state: {
    list: [],
    listForTeacher: [],
  },
  //命名规范（个人）：函数功能+FromServices+Effects
  effects: {
    //根据问卷id获取问卷链接
    *getQuestionnaireUrlEffects({ payload }:any, { call, put }:any): Generator{//: Generator解决yield报红
      console.log(payload)
      let token = localStorage.getItem('token');
      const result:any = yield call(getQuestionnaireUrl,token,payload.data);
      if (200 === result.data.code){
        window.open(result.data.data.TestEncryptAddress)
      }else {
        message.warn("问卷已填写完成请点击进行查看")
      }
    },
    //获取报告列表
    *getQuestionnaireListEffects({ payload }:any, { call, put }:any): Generator{//: Generator解决yield报红
      console.log(payload)
      let token = localStorage.getItem('token');
      const result:any = yield call(getQuestionnaireList,token,payload.PersonCode);
      payload.callback(result.data.data)
    },
    //根据。。。获取报告预览
    *getPreviewEffects({ payload }:any, { call, put }:any): Generator{//: Generator解决yield报红
      console.log(payload.currentUrlInfo)
      let token = localStorage.getItem('token');
      const result:any = yield call(getPreview,token,payload.currentUrlInfo);
      // payload.callback(data)
    },
    //根据。。。下载报告
    *getReportEffects({ payload }:any, { call, put }:any): Generator{//: Generator解决yield报红
      console.log(payload)
      console.log(payload.currentUrlInfo)
      let token = localStorage.getItem('token');
      const result:any = yield call(getReport,token,payload.currentUrlInfo);
      // payload.callback(data)
    },
  },

  //命名规范（个人）：函数功能+Reducers
  reducers: {
    getListReducers(state, {payload}) {
      //返回形式return {...state}，必须是"...state"，否则报错
      console.log(state)
      return {...state,list:payload};//将payload赋值给list
    },
  },


};
/*
model结构
-----------------------------------------------------------------------------------------------------------------
 */


export default CharacterAnalysisModel;

