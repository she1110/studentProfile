import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {Button, Card, Col, ConfigProvider, DatePicker, Form, Modal, Row, Select, Table, Tooltip,} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';

const {Option} = Select;
const {RangePicker} = DatePicker;

export type Props = {
  dispatch: Dispatch;
  allCourseInfo?: object[]; //课程信息
  allTagInfo?: object[]; //所有标签信息
  allPointInfo?: object[]; //积分信息
  pointDataLoading: boolean;
};

class PointAnalysis extends Component<Props> {
  state = {
    modalAddVisible: false, //添加标签 是否弹出
    modalDeleteVisible: false, //删除标签 是否弹出
    modalCreateVisible: false, //创建标签 是否弹出
    Utags: [
      {
        tagId: undefined,
        tagName: undefined,
      },
    ], //标签并集用于删除
    modalDetailVisible: false, //活动明细 是否弹出
    detailData: [], //活动明细数据
    currentIndex: 1, //初始化的下标---用于生成table序号
  };

  searchFormRef = React.createRef<FormInstance>();
  formRef = React.createRef<FormInstance>();
  formRef1 = React.createRef<FormInstance>();
  paginationProps = {
    // showSizeChanger: true,//设置每页显示数据条数
    // showQuickJumper: false,
    // showTotal: () => `共${this.state.total}条`,
    pageSize: 10,
    // total: this.state.total,  //数据的总的条数
    onChange: (page: any, pageSize: any) => {
      this.setState({
        currentIndex: page,
      });
    },
  };

  componentDidMount() {
    const {dispatch} = this.props;

    dispatch({
      type: 'tags/getPoint',
      payload: {
        tagId: '1344200475410432',
        type: '1',
      },
    });
    dispatch({
      type: 'tags/getAllTagInfo',
      payload: {},
    });
  }

  //查询
  onSearchFinish = (value: any) => {
    const {dispatch} = this.props;

    dispatch({
      type: 'tags/getPoint',
      payload: {
        startTime:
          value.time == undefined
            ? undefined
            : moment(value.time[0]).format('YYYY-MM-DD'),
        endTime:
          value.time == undefined
            ? undefined
            : moment(value.time[1]).format('YYYY-MM-DD'),
        tagId: value.tagId,
        type: '1',
      },
    });
  };

  //重置
  resetSearchForm = () => {
    this.searchFormRef.current?.resetFields();
    this.props.dispatch({
      type: 'tags/getPoint',
      payload: {
        tagId: '1344200475410432',
        type: '1',
      },
    });
  };

  handleCancel = () => {
    this.setState({
      modalAddVisible: false,
      modalDeleteVisible: false,
      modalCreateVisible: false,
      modalDetailVisible: false,
    });
  };

  //活动
  detailShowModal = (record: any) => {
    this.setState({
      modalDetailVisible: true,
      detailData: record.detailVos,
    });
  };

  render() {
    const {allPointInfo, allTagInfo, pointDataLoading} = this.props;
    const {modalDetailVisible, detailData} = this.state;
    const PointColumns = [
      {
        title: '排名',
        dataIndex: 'rank',
        key: 'rank',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          //生成序号
          return (
            <span>{(this.state.currentIndex - 1) * 10 + (index + 1)}</span>
          );
        },
      },
      {
        title: '班级',
        dataIndex: 'className',
        key: 'className',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
      },
      {
        title: '学号',
        dataIndex: 'userId',
        key: 'userId',
        align: 'center',
      },
      {
        title: '分数',
        dataIndex: 'point',
        key: 'point',
        align: 'center',
      },
      {
        title: '参与活动明细',
        dataIndex: 'detailVos',
        key: 'detailVos',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          //当前行的值   当前行的数据   索引
          //return <span>{text[0].detailName}
          if (record !== null) {
            return (
              <>
                {/* {console.log(record.detailVos)} */}
                <span>{text[0].detailName}</span>
                <Tooltip title="点击查看所有活动">
                  <Button
                    type="link"
                    onClick={() => {
                      this.detailShowModal(record);
                    }}
                  >
                    展开
                  </Button>
                </Tooltip>
              </>
            );
          }
        },
      },
    ];
    const detailColumns = [
      {
        title: '活动名称',
        dataIndex: 'detailName',
        align: 'center',
      },
      {
        title: '活动分值',
        dataIndex: 'detailValue',
        align: 'center',
        width: 120,
      },
    ];
    return (
      <div>
        {/* <Button onClick={()=>{console.log(allCourseInfo)}}>测试</Button> */}
        {/* 查询课程标签 */}
        <ConfigProvider locale={zhCN}>
          <Form onFinish={this.onSearchFinish} ref={this.searchFormRef}>
            <Row gutter={[16, 0]}>
              <Col span={4}/>
              <Col>
                <Form.Item label="标签名称" name="tagId">
                  <Select style={{width: 130}}>
                    {allTagInfo?.map((element: any, index: any) => {
                      return (
                        <Option key={index} value={element.tagId}>
                          {element.tagName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="查询时间" name="searchTime">
                  <RangePicker showTime/>
                </Form.Item>
              </Col>
              <Col>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </Col>
              {/* <Col>
                <Button type="primary" onClick={this.resetSearchForm}>
                  重置
                </Button>
              </Col> */}
              <Col>
                <Button type="primary" onClick={this.handleDownloadExcel}>
                  下载
                </Button>
              </Col>
            </Row>
          </Form>
        </ConfigProvider>

        {/* 评分信息 */}
        <Card style={{marginBottom: 30}}>
          <Table
            columns={PointColumns}
            dataSource={allPointInfo}
            // rowSelection={rowSelection}
            rowKey={(record: any) => record.userId}
            pagination={this.paginationProps}
            loading={pointDataLoading}
          />
        </Card>

        {/* 删除标签 */}
        <Modal
          title={'活动明细'}
          visible={modalDetailVisible}
          onCancel={this.handleCancel}
          forceRender //被隐藏时是否渲染 DOM 结构
          footer={[
            <Button
              type="primary"
              onClick={() => {
                this.setState({modalDetailVisible: false});
              }}
            >
              确定
            </Button>,
          ]}
        >
          <Table
            columns={detailColumns}
            dataSource={detailData}
            pagination={this.paginationProps}
          />
        </Modal>
      </div>
    );
  }
}

export default connect(({tags, loading}: any) => ({
  ...tags,
  pointDataLoading: loading.effects['tags/getPoint'],
}))(PointAnalysis);
