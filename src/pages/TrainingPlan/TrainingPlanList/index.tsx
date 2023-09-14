import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {
  Button,
  Card,
  ConfigProvider,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
  Upload,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import {ColumnsType} from 'antd/es/table';

const {Search} = Input;
const {Option} = Select;
const {Paragraph} = Typography;

export type APP = {
  trainPlanName: string;
  grade: string;
  majorName: string;
  unitName: string;
  schoolName: string;
};

export type Props = {
  dispatch: Dispatch;
  getLoading?: boolean;
  trainPlanList?: any;
};

class TrainingPlanList extends Component<Props> {
  state = {
    visible: false,
    trainPlanId: undefined,

    FuzzyValue: undefined,
  };
  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'trainingplan/getTrainPlan',
      });
    }
  };

  delete = (value: any) => {
    console.log(value);
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'trainingplan/deleteTrainPlan',
        payload: {trainPlanId: value.trainPlanId},
      }).then(() => {
        dispatch({
          type: 'trainingplan/getTrainPlan',
        });
      });
    }
  };

  onFinish = (value: any) => {
    console.log(value);
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'trainingplan/getTrainPlan',
        payload: {
          grade: value.grade,
          majorId: value.majorId,
        },
      });
    }
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

  render() {
    const {getLoading, trainPlanList} = this.props;
    const {FuzzyValue} = this.state;

    const propsPrinciples = {
      name: 'file',
      accept: '.xls,.xlsx',
      action: 'http://10.1.40.84:8072/submitTrainPlan',
      headers: {
        // authorization: 'authorization-text',
        Authorization: localStorage.getItem('token') as string,
      },
      maxCount: 1,

      onChange(info: any) {
        if (info.file.status !== 'uploading') {
          console.log(info);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 文件上传成功`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败`);
        }
      },
    };
    const columns: ColumnsType<APP> = [
      {
        title: '培养计划名称',
        dataIndex: 'trainPlanName',
        align: 'center',
      },
      {
        title: '年级',
        dataIndex: 'grade',
        align: 'center',
      },
      {
        title: '专业',
        dataIndex: 'majorName',
        align: 'center',
      },

      {
        title: '学院',
        dataIndex: 'unitName',
        align: 'center',
      },
      {
        title: '学校',
        dataIndex: 'schoolName',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: (text: any, record: any) => (
          <Space>
            <Link
              to={{
                pathname: '/TrainingPlan/TrainingPlanContent',
                state: {...record},
              }}
            >
              查看
            </Link>

            <Popconfirm
              title="您确定要删除该培养计划吗？"
              onConfirm={() => this.delete(record)}
              okText="是"
              cancelText="否"
            >
              <Button type="link">删除</Button>
            </Popconfirm>

            <Upload
              data={{
                param: JSON.stringify({trainPlanId: record.trainPlanId + ''}),
              }}
              {...propsPrinciples}
            >
              <a>上传培养计划</a>
            </Upload>
          </Space>
        ),
      },
    ];

    return (
      <div>
        <ConfigProvider locale={zhCN}>
          <Card
            title="培养计划列表"
            extra={
              <Form layout="inline" onFinish={this.onFinish} ref={this.formRef}>
                <Form.Item label="年级" name="grade">
                  <Select style={{width: 120}} allowClear={true}>
                    <Option value="2021">2021</Option>
                    <Option value="2020">2020</Option>
                    <Option value="2019">2019</Option>
                    <Option value="2018">2018</Option>
                    <Option value="2017">2017</Option>
                  </Select>
                </Form.Item>
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
                    style={{width: 180}}
                    allowClear={true}
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
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </Form.Item>
              </Form>
            }
          >
            <Table
              columns={columns}
              dataSource={trainPlanList}
              rowKey={() => Math.random()}
              loading={getLoading}
              style={{height: 800}}
            />
          </Card>
        </ConfigProvider>
      </div>
    );
  }
}

export default connect(({trainingplan, loading}: any) => ({
  ...trainingplan,
  getLoading: loading.effects['trainingplan/getTrainPlan'],
}))(TrainingPlanList);
