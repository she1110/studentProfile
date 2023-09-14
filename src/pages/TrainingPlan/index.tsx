import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {Button, Col, Drawer, Form, Input, message, PageHeader, Row, Select, Tag, Typography, Upload,} from 'antd';
import {FormInstance} from 'antd/lib/form';
import {PlusOutlined, RedoOutlined, UploadOutlined,} from '@ant-design/icons';

const {Search} = Input;
const {Option} = Select;
const {Paragraph} = Typography;

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
  unitlist: object[];
};

class TrainingPlan extends Component<Props> {
  state = {
    drawerVisible: false, //右侧抽屉是否可见
    trainPlanName: undefined,
    grade: undefined,
    majorId: undefined,
    unitId: undefined,
    FuzzyValue: [], //模糊查询的下拉框
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/getBaseInfo',
        payload: {
          type: 'unit',
        },
      });
    }
  };

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  onClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  onFinish = (value: any) => {
    console.log(value);
    this.setState({
      trainPlanName: value.trainPlanName,
      grade: value.grade,
      majorId: value.majorId,
      unitId: value.unitId,
    });
  };

  //专业 模糊查询框
  handleSearch = (str: any) => {
    const {dispatch} = this.props;
    if (str) {
      dispatch({
        type: 'portrait/getLike',
        payload: {
          payload: {
            id: 8,
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

  reset = (info: any) => {
    const {dispatch} = this.props;
    if (info.file.status === 'uploading') {
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
      this.formRef.current?.resetFields();
      this.setState({
        drawerVisible: false,
      });
      if (dispatch) {
        dispatch({
          type: 'trainingplan/getTrainPlan',
        });
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };

  render() {
    const {dispatch, unitlist} = this.props;
    const {drawerVisible, trainPlanName, grade, majorId, unitId, FuzzyValue} =
      this.state;

    const content = (
      <>
        <Paragraph>
          培养计划应当体现专业教学标准规定的各要素和学生培养的主要环节要求。
        </Paragraph>
        <Paragraph>
          学校可根据区域经济社会发展需求、办学特色和专业实际制订专业学生培养方案。
        </Paragraph>
        <Paragraph>
          学生培养方案包括课程编号、课程名称、课程类别、课程属性、课程标签和学分等内容。
        </Paragraph>
      </>
    );

    const Content = ({children, extraContent}: any) => (
      <Row>
        <div style={{flex: 1}}>{children}</div>
        <div className="image">{extraContent}</div>
      </Row>
    );
    const propsPrinciples = {
      name: 'file',
      action: 'http://10.1.40.84:8072/submitTrainPlan',
      headers: {
        // authorization: 'authorization-text',
        Authorization: localStorage.getItem('token') as string,
      },
      maxCount: 1,
      data: {
        param: JSON.stringify({
          trainPlanName: trainPlanName,
          grade: grade,
          majorId: majorId,
          unitId: unitId,
        }),
      },
    };

    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        {/* <Button onClick={() => {
                    console.log(unitlist);
                }}>ce</Button> */}
        <div style={{marginBottom: 30, backgroundColor: 'white'}}>
          <PageHeader
            title="培养计划管理"
            subTitle="包含多学校多专业的培养计划"
            tags={<Tag color="blue">运行中</Tag>}
            extra={[
              // <Search
              //     key={'Search'}
              //     placeholder="创建者"
              //     style={{ width: 208 }}
              // />,
              <Button
                key={'reset'}
                icon={<RedoOutlined/>}
                onClick={() => {
                  if (dispatch) {
                    dispatch({
                      type: 'trainingplan/getTrainPlan',
                    });
                  }
                }}
              >
                刷新列表
              </Button>,
              <Button
                type="primary"
                icon={<PlusOutlined/>}
                key={'create'}
                onClick={this.showDrawer}
              >
                添加培养计划
              </Button>,
            ]}
            avatar={{src: require('@/assets/picture/培养计划.png')}}
          >
            <Content
              extraContent={
                <img
                  src="https://gw.alipayobjects.com/zos/antfincdn/K%24NnlsB%26hz/pageHeader.svg"
                  alt="content"
                  width="100%"
                />
              }
            >
              {content}
            </Content>
          </PageHeader>
        </div>

        {this.props.children}

        <Drawer
          title="添加培养计划"
          placement="right"
          onClose={this.onClose}
          visible={drawerVisible}
          width="500px"
        >
          {/* <Spin spinning={Loading ? Loading : false}> */}
          <Form layout="vertical" onFinish={this.onFinish} ref={this.formRef}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="trainPlanName"
                  label="培养计划名称"
                  rules={[{required: true, message: '请输入用户画像名称'}]}
                >
                  <Input placeholder="培养计划名称"/>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="grade"
                  label="培养计划年级"
                  rules={[{required: true, message: '请输入培养计划年级'}]}
                >
                  <Select>
                    <Option value="2021">2021</Option>
                    <Option value="2020">2020</Option>
                    <Option value="2019">2019</Option>
                    <Option value="2018">2018</Option>
                    <Option value="2017">2017</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="majorId"
                  label="培养计划专业"
                  rules={[{required: true, message: '请输入培养计划专业'}]}
                >
                  <Select
                    showSearch
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={(str: any) => {
                      this.handleSearch(str);
                    }}
                    notFoundContent={null}
                  >
                    {FuzzyValue?.map((element: any, index: any) => {
                      return (
                        <Option key={index} value={element.VALUE}>
                          {element.LABEL}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="unitId"
                  label="培养计划学院"
                  rules={[{required: true, message: '请输入培养计划学院'}]}
                >
                  <Select>
                    {unitlist?.map((element: any, index: any) => {
                      return (
                        <Option key={index} value={element.UNIT_ID}>
                          {element.UNIT_NAME}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="file"
                  // label="培养计划文件"
                  // rules={[{ required: true, message: '请输入培养计划文件' }]}
                >
                  {/* beforeUpload={beforeUpload} */}
                  <Upload
                    {...propsPrinciples}
                    onChange={(info: any) => {
                      this.reset(info);
                    }}
                  >
                    <Button
                      icon={<UploadOutlined/>}
                      type="primary"
                      htmlType="submit"
                    >
                      点击上传文件
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            {/* <Divider />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        创建培养计划
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row> */}
          </Form>
          {/* </Spin > */}
        </Drawer>
      </div>
    );
  }
}

export default connect(({user, loading}: any) => ({
  ...user,
  // AddLoading: loading.effects['application/appAdd'],
}))(TrainingPlan);
