import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  PageHeader,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import axios from 'axios';

const {Option} = Select;
const {RangePicker} = DatePicker;

export type Props = {
  dispatch: Dispatch;
  competitionList?: object[]; //竞赛信息列表
};

class CompetitionInfo extends Component<Props> {
  state = {
    dataTable: [], //excel文件中的数据内容
    option: {}, //option代表的就是excel文件
    FuzzyValue: [], //模糊查询的下拉框--专业
    FuzzyValueClass: [], //模糊查询的下拉框--班级

    visble: false, // 查看  modal 是否可见
    tableSource: [], //modal table 数据
    tableTitle: undefined, //modal 标题
  };

  searchFormRef = React.createRef<FormInstance>();
  //查询
  onSearchFinish = (value: any) => {
    const {dispatch} = this.props;

    dispatch({
      type: 'competition/getSoftPaperPatentComp',
      payload: {
        startTime:
          value.time == undefined
            ? undefined
            : moment(value.time[0]).format('YYYY-MM-DD'),
        endTime:
          value.time == undefined
            ? undefined
            : moment(value.time[1]).format('YYYY-MM-DD'),
        majorId: value.majorId == undefined ? undefined : value.majorId,
        classId: value.classId == undefined ? undefined : value.classId,
        enrollyear:
          value.enrollyear == undefined
            ? undefined
            : moment(value.enrollyear).format('YYYY'),
        userid: value.userid == undefined ? undefined : value.userid,
        username: value.username == undefined ? undefined : value.username,
        type: '3', //竞赛信息
        compName: value.compName == undefined ? undefined : value.compName,
        compLevel: value.compLevel == undefined ? undefined : value.compLevel,
        awardLevel:
          value.awardLevel == undefined ? undefined : value.awardLevel,
      },
    });
  };

  //重置
  resetSearchForm = () => {
    this.searchFormRef.current?.resetFields();
    this.props.dispatch({
      type: 'competition/getSoftPaperPatentComp',
      payload: {
        type: '3', //竞赛信息
      },
    });
  };
  //导出竞赛、论文、软著、专利excel表
  handleDownloadExcel = () => {
    const {competitionList} = this.props;
    let payloadTemp: any = JSON.parse(JSON.stringify(competitionList));
    payloadTemp.map((element: any, index: any) => {
      delete element.specColCount;
      delete element.memColCount;
      delete element.columnName;
      delete element.memRowCount;
    });
    const token = localStorage.getItem('token');
    // Send a POST request
    axios({
      method: 'post',
      url: 'http://10.1.40.84:8072/downSppcExcel',
      data: {
        // 这里data中的参数为requestBody参数，服务端需要使用@RequestBody注解进行获取
        type: '3',
        data: payloadTemp,
      },
      responseType: 'arraybuffer',
      headers: {
        // 'Content-Type': 'application/json;charset=utf-8',
        // Accept: 'application/json',
        Authorization: token ? token : '',
      },
    })
      .then(function (res) {
        //设置下载文件类型为xlsx 不同的类型type也不一样，创建URL对象
        let url = window.URL.createObjectURL(
          new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        );
        // 创建A标签
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        // 设置的下载文件文件名
        // const fileName = decodeURI(res.headers['content-disposition'].split(";")[1].split("filename=")[1]);
        // 触发点击方法
        link.setAttribute('download', '竞赛统计表格');
        document.body.appendChild(link);
        link.click();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //专业模糊查询框
  handleSearch = (str: any) => {
    const {dispatch} = this.props;
    if (str) {
      dispatch({
        type: 'competition/getLike',
        payload: {
          payload: {
            id: 8, //专业
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
  //班级 模糊查询框
  handleclassSearch = (str: any) => {
    const {dispatch} = this.props;
    if (str) {
      dispatch({
        type: 'competition/getLike',
        payload: {
          payload: {
            id: 10,
            str: str,
          },
          callback: (value: any) => {
            this.getLikeCallbackclass(value);
          },
        },
      });
    }
  };
  getLikeCallbackclass = (value: any) => {
    this.setState({
      FuzzyValueClass: value,
    });
  };

  //查看modal
  showModal = (value: any) => {
    this.setState({
      visble: true,
      tableSource: value.memberInfo,
      tableTitle: value.compName,
    });
  };
  okModal = (value: any) => {
    this.setState({
      visble: false,
    });
  };
  cancelModal = (value: any) => {
    this.setState({
      visble: false,
    });
  };

  render() {
    const {competitionList} = this.props;
    const {FuzzyValue, FuzzyValueClass, visble, tableSource, tableTitle} =
      this.state;
    const competitonColumns = [
      // {
      //   title: 'ID',
      //   dataIndex: 'id',
      //   key: 'id',
      // },
      {
        title: '项目名称',
        dataIndex: 'compName',
        key: 'compName',
        width: 175,
        align: 'center',
      },
      {
        title: '竞赛级别',
        dataIndex: 'compLevel',
        key: 'compLevel',
        align: 'center',
        // sorter: {
        //   compare: (a, b) => a.compLevel - b.compLevel,
        //   multiple: 3,
        // },
      },
      {
        title: '队长',
        dataIndex: 'concatCap',
        key: 'concatCap',
        align: 'center',
      },
      {
        title: '队员',
        dataIndex: 'concatMember',
        key: 'concatMember',
        align: 'center',
      },
      // {
      //   title: '参赛选手',
      //   align: 'center',
      //   render: (text: any, record: any, index: any) => {
      //     return (<Button type="link" onClick={() => { this.showModal(record) }}>查看</Button>)
      //   },
      // },
      // {
      //   title: '参赛身份',
      //   dataIndex: 'isCap',
      //   key: 'isCap',
      //   align: 'center',
      //   render: (text: any, record: any, index: any) => {
      //     if (text !== null) {
      //       return text == 0 ? <span>队长</span> : <span>队员</span>;
      //     } else {
      //       return <span></span>;
      //     }
      //   },
      // },
      {
        title: '获奖级别',
        dataIndex: 'awardLevel',
        key: 'awardLevel',
        align: 'center',
      },
      {
        title: '指导教师',
        dataIndex: 'professorName',
        key: 'professorName',
        align: 'center',
        // render: (value, row, index) => {
        //   const obj = {
        //     children: value,
        //     props: {},
        //   };
        //   if (index === 2) {
        //     obj.props.rowSpan = 2;
        //   }
        //   // These two are merged into above cell
        //   if (index === 3) {
        //     obj.props.rowSpan = 0;
        //   }
        //   if (index === 4) {
        //     obj.props.colSpan = 0;
        //   }
        //   return obj;
        // },
      },
      {
        title: '参赛时间',
        dataIndex: 'entryTime',
        key: 'entryTime',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (text !== null) {
            return <span>{moment(text).format('YYYY-MM-DD')}</span>;
          } else {
            return <span></span>;
          }
        },
      },
      {
        title: '主办单位',
        dataIndex: 'orgName',
        key: 'orgName',
        align: 'center',
      },
    ];
    const columns = [
      {
        title: '学号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '班级',
        dataIndex: 'className',
        key: 'className',
      },
      {
        title: '专业',
        dataIndex: 'majorName',
        key: 'majorName',
      },
      {
        title: '学院',
        dataIndex: 'unitName',
        key: 'unitName',
      },
    ];
    return (
      <div>
        {/* <Button onClick={() => {
          console.log(competitionList);
        }}>测试</Button> */}
        {/* 模糊查询 */}
        <PageHeader
          className="site-page-header"
          // onBack={() => null}
          ghost={false}
          title="竞赛统计查询"
          extra={
            <Space>
              <Button
                onClick={this.handleDownloadExcel}
                icon={<DownloadOutlined/>}
                type="primary"
              >
                导出Excel
              </Button>
            </Space>
          }
        >
          <Divider/>
          <ConfigProvider locale={zhCN}>
            <Form onFinish={this.onSearchFinish} ref={this.searchFormRef}>
              <Row gutter={[16, 0]}>
                <Col>
                  <Form.Item label="时间" name="time">
                    <RangePicker/>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="竞赛名称" name="compName">
                    <Input/>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="竞赛级别" name="compLevel">
                    <Select style={{width: 70}}>
                      <Option value="A类" key="1">
                        A类
                      </Option>
                      <Option value="B类" key="2">
                        B类
                      </Option>
                      <Option value="C类" key="3">
                        C类
                      </Option>
                      <Option value="D类" key="4">
                        D类
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="获奖级别" name="awardLevel">
                    <Select style={{width: 150}}>
                      <Option value="国家级特等奖" key="10">
                        国家级特等奖
                      </Option>
                      <Option value="国家级一等奖" key="11">
                        国家级一等奖
                      </Option>
                      <Option value="国家级二等奖" key="12">
                        国家级二等奖
                      </Option>
                      <Option value="国家级三等奖" key="13">
                        国家级三等奖
                      </Option>
                      <Option value="国家级优秀奖" key="14">
                        国家级优秀奖
                      </Option>
                      <Option value="省市级特等奖" key="20">
                        省市级特等奖
                      </Option>
                      <Option value="省市级一等奖" key="21">
                        省市级一等奖
                      </Option>
                      <Option value="省市级二等奖" key="22">
                        省市级二等奖
                      </Option>
                      <Option value="省市级三等奖" key="23">
                        省市级三等奖
                      </Option>
                      <Option value="省市级优秀奖" key="24">
                        省市级优秀奖
                      </Option>
                      <Option value="校级特等奖" key="30">
                        校级特等奖
                      </Option>
                      <Option value="校级一等奖" key="31">
                        校级一等奖
                      </Option>
                      <Option value="校级二等奖" key="32">
                        校级二等奖
                      </Option>
                      <Option value="校级三等奖" key="33">
                        校级三等奖
                      </Option>
                      <Option value="校级优秀奖" key="34">
                        校级优秀奖
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="入学年份" name="enrollyear">
                    <DatePicker picker="year"/>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="专业" name="majorId">
                    <Select
                      showSearch
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onSearch={(str: any) => {
                        this.handleSearch(str);
                      }}
                      notFoundContent={null}
                      style={{width: 208}}
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
                <Col>
                  <Form.Item label="班级" name="classId">
                    <Select
                      showSearch
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onSearch={(str: any) => {
                        this.handleclassSearch(str);
                      }}
                      notFoundContent={null}
                      style={{width: 190}}
                    >
                      {FuzzyValueClass?.map((element: any, index: any) => {
                        return (
                          <Option key={index} value={element.VALUE}>
                            {element.LABEL}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="姓名" name="username">
                    <Input/>
                  </Form.Item>
                </Col>

                <Col>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={this.resetSearchForm}>
                    重置
                  </Button>
                </Col>
              </Row>
            </Form>
          </ConfigProvider>
        </PageHeader>
        {/* 竞赛名单 */}
        <Card style={{marginBottom: 30}}>
          <Table
            scroll={{x: '100 %'}}
            columns={competitonColumns}
            dataSource={competitionList}
            // expandable={{
            //   expandedRowRender: (record: any) => <Table dataSource={record.memberInfo} columns={columns} />,
            //   rowExpandable: (record: any) => record.compName !== 'Not Expandable',
            // }}
            rowKey={(record: any) => record.compName}
            // loading={Tableloading}
          />
        </Card>
        <Modal
          title={tableTitle + '：' + '参赛选手'}
          visible={visble}
          onOk={this.okModal}
          onCancel={this.cancelModal}
          width={'1000px'}
        >
          <Table
            dataSource={tableSource}
            columns={columns}
            rowKey={() => Math.random()}
          />
        </Modal>
      </div>
    );
  }
}

export default connect(({competition, loading, user}: any) => ({
  ...competition,
  Tableloading: loading.effects['user/getAllUser'],
  ...user,
}))(CompetitionInfo);
