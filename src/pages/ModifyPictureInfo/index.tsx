import React from 'react';
import {Button, Card, Col, Divider, Drawer, message, Modal, Row, Select, Space, Table, Upload,} from 'antd';
import type {Dispatch} from 'umi';
import {connect} from 'umi';

const {Option} = Select;

export type Props = {
  dispatch: Dispatch;
  // allapplist: number[],
  // picturelist: number[],
  // creatorlist: string[],
  // colorblockloading: boolean,
  // tag: boolean,
};

class ModifyPictureInfo extends React.Component<Props> {
  state = {
    isModalVisible: false,
    CLASSID: 0,
    ClassGroup: [],
    ClassOne: [],
    PrinciplesVisible: false, //学则Drawer
    CreditVisible: false, //学分Drawer
    PrinciplesMajor: '', //学则专业
    PrinciplesYear: '', //学则入学年份
    CreditMajor: '', //学分专业
    CreditYear: '', //学分入学年份
  };

  showPrinciplesDrawer = () => {
    this.setState({
      PrinciplesVisible: true,
    });
  };
  showCreditDrawer = () => {
    this.setState({
      CreditVisible: true,
    });
  };
  onPrinciplesDrawerClose = () => {
    this.setState({
      PrinciplesVisible: false,
    });
  };
  onCreditDrawerClose = () => {
    this.setState({
      CreditVisible: false,
    });
  };

  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'picture/tryLog',
        payload: {
          callback: this.ljh,
        },
      });
      dispatch({
        type: 'application/getMajor',
      });
    }
  };

  ljh = (value: any) => {
    console.log(value);
    this.setState({
      ClassGroup: value.data,
    });
  };

  handleOk = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  handleChange = (value: any) => {
    console.log(value);
    let ljh = {
      PCLASSID: value.CLASSID,
    };
    // console.log(ljh);
    this.props
      .dispatch({
        type: 'picture/getClassDetail',
        payload: ljh,
      })
      .then(() => {
        this.setState({
          ClassOne: this.props.picture.classdetail,
        });
      })
      .then(() => {
        console.log(this.state.ClassOne);
      });

    this.setState({
      isModalVisible: true,
    });
  };

  onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  downloadHandleChange = (value: any) => {
    let ljh = {
      CLASSID: value.CLASSID,
    };

    this.props.dispatch({
      type: 'picture/attrTextDownload',
      payload: ljh,
    });
  };

  setClassID = (value: any) => {
    this.setState({
      CLASSID: value.CLASSID,
    });
  };
  setPrinciplesMajor = (value: any) => {
    this.setState({
      PrinciplesMajor: value,
    });
  };
  setPrinciplesYear = (value: any) => {
    this.setState({
      PrinciplesYear: value,
    });
  };
  setCreditMajor = (value: any) => {
    this.setState({
      CreditMajor: value,
    });
  };
  setCreditYear = (value: any) => {
    this.setState({
      CreditYear: value,
    });
  };

  render() {
    const props = {
      name: 'file',
      action: 'http://10.1.40.85:8087/uploadattrtext',
      // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text',
      },
      // showUploadList: false,
      maxCount: 1,
      data: {CLASSID: this.state.CLASSID},
      onChange(info: any) {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    const propsPrinciples = {
      name: 'file',
      action: 'http://10.1.40.85:8087/updateExamByMajAndYear',
      headers: {
        // authorization: 'authorization-text',
        Authorization: localStorage.getItem('token') as string,
      },
      maxCount: 1,
      data: {
        majorid: this.state.PrinciplesMajor,
        enrollyear: this.state.PrinciplesYear,
      },
      onChange(info: any) {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 文件上传成功`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败`);
        }
      },
    };
    const propsCredit = {
      name: 'file',
      action: 'http://10.1.40.85:8087/updateStudentAttr',
      // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        // authorization: 'authorization-text',
        Authorization: localStorage.getItem('token') as string,
      },
      // showUploadList: false,
      maxCount: 1,
      data: {
        majorid: this.state.CreditMajor,
        enrollyear: this.state.CreditYear,
      },
      onChange(info: any) {
        if (info.file.status !== 'uploading') {
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 文件上传成功`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败`);
        }
      },
    };
    const columns = [
      {
        title: '班级ID',
        dataIndex: 'CLASSID',
        key: 'CLASSID',
        align: 'center',
      },
      {
        title: '班级名称',
        dataIndex: 'CLASS_NAME',
        key: 'CLASS_NAME',
        align: 'center',
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (text: any, record: any) => (
          <Space size="middle">
            <Button type="link" onClick={() => this.handleChange(record)}>
              查询信息{' '}
            </Button>
            <Button
              type="link"
              onClick={() => this.downloadHandleChange(record)}
            >
              导出编辑{' '}
            </Button>

            <Upload {...props}>
              <a onClick={() => this.setClassID(record)}>上传覆盖</a>
            </Upload>
          </Space>
        ),
      },
    ];
    const StudentColumns = [
      {
        title: '学号',
        dataIndex: 'userid',
        key: 'userid',
      },
      {
        title: '姓名',
        dataIndex: 'username',
        key: 'username',
        align: 'center',
      },
      {
        title: '班级',
        dataIndex: 'classid',
        key: 'classid',
      },
      {
        title: '入学年份',
        dataIndex: 'enrollyear',
        key: 'enrollyear',
        align: 'center',
      },
      {
        title: '专业',
        dataIndex: 'majorid',
        key: 'majorid',
        align: 'center',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '籍贯省',
        dataIndex: 'nativeprovince',
        key: 'nativeprovince',
      },
      {
        title: '籍贯市',
        dataIndex: 'nativecity',
        key: 'nativecity',
      },
      {
        title: '民族',
        dataIndex: 'nation',
        key: 'nation',
      },
      {
        title: '政治面貌',
        dataIndex: 'politics',
        key: 'politics',
      },
      {
        title: '班级职务',
        dataIndex: 'classposition',
        key: 'classposition',
      },
      {
        title: '学院职务',
        dataIndex: 'unionposition',
        key: 'unionposition',
      },
      {
        title: '生源地省',
        dataIndex: 'sourceprovince',
        key: 'sourceprovince',
      },
      {
        title: '生源地市',
        dataIndex: 'sourcecity',
        key: 'sourcecity',
      },
      {
        title: '宿舍',
        dataIndex: 'dormitory',
        key: 'dormitory',
      },
      {
        title: '学院',
        dataIndex: 'united',
        key: 'united',
        align: 'center',
      },
    ];

    return (
      <div
        className="site-card-border-less-wrapper"
        style={{padding: 30, background: ' #ececec'}}
      >
        <Card
          title="画像/学则信息维护"
          bordered={false}
          extra={
            <Space>
              <Button type="primary" onClick={this.showPrinciplesDrawer}>
                学则文件
              </Button>
              <Button type="primary" onClick={this.showCreditDrawer}>
                学分文件
              </Button>
            </Space>
          }
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Table columns={columns} dataSource={this.state.ClassGroup}/>
            </Col>
          </Row>
        </Card>

        <Modal
          width="1600px"
          centered
          title="班级详细信息"
          visible={this.state.isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Table columns={StudentColumns} dataSource={this.state.ClassOne}/>
        </Modal>

        <Drawer
          width="400px"
          title="学则信息维护"
          closable={false}
          // placement="left"
          onClose={this.onPrinciplesDrawerClose}
          visible={this.state.PrinciplesVisible}
          key="1"
        >
          <Row gutter={24} align="middle">
            <Col span={4}>
              <span style={{fontSize: 16}}>专业:</span>
            </Col>
            <Col span={16}>
              <Select
                // defaultValue="lucy"
                style={{width: 230}}
                onChange={this.setPrinciplesMajor}
              >
                {this.props.application.majorlist.map(
                  (element: any, index: any) => {
                    return (
                      <Option value={element.MAJOR_ID} key={index}>
                        {element.MAJOR_NAME}
                      </Option>
                    );
                  },
                )}
              </Select>
            </Col>
          </Row>
          <Divider/>
          <Row gutter={24} align="middle">
            <Col span={4}>
              <span style={{fontSize: 16}}>年级:</span>
            </Col>
            <Col span={16}>
              <Select
                // defaultValue="lucy"
                style={{width: 230}}
                onChange={this.setPrinciplesYear}
              >
                <Option value="2017">2017</Option>
                <Option value="2018">2018</Option>
                <Option value="2019">2019</Option>
                <Option value="2020">2020</Option>
              </Select>
            </Col>
          </Row>
          <Divider/>
          <Upload {...propsPrinciples}>
            <Button type="primary">上传学则文件</Button>
          </Upload>
        </Drawer>

        <Drawer
          width="400px"
          title="学分信息维护"
          closable={false}
          // placement="left"
          onClose={this.onCreditDrawerClose}
          visible={this.state.CreditVisible}
          key="2"
        >
          <Row gutter={24} align="middle">
            <Col span={4}>
              <span style={{fontSize: 16}}>专业:</span>
            </Col>
            <Col span={16}>
              <Select
                // defaultValue="lucy"
                style={{width: 230}}
                onChange={this.setCreditMajor}
              >
                {this.props.application.majorlist.map(
                  (element: any, index: any) => {
                    return (
                      <Option value={element.MAJOR_ID} key={index}>
                        {element.MAJOR_NAME}
                      </Option>
                    );
                  },
                )}
              </Select>
            </Col>
          </Row>
          <Divider/>
          <Row gutter={24} align="middle">
            <Col span={4}>
              <span style={{fontSize: 16}}>年级:</span>
            </Col>
            <Col span={16}>
              <Select
                // defaultValue="lucy"
                style={{width: 230}}
                onChange={this.setCreditYear}
              >
                <Option value="2017">2017</Option>
                <Option value="2018">2018</Option>
                <Option value="2019">2019</Option>
                <Option value="2020">2020</Option>
              </Select>
            </Col>
          </Row>
          <Divider/>
          <Upload {...propsCredit}>
            <Button type="primary">上传学分文件</Button>
          </Upload>
        </Drawer>
      </div>
    );
  }
}

export default connect(({picture, application}: any) => ({
  picture,
  application,
}))(ModifyPictureInfo);
