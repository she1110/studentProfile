import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {Button, Card, Col, ConfigProvider, Form, Input, Modal, Row, Select, Spin, Table,} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons';
import RadarChart from '../RadarChart/index';
import LineChartDormClass from '../LineChartDormClass/index';
import MiniChart from '../ClassPage/components/MiniChart';

export type Props = {
  dispatch?: Dispatch;
  allLoading?: boolean;
  dormitoryReport?: any;
  getUserId?: any;
  phoneAndEmail?: any;
  DormName?: any;
};
const {Option} = Select;

class DormitoryPage extends Component<Props> {
  state = {
    modalVisible: false, //联系方式 是否弹出
    modalTitle: '', //modal标题
    selectedRowKeys: [], // Check here to configure the default column

    tag: 'GPA', // GPA和五育联合图 X轴是什么
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch, DormName} = this.props;
    if (dispatch) {
      if (DormName) {
        dispatch({
          type: 'trainingplan/dormAndClassProfile',
          payload: {
            type: 'dormitory',
            id: DormName,
          },
        });
      } else {
        dispatch({
          type: 'trainingplan/dormAndClassProfile',
          payload: {
            type: 'dormitory',
            id: '红桥校区红桥东院东十二1117',
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
    const {allLoading, dormitoryReport, getUserId, phoneAndEmail} =
      this.props;
    const {modalVisible, modalTitle, selectedRowKeys, tag} = this.state;
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
        title: 'GPA',
        dataIndex: 'gpa',
        key: 'gpa',
        render: (text: any, record: any, index: any) => {
          if (text >= dormitoryReport.gpaAvg) {
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
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div>
        <ConfigProvider locale={zhCN}>
          <Spin spinning={allLoading ? allLoading : false}>
            {dormitoryReport && dormitoryReport.typeName ? (
              <>
                <Card
                  title={dormitoryReport.typeName + ' ' + '基本信息'}
                  style={{marginBottom: 30}}
                >
                  {dormitoryReport.stus ? (
                    <Table
                      dataSource={dormitoryReport.stus}
                      rowSelection={rowSelection}
                      columns={classColumns}
                    />
                  ) : null}
                </Card>
                <Card style={{marginBottom: 30}}>
                  <Row gutter={8}>
                    <Col span={8}>
                      <Card
                        title={dormitoryReport.typeName + ' ' + '“五育”雷达图'}
                        style={{marginBottom: 30}}
                      >
                        {dormitoryReport.fiveStar ? (
                          <RadarChart
                            fiveStar={dormitoryReport?.fiveStar}
                            selectedRowKeys={selectedRowKeys}
                            studentAllData={dormitoryReport.stus}
                          />
                        ) : null}
                      </Card>
                    </Col>
                    <Col span={16}>
                      <Card
                        title={'宿舍维度下：GPA趋势对比'}
                        style={{marginBottom: 30}}
                      >
                        {dormitoryReport.gpaTrend && dormitoryReport.stus ? (
                          <LineChartDormClass
                            gpaTrend={dormitoryReport.gpaTrend}
                            selectedRowKeys={selectedRowKeys}
                            studentAllData={dormitoryReport.stus}
                          />
                        ) : null}
                      </Card>
                    </Col>
                  </Row>
                </Card>

                {/* <Card>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Card
                        title={'GPA-五育 联合堆叠图'}

                        extra={
                          <Select
                            defaultValue="GPA"
                            style={{ width: 120 }}
                            onChange={this.handleOkhandleChange}
                          >
                            <Option value="GPA">GPA</Option>
                            <Option value="五育">五育</Option>
                          </Select>
                        }
                      >
                        {tag === 'GPA' ? (
                          <GradeColumnGPA />
                        ) : (
                          <GradeColumn5yu />
                        )}
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card
                        title={'GPA-五育 联合热力图'}
                        style={{ marginBottom: 30 }}
                        extra={<div style={{ height: 32 }}></div>}
                      >
                        <GradeHotMap />
                      </Card>
                    </Col>
                  </Row>
                </Card> */}
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
}))(DormitoryPage);
