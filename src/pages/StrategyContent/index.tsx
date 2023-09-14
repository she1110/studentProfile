import {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, history, Link} from 'umi';
import {
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  ConfigProvider,
  Descriptions,
  Divider,
  notification,
  PageHeader,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import {RedoOutlined} from '@ant-design/icons';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import DownloadExcel from '@/utils/DownloadExcel.js';

const {Panel} = Collapse;
const {Option} = Select;
const {Paragraph} = Typography;

export type Props = {
  dispatch: Dispatch;
  // allapplist: number[],
  picturelist: number[];
  clusterdetail: {
    column?: number[];
    data: number[];
  };
  Tableloading: boolean;
  location: {
    state?:
      | {
      creator?: string | undefined;
      id?: string | undefined;
      name?: number | undefined;
      remark?: string | undefined;
      strategy_time?: any;
      jList?: any;
    }
      | any;
  };
  columns: any;
  stateColumn?: number[];
  allapplist: string[];
  tag: boolean;
};

class StrategyContent extends Component<Props> {
  state = {};

  componentDidMount = () => {
    const {location, dispatch} = this.props;
    if (location.state === undefined) {
      history.goBack();
    }
  };
  handleDownloadExcel = () => {
    const {clusterdetail} = this.props;
    DownloadExcel(
      columns,
      data,
      `画像详细信息${moment().format('YYYYMMDDHHmmss')}`,
      [],
      () => {
        setTimeout(() => {
          notification.success({message: '导出成功!'});
        }, 300);
      },
    );
  };
  reset = () => {
  };

  render() {
    // const { persons_info } = this.state;
    const {picturelist, clusterdetail, Tableloading, location, dispatch} =
      this.props;
    const iiid = location.state?.strategyId;
    const columns = [
      {
        title: '序号',
        dataIndex: 'uuid',
        align: 'center',
      },
      {
        title: '计算任务ID',
        dataIndex: 'jobId',
        align: 'center',
      },
      {
        title: '计算任务名称',
        dataIndex: 'jobName',
        align: 'center',
      },
      {
        title: '任务维度',
        dataIndex: 'jobDim',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          switch (text) {
            case 'classid':
              return <span>班级</span>;
            case 'majorid':
              return <span>专业</span>;
            case 'userid':
              return <span>学生</span>;
            case 'dormitory':
              return <span>宿舍</span>;
            default:
          }
        },
      },
      {
        title: '创建日期',
        dataIndex: 'jobTime',
        align: 'center',
      },
      {
        title: '创建人',
        dataIndex: 'jobAuthor',
        align: 'center',
      },
      {
        title: '当前状态',
        dataIndex: 'jobState',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          switch (text) {
            case '1':
              return <Badge color="green" text="成功"/>;
            case '2':
              return <Badge color="blue" text="处理中"/>;
            case '3':
              return <Badge color="red" text="失败"/>;
            case '0':
              return <Badge color="volcano" text="未计算"/>;
            default:
          }
        },
      },
      {
        title: '操作',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          const state = record.state;
          const dim = record.jobDim;
          switch (dim) {
            case 'classid':
              return (
                <Link
                  to={{
                    pathname: '/JobResultClass',
                    state: {...record, iiid, dim},
                  }}
                >
                  <Button type="link">查看结果</Button>
                </Link>
              );
            case 'majorid':
              return (
                <Link
                  to={{
                    pathname: '/JobResultMajor',
                    state: {...record, iiid, dim},
                  }}
                >
                  <Button type="link">查看结果</Button>
                </Link>
              );
            case 'userid':
              return (
                <Link
                  to={{
                    pathname: '/JobResultUser',
                    state: {...record, iiid, dim},
                  }}
                >
                  <Button type="link">查看结果</Button>
                </Link>
              );
            case 'dormitory':
              return (
                <Link
                  to={{
                    pathname: '/JobResultDormitory',
                    state: {...record, iiid, dim},
                  }}
                >
                  {/* <Button type='link' disabled={state !== '1'}> */}
                  <Button type="link">查看结果</Button>
                </Link>
              );
            default:
          }
        },
      },
    ];
    const content = (
      <>
        <Paragraph>
          当前策略绑定的所有任务，通过查看任务的计算结果对分群进行评价。
        </Paragraph>
        <Divider/>
        <Row>
          <Col span={10}>
            <Descriptions>
              <Descriptions.Item label="策略名称">
                {location.state?.strategyName}
              </Descriptions.Item>
              <Descriptions.Item label="备注">
                {location.state?.strategyRemark}
              </Descriptions.Item>
              <Descriptions.Item label="策略ID">
                {location.state?.strategyId}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </>
    );

    const Content = ({children, extraContent}: any) => (
      <Row>
        <div style={{flex: 1}}>{children}</div>
      </Row>
    );
    return (
      <>
        <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
          <div style={{marginBottom: 30, backgroundColor: 'white'}}>
            <PageHeader
              title="策略绑定详情"
              subTitle="连接策略与分群"
              tags={<Tag color="blue">运行中</Tag>}
              extra={[
                <Button
                  onClick={this.reset}
                  icon={<RedoOutlined/>}
                  key={'reset'}
                >
                  刷新列表
                </Button>,
              ]}
              avatar={{src: require('@/assets/picture/绑定.png')}}
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
          <ConfigProvider locale={zhCN}>
            <Card
              title="任务列表"
              extra={
                <Space>
                  {/* <Button type="primary" onClick={this.handleDownloadExcel}>
                    下载
                  </Button> */}
                  {/* <Button type="primary" onClick={this.reset}>
                    刷新
                  </Button> */}
                </Space>
              }
            >
              <Table
                // loading={Tableloading}
                columns={columns}
                rowKey={() => Math.random()}
                // columns={clusterdetail.column}
                dataSource={location.state?.jList}
              />
            </Card>
          </ConfigProvider>
        </div>
      </>
    );
  }
}

export default connect(({application, loading}: any) => ({
  ...application,
  // Tableloading: loading.effects['application/getClusterDetail'],
}))(StrategyContent);
