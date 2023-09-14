import React from 'react';
import { Avatar, Badge, Button, Col, Dropdown, Image, Layout, Menu, Row, Tabs, } from 'antd';
// import './index.less';
import './index.css';
import type { Dispatch } from 'umi';
import { connect, history, Link } from 'umi';

import {
  BellOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  FolderOpenOutlined,
  FormOutlined,
  HomeOutlined,
  IdcardOutlined,
  IssuesCloseOutlined,
  MailOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import CrowdManagement from "@/pages/SystemManagement/CrowdManagement";
import CreateApplication from "@/pages/CreateApplication";

export type Props = {
  dispatch: Dispatch;
  MessageList: object[];
  menuTotal?: any;
};

const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;
const { TabPane } = Tabs;

class BasicLayout extends React.Component<Props> {
  state = {
    collapsed: false,
    MessageCount: 0, //未读消息条数
    menuTotal: undefined, //
  };
  componentDidMount = () => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'user/getAllUser',
    // });
    // dispatch({
    //   type: 'authority/findpermission',
    // });
    dispatch({
      type: 'messagelist/getAllMessage',
    }).then(() => {
      const { MessageList }: any = this.props;
      let MessageCountTemp: number = 0;
      if (MessageList.length !== 0) {
        MessageList.map((element: any, index: any) => {
          if (element.status === '0') {
            MessageCountTemp = MessageCountTemp + 1;
          }
        });
      }
      this.setState({
        MessageCount: MessageCountTemp,
      });
    });
    this.menuTotal();
  };

  componentDidUpdate = (nextProps: any, nextState: any) => {
    const { MessageList }: any = this.props;
    let MessageCountTemp: number = 0;
    if (MessageList.length !== 0) {
      MessageList.map((element: any, index: any) => {
        if (element.status === '0') {
          MessageCountTemp = MessageCountTemp + 1;
        }
      });
    }
    if (this.state === nextState) {
      this.setState({
        MessageCount: MessageCountTemp,
      });
    }
  };

  toggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };
  logout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/logout',
    }).then(() => {
      history.push('/');
    });
  };
  menu = (
    <Menu>
      <Menu.Item key={'1'}>
        <Button type="link">
          <Link to="/userCenter">个人中心</Link>
        </Button>
      </Menu.Item>
      <Menu.Item key={'2'}>
        <Button type="link" onClick={this.logout}>
          退出登录
        </Button>
      </Menu.Item>
    </Menu>
  );

  strategyTempClear = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'messagelist/strategyTempClear',
    });
  };
  calculationMessageCount = () => {
    const { MessageList }: any = this.props;
    let MessageCountTemp: number = 0;
    if (MessageList.length !== 0) {
      MessageList.map((element: any, index: any) => {
        if (element.status === '0') {
          MessageCountTemp = MessageCountTemp + 1;
        }
      });
    }
    this.setState({
      MessageCount: MessageCountTemp,
    });
  };

  menuTotal = () => {
    const permissions = JSON.parse(
      localStorage.getItem('permissions') as string,
    );
    let menuTotalTemp = new Map();

    //////////////
    menuTotalTemp.set(
      '创建画像',
      <Menu.Item key="/Dashboard" icon={<IdcardOutlined />}>
        <Link to="/Dashboard">创建画像</Link>
      </Menu.Item>,
    );

    menuTotalTemp.set(
      '应用任务',
      <Menu.Item key="/CreateApplication" icon={<IdcardOutlined/>}>
        <Link to="/CreateApplication">应用任务</Link>
      </Menu.Item>,
    );
    menuTotalTemp.set(
      '分群评价',
      <SubMenu key="clusterEvaluation" icon={<MailOutlined />} title="分群评价">
        <Menu.Item key="/StrategyManagement">
          <Link to="/StrategyManagement">策略管理</Link>
        </Menu.Item>
        <Menu.Item key="/JobManagement">
          <Link to="/JobManagement">任务管理</Link>
        </Menu.Item>
      </SubMenu>,
    );
    menuTotalTemp.set(
      '画像看板',
      <Menu.Item key="/PictureBoard" icon={<IdcardOutlined />}>
        <Link to="/PictureBoard">画像看板</Link>
      </Menu.Item>,
    );

    menuTotalTemp.set(
      '第二课堂',
      <SubMenu key="secondClass" icon={<IdcardOutlined/>} title="第二课堂">
        <Menu.Item key="/ActivityStrategyManagement">
          <Link to="/ActivityStrategyManagement">策略管理</Link>
        </Menu.Item>
        <Menu.Item key="/ActivityList">
          <Link to="/ActivityList">活动管理</Link>
        </Menu.Item>
      </SubMenu>,
    );
    menuTotalTemp.set(
      '培养计划',
      <Menu.Item key="/TrainingPlan" icon={<IdcardOutlined />}>
        <Link to="/TrainingPlan/TrainingPlanList">培养计划</Link>
      </Menu.Item>,
    );

    //////////////////
    menuTotalTemp.set(
      '学生报表',
      <Menu.Item key="/StudentReport" icon={<SearchOutlined />}>
        <Link to="/StudentReport">学生报表</Link>
      </Menu.Item>,
    );
    menuTotalTemp.set(
      '宿舍分布',
      <Menu.Item key="/DormitoryColorBlock" icon={<HomeOutlined />}>
        <Link to="/DormitoryColorBlock">宿舍分布</Link>
      </Menu.Item>,
    );
    menuTotalTemp.set(
      '事务管理',
      <SubMenu
        key="transactionManagement"
        icon={<MailOutlined />}
        title="事务管理"
      >
        <Menu.Item key="/WorkFlow/WorkFlowManage">
          <Link to="/WorkFlow/WorkFlowManage">事务办理</Link>
        </Menu.Item>
        <Menu.Item key="/WorkFlow/MyWorkFlow">
          <Link to="/WorkFlow/MyWorkFlow">事务列表</Link>
        </Menu.Item>
      </SubMenu>,
    );
    menuTotalTemp.set(
      '院系通知',
      <Menu.Item key="/DepartmentNotice" icon={<FilterOutlined rotate={90} />}>
        <Link to="/DepartmentNotice">院系通知</Link>
      </Menu.Item>,
    );
    menuTotalTemp.set(
      '竞赛档案',
      <Menu.Item key="/CompetitionFile" icon={<FolderOpenOutlined />}>
        <Link to="/CompetitionFile">竞赛档案</Link>
      </Menu.Item>,
    );

    menuTotalTemp.set(
      '标签数据',
      <Menu.Item key="/TagsData" icon={<IssuesCloseOutlined />}>
        <Link to="/TagsData">标签数据</Link>
      </Menu.Item>,
    );

    ///////////////
    menuTotalTemp.set(
      '学业预警',
      <Menu.Item key="/StudentWarning" icon={<IssuesCloseOutlined />}>
        <Link to="/StudentWarning">学业预警</Link>
      </Menu.Item>,
    );
    menuTotalTemp.set(
      '学籍预警',
      <Menu.Item key="/StuStudentWarningHelp" icon={<IssuesCloseOutlined />}>
        <Link to="/StuStudentWarningHelp">学籍预警</Link>
      </Menu.Item>,
    );
    menuTotalTemp.set(
      '毕业去向学生页',
      <Menu.Item key="/GraduationSurveyStudent" icon={<FormOutlined />}>
        <Link to="/GraduationSurveyStudent">毕业去向</Link>
      </Menu.Item>,
    );
    menuTotalTemp.set(
      '毕业去向教师页',
      <Menu.Item key="/GraduationSurveyTeacher" icon={<FormOutlined />}>
        <Link to="/GraduationSurveyTeacher">毕业去向</Link>
      </Menu.Item>,
    );
    menuTotalTemp.set(
      '系统管理',
      <SubMenu key="systemManagement" icon={<UserOutlined />} title="系统管理">
        <Menu.Item key="/UserManagement">
          <Link to="/UserManagement">用户管理</Link>
        </Menu.Item>
        <Menu.Item key="/RoleManagement">
          <Link to="/RoleManagement">角色管理</Link>
        </Menu.Item>
        <Menu.Item key="/AuthorityManagement">
          <Link to="/AuthorityManagement">权限管理</Link>
        </Menu.Item>
        <Menu.Item key="/DepartmentManagement">
          <Link to="/DepartmentManagement">部门管理</Link>
        </Menu.Item>
        <Menu.Item key="/CrowdManagement">
          <Link to="/CrowdManagement">责任管理</Link>
        </Menu.Item>
      </SubMenu>,
    );
    menuTotalTemp.set(
      '心理测试',
      <Menu.Item key="/CharacterAnalysis" icon={<FormOutlined />}>
        <Link to="/CharacterAnalysis">心理测试</Link>
      </Menu.Item>,
    );

    menuTotalTemp.set(
      '心理测试教师页',
      <Menu.Item key="/CharacterAnalysisTeacher" icon={<FormOutlined />}>
        <Link to="/CharacterAnalysisTeacher">心理测试教师页</Link>
      </Menu.Item>,
    );
    /////////////////
    menuTotalTemp.set(
      '个人中心',
      <Menu.Item key="/userCenter" icon={<FormOutlined />}>
        <Link to="/userCenter">个人中心</Link>
      </Menu.Item>,
    );
    menuTotalTemp.set(
      '站内信',
      <Menu.Item
        key="/MessageList"
        icon={
          <Badge count={this.state.MessageCount}>
            <BellOutlined />
          </Badge>
        }
      >
        /     <Link to="/MessageList">站内信</Link>
      </Menu.Item>,
    );
    menuTotalTemp.set(
      '退出登录',
      <Menu.Item key="/logut" icon={<CloseCircleOutlined />}>
        <a onClick={this.logout}>退出登录</a>
      </Menu.Item>,
    );
    this.setState({
      menuTotal: menuTotalTemp,
    });
  };

  render() {
    const { MessageList } = this.props;
    const { MessageCount, menuTotal } = this.state;
    const roleTag = localStorage.getItem('roles');
    const userAllMessage = JSON.parse(
      localStorage.getItem('userAllMessage') as string,
    );
    const permissions = JSON.parse(
      localStorage.getItem('permissions') as string,
    );

    return (
      <div>
        {/* <Button onClick={() => {
          console.log(MessageCount);
        }}>测试roleTag</Button> */}
        {roleTag === '0' ? (
          <Layout>
            <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
              <div className="logo"></div>
              <div
                style={{
                  height: 80,
                  backgroundColor: '#1890ff',
                }}
              ></div>
              <div style={{ height: 30 }}></div>
              <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={[history.location.pathname]}
                defaultOpenKeys={[
                  'clusterEvaluation',
                  'systemManagement',
                  'secondClass',
                  'transactionManagement',
                ]}
              >
                {permissions.map((element: any, index: any) => {
                  return menuTotal?.get(element.name);
                })}
              </Menu>
            </Sider>

            <Layout className="site-layout">
              <Header
                className="site-layout-background"
                style={{ padding: 0, height: 80 }}
              >
                <Row align="middle" style={{ height: 80 }}>
                  <Col
                    span={8}
                    style={{
                      backgroundColor: '#1890ff',
                      height: 80,
                      borderTopRightRadius: 50,
                      borderEndEndRadius: 50,
                    }}
                  >
                    <Image
                      src={require('@/assets/picture/智能学院.png')}
                      style={{ height: '80' }}
                      preview={false}
                    />
                  </Col>
                  <Col
                    span={1}
                    offset={14}
                    style={{ paddingLeft: 20, paddingTop: 10 }}
                  >

                    {<Badge count={MessageCount}>
                      <Link to="/MessageList" onClick={this.strategyTempClear}>
                        {' '}
                        <BellOutlined style={{ fontSize: 20 }} />
                      </Link>
                    </Badge>}
                  </Col>
                  <Col span={1}>

                    {<Dropdown overlay={this.menu} placement="bottomRight">
                      <Avatar icon={<UserOutlined />} size="large" />
                    </Dropdown>}
                  </Col>
                </Row>
              </Header>
              <Content className="site-layout-background">
                {this.props.children}
              </Content>
            </Layout>
          </Layout>
        ) : null}

        {roleTag === '2' || roleTag === '1' ? (
          <Layout className="layout" style={{ background: '#FFFAF0' }}>
            <Header style={{ background: 'white' }}>
              {/* <div style={{backgroundColor:'blue', width:50, height:50, position:'absolute', marginLeft:-50}}></div> */}
              <Row>
                <Col span={24}>
                  <Menu
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={[history.location.pathname]}
                  // defaultOpenKeys={['clusterEvaluation', 'systemManagement', 'secondClass', 'transactionManagement']}
                  // style={{ width: 500 }}
                  >
                    {permissions.map((element: any, index: any) => {
                      return menuTotal?.get(element.name);
                    })}
                    {/*////////////////////////////////////*/}
                    {<Menu.Item
                      key="/MessageList"
                      icon={
                        <Badge count={MessageCount}>
                          <BellOutlined />
                        </Badge>
                      }
                    >
                      <Link to="/MessageList">站内信</Link>
                    </Menu.Item>}

                  </Menu>
                </Col>
                {/* <Col
                    span={1}
                    style={{ paddingLeft: 20, paddingTop: 5 }}
                    offset={16}
                  >
                    <Badge count={MessageCount}>
                      <Link to="/MessageList" onClick={this.strategyTempClear}> <BellOutlined style={{ fontSize: 20 }} /></Link>
                    </Badge>
                  </Col> */}
                {/* <Col span={1} offset={11}>
                    <Dropdown overlay={this.menu} placement="bottomRight">
                      <Avatar icon={<UserOutlined />} size="large" />
                    </Dropdown>
                  </Col> */}
              </Row>
            </Header>

            <Content style={{ padding: '0 50px' }}>
              <div
                className="site-layout-content"
                style={{ minHeight: 280, padding: 24 }}
              >
                {this.props.children}
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Student Portrait ©2021 Created by 215
            </Footer>
          </Layout>
        ) : null}
      </div>
    );
  }
}

// messagelist

export default connect(({ user, authority, messagelist }: any) => ({
  user,
  authority,
  ...messagelist,
}))(BasicLayout);
