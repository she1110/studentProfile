import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },

  publicPath: './',
  history: {
    type: 'hash',
  },
  // hash: false,	// 清除缓存

  routes: [
    //邮箱登录页面
    {
      exact: true,
      path: '/',
      component: '@/pages/index',
    },
    //账号密码登录页面
    {
      exact: true,
      path: '/login',
      component: '@/pages/indexLogin',
    },
    {
      name: '测试页',
      path: '/Test',
      component: '@/pages/Test/index',
    },
    // {
    //   name: '大屏',
    //   path: '/BigDataScreen',
    //   component: '@/pages/BigDataScreen/index',
    // },
    {
      name: '导航栏',
      path: '/',
      component: '@/layout/index',
      routes: [
        {
          name: '首页',
          path: '/Dashboard',
          component: '@/pages/Dashboard/index',
        },
        {
          name: '创建画像',
          path: '/CreatePortrait',
          component: '@/pages/CreatePortrait/index',
        },
        {
          name: '画像看板',
          path: '/PictureBoard',
          component: '@/pages/PictureBoard/index',
        },
        {
          name: '画像预览',
          path: '/PicturePreview',
          component: '@/pages/PicturePreview/index',
        },

        {
          name: '修改画像信息',
          path: '/ModifyUserPicture',
          component: '@/pages/ModifyPictureInfo/index',
        },
        {
          name: '培养计划',
          path: '/TrainingPlan',
          component: '@/pages/TrainingPlan/index',
          routes: [
            {
              path: '/TrainingPlan/TrainingPlanList',
              component: '@/pages/TrainingPlan/TrainingPlanList/index',
            },
            {
              path: '/TrainingPlan/TrainingPlanContent',
              component: '@/pages/TrainingPlan/TrainingPlanContent/index',
            },
          ],
        },
        {
          name: '学生报表',
          path: '/StudentReport',
          component: '@/pages/StudentReport/index',
        },
        {
          name: '院系通知',
          path: '/DepartmentNotice',
          component: '@/pages/DepartmentNotice/index',
        },
        {
          name: '竞赛档案',
          path: '/CompetitionFile',
          component: '@/pages/CompetitionFile/index',
        },
        {
          name: '标签数据',
          path: '/TagsData',
          component: '@/pages/TagsData/index',
        },
        {
          name: '我的事务',
          path: '/WorkFlow/MyWorkFlow',
          component: '@/pages/WorkFlow/MyWorkFlow/index',
        },
        {
          name: '事务管理',
          path: '/WorkFlow/WorkFlowManage',
          component: '@/pages/WorkFlow/WorkFlowManage/index',
        },
        {
          name: '宿舍色块图',
          path: '/DormitoryColorBlock',
          component: '@/pages/DormitoryColorBlock/index',
        },
        {
          name: '创建应用',
          path: '/CreateApplication',
          component: '@/pages/CreateApplication/index',
        },
        {
          name: '应用内容',
          path: '/ApplicationContent',
          component: '@/pages/ApplicationContent/index',
        },
        {
          name: '策略管理',
          path: '/StrategyManagement',
          component: '@/pages/StrategyManagement/index',
        },
        {
          name: '策略管理详细信息',
          path: '/StrategyContent',
          component: '@/pages/StrategyContent/index',
        },

        {
          name: '任务管理',
          path: '/JobManagement',
          component: '@/pages/JobManagement/index',
        },
        {
          name: '任务result_班级',
          path: '/JobResultClass',
          component: '@/pages/JobResult/JobResultClass/index',
        },
        {
          name: '任务result_学生',
          path: '/JobResultUser',
          component: '@/pages/JobResult/JobResultUser/index',
        },
        {
          name: '任务result_专业',
          path: '/JobResultMajor',
          component: '@/pages/JobResult/JobResultMajor/index',
        },
        {
          name: '任务result_宿舍',
          path: '/JobResultDormitory',
          component: '@/pages/JobResult/JobResultDormitory/index',
        },

        {
          name: '第二课堂活动列表',
          path: '/ActivityList',
          component: '@/pages/Activity/ActivityList/index',
        },
        {
          name: '第二课堂意见征集',
          path: '/ActivityCommentsCollect',
          component: '@/pages/Activity/ActivityCommentsCollect/index',
        },
        {
          name: '第二课堂策略管理',
          path: '/ActivityStrategyManagement',
          component: '@/pages/Activity/ActivityStrategyManagement/index',
        },
        {
          name: '第二课堂活动成绩',
          path: '/ActivityScore',
          component: '@/pages/Activity/ActivityScore/index',
        },
        {
          name: '消息列表',
          path: '/MessageList',
          component: '@/pages/MessageList/index',
        },

        {
          name: '用户管理',
          path: '/UserManagement',
          component: '@/pages/SystemManagement/UserManagement/index',
        },
        {
          name: '角色管理',
          path: '/RoleManagement',
          component: '@/pages/SystemManagement/RoleManagement/index',
        },
        {
          name: '权限管理',
          path: '/AuthorityManagement',
          component: '@/pages/SystemManagement/AuthorityManagement/index',
        },
        {
          name: '部门管理',
          path: '/DepartmentManagement',
          component: '@/pages/SystemManagement/DepartmentManagement/index',
        },
        {
          name: '人群管理',
          path: '/CrowdManagement',
          component: '@/pages/SystemManagement/CrowdManagement/index',
        },
        {
          name: '性格调查与分析',
          path: '/CharacterAnalysis',
          component: '@/pages/CharacterAnalysis/index',
        },
        {
          name: '性格调查与分析教师页',
          path: '/CharacterAnalysisTeacher',
          component: '@/pages/CharacterAnalysisTeacher/index',
        },
        {
          name: '个人中心',
          path: '/UserCenter',
          component: '@/pages/SystemManagement/UserCenter/index',
        },
        {
          name: '学业预警',
          path: '/StudentWarning',
          component: '@/pages/StudentWarning/index',
        },
        {
          name: '帮扶计划详情',
          path: '/HelpDetails',
          component: '@/pages/HelpDetails/index',
        },
        {
          name: '学业预警及帮扶信息',
          path: '/StuStudentWarningHelp',
          component: '@/pages/StuStudentWarningHelp/index',
        },
        {
          name: '毕业去向学生页',
          path: '/GraduationSurveyStudent',
          component: '@/pages/GraduationSurveyStudent',
        },
        {
          name: '毕业去向教师页',
          path: '/GraduationSurveyTeacher',
          component: '@/pages/GraduationSurveyTeacher',
        },
        {
          name: '测试路由传参',
          path: '/TestRoute',
          component: '@/pages/TestRoute/index',
        },
        {
          name: '测试路由传参子路由',
          path: '/TestRoute/TestRouteSon',
          component: '@/pages/TestRoute/components/TestRouteSon1/index',
        },
        {
          component: '@/pages/404',
        },
      ],
    },
  ],
  fastRefresh: {},

  dva: {
    immer: true,
    hmr: false,
  },
});
