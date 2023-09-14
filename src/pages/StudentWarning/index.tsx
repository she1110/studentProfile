import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {Avatar, Collapse, Input, PageHeader, Row, Select, Tabs, Tag, Typography,} from 'antd';
import {FormInstance} from 'antd/lib/form';
import {AuditOutlined, TeamOutlined, UserOutlined, UserSwitchOutlined,} from '@ant-design/icons';
import styles from './index.less';
import 'rc-texty/assets/index.css';
import FirstWarning from './components/FirstWarning';
import SecondWarning from './components/SecondWarning';
import ThirdWarning from './components/ThirdWarning';
import FailCourseSum from './components/FailCourseSum';

const {Search} = Input;
const {Option} = Select;
const {Paragraph} = Typography;
const {Panel} = Collapse;
const {TabPane} = Tabs;
const {TextArea} = Input;

export type APP = {
  courseId: string;
  courseName: string;
  courseType: string;
  courseAttr: string;
  courseTag: string;
  credit: string;
  schoolId: string;
};

export type Props = {
  dispatch: Dispatch;
  studentReport?: any;
  sendReportMailLoading?: boolean;
};

class StudentWarning extends Component<Props> {
  state = {
    TabsVisible: '1', //标签页
    picPath: undefined, //头像地址
  };

  formRef = React.createRef<FormInstance>();
  GPATrend = React.createRef<Function>();
  fiveStarBase64 = React.createRef<Function>();

  componentDidMount = () => {
    const {dispatch} = this.props;

    if (dispatch) {
      dispatch({
        type: 'user/getcurrentuserinfo',
        payload: {
          callback: (value: any) => {
            this.setCurrentUserInfo(JSON.parse(value));
          },
        },
      });
    }
  };
  //获取 用户头像
  setCurrentUserInfo = (value: any) => {
    this.setState({
      picPath: value.picPath,
    });
  };

  //各个主题间切换
  TabsOnChange = (value: any) => {
    this.setState({
      TabsVisible: value,
    });
  };
  onSelectChange = (selectedRowKeys: any) => {
    this.setState({selectedRowKeys});
  };

  render() {
    const {studentReport, sendReportMailLoading} = this.props;
    const {TabsVisible} = this.state;
    const roleTag = localStorage.getItem('roles');
    const content = (
      <>
        <Paragraph>
          学籍预警是指在学生管理工作中，针对学生在学习中出现的不良情况，及时告知学生本人及其家长可能产生的不良后果，并有针对性的采取防范措施的一项制度。
        </Paragraph>
        <Paragraph>
          运行方式是通过学校、学生和家长之间的配合，确保信息沟通和危机预警渠道通畅，从而帮助学生顺利完成学业。
        </Paragraph>
        <Paragraph>
          预警不属于处分的类别，预警的目的为了尽最大的努力预先警示处于处分边缘、将有可能受到相应纪律处分的学生。
        </Paragraph>
        <Tabs activeKey={TabsVisible} onChange={this.TabsOnChange} size="large">
          {roleTag === '2' ? null : (
            <>
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <UserSwitchOutlined/>
                    一级预警
                  </span>
                }
                key="1"
              />
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <TeamOutlined/>
                    二级预警
                  </span>
                }
                key="2"
              />
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <AuditOutlined/>
                    三级预警
                  </span>
                }
                key="3"
              />
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <AuditOutlined/>
                    累计挂科
                  </span>
                }
                key="4"
              />
            </>
          )}
        </Tabs>
      </>
    );
    const Content = ({children, extraContent}: any) => (
      <Row>
        <div style={{flex: 1}}>{children}</div>
        <div className="image">{extraContent}</div>
      </Row>
    );
    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        <div style={{marginBottom: 30, backgroundColor: 'white'}}>
          <PageHeader
            title="学籍预警"
            subTitle="划分三种预警等级"
            tags={<Tag color="blue">运行中</Tag>}
            avatar={{src: require('@/assets/picture/学籍预警.png')}}
          >
            <Content
              extraContent={
                studentReport?.picPath ? (
                  <Avatar
                    size={120}
                    src={studentReport.picPath}
                    style={{marginRight: 20}}
                  />
                ) : (
                  <Avatar
                    size={120}
                    icon={<UserOutlined/>}
                    style={{marginRight: 20}}
                  />
                )
              }
            >
              {content}
            </Content>
          </PageHeader>
        </div>
        {TabsVisible === '1' ? <FirstWarning/> : null}
        {TabsVisible === '2' ? <SecondWarning/> : null}
        {TabsVisible === '3' ? <ThirdWarning/> : null}
        {TabsVisible === '4' ? <FailCourseSum/> : null}
      </div>
    );
  }
}

export default connect(({trainingplan, loading}: any) => ({
  ...trainingplan,
  sendReportMailLoading: loading.effects['trainingplan/sendReportMail'],
}))(StudentWarning);
