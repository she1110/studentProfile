import React, { Component } from 'react';
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
import QuestionnaireTag from "@/pages/CharacterAnalysisTeacher/components/QuestionnaireTag";
import type { ColumnsType } from 'antd/es/table';
import {connect} from "umi";
//要大写
const { Paragraph } = Typography;//说明文字的标签
const CharacterAnalysisTeacher = (props:any)=> {

  //说明文字标签定义
  const content = (
    <>
      <Paragraph>
        电气工程学院性格测评系统是指在学生管理工作中，对学生的性格以及状态做到及时的了解与关怀，为及时了解学生的精神等方面需求，并有针对性的采取一系列措施以帮助学生。
      </Paragraph>
      <Paragraph>
        运行方式是通过学校、学生和家长之间的配合，确保信息沟通和危机预警渠道通畅。
      </Paragraph>
      <Paragraph>
        学生性格调查与分析不属于处分的类别，其目的是为了尽最大的努力帮助对未来有忧虑或者其他方面存在困难的学生。
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
  //性格测试调查表渲染页面
  return (
    <div style={{ padding: 30, background: ' #ececec', width: '100%' }}>
      <div style={{ marginBottom: 30, backgroundColor: 'white' }}>
        {/*学生页面说明模块*/}
        <PageHeader title="电气工程学院性格测评系统" subTitle="学生" tags={<Tag color="blue">运行中</Tag>}
                    avatar={{ src: require('@/assets/picture/毕业意向调查.png') }}
        >
          <Content>
            {content}
            {/*标签页面*/}
            <QuestionnaireTag/>
          </Content>
        </PageHeader>
      </div>
    </div>
  );
}

//连接的参数名必须是model的namespace
export default connect(({ Model_CharacterAnalysisModel }: any) => ({
  Model_CharacterAnalysisModel,
}))(CharacterAnalysisTeacher);
