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
import moment from 'moment';
import zhCN from 'antd/lib/locale/zh_CN';
import axios from 'axios';

const {Option} = Select;
const {RangePicker} = DatePicker;

export type Props = {
  dispatch: Dispatch;
  softwareList?: object[]; //软件著作权信息列表
  paperList?: object[]; //论文信息列表
  patentList?: object[]; //专利信息列表
  competitionList?: object[]; //竞赛信息列表
};

class SorftwareConpyright extends Component<Props> {
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
        type: '2', //软著信息
        proTitle: value.proTitle == undefined ? undefined : value.proTitle,
      },
    });
  };

  //重置
  resetSearchForm = () => {
    this.searchFormRef.current?.resetFields();
    this.props.dispatch({
      type: 'competition/getSoftPaperPatentComp',
      payload: {
        type: '2', //软著信息
      },
    });
  };
  //导出竞赛、论文、软著、专利excel表
  handleDownloadExcel = () => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'competition/downSppcExcel',
    //   payload: {
    //     type: '2',
    //     data: this.props.softwareList,
    //   },
    // });

    const {softwareList} = this.props;
    let payloadTemp: any = JSON.parse(JSON.stringify(softwareList));
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
        type: '2',
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
        link.setAttribute('download', '软著统计表格');
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
      tableTitle: value.proTitle,
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
    const {softwareList} = this.props;
    const {FuzzyValue, FuzzyValueClass, visble, tableSource, tableTitle} =
      this.state;
    const SorftwareConpyrightColumns = [
      {
        title: '著作权题目',
        dataIndex: 'proTitle',
        key: 'proTitle',
        width: 175,
        align: 'center',
      },
      {
        title: '著作权类别',
        dataIndex: 'proType',
        key: 'proType',
        align: 'center',
      },
      {
        title: '第一作者',
        dataIndex: 'concatOne',
        key: 'concatOne',
        align: 'center',
      },
      {
        title: '其他作者',
        dataIndex: 'concatMember',
        key: 'concatMember',
        align: 'center',
      },
      {
        title: '授权号',
        dataIndex: 'proNum',
        key: 'proNum',
        align: 'center',
      },
      {
        title: '授权时间',
        dataIndex: 'timeOrPage',
        key: 'timeOrPage',
        align: 'center',
      },
      {
        title: '著作权级别',
        dataIndex: 'proLevel',
        key: 'proLevel',
        align: 'center',
      },
      {
        title: '指导教师',
        dataIndex: 'professorName',
        key: 'professorName',
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
        {/* 模糊查询 */}
        <PageHeader
          className="site-page-header"
          // onBack={() => null}
          ghost={false}
          title="软件著作统计查询"
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
                  <Form.Item label="著作权题目" name="proTitle">
                    <Input/>
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
            columns={SorftwareConpyrightColumns}
            dataSource={softwareList}
            rowKey={() => Math.random()}
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
}))(SorftwareConpyright);
