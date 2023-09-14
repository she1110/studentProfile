import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Spin,
  Table,
  Tabs,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons';
import DownloadExcel from '@/utils/DownloadExcel.js';
import MiniChart from './components/MiniChart/index';
import LineChartDormClass from '../LineChartDormClass/index';
import DormitoryInClassGPA from './components/DormitoryInClassGPA';
import RadarStuDim from './components/RadarStuDim';
import RadarDormDim from './components/RadarDormDim';

import GradeColumnGPA from './components/GradeColumnGPA';
import GradeColumn5yu from './components/GradeColumn5yu';
import GradeHotMap from './components/GradeHotMap';

export type Props = {
  dispatch?: Dispatch;
  allLoading?: boolean;
  classReport?: any;
  getUserId?: any;
  phoneAndEmail?: any;
  getDormName?: any;

  classid?: any;
  stackData?: any;
};
const {TabPane} = Tabs;
const {Option} = Select;

class ClassPage extends Component<Props> {
  state = {
    modalVisible: false, //联系方式 是否弹出
    modalTitle: '', //modal标题
    selectedRowKeys: [], // Check here to configure the default column

    selectedRowKeysDorm: [], //宿舍维度 Check here to configure the default column
    defaultActiveKey: '1',
    tag: 'GPA', // GPA和五育联合图 X轴是什么
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch, classid} = this.props;

    if (dispatch) {
      if (classid) {
        dispatch({
          type: 'trainingplan/dormAndClassProfile',
          payload: {
            type: 'classid',
            id: classid,
          },
        });
        dispatch({
          type: 'trainingplan/getStackData',
          payload: {
            type: 'classid',
            id: classid,
          },
        });
      } else {
        dispatch({
          type: 'trainingplan/dormAndClassProfile',
          payload: {
            type: 'classid',
            id: 1500,
          },
        });
        dispatch({
          type: 'trainingplan/getStackData',
          payload: {
            type: 'classid',
            id: 1500,
          },
        });
      }
    }
  };
  showModal = (value: any) => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/getOneUserByAccount',
        payload: {
          account: value.userid,
        },
      }).then(() => {
        const {phoneAndEmail} = this.props;
        this.formRef.current?.setFieldsValue({
          phone: phoneAndEmail.phone,
          email: phoneAndEmail.email,
        });
      });
    }
    this.setState({
      modalVisible: true,
      modalTitle: value.username,
    });
  };
  handleOk = () => {
    this.setState({
      modalVisible: false,
      modalTitle: '',
    });
  };
  handleCancel = () => {
    this.setState({
      modalVisible: false,
      modalTitle: '',
    });
  };
  handleDownloadExcel = (columns: any, data: any) => {
    const {classReport} = this.props;
    DownloadExcel(columns, data, classReport.typeName + ` 详细信息`, [], () => {
      setTimeout(() => {
        notification.success({message: '导出成功!'});
      }, 300);
    });
  };

  onSelectChange = (selectedRowKeys: any) => {
    this.setState({selectedRowKeys});
  };
  onSelectChangeDorm = (selectedRowKeysDorm: any) => {
    this.setState({selectedRowKeysDorm});
  };
  tabsCallbackTable = (value: any) => {
    this.setState({
      defaultActiveKey: value,
    });
  };

  handleOkhandleChange = (value: any) => {
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
    const {allLoading, classReport, getUserId, getDormName, stackData} =
      this.props;
    const {
      modalTitle,
      modalVisible,
      selectedRowKeys,
      selectedRowKeysDorm,
      defaultActiveKey,
      tag,
    } = this.state;
    const classColumns = [
      {
        title: '学号',
        dataIndex: 'userid',
        key: 'userid',
      },
      {
        title: '姓名',
        dataIndex: 'username',
        key: 'username',
        render: (text: any, record: any, index: any) => {
          return (
            <Button
              type="link"
              onClick={() => {
                getUserId(record.userid);
              }}
            >
              {text}
            </Button>
          );
        },
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '政治面貌',
        dataIndex: 'politics',
        key: 'politics',
      },
      {
        title: '班级',
        dataIndex: 'classid',
        key: 'classid',
      },
      {
        title: '专业',
        dataIndex: 'majorid',
        key: 'majorid',
      },
      {
        title: '学院',
        dataIndex: 'united',
        key: 'united',
      },
      {
        title: '辅导员',
        dataIndex: 'counselorid',
        key: 'counselorid',
      },
      {
        title: '宿舍',
        dataIndex: 'dormitory',
        key: 'dormitory',
      },
      {
        title: 'GPA',
        dataIndex: 'gpa',
        key: 'gpa',
        render: (text: any, record: any, index: any) => {
          if (text >= classReport.gpaAvg) {
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
        sorter: {
          compare: (a: { gpa: number }, b: { gpa: number }) => a.gpa - b.gpa,
          multiple: 1,
        },
      },
      {
        title: 'GPA趋势图',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          return (
            <div>
              <MiniChart record={record} dim={'stu'}/>
            </div>
          );
        },
      },
      {
        title: '联系方式',
        key: 'counselorid',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          return (
            <Button
              onClick={() => {
                this.showModal(record);
              }}
            >
              查看联系方式
            </Button>
          );
        },
      },
    ];

    const classDormityColumns = [
      {
        title: '宿舍名',
        dataIndex: 'DORMITORY',
        key: 'DORMITORY',
        render: (text: any, record: any, index: any) => {
          return (
            <Button
              type="link"
              onClick={() => {
                getDormName(record.DORMITORY);
              }}
            >
              {text}
            </Button>
          );
        },
      },
      {
        title: '德育分值',
        dataIndex: 'VIRTUE',
        key: 'VIRTUE',
      },
      {
        title: '智育分值',
        dataIndex: 'WISDOM',
        key: 'WISDOM',
      },
      {
        title: '体育分值',
        dataIndex: 'SPORTS',
        key: 'SPORTS',
      },
      {
        title: '美育分值',
        dataIndex: 'ART',
        key: 'ART',
      },
      {
        title: '劳动分值',
        dataIndex: 'LABOUR',
        key: 'LABOUR',
      },
      {
        title: '1-1GPA',
        dataIndex: 'GPA11',
        key: 'GPA11',
      },
      {
        title: '1-2GPA',
        dataIndex: 'GPA12',
        key: 'GPA12',
      },
      {
        title: '2-1GPA',
        dataIndex: 'GPA21',
        key: 'GPA21',
      },
      {
        title: '2-2GPA',
        dataIndex: 'GPA22',
        key: 'GPA22',
      },
      {
        title: '3-1GPA',
        dataIndex: 'GPA31',
        key: 'GPA31',
      },
      {
        title: '3-2GPA',
        dataIndex: 'GPA32',
        key: 'GPA32',
      },
      {
        title: '4-1GPA',
        dataIndex: 'GPA41',
        key: 'GPA41',
      },
      {
        title: '4-2GPA',
        dataIndex: 'GPA42',
        key: 'GPA42',
      },

      {
        title: 'GPA趋势图',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          return (
            <div>
              <MiniChart record={record} dim={'dorm'}/>
            </div>
          );
        },
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const rowSelectionDorm = {
      selectedRowKeysDorm,
      onChange: this.onSelectChangeDorm,
    };
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
    };
    return (
      <div>
        <ConfigProvider locale={zhCN}>
          <Spin spinning={allLoading ? allLoading : false}>
            {classReport ? (
              <>
                <Card style={{marginBottom: 30}}>
                  <Tabs onChange={this.tabsCallbackTable}>
                    <TabPane tab="学生维度" key="1">
                      <Card
                        title={classReport.typeName + ' ' + '基本信息'}
                        style={{marginBottom: 30}}
                        extra={
                          <>
                            <Button
                              type="primary"
                              onClick={() => {
                                this.handleDownloadExcel(
                                  classColumns,
                                  classReport.stus,
                                );
                              }}
                            >
                              下载 Excel
                            </Button>
                          </>
                        }
                      >
                        {classReport.stus ? (
                          <Table
                            dataSource={classReport.stus}
                            columns={classColumns}
                            rowSelection={rowSelection}
                            pagination={paginationProps}
                          />
                        ) : null}
                      </Card>
                    </TabPane>
                    <TabPane tab="宿舍维度" key="2">
                      <Card
                        title={classReport.typeName + ' ' + '基本信息'}
                        style={{marginBottom: 30}}
                        extra={
                          <>
                            <Button
                              type="primary"
                              onClick={() => {
                                this.handleDownloadExcel(
                                  classDormityColumns,
                                  classReport.dormitoryInfo,
                                );
                              }}
                            >
                              下载 Excel
                            </Button>
                          </>
                        }
                      >
                        {classReport.dormitoryInfo ? (
                          <Table
                            dataSource={classReport.dormitoryInfo}
                            columns={classDormityColumns}
                            rowSelection={rowSelectionDorm}
                            pagination={paginationProps}
                          />
                        ) : null}
                      </Card>
                    </TabPane>
                  </Tabs>
                </Card>

                <Card style={{marginBottom: 30}}>
                  <Tabs activeKey={defaultActiveKey}>
                    <TabPane tab="学生维度" key="1">
                      <Row gutter={8}>
                        <Col span={8}>
                          <Card
                            title={classReport.typeName + ' ' + '“五育”雷达图'}
                            style={{marginBottom: 30}}
                          >
                            {classReport.fiveStar ? (
                              <RadarStuDim
                                fiveStar={classReport?.fiveStar}
                                selectedRowKeys={selectedRowKeys}
                                studentAllData={classReport.stus}
                              />
                            ) : null}
                          </Card>
                        </Col>
                        <Col span={16}>
                          <Card
                            title={'学生维度下：GPA趋势对比'}
                            style={{marginBottom: 30}}
                          >
                            {classReport.gpaTrend ? (
                              <LineChartDormClass
                                gpaTrend={classReport?.gpaTrend}
                                selectedRowKeys={selectedRowKeys}
                                studentAllData={classReport.stus}
                              />
                            ) : null}
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tab="宿舍维度" key="2">
                      <Row gutter={8}>
                        <Col span={8}>
                          <Card
                            title={classReport.typeName + ' ' + '“五育”雷达图'}
                            style={{marginBottom: 30}}
                          >
                            {classReport.fiveStar ? (
                              <RadarDormDim
                                fiveStar={classReport?.fiveStar}
                                selectedRowKeys={selectedRowKeysDorm}
                                studentAllData={classReport.dormitoryInfo}
                              />
                            ) : null}
                          </Card>
                        </Col>
                        <Col span={16}>
                          <Card
                            title={'宿舍维度下：GPA趋势对比'}
                            style={{marginBottom: 30}}
                          >
                            {classReport.gpaTrend ? (
                              <DormitoryInClassGPA
                                gpaTrend={classReport?.gpaTrend}
                                selectedRowKeys={selectedRowKeysDorm}
                                studentAllData={classReport.dormitoryInfo}
                              />
                            ) : null}
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                  </Tabs>
                </Card>

                {stackData ? (
                  <Card>
                    <Row gutter={12}>
                      <Col span={12}>
                        <Card
                          title={
                            classReport.typeName + ' ' + 'GPA-五育 联合热力图'
                          }
                          style={{marginBottom: 30}}
                          extra={<div style={{height: 32}}></div>}
                        >
                          <GradeHotMap GradeHotMapData={stackData.block}/>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card
                          title={
                            classReport.typeName + ' ' + 'GPA-五育 联合堆叠图'
                          }
                          extra={
                            <Select
                              defaultValue="GPA"
                              style={{width: 120}}
                              onChange={this.handleOkhandleChange}
                            >
                              <Option value="GPA">GPA</Option>
                              <Option value="五育">五育</Option>
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
              </>
            ) : null}
          </Spin>
        </ConfigProvider>
        <Modal
          title={modalTitle + ' ' + '联系方式'}
          visible={modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          forceRender
        >
          <Form
            name="basic"
            labelCol={{span: 4}}
            wrapperCol={{span: 18}}
            ref={this.formRef}
          >
            <Form.Item label="手机" name="phone">
              <Input/>
            </Form.Item>

            <Form.Item label="邮箱" name="email">
              <Input/>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default connect(({trainingplan, loading, user}: any) => ({
  ...trainingplan,
  ...user,
  allLoading: loading.effects['trainingplan/dormAndClassProfile'],
}))(ClassPage);
