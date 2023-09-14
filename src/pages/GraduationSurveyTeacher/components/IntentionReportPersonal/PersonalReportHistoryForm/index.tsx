
import { ClockCircleOutlined } from '@ant-design/icons';
import { Button, Cascader, Col, Form, Input, Row, Select, Timeline, Layout } from 'antd';
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { FormInstance } from 'antd/lib/form';
import { connect } from 'umi';
// @ts-ignore
import City from '@/assets/data/area.json'//要大写
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
const { Header, Content, Footer, Sider } = Layout;
const PersonalReportHistoryForm = (props: any) => {
  //console.log("进入" + props.studentId)
  var [formHistoryList, setformHistoryList] = useState([]);
  var [selectState, setSelectState] = useState(0);
  const modifyProfileFormRef = React.createRef<FormInstance>();
  const componentDidMount = () => {
    const { dispatch } = props;
    console.log('获取列表' + props.studentId);
    if (dispatch) {
      dispatch({
        type: 'graduationsurvey/getPersonalGraduationIntentionReport',
        payload: {
          stuId: props.studentId,
          callback: (value: any) => {
            // console.log(value);
            getFormInfo(value)
          },
        },
      });
    }
  };
  //获取列表信息
  const getFormInfo = (value: any) => {
    console.log(value)
    let qwe = [];
    for (let Item of value) {
      //console.log(Item)
      qwe.push(Item)
    }
    console.log(qwe)
    setformHistoryList(qwe)
    console.log(formHistoryList)
    // this.setState({ formHistory: this.state.formHistoryList[1] })
  }
  //表单重置
  const onReset = () => {
    modifyProfileFormRef.current?.setFieldsValue({
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
  //查看历史表单
  const openHistoryForm = (value: any) => {
    console.log(value)
    modifyProfileFormRef.current?.setFieldsValue({
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
      graYear: value.enrollyear,
    })
    onSelect(value.intentionId)
  }
  //历史的动态表单
  const onSelect = (value: any) => {
    switch (value) {
      case '1'||1:
        setSelectState(3584);//111000000000(二进制)=3584（十进制）
        break;
      case '2'||2:
        setSelectState(224);//000011100000(二进制)=224（十进制）
        break;
      case '3'||3:
        setSelectState(256);//000100000000(二进制)=256（十进制）
        break;
      case '4'||4:
        setSelectState(1536);//011000000000(二进制)=1536（十进制）
        break;
      case '5'||5:
        setSelectState(30);//000000011110(二进制)=30（十进制）
        break;
      case '6'||6:
        setSelectState(0);//000000000000(二进制)=0（十进制）
        break;
      case '7'||7:
        setSelectState(1536);//011000000000(二进制)=1536（十进制）
        break;
      case '8'||8:
        setSelectState(1);//000000000001(二进制)=1（十进制）
        break;
      default:
        break;
    }
  }
  useEffect(() => {
    componentDidMount()
  }, [])

  return (
    <Layout style={{ minHeight: '50vh', backgroundColor: 'white', justifyContent: 'center', alignItems: 'flex-start'}}>
      <Sider> </Sider>
      <Sider style={{ minHeight: '50vh' }}>
      <Header className="site-layout-background" style={{ padding: 0 , backgroundColor: 'white'}} />
        <div style={{ minHeight: '50vh', backgroundColor: 'white' }}>
          {formHistoryList.map(item => {
            return (
              <Timeline style={{minHeight: '10vh' }}>
                <Timeline.Item style={{ height: '40px', fontSize: 'large', alignItems: 'center', scale: 'initial' }}><a onClick={() => { onReset; openHistoryForm(item) }} >{item?.updateTime}</a></Timeline.Item>
              </Timeline>)
          })}
        </div>
      </Sider>
      <Layout style={{ backgroundColor: 'white' }} className="site-layout" >
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px', scale: 'initial', backgroundColor: 'white' ,width:'80%',}}>
          <Col>
            <Form
              style={{ backgroundColor: 'white', width: '100%', alignItems: 'center',}}
              name="basic"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 20 }}
              initialValues={{ remember: true }}
              autoComplete="off"
              ref={modifyProfileFormRef}
            >
              <Form.Item name={'stuId'} fieldKey={'stuId'} label="学号" hidden={true}>
                <Input style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
              <Form.Item name={'majorId'} fieldKey={'majorId'} label="专业号" hidden={true} >
                <Input style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
              {/*<Form.Item label="报表时间" name="time" key="time" hidden={true} >
                  {<Input value={this.timeIntemntion} disabled />}
            </Form.Item*/}
              <Form.Item label="姓名" hidden={true}>
                <Input style={{ width: '40%', height: '40px', fontSize: 'large' }} disabled />
              </Form.Item>
              <Form.Item label="专业" hidden={true}>
                <Input style={{ width: '40%', height: '40px', fontSize: 'large' }} disabled />
              </Form.Item>
              <Form.Item label="毕业意向" name="intentionId" key="intentionId">
                <Select options={selectIntentionId} style={{ width: '40%', height: '40px', fontSize: 'large' }} disabled />
              </Form.Item>
              <Form.Item label="第二毕业意向" name="intentionSecId" key="intentionSecId">
                <Select options={selectSecondGraduationIntention} style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
              <Form.Item label="毕业年份" name="graYear" key="graYear" hidden={true}>
                <Input style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
              <Form.Item label="毕业首选城市" name="intentionCity" key="intentionCity" hidden={(selectState & 1024) === 0}>
                <Select options={selectSecondGraduationIntention} style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
              <Form.Item label="预期薪资" name="intentionSalary" key="intentionSalary" hidden={(selectState & 512) === 0}>
                <Select options={selectIntentionSalary} style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
              <Form.Item label="目前状态" name="workState" key="workState" hidden={(selectState & 2048) === 0}>
                <Select options={selectWorkState} style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
              <Form.Item label="目前状态" name="publicState" key="publicState" hidden={(selectState & 256) === 0}>
                <Select options={selectPublicState} style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
              <Form.Item label="报考国家名称" name="country" key="country" hidden={(selectState & 128) === 0}>
                <Input style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
              <Form.Item label="报考学校名称" name="abroadSchool" key="abroadSchool" hidden={(selectState & 64) === 0}>
                <Input style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
              <Form.Item label="目前状态" name="abroadState" key="abroadState" hidden={(selectState & 32) === 0}>
                <Select options={selectAbroadState} style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
              <Form.Item label="报考高校名称" name="postgraduateSchool" key="postgraduateSchool" hidden={(selectState & 16) === 0}>
                <Input style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
              <Form.Item label="报考专业名称" name="major" key="major" hidden={(selectState & 8) === 0}>
                <Input style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
              <Form.Item label="报考学校类型" name="schoolType" key="schoolType" hidden={(selectState & 4) === 0}>
                <Select options={selectSchoolType} style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
              <Form.Item label="目前状态" name="postgraduateState" key="postgraduateState" hidden={(selectState & 2) === 0}>
                <Select options={selectPostgraduateState} style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
              <Form.Item label="主要影响因素" name="reason" key="reason" hidden={(selectState & 1) === 0} >
                <Select options={selectReason} style={{ width: '40%', height: '40px', fontSize: 'large', }} disabled />
              </Form.Item>
            </Form>
          </Col>
        </Content>
      </Layout>
    </Layout>
  );
}
export default connect((graduationsurvey: any) => ({

  graduationsurvey,
}))(PersonalReportHistoryForm);
