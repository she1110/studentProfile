import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {Button, Card, Col, ConfigProvider, Row, Select, Spin, Table,} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons';

import GradePageRadar from './components/GradePageRadar';
import GradePageLine from './components/GradePageLine';

import GradeColumnGPA from './components/GradeColumnGPA';
import GradeColumn5yu from './components/GradeColumn5yu';
import GradeHotMap from './components/GradeHotMap';

export type Props = {
  dispatch?: Dispatch;
  allLoading?: boolean;
  dormitoryReport?: any;
  getUserId?: any;
  phoneAndEmail?: any;
  DormName?: any;

  getClassId?: any;
  gradeReport?: any;
  stackData?: any;
};

const {Option} = Select;

class GradePage extends Component<Props> {
  state = {
    modalTitle: '', //modal标题
    selectedRowKeys: [], // Check here to configure the default column
    tag: 'GPA', // GPA和五育联合图 X轴是什么
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch, DormName} = this.props;
    if (dispatch) {
      dispatch({
        type: 'trainingplan/getGrade',
        payload: {
          year: '2018',
        },
      });
      dispatch({
        type: 'trainingplan/getStackData',
        payload: {
          type: 'enrollyear',
          id: '2018',
        },
      });
    }
  };

  onSelectChange = (selectedRowKeys: any) => {
    this.setState({selectedRowKeys});
  };

  handleOkhandleChange = (value: any) => {
    console.log(value);
    if (value === 'GPA') {
      this.setState({
        tag: 'GPA',
      });
    } else if (value === '五育') {
      this.setState({
        tag: '五育',
      });
    }
  };

  render() {
    const {
      allLoading,
      dormitoryReport,
      getUserId,
      phoneAndEmail,
      getClassId,
      gradeReport,
      stackData,
    } = this.props;
    const {modalTitle, selectedRowKeys, tag} = this.state;
    const classColumns = [
      {
        title: '班级编号',
        dataIndex: 'classId',
        key: 'classId',
      },
      {
        title: '班级名称',
        dataIndex: 'className',
        key: 'className',
        render: (text: any, record: any, index: any) => {
          return (
            <Button
              type="link"
              onClick={() => {
                getClassId(record.classId);
              }}
            >
              {text}
            </Button>
          );
        },
      },
      {
        title: '专业',
        dataIndex: 'classMajor',
        key: 'classMajor',
      },
      {
        title: '学院',
        dataIndex: 'classUnit',
        key: 'classUnit',
      },
      {
        title: '辅导员',
        dataIndex: 'classCounselor',
        key: 'classCounselor',
      },
      {
        title: 'GPA',
        dataIndex: 'classAvgGpa',
        key: 'classAvgGpa',
        render: (text: any, record: any, index: any) => {
          if (text >= record.gradeAverageGpa) {
            return (
              <>
                <span>{text}</span>
                <ArrowUpOutlined style={{color: 'red'}}/>
              </>
            );
          } else {
            return (
              <>
                <span>{text}</span>
                <ArrowDownOutlined style={{color: 'green'}}/>
              </>
            );
          }
        },
        // sorter: {
        //     compare: (a: { gpa: string }, b: { gpa: string }) => a.gpa - b.gpa,
        //     multiple: 1,
        // },
        sorter: {
          compare: (a: { classAvgGpa: string }, b: { classAvgGpa: string }) =>
            a.classAvgGpa.localeCompare(b.classAvgGpa),
          multiple: 2,
        },
      },
      // {
      //     title: 'GPA趋势图',
      //     align: 'center',
      //     // render: (text: any, record: any, index: any) => {
      //     //     return (
      //     //         <div>
      //     //             <MiniChart record={record} dim={'stu'} />
      //     //         </div>
      //     //     )
      //     // },
      // },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div>
        <ConfigProvider locale={zhCN}>
          <Spin spinning={allLoading ? allLoading : false}>
            {gradeReport ? (
              <Card
                title={gradeReport.grade + '级' + ' ' + '基本信息'}
                style={{marginBottom: 30}}
              >
                <Table
                  // dataSource={dormitoryReport.stus}
                  dataSource={gradeReport?.gradeClassData}
                  rowSelection={rowSelection}
                  columns={classColumns}
                />
              </Card>
            ) : null}

            <Card style={{marginBottom: 30}}>
              <Row gutter={8}>
                <Col span={8}>
                  {gradeReport ? (
                    <Card
                      title={gradeReport.grade + '级 ' + '“五育”雷达图'}
                      style={{marginBottom: 30}}
                    >
                      <GradePageRadar
                        selectedRowKeys={selectedRowKeys}
                        studentAllData={gradeReport.gradeClassData}
                        averageData={gradeReport.fiveStatAverger}
                      />
                    </Card>
                  ) : null}
                </Col>
                <Col span={16}>
                  {gradeReport ? (
                    <Card
                      title={gradeReport.grade + '级：GPA趋势对比'}
                      style={{marginBottom: 30}}
                    >
                      <GradePageLine
                        selectedRowKeys={selectedRowKeys}
                        studentAllData={gradeReport.gradeClassData}
                        averageData={gradeReport.gradeAvergerGpaSeme}

                        // averageData={gradeReport.}
                      />
                    </Card>
                  ) : null}
                </Col>
              </Row>
            </Card>

            {stackData && gradeReport ? (
              <Card>
                <Row gutter={12}>
                  <Col span={12}>
                    <Card
                      title={gradeReport.grade + '级 ' + 'GPA-五育 联合热力图'}
                      style={{marginBottom: 30}}
                      extra={<div style={{height: 32}}></div>}
                    >
                      <GradeHotMap GradeHotMapData={stackData.block}/>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      title={gradeReport.grade + '级 ' + 'GPA-五育 联合堆叠图'}
                      extra={
                        <Select
                          defaultValue="GPA"
                          style={{width: 120}}
                          onChange={this.handleOkhandleChange}
                        >
                          <Option value="五育">五育</Option>
                          <Option value="GPA">GPA</Option>
                        </Select>
                      }
                    >
                      {tag === '五育' ? (
                        <GradeColumnGPA stackData={stackData.stack}/>
                      ) : (
                        <GradeColumn5yu stackData={stackData.stack}/>
                      )}
                    </Card>
                  </Col>
                </Row>
              </Card>
            ) : null}
          </Spin>
        </ConfigProvider>
      </div>
    );
  }
}

export default connect(({trainingplan, loading, user}: any) => ({
  ...trainingplan,
  ...user,
  allLoading: loading.effects['trainingplan/dormAndClassProfile'],
}))(GradePage);
