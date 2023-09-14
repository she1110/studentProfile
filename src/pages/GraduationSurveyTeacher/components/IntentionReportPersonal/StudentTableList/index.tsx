import type { TableColumnsType } from 'antd';
import React, { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Popconfirm, Space, Table, Col, Input, Card, Layout } from "antd";
import { connect } from "umi";
import { color } from 'echarts';
/*
表格数据
 */
interface StudentListType {
  key: string;
  studentName: string;
  studentId: string;
  studentClass: string;
  studentMajor: string;
}


const StudentTableList = (props: any) => {
  //定义表格列的属性
  const { Search } = Input;
  const { Content } = Layout
  const columns: ColumnsType<StudentListType> = [
    {
      title: '姓名',
      dataIndex: 'studentName',
      key: 'studentName',
      width: '20%',
      align: "center",
      //render: text => <a onClick={()=>{props.addTagsClick(text)}}>{text}</a>
      render: (_, record) => (
        <a onClick={() => { props.addTagsClick(record) }}>{record.studentName}</a>
      ),
    },
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
      width: '20%',
      align: "center",
      sorter: (a, b) => a.studentId - b.studentId
    },
    {
      title: '专业',
      dataIndex: 'studentMajor',
      key: 'studentMajor',
      width: '20%',
      align: "center",
    },
    {
      title: '班级',
      dataIndex: 'studentClass',
      key: 'studentClass',
      width: '20%',
      align: "center",
    }
  ];

  const [data, setData] = useState<StudentListType[]>(
    //   [
    //   {
    //     key:'181418',
    //     studentName:'佘甲帅',
    //     studentId:'181418',
    //     studentClass:'计183',
    //     studentMajor:'计算机科学与技术专业'
    //   },
    //   {
    //     key:'185853',
    //     studentName:'周佳丽',
    //     studentId:'185853',
    //     studentClass:'计181',
    //     studentMajor:'计算机科学与技术专业'
    //   }
    // ]
  );
  /*
  异步操作
  ----------------------------------------------------------------------------------------------------------------------
   */

  const onSearch = (value: any) => {
    let values = {
      accountId: props.Model_GraduationSurveyTeacherModel.accountId,
      roleId: props.Model_GraduationSurveyTeacherModel.currentRoleId,
      studentName: value
    }
    if (value === '') setData(props.Model_GraduationSurveyTeacherModel.studentList)
    else {
      let profileNameFuzzyListCopy: any = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].studentName.includes(value)) {
          let name = {
            key: data[i].key,
            studentName: data[i].studentName,
            studentId: data[i].studentId,
            studentClass: data[i].studentClass,
            studentMajor: data[i].studentMajor
          }
          profileNameFuzzyListCopy.push(name)
        }
      }
      setData(profileNameFuzzyListCopy)
    }
    // if (props.dispatch) {
    //   props.dispatch({
    //     type: 'Model_GraduationSurveyTeacherModel/getStudentFromSerices',
    //     payload: {
    //       value: values,
    //       callback: (value: any) => {
    //         setData(data?.filter(v => v.studentName === value.studentName))
    //       },
    //     },
    //   });
    // }
  }
  useEffect(() => {
    if (props.Model_GraduationSurveyTeacherModel.studentList.length !== 0) {
      setData(props.Model_GraduationSurveyTeacherModel.studentList)
    }
  }, [props])
  return (
    <Layout style={{ backgroundColor: 'white' }} >
      <Search
        placeholder="请输入姓名"
        style={{ width: 208, alignSelf: 'end' }}
        onSearch={onSearch}
      />
      <Content>
        <Table columns={columns} dataSource={data} scroll={{ y: 300 }} />
      </Content>
    </Layout>
  )
}

export default connect(({ Model_GraduationSurveyTeacherModel }: any) => ({
  Model_GraduationSurveyTeacherModel,
}))(StudentTableList);

