import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {
  Avatar,
  Button,
  Col,
  Collapse,
  Form,
  Input,
  message,
  Modal,
  PageHeader,
  Row,
  Select,
  Space,
  Spin,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import {
  AuditOutlined,
  CarryOutOutlined,
  DownloadOutlined,
  TeamOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import StudentPage from './components/StudentPage';
import DormitoryPage from './components/DormitoryPage';
import ClassPage from './components/ClassPage/index';
import GradePage from './components/GradePage';
import styles from './index.less';
import 'rc-texty/assets/index.css';
import GPA5yuPage from './components/GPA5yuPage';
import RewordPage from './components/RewordPage';

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

class StudentReport extends Component<Props> {
  state = {
    TabsVisible: '1', //右侧抽屉是否可见
    userId: undefined, //班级或者宿舍主题 传输id 给学生报表
    FuzzyValue: [], //模糊查询的下拉框 班级
    DormitoryFuzzyValue: [], //模糊查询的下拉框  宿舍

    mailVisible: false,
    picPath: undefined, //头像地址
    DormName: undefined, //班级主题 传输宿舍名字 给宿舍主题

    classid: undefined, //
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
  //选中学号，查询个人报表
  onSearch = (value: any) => {
    let regPos = /^[0-9]+.?[0-9]*/;
    value = value.replace(/\s*/g, '');
    const {dispatch} = this.props;
    if (regPos.test(value)) {
      if (dispatch) {
        dispatch({
          type: 'trainingplan/personalProfile',
          payload: {
            userid: value,
          },
        });
        dispatch({
          type: 'trainingplan/identifyDataInProfile',
          payload: {
            userid: value,
          },
        });
      }
    } else {
      message.error('请输入数字！！！');
    }
  };
  //选中宿舍 触发请求
  onSearchDormitory = (value: any) => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'trainingplan/dormAndClassProfile',
        payload: {
          type: 'dormitory',
          id: value,
        },
      });
    }
  };
  //选中班级，查询班级报表
  onSearchClass = (value: any) => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'trainingplan/dormAndClassProfile',
        payload: {
          type: 'classid',
          id: parseInt(value),
        },
      });

      dispatch({
        type: 'trainingplan/getStackData',
        payload: {
          type: 'classid',
          id: parseInt(value),
        },
      });
    }
  };
  //选中年级，查询年级报表
  gradeOnChange = (value: any) => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'trainingplan/getGrade',
        payload: {
          year: value,
        },
      });
      dispatch({
        type: 'trainingplan/getStackData',
        payload: {
          type: 'enrollyear',
          id: value,
        },
      });
    }
  };
  //各个主题间切换
  TabsOnChange = (value: any) => {
    this.setState({
      TabsVisible: value,
    });
  };
  //获取学号 跳转到学生主题
  getUserId = (value: any) => {
    this.setState({
      TabsVisible: '1',
      userId: value,
    });
  };
  //获取宿舍名字 跳转到宿舍主题
  getDormName = (value: any) => {
    this.setState({
      TabsVisible: '2',
      DormName: value,
    });
  };
  //获取班级Id 跳转到班级主题
  getClassId = (value: any) => {
    this.setState({
      TabsVisible: '3',
      classid: value,
    });
  };
  //发送邮件 一套modal函数
  showModal = () => {
    const {studentReport} = this.props;
    this.formRef.current?.setFieldsValue({
      message: studentReport.realWords,
    });
    this.setState({
      mailVisible: true,
    });
  };
  handleOk = () => {
    this.setState({
      mailVisible: false,
    });
  };
  handleCancel = () => {
    this.setState({
      mailVisible: false,
    });
  };
  onFinish = (value: any) => {
    const {dispatch} = this.props;
    var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

    if (reg.test(value.address)) {
      dispatch({
        type: 'trainingplan/sendReportMail',
        payload: {
          file: this.GPATrend.current(),
          message: value.message,
          address: value.address,
        },
      }).then(() => {
        this.setState({
          mailVisible: false,
        });
      });
    } else {
      message.error('邮箱格式不正确');
      return;
    }
  };
  //班级 模糊查询框
  handleSearch = (str: any) => {
    const {dispatch} = this.props;
    if (str) {
      dispatch({
        type: 'portrait/getLike',
        payload: {
          payload: {
            id: 10,
            str: str,
          },
          callback: (value: any) => {
            this.getLikeCallback(value);
          },
        },
      });
    }
  };
  getLikeCallback = (value: any) => {
    this.setState({
      FuzzyValue: value,
    });
  };
  //宿舍 模糊查询框
  handleSearchDormitory = (str: any) => {
    const {dispatch} = this.props;
    if (str) {
      dispatch({
        type: 'portrait/getLike',
        payload: {
          payload: {
            id: 17,
            str: str,
          },
          callback: (value: any) => {
            this.getLikeCallback1(value);
          },
        },
      });
    }
  };
  getLikeCallback1 = (value: any) => {
    this.setState({
      DormitoryFuzzyValue: value,
    });
  };

  //下载成绩单
  DownloadReport = () => {
    const {studentReport} = this.props;
    let studentReportTemp: any = JSON.parse(JSON.stringify(studentReport));
    studentReportTemp.gpaBase64 = this.GPATrend.current();
    studentReportTemp.fiveStarBase64 = this.fiveStarBase64.current();
    console.log(studentReport);
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'trainingplan/DownloadReport',
        payload: studentReportTemp,
      });
    }
  };

  render() {
    const {studentReport, sendReportMailLoading} = this.props;
    const {
      TabsVisible,
      userId,
      FuzzyValue,
      DormitoryFuzzyValue,
      mailVisible,
      picPath,
      DormName,
      classid,
    } = this.state;
    const roleTag = localStorage.getItem('roles');
    const content = (
      <>
        {/* <Button onClick={() => {
          console.log(this.props);
        }}>测试</Button>*/}
        <Paragraph>
          学生的个人报告应该全方位展示学生第一课堂和第二课堂的情况。
        </Paragraph>
        <Paragraph>
          第一课堂，主要以学生参加选课，考试为主，包括选课表、单科考试成绩以及历年绩点成绩。
        </Paragraph>
        <Paragraph>
          第二课堂，主要以学生参与活动、认证证书为主，包含思想政治引领、素质拓展提升、社会实践锻炼、志愿服务公益和自我管理服务等多维度能力培养与评估。
        </Paragraph>
        {/* <Button onClick={() => { console.log(roleTag) }}>ceshi</Button> */}
        <Tabs activeKey={TabsVisible} onChange={this.TabsOnChange} size="large">
          {roleTag === '2' ? null : (
            <>
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <UserSwitchOutlined/>
                    学生主题
                  </span>
                }
                key="1"
              />
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <TeamOutlined/>
                    宿舍主题
                  </span>
                }
                key="2"
              />
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <AuditOutlined/>
                    班级主题
                  </span>
                }
                key="3"
              />
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <AuditOutlined/>
                    年级主题
                  </span>
                }
                key="4"
              />
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <AuditOutlined/>
                    GPA-五育 专题
                  </span>
                }
                key="5"
              />
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <AuditOutlined/>
                    三助一奖 专题
                  </span>
                }
                key="6"
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
        {studentReport?.picPath ? (
          <img src={studentReport?.picPath} hidden id="ljh111"/>
        ) : null}
        <div style={{marginBottom: 30, backgroundColor: 'white'}}>
          <PageHeader
            title="学生报表"
            subTitle="包含学生属性和学生行为"
            tags={<Tag color="blue">运行中</Tag>}
            extra={
              <Space>
                {TabsVisible === '1' && roleTag !== '2' ? (
                  <Space>
                    <Search
                      placeholder="请输入学号"
                      style={{width: 208}}
                      onSearch={this.onSearch}
                    />
                    <Button
                      onClick={this.showModal}
                      icon={<CarryOutOutlined/>}
                      type="primary"
                    >
                      发送邮件
                    </Button>
                    <Button
                      onClick={this.DownloadReport}
                      icon={<DownloadOutlined/>}
                      type="primary"
                    >
                      下载成绩单
                    </Button>
                  </Space>
                ) : null}
                {TabsVisible === '2' ? (
                  <Select
                    placeholder="请输入宿舍"
                    showSearch
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={(str: any) => {
                      this.handleSearchDormitory(str);
                    }}
                    notFoundContent={null}
                    style={{width: 208}}
                    onSelect={this.onSearchDormitory}
                  >
                    {DormitoryFuzzyValue?.map((element: any, index: any) => {
                      return (
                        <Option key={index} value={element.VALUE}>
                          {element.LABEL}
                        </Option>
                      );
                    })}
                  </Select>
                ) : null}
                {TabsVisible === '3' ? (
                  <Select
                    placeholder="请输入班级"
                    showSearch
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={(str: any) => {
                      this.handleSearch(str);
                    }}
                    notFoundContent={null}
                    style={{width: 208}}
                    onSelect={this.onSearchClass}
                  >
                    {FuzzyValue?.map((element: any, index: any) => {
                      return (
                        <Option key={index} value={element.VALUE}>
                          {element.LABEL}
                        </Option>
                      );
                    })}
                  </Select>
                ) : null}
                {TabsVisible === '4' ? (
                  <Select
                    placeholder="请输入年级"
                    // showSearch
                    // defaultActiveFirstOption={false}
                    // showArrow={false}
                    // filterOption={false}
                    // onSearch={(str: any) => {
                    //   this.handleSearch(str);
                    // }}
                    // notFoundContent={null}
                    style={{width: 208}}
                    // onSelect={this.onSearchClass}
                    onChange={this.gradeOnChange}
                  >
                    <Option value={'2017'}>2017</Option>
                    <Option value={'2018'}>2018</Option>
                    <Option value={'2019'}>2019</Option>
                    <Option value={'2020'}>2020</Option>
                  </Select>
                ) : null}
              </Space>
            }
            avatar={{src: require('@/assets/picture/报表.png')}}
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

        {TabsVisible === '1' ? (
          <StudentPage
            GPATrend={this.GPATrend}
            userId={userId}
            fiveStarBase64={this.fiveStarBase64}
          />
        ) : null}
        {TabsVisible === '2' ? (
          <DormitoryPage getUserId={this.getUserId} DormName={DormName}/>
        ) : null}
        {TabsVisible === '3' ? (
          <ClassPage
            getUserId={this.getUserId}
            getDormName={this.getDormName}
            classid={classid}
          />
        ) : null}
        {TabsVisible === '4' ? (
          <GradePage
            getClassId={this.getClassId}
            // getUserId={this.getUserId}
            // getDormName={this.getDormName}
          />
        ) : null}

        {TabsVisible === '5' ? (
          <GPA5yuPage
            getUserId={this.getUserId}
            getDormName={this.getDormName}
            getClassId={this.getClassId}
          />
        ) : null}

        {TabsVisible === '6' ? (
          <RewordPage
            // getUserId={this.getUserId}
            // getDormName={this.getDormName}
            // getClassId={this.getClassId}
          />
        ) : null}

        <Modal
          title="发送邮件"
          visible={mailVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          forceRender
        >
          <Spin
            spinning={sendReportMailLoading ? sendReportMailLoading : false}
          >
            <Form
              name="新建活动"
              onFinish={this.onFinish}
              layout="vertical"
              ref={this.formRef}
            >
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="邮箱"
                    name="address"
                    rules={[{required: true, message: '请输入邮箱'}]}
                  >
                    <Input></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="评语"
                    name="message"
                    rules={[{required: true, message: '请输入评语'}]}
                  >
                    <TextArea rows={4}/>
                  </Form.Item>
                </Col>
              </Row>
              <Button
                type="primary"
                htmlType="submit"
                style={{width: '100%'}}
              >
                发送
              </Button>
            </Form>
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default connect(({trainingplan, loading}: any) => ({
  ...trainingplan,
  sendReportMailLoading: loading.effects['trainingplan/sendReportMail'],
}))(StudentReport);
