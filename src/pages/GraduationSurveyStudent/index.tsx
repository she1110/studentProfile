import React, { Component, useState } from 'react';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import { FormInstance } from 'antd/lib/form';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, PageHeader, Row, Select, Cascader, Tag, Typography, Col, } from 'antd';
import { isLoginStatus } from '@/utils/loginStatusChecker';
import { Timeline, TimePicker, } from 'antd';
import moment from 'moment';
// @ts-ignore
import City from '@/assets/data/area.json'//要大写
const { Paragraph } = Typography;//说明文字的标签
//选择器属性
const selectIntentionId = [{ value: '1', label: '打算找工作' }, { value: '2', label: '准备出国留学' }, { value: '3', label: '准备公务员、事业单位考试、基层就业' }, { value: '4', label: '准备灵活就业（主播、线上教师、兼职）' }, { value: '5', label: '准备考研' }, { value: '6', label: '准备应征入伍' }, { value: '7', label: '准备自主创业' }, { value: '8', label: '感到迷茫，没有计划' }];
const selectSecondGraduationIntention = [{ value: '0', label: '暂不就业' }, { value: '1', label: '企业求职' }, { value: '9', label: '二战考研' }, { value: '3', label: '参加公招考试' }, { value: '7', label: '自主创业' }, { value: '2', label: '出国留学' }, { value: '6', label: '应征入伍' }];
const selectIntentionSalary = [{ value: 1, label: '6000元以上' }, { value: 2, label: '5000-6000元' }, { value: 3, label: '4000-5000元' }, { value: 4, label: '3000-4000元' }];
const selectWorkState = [{ value: 0, label: '已签署三方协议' }, { value: 1, label: '还未投简历' }, { value: 2, label: '已投简历但未面试' }, { value: 3, label: '已经面试但没有offer' }, { value: 4, label: '已有offer' }];
const selectAbroadState = [{ value: 0, label: '申请留学成功' }, { value: 1, label: '通过校内测试，无需语言考试' }, { value: 2, label: '未参加过相关的语言考试' }, { value: 3, label: '未通过申请学校所在地的语言考试' }, { value: 4, label: '已通过申请学校所在地的语言考试' }, { value: 5, label: '已通过学校的入学考试，但未通过语言考试' }];
const selectPublicState = [{ value: 1, label: '刚产生备考想法不久' }, { value: 2, label: '仍在犹豫是否备考' }, { value: 3, label: '已经准备笔试半年以上' }, { value: 4, label: '作为找工作的备选方案' }];
const selectSchoolType = [{ value: 1, label: '985院校' }, { value: 2, label: '211院校' }, { value: 3, label: '本校' }, { value: 4, label: '其他院校' }];
const selectPostgraduateState = [{ value: 1, label: '已录取' }, { value: 2, label: '备考' }, { value: 3, label: '其他' }];
const selectReason = [{ value: 1, label: '想花点时间调整一下个人心态' }, { value: 2, label: '担心找不到工作碰壁，害怕受到打击' }, { value: 3, label: '家庭支持缓就业，等待好机会' }, { value: 4, label: '身体或家庭情况不允许' }, { value: 5, label: '其他' }];
interface intentionCity { value: string; label: string; children?: intentionCity[]; }
const intentionCitys: intentionCity[] = City;
//学生信息，后端获取，默认填充，不能更改
export type user = {
  username: string;
  majorId: string;
  stuId: string;
};
export type formType = {
  intentionId: string;
  intentionSecId: string;
  intentionCity: string;
  intentionSalary: string;
  workState: string;
  abroadState: string;
  country: string;
  abroadSchool: string;
  publicState: string;
  postgraduateSchool: string;
  major: string;
  schoolType: string;
  postgraduateState: string;
  reason: string;
  updateTime: string;
  graYear: string;
}
//毕业表单信息
export type GraduationSurveyStudentType = {
  dispatch?: Dispatch;
  graduateSurvey?: any;
  currentUserInfo: object[];
  currrentuser: user;
  formList: formType;
  userId?: any;
  studentReport?: {
    baseInfo?:
    | {
      姓名: string;
      //  平均绩点: string;
      //  辅导员: string;
      //  入学年份: string;
      专业: string;
      //  性别: string;
      //  班级职务: string;
      //  民族: string;
      //  班级: string;
      //  学院: string;
      //  政治面貌: string;
      //  学生会职务: string;
      //  学号: string;
      //  班级排名: string;
      //  专业排名: string;
    };
  };

};
//类组件
class GraduationSurveyStudent extends Component<any> {
  state = {
    currentUserInfo: {}, //之前系统带的
    selectState: 0,//用于选择器的联动
    buttonState: false,//用于提交按钮是否隐藏
    buttonState2: true,//用于修改按钮是否隐藏
    wordColorChange: '',//用于修改字体颜色，表示正在展示的页面
    formChange: false,//用于判断是新建表单还是修改表单
    formHistoryList: [],
    stuIdChange: '',
    timeChange: '',
  };
  modifyProfileFormRef = React.createRef<FormInstance>();
  /*
函数功能
----------------------------------------------------------------------------------------------------------------------
 */
  //从后端获取学生信息列表studentReport?: baseInfo?:{}
  componentDidMount = () => {
    if (!isLoginStatus()) return;
    const { dispatch, userId } = this.props;
    const roleTag = localStorage.getItem('roles');
    const userAllMessage = JSON.parse(
      localStorage.getItem('userAllMessage') as string,
    );
    let stuId: any;
    if (roleTag === '2') {
      stuId = userAllMessage.account;
    } else {
      stuId = userId || '181418';
    }
    console.log(stuId)
    this.getPersonalHistoryForm(JSON.parse(stuId));
    if (dispatch) {
      dispatch({
        type: 'user/getcurrentuserinfo',
        payload: {
          callback: (value: any) => {
            //  console.log(value);
            this.setCurrentUserInfo(JSON.parse(value));
          },
        },
      });
      dispatch({
        type: 'trainingplan/personalProfile',
        payload: {
          userid: stuId,
        },
      });
    }
  };
  //获取学生姓名，专业号和学号
  setCurrentUserInfo = (value: any) => {
    this.modifyProfileFormRef.current?.setFieldsValue({
      userName: value.userName,
      majorId: value.majorId,
      stuId: value.account,
    });
  };
  //表单上传成功/失败函数
  onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  onFinish = (values: any) => {
    const { dispatch } = this.props;
    var stuId = this.state.stuIdChange;
    var updateTime = this.state.timeChange;
    var giKeyVo = { stuId, updateTime };
    var gisai = values;
    console.log('Success:', giKeyVo, gisai);
    if (this.state.formChange) {//修改表单
      if (dispatch)
        dispatch({
          type: 'graduationsurvey/graduationSurveyStudentChange',
          payload: {
            giKeyVo,
            gisai,
          },
        });
    } else {//新增表单
      if (dispatch)
        dispatch({
          type: 'graduationsurvey/graduationSurveyStudent',
          payload: {
            values,
          },
        });
    }

  };
  //表单重置
  onReset = () => {
    this.modifyProfileFormRef.current?.setFieldsValue({
      intentionCity: null,
      intentionSalary: null,
      workState: null,
      abroadState: null,
      country: null,
      abroadSchool: null,
      publicState: null,
      postgraduateSchool: null,
      major: null,
      schoolType: null,
      postgraduateState: null,
      reason: null,
    })
  }
  //增加新的表单
  addNewReport = () => {
    this.setState({ selectState: 0 })
    this.modifyProfileFormRef.current?.setFieldsValue({
      intentionId: null,
      intentionSecId: null,
      graYear: null,
      updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),

    })
    this.setState({ buttonState: false })
    this.setState({ buttonState2: true })
  }
  //获取个人所有表单
  getPersonalHistoryForm = (value: any) => {
    const { dispatch } = this.props;
    console.log('获取列表' + value);
    if (dispatch) {
      dispatch({
        type: 'graduationsurvey/getPersonalGraduationIntentionReport',
        payload: {
          stuId: value,
          callback: (value: any) => {
            console.log(value);
            this.getFormInfo(value)
          },
        },
      });
    }
  }
  //获取列表信息
  getFormInfo = (value: any) => {
    // console.log(value)
    let qwe = [];
    for (let Item of value) {
      //console.log(Item)
      qwe.push(Item)
    }
    console.log(qwe)
    this.setState({ formHistoryList: qwe })
    // this.setState({ formHistory: this.state.formHistoryList[1] })
  }
  //查看历史表单
  openHistoryForm = (value: any) => {
    console.log(value);
    this.modifyProfileFormRef.current?.setFieldsValue({
      intentionId: value.intentionId,
      intentionSecId: value.intentionSecId,
      intentionCity: value.intentionCity,
      intentionSalary: value.intentionSalary,
      workState: value.workState,
      abroadState: value.abroadState,
      country: value.country,
      abroadSchool: value.abroadSchool,
      publicState: value.publicState,
      postgraduateSchool: value.postgraduateSchool,
      major: value.major,
      schoolType: value.schoolType,
      postgraduateState: value.postgraduateState,
      reason: value.reason,
      updateTime: value.updateTime,
      graYear: value.graYear,
    })
    this.onSelect(value.intentionId)
    this.setState({ buttonState: true })
  }
  //历史的动态表单
  onSelect = (value: any) => {
    switch (value) {
      case '1' || 1:
        this.setState({ selectState: 3584 });//111000000000(二进制)=3584（十进制）
        break;
      case '2' || 2:
        this.setState({ selectState: 224 });//000011100000(二进制)=224（十进制）
        break;
      case '3' || 3:
        this.setState({ selectState: 256 });//000100000000(二进制)=256（十进制）
        break;
      case '4' || 4:
        this.setState({ selectState: 1536 });//011000000000(二进制)=1536（十进制）
        break;
      case '5' || 5:
        this.setState({ selectState: 30 });//000000011110(二进制)=30（十进制）
        break;
      case '6' || 6:
        this.setState({ selectState: 0 });//000000000000(二进制)=0（十进制）
        break;
      case '7' || 7:
        this.setState({ selectState: 1536 });//011000000000(二进制)=1536（十进制）
        break;
      case '8' || 8:
        this.setState({ selectState: 1 });//000000000001(二进制)=1（十进制）
        break;
      default:
        break;
    }
  }
  //判断表单是否超过更改期限
  timeDifferent = (value: any) => {
    var nowTime = moment().format('YYYY-MM-DD HH:mm:ss')
    var sendTime = value.updateTime;
    console.log(value.updateTime)
    var timeDiff = moment(nowTime).diff(moment(sendTime), 'days')
    if (timeDiff > 7) {
      //this.setState({ colorSign: 'blue' })
      this.setState({ buttonState2: true })
    } else {
      //this.setState({ colorSign: 'blue' })
      this.setState({ buttonState2: false })
      this.modifyProfileFormRef.current?.setFieldsValue({
        updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      })

    }
    console.log(this.state.buttonState2)
  }
  //通过标记颜色识别是否表单是否过期：蓝色未过期；灰色过期
  colorChange = (value: any) => {
    var nowTime = moment().format('YYYY-MM-DD HH:mm:ss')
    var sendTime = value.updateTime;
  //  console.log(value.updateTime)
    var timeDiff = moment(nowTime).diff(moment(sendTime), 'days')
    if (timeDiff > 7) {
      return "gray"
    }
    else {
      return "blue"
    }
  }
  wordColorChange = (value: any) => {
    console.log(value.updateTime);
    this.setState({ wordColorChange: value.updateTime })
    console.log(this.state.wordColorChange);
    
  }
  render() {
    /*
 获取初始信息
 ----------------------------------------------------------------------------------------------------------------------
  */
    const { graduateSurvey, studentReport } = this.props;
    const { } = this.state;

    //说明文字标签定义
    const content = (
      <>
        <Paragraph>
          就业意向调查是指在学生管理工作中，对学生毕业去向意向的调研，为及时了解学生的毕业需求，并有针对性的采取一系列措施以帮助学生顺利度过毕业过渡期。
        </Paragraph>
        <Paragraph>
          运行方式是通过学校、学生和家长之间的配合，确保信息沟通和危机预警渠道通畅，从而帮助学生顺利完成学业。
        </Paragraph>
        <Paragraph>
          就业意向调查不属于处分的类别，其目的是为了尽最大的努力帮助对未来有忧虑或者存在困难的学生。
        </Paragraph>
      </>
    );
    //学生图像标签定义
    const Content = ({ children, extraContent }: any) => (
      <Row>
        <div style={{ flex: 1 }}>{children}</div>
        <div className="image">{extraContent}</div>
      </Row>
    );
    //毕业意向调查表渲染页面
    return (
      <div style={{ padding: 30, background: ' #ececec', width: '100%' }}>
        <div style={{ marginBottom: 30, backgroundColor: 'white' }}>
          {/*学生页面说明模块*/}
          <PageHeader title="毕业意向调查" subTitle="学生" tags={<Tag color="blue">运行中</Tag>}
            avatar={{ src: require('@/assets/picture/毕业意向调查.png') }}>
            <Content
              extraContent={
                graduateSurvey?.picPath ? (
                  <Avatar
                    size={120}
                    src={graduateSurvey.picPath}
                    style={{ marginRight: 20 }}
                  />
                ) : (
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    style={{ marginRight: 20 }}
                  />
                )
              }
            >
              {content}
            </Content>
          </PageHeader>
        </div>
        {/*学生页面填写模块标题*/}
        <div style={{ marginBottom: 30, backgroundColor: 'white' }}>
          <PageHeader title={studentReport?.baseInfo?.姓名 + "同学毕业去向意向调查表"} style={{ alignSelf: 'center' }} />
          <Row style={{ height: '10' }}>
            <Col span={2}></Col>
            {/*学生毕业意向表单填写历史 */}
            <Col span={2}>
              {this.state?.formHistoryList.map(item => {
                return (
                  <Timeline >
                    <Timeline.Item color={this.colorChange(item)}>
                      <a style={{color:this.state.wordColorChange==item?.updateTime?'red':''}} onClick={() => { this.openHistoryForm(item); this.timeDifferent(item); this.setState({ stuIdChange: item?.stuId }); this.setState({ timeChange: item?.updateTime }); this.wordColorChange(item) }} >
                        {item?.updateTime}
                      </a>
                    </Timeline.Item>
                  </Timeline>)
              })}
              <Timeline >
                <Timeline.Item color='red'>
                  <a onClick={() => { this.addNewReport() }}>点击添加</a>
                </Timeline.Item>
              </Timeline>
            </Col>
            {/*学生毕业意向表单 */}
            <Col span={12}>
              <Form
                style={{ backgroundColor: 'white', width: '100%', alignItems: 'center' }}
                name="basic"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 20 }}
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                autoComplete="off"
                ref={this.modifyProfileFormRef}
              >
                <Form.Item name={'stuId'} fieldKey={'stuId'} label="学号" hidden={true}>
                  <Input style={{ width: '100%', height: '40px', fontSize: 'large', }} disabled />
                </Form.Item>
                <Form.Item name={'majorId'} fieldKey={'majorId'} label="专业号" hidden={true} >
                  <Input style={{ width: '100%', height: '40px', fontSize: 'large', }} disabled />
                </Form.Item>
                {/*<Form.Item label="报表时间" name="time" key="time" hidden={true} >
                  {<Input value={this.timeIntemntion} disabled />}
            </Form.Item*/}
                <Form.Item label="姓名" hidden={true}>
                  <Input style={{ width: '100%', height: '40px', fontSize: 'large' }} value={studentReport?.baseInfo?.姓名} disabled />
                </Form.Item>
                <Form.Item label="专业" hidden={true}>
                  <Input style={{ width: '100%', height: '40px', fontSize: 'large' }} value={studentReport?.baseInfo?.专业} disabled />
                </Form.Item>
                <Form.Item label="毕业意向" name="intentionId" key="intentionId">
                  {/*
打算找工作：11000000000 准备灵活就业：11000000000 准备自主创业：11000000000 准备出国留学：00011100000 准备公务员等：00100000000 
准备研究生考试：00000011110 准备应征入伍：00000000000 迷茫：00000000001
其中第i位代表第i个选择器，比如打算找工作是11000000000，说明第一个和第二个选择器可用，
若第一个选择器则让10000000000&11000000000！=0，所以显示;若第三个选择器则让00100000000&11000000000==0，所以不显示
            */}
                  <Select options={selectIntentionId}
                    onClick={this.onReset}
                    onSelect={(value: any) => {
                      switch (value) {
                        case '1':
                          this.setState({ selectState: 3584 });//111000000000(二进制)=3584（十进制）
                          break;
                        case '2':
                          this.setState({ selectState: 224 });//000011100000(二进制)=224（十进制）
                          break;
                        case '3':
                          this.setState({ selectState: 256 });//000100000000(二进制)=256（十进制）
                          break;
                        case '4':
                          this.setState({ selectState: 1536 });//011000000000(二进制)=1536（十进制）
                          break;
                        case '5':
                          this.setState({ selectState: 30 });//000000011110(二进制)=30（十进制）
                          break;
                        case '6':
                          this.setState({ selectState: 0 });//000000000000(二进制)=0（十进制）
                          break;
                        case '7':
                          this.setState({ selectState: 1536 });//011000000000(二进制)=1536（十进制）
                          break;
                        case '8':
                          this.setState({ selectState: 1 });//000000000001(二进制)=1（十进制）
                          break;
                        default:
                          break;
                      }
                    }
                    }
                  />
                </Form.Item>
                <Form.Item label="第二毕业意向" name="intentionSecId" key="intentionSecId">
                  <Select options={selectSecondGraduationIntention} />
                </Form.Item >
                <Form.Item label="毕业年份" name="graYear" key="graYear" hidden={true} >
                  <Input />
                </Form.Item>
                <Form.Item label="毕业首选城市" name="intentionCity" hidden={(this.state.selectState & 1024) === 0} key="intentionCity">
                  <Cascader options={intentionCitys} expandTrigger="hover" />
                </Form.Item>
                <Form.Item label="预期薪资" name="intentionSalary" hidden={(this.state.selectState & 512) === 0} key="intentionSalary">
                  <Select options={selectIntentionSalary} />
                </Form.Item>
                <Form.Item label="目前状态" name="workState" hidden={(this.state.selectState & 2048) === 0} key="workState">
                  <Select options={selectWorkState} />
                </Form.Item>
                <Form.Item label="目前状态" name="publicState" hidden={(this.state.selectState & 256) === 0} key="publicState">
                  <Select options={selectPublicState} />
                </Form.Item>
                <Form.Item label="报考国家名称" name="country" hidden={(this.state.selectState & 128) === 0} key="country">
                  <Input />
                </Form.Item>
                <Form.Item label="报考学校名称" name="abroadSchool" hidden={(this.state.selectState & 64) === 0} key="abroadSchool">
                  <Input />
                </Form.Item>
                <Form.Item label="目前状态" name="abroadState" hidden={(this.state.selectState & 32) === 0} key="abroadState">
                  <Select options={selectAbroadState} />
                </Form.Item>
                <Form.Item label="报考高校名称" name="postgraduateSchool" hidden={(this.state.selectState & 16) === 0} key="postgraduateSchool">
                  <Input />
                </Form.Item>
                <Form.Item label="报考专业名称" name="major" hidden={(this.state.selectState & 8) === 0} key="major">
                  <Input />
                </Form.Item>
                <Form.Item label="报考学校类型" name="schoolType" hidden={(this.state.selectState & 4) === 0} key="schoolType">
                  <Select options={selectSchoolType} />
                </Form.Item>
                <Form.Item label="目前状态" name="postgraduateState" hidden={(this.state.selectState & 2) === 0} key="postgraduateState">
                  <Select options={selectPostgraduateState} />
                </Form.Item>
                <Form.Item label="主要影响因素" name="reason" hidden={(this.state.selectState & 1) === 0} key="reason">
                  <Select options={selectReason} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 16, span: 8 }} name="updateTime" key="updateTime" initialValue={moment().format('YYYY-MM-DD HH:mm:ss')} hidden={this.state.buttonState}>
                  <Button type="primary" htmlType="submit" onClick={() => { this.setState({ formChange: false }); window.location.reload() }}>
                    提交
                  </Button>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 16, span: 8 }} name="updateTime" key="updateTime" initialValue={moment().format('YYYY-MM-DD HH:mm:ss')} hidden={this.state.buttonState2}>
                  <Button type="primary" htmlType="submit" onClick={() => { this.setState({ formChange: true }); window.location.reload() }}>
                    修改
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col span={4}></Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default connect(({ trainingplan, graduationsurvey }: any) => ({
  ...trainingplan,
  graduationsurvey,
}))(GraduationSurveyStudent);
