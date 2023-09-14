import { FormInstance } from 'antd/lib/form';
import { DownloadOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import {
  Avatar,
  Button,
  Form,
  Input,
  PageHeader,
  Row,
  Select,
  Cascader,
  Tag,
  Typography,
  Col,
  Space,
  Table,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
// @ts-ignore
import Pic1 from '@/assets/picture/问卷调查EQT.jpg'
// @ts-ignore
import Pic2 from '@/assets/picture/问卷调查IQCAT.jpg'
import Pic3 from '@/assets/picture/问卷调查MAP.png'
import {connect} from "umi";
import StudentReport from '@/pages/StudentReport';

const CharacterAnalysisAnswer = (props:any)=> {
  const [Name,setName]=useState<any>();
  const [PersonCode,setPersonCode]=useState<any>();
  let currentTime = new Date().getTime();
  let timeSpan = 1000;
  //获取问卷链接
  const getQuestionnaireUrl = (id:any,userName:any,account:any) => {
    let newCurrentTime = new Date().getTime()
    console.log(newCurrentTime - currentTime)
    if (newCurrentTime - currentTime > timeSpan){//防止重复点击
      let data = {
        ProductCode : id,
        PersonList:{
          persons:[
            {
              Name:userName,
              Email:"dqzp@hebut.edu.cn",
              PersonCode:account
            }
          ]
        }
      }
      if (props.dispatch){
        props.dispatch({
          //路径：model的namespace+effects函数名
          type: 'Model_CharacterAnalysisModel/getQuestionnaireUrlEffects',
          payload: {
            data :data,
            callback: (value: any) => {
              console.log(value);
            },
          },
        })
      }
    }
    currentTime = newCurrentTime
  }
  //从后端获取学生信息列表
  const  componentDidMount = () => {
    const { dispatch} = props;
    dispatch({
      type: 'user/getcurrentuserinfo',
      payload: {
        callback: (value: any) => {
          //     console.log(value);
          setCurrentUserInfo(JSON.parse(value));
        },
      },
    });

  };
  //获取学生姓名和学号
  const  setCurrentUserInfo = (value: any) => {
    console.log(value)
    setName(value.userName);
    setPersonCode(value.account);

  };
  //表格数据
  interface DataType {
    key: string;
    name: string,
    description: string;
    img: string;
    handler: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title:"",
      width:30,
      align:'center',
      dataIndex:"img",
      render:(text)=> <img src={text}/>
    },
    {
      title: '问卷链接',
      align:'center',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        return <a onClick={()=>{getQuestionnaireUrl(record.key,Name,PersonCode)}}>{record.name}</a>
      },
    },
    {
      title: '描述',
      align:'center',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const data: DataType[] = [
    {
      key: '416912',
      name: 'IQCAT思维能力自适应测验',
      description: '思维能⼒⾃适应测验考察了作答者对数字、图形、⽂字等不同信息的敏感性和逻辑加⼯的能⼒，在⼀定程度上反映了作答者的思维能⼒。通常思维能⼒较⾼的⼈，在⼯作中可能⽐其他⼈更专注，对问题的反应更敏捷，可能表现出更⾼的⼯作绩效。因此作答者的思维能⼒能够有效地预测个⼈未来在职业领域有所成就的可能性。\n' +
        '思维能⼒⾃适应测验基于项⽬反应理论（IRT），并采⽤多阶段测验（MST）技术，能够根据作答者当前的作答情况，从题库抽取符合其能⼒⽔平的下⼀阶段题⽬。相⽐于传统测验，思维能⼒⾃适应测验实现了实时动态调整试卷，题量更少、精度更⾼、作弊更难、作答体验更好。\n' +
        '思维能⼒⾃适应测验得分⾼的⼈，学习新知识、新技能的速度会更快，质量会更⾼。因此，对于不同职位，思维能⼒⾃适应测验都是⼀种⾮常有⽤的⼯具。职位越复杂，该测验对⼯作绩效的预测效果越好。',
      img: Pic2,
      handler:''
    },
    {
      key: '416913',
      name: 'MAP职业性格测验(大学生通用版V3.0)',
      description: 'MAP职业性格测验是⼀套适合中国⽂化背景、应⽤于职业环境、全⾯系统的性格测验。它以智⿍公司经典的胜任⼒MAP模型为理论基础，根据严格规范的程序进⾏开发和修订，经⼤量施测和应⽤，具备良好的信度和效度指标。\n' +
        '测验从M（思维倾向）、A（态度和动⼒）、P（⼈际特点）3个⽅⾯测评性格特征：\n' +
        'M：创新、前瞻性、理论思考、质疑、数据导向、实践性、关注细节\n' +
        'A：情绪稳定、乐观性、坚韧性、尽责、守规性、主动性、成就动机、好胜⼼、内省性、果断性\n' +
        'P：社交⾃信、乐群性、⼈际敏锐、助⼈倾向、⽀配性、说服他⼈、⾃主性\n' +
        '通过全⾯、细致地描绘个体的个性轮廓，测验可根据不同岗位、不同需求和不同⽤途将各性格维度进⾏灵活组合，以对个体的胜任⼒、情商领导⻛格、职业倾向、团队⻆⾊等个⼈特征进⾏有效的预测。',
      img: Pic3,
      handler:''
    },
    {
      key: '416914',
      name: 'EQT情商测验',
      description: '情商测验以丹尼尔•⼽尔曼的情绪智⼒理论为基础，采⽤关键事件法提取和概括⼈们在社会⽣活中发⽣的情景，了解作答者在⾯对情景中的问题时最可能采取的做法，以考察其在情景中，对影响情绪变化的因素、与情绪相关的⾏为进⾏识别判断和调节控制的能⼒。 它能够评估作答者的情绪智⼒，主要包括情绪觉察、情绪调节、⾃我激励、同理⼼和社交技能五个⽅⾯。该测验更加适⽤于需要经常与⼈打交道的⼯作岗位，如销售类岗位、客⼾服务类岗位、⼈⼒资源类岗位等。',
      img: Pic1,
      handler:''
    },
  ];
  //毕业意向调查表渲染页面

  useEffect(()=>{
    componentDidMount()
  },[])
  /*
  ----------------------------------------------------------------------------------------------------------------------
  渲染界面
   */
  return (

    <div style={{ padding: 30, background: ' #ececec', width: '100%' }}>
      {/*学生页面填写模块标题*/}
      <div style={{ marginBottom: 30, backgroundColor: 'white' }}>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
}

//连接的参数名必须是model的namespace
export default connect(({ Model_CharacterAnalysisModel }: any) => ({
  Model_CharacterAnalysisModel,
}))(CharacterAnalysisAnswer);
