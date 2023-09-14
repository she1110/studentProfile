import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {Button, ConfigProvider, Input, Modal, PageHeader, Row, Space, Tag, Typography,} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import {RedoOutlined,} from '@ant-design/icons';
import moment from 'moment';
import type {ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

const {Search} = Input;
const {Paragraph} = Typography;

export type Message = {
  createTime: string;
  messageContent: string;
  messageId: number;
  messageInfoId: number;
  messageTitle: string;
  receiverId: number;
  senderId: number;
  status: string;
};
export type Props = {
  dispatch: Dispatch;
  MessageList: Message[];
  Tableloading: boolean;
};

class MessageList extends Component<Props> {
  state = {
    visible: false,
    editvisible: false, //编辑modal
    messageTitle: '', //消息的标题
    messageContent: '', //消息的内容
    messageCreateTime: '', //消息的时间
    messageLink: undefined, //消息 参数和接口
  };
  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'messagelist/getAllMessage',
      });
    }
  };
  showModal = (value: any) => {
    this.setState({visible: true});
    const {dispatch} = this.props;
    this.setState({
      messageTitle: value.messageTitle,
      messageContent: value.messageContent,
      messageCreateTime: moment(value.createTime).format('YYYY-MM-DD HH:mm:ss'),
      messageLink: value.messageLink,
    });

    dispatch({
      type: 'messagelist/updateMessageStatus',
      payload: {messageId: value.messageId},
    }).then(() => {
      dispatch({
        type: 'messagelist/getAllMessage',
      });
    });
  };
  handleCancel = () => {
    this.setState({visible: false});
  };
  handleOk = () => {
    this.setState({visible: false});
  };
  handlePersons_info = (value: any) => {
    if (value === null) {
      return null;
    }
    let persons_infotemp = JSON.parse(value);
    persons_infotemp.map((element: any, index: any) => {
      element.fieldKey = index;
    });
    return persons_infotemp;
  };
  onFinish = (values: any) => {
    const {dispatch} = this.props;
    this.setState({visible: false});
    values.creator = localStorage.getItem('userName');
    values.creat_time = moment().format('YYYY-MM-DD HH:mm:ss');
    values.persons_info = JSON.stringify(values.persons_info);
    dispatch({
      type: 'application/appAdd',
      payload: values,
    }).then(() => {
      this.props.dispatch({
        type: 'application/appGetAll',
      });
    });
  };
  onSearch = (value: any) => {
    const {dispatch} = this.props;
    if (value.length === 0) {
      dispatch({
        type: 'application/appGetAll',
      });
    }
    if (value.length !== 0) {
      dispatch({
        type: 'application/appGet',
        payload: {
          creator: value,
        },
      });
    }
  };
  delete = (record: any) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'messagelist/deleteMessage',
      payload: {
        messageId: record.messageId,
      },
    }).then(() => {
      dispatch({
        type: 'messagelist/getAllMessage',
      });
    });
  };

  render() {
    const {MessageList, Tableloading} = this.props;
    const {messageTitle, messageContent, messageCreateTime, messageLink} =
      this.state;
    const columns: ProColumns<Message>[] = [
      {
        title: '标题',
        dataIndex: 'messageTitle',
      },
      {
        title: '发布日期',
        dataIndex: 'createTime',
        hideInSearch: true,
        render: (text: any) => {
          return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: '发送人',
        dataIndex: 'senderName',
      },
      {
        title: '接收人',
        dataIndex: 'receiverName',
      },
      {
        disable: true,
        title: '状态',
        dataIndex: 'status',
        filters: true,
        onFilter: true,
        valueType: 'select',
        valueEnum: {
          '0': {text: '未读', status: 'Error'},
          '1': {
            text: '已读',
            status: 'Success',
          },
        },
      },
      {
        title: '操作',
        // align: 'center',
        hideInSearch: true,
        render: (text: any, record: any) => (
          <Space>
            <a
              onClick={() => {
                this.showModal(record);
              }}
            >
              查看
            </a>
            <a
              onClick={() => {
                this.delete(record);
              }}
            >
              删除
            </a>
          </Space>
        ),
      },
      // {
      //     title: '操作',
      //     dataIndex: 'english',
      //     align: 'center',
      //     render: (text: any, record: any) => (
      // <Space>
      //     <Button
      //         type="link"
      //         onClick={() => {
      //             this.editshowModal(record);
      //         }}
      //     >
      //         编辑
      //     </Button>
      //     <Button
      //         type="link"
      //         onClick={() => {
      //             this.delete(record);
      //         }}
      //     >
      //         删除
      //     </Button>
      // </Space>
      //     ),
      // },
    ];
    const content = (
      <>
        <Paragraph>
          站内信，是为方便用户信件往来而设的服务功能，类似于邮箱。
        </Paragraph>
        <Paragraph>
          点到点的消息传送，用户给用户发送站内信，管理员给用户发送站内信。
        </Paragraph>
        <Paragraph>
          点到面的消息传送，管理员给用户（指定满足某一条件的用户群）群发消息。
        </Paragraph>
      </>
    );

    const Content = ({children, extraContent}: any) => (
      <Row>
        <div style={{flex: 1}}>{children}</div>
      </Row>
    );

    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        <div style={{marginBottom: 30}}>
          <PageHeader
            title="站内信"
            subTitle="用户消息列表"
            tags={<Tag color="blue">运行中</Tag>}
            extra={[
              <Button
                onClick={() => console.log(MessageList)}
                icon={<RedoOutlined/>}
                key={'2123'}
              >
                刷新消息
              </Button>,
            ]}
            avatar={{src: require('@/assets/picture/消息.png')}}
            style={{
              background: 'white',
              marginBottom: 20,
            }}
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
          <ProTable
            columns={columns}
            dataSource={MessageList}
            rowKey={'messageId'}
          ></ProTable>
        </div>

        <ConfigProvider locale={zhCN}>
          {/* <Card
                        className={styles.projectList}
                        style={{ marginBottom: 24 }}
                        title="消息列表"
                        bordered={false}
                        extra={
                            <Space>
                                <Search
                                    placeholder="创建者"
                                    onSearch={this.onSearch}
                                    style={{ width: 208 }}
                                />
                            </Space>
                        }
                        bodyStyle={{ padding: 0 }}
                        loading={Tableloading}
                    >
                        {MessageList.length != 0 ? (
                            MessageList.map((element: any, index: any) => {
                                return (
                                    <Card.Grid className={styles.projectGrid} key={index}>
                                        <Card
                                            bodyStyle={{ padding: 0 }}
                                            bordered={false}
                                            actions={[
                                                <SearchOutlined key="see"
                                                    onClick={() => { this.showModal(element) }}
                                                />,
                                                <EditOutlined key="edit" onClick={() => { message.info('该消息不可编辑！！') }} />,
                                                <DeleteOutlined key="delete" onClick={() => { this.delete(element) }} />,
                                            ]}
                                        >
                                            <Card.Meta
                                                title={
                                                    <div className={styles.cardTitle}>
                                                        <Avatar
                                                            size="small"
                                                            src={require('@/assets/picture/站内信.png')}
                                                        />
                                                        <span style={{ paddingLeft: 10 }}>{element.messageTitle}</span>
                                                        {
                                                            element.status === '0' ? <span>（未读）</span> : <span>（已读）</span>
                                                        }
                                                    </div>
                                                }
                                                description={element.messageContent}
                                            />
                                            <div className={styles.projectItemContent}>
                                                <Link to="/MessageList">{element.senderName}</Link>
                                                <span className={styles.datetime} title="科学搬砖">
                                                    {element.createTime}
                                                </span>
                                            </div>
                                        </Card>
                                    </Card.Grid>
                                );
                            })
                        ) : <div style={{ height: 500, paddingTop: 170 }}> <Empty /></div>
                        }
                    </Card> */}

          <Modal
            width="900px"
            title="消息详情"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
          >
            <Row justify="center">
              <span style={{fontSize: 34, fontWeight: 'bold'}}>
                {messageTitle}
              </span>
            </Row>
            <Row justify="center">
              <span style={{fontSize: 24}}>{messageCreateTime}</span>
            </Row>
            <Row justify="center">
              <span style={{fontSize: 24}}>&nbsp;</span>
            </Row>
            <Row>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span style={{fontSize: 24}}>{messageContent}</span>
            </Row>
            <Row justify="center">
              <span style={{fontSize: 24}}>&nbsp;</span>
            </Row>
            {messageLink ? (
              <Row>
                <Link
                  to={{
                    pathname: '/ActivityCommentsCollect',
                    state: {messageLink},
                  }}
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{fontSize: 20}}>参与链接</span>
                </Link>
              </Row>
            ) : null}
          </Modal>
        </ConfigProvider>
      </div>
    );
  }
}

export default connect(({messagelist, loading}: any) => ({
  ...messagelist,
  Tableloading: loading.effects['messagelist/getAllMessage'],
}))(MessageList);
