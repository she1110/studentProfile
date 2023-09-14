import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  PageHeader,
  Popconfirm,
  Row,
  Select,
  Space,
  Steps,
  Table,
  Tag,
  Typography,
  Upload,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import {PlusCircleOutlined, SearchOutlined, UploadOutlined, UserOutlined,} from '@ant-design/icons';
import moment from 'moment';
import 'rc-texty/assets/index.css';

const {Option} = Select;
const {Paragraph} = Typography;
const {Panel} = Collapse;
const {TextArea} = Input;
const {Step} = Steps;

export type fileListType = {
  uid: string;
  path: string;
};
export type Props = {
  dispatch: Dispatch;
  studentReport?: any;
  userlist?: any;
  noticestutree?: any;
  teachernoticelist?: any;
  stunoticelist?: any;
  filePath?: Array<fileListType>;
  classandtemplate?: any;
  onetemplate?: any;
};

class DepartmentNotice extends Component<Props> {
  state = {
    noticeVisible: false, //发布通知是否可见
    checkPeopleVisible: false, //查看已读和未读的人数
    seeNoticeVisible: false, //阅读通知
    problemShow: false, //是否存在疑问
    footerShow: true, //存在疑问 不显示footer
    problemListVisible: false, //问题列表是否可见
    answerProblemVisible: false, //回答问题是否可见
    current: 0, //分步表单的当前步数

    step1form: {}, //步骤一
    step2form: {}, //步骤二
    groupLeader: {}, //根据选择的小组具体人员，从中选择小组长
    noticeTitle: '', //通知标题
    promblemTitle: '', //问题内容
    promblemList: [], //问题列表
    noticeContent: '', //通知的内容
    noticeId: '', //通知Id
    stuDetailId: '', //通知 和 学生 连接的 detailid  提问题接口的参数
    noticePeople: [], //点击查看学生详情  显示出的List
    sendButton: false, //是否存在 确认发送给老师的按钮（只有小组长有）
    filePath: [], //文件列表 uid 和 path

    exampleVisible: false, //模板modal是否可见
    exampleChoseClassStu: [], // 创建模板 班级 学生列表
    classExample: {}, //根据选择的班级，展示不同的模板
    downloadFile: [], //通知中 文档下载地址
    exampleTitle: undefined, //新建模板 or 查看模板
  };

  formRef = React.createRef<FormInstance>();
  formRef1 = React.createRef<FormInstance>();
  formRef2 = React.createRef<FormInstance>();
  proFormRef = React.createRef<FormInstance>();
  answerFormRef = React.createRef<FormInstance>();
  exampleFormRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch} = this.props;
    const roleTag = localStorage.getItem('roles');
    if (dispatch) {
      dispatch({type: 'user/getAllUser'});
      dispatch({type: 'departmentnotice/noticeStuTree'});
      dispatch({type: 'departmentnotice/getAllClassAndTemplate'});
      if (roleTag === '2') {
        dispatch({type: 'departmentnotice/getAllStuNotice'});
      } else {
        dispatch({type: 'departmentnotice/getAllTeacherNotice'});
      }
      dispatch({
        type: 'user/getcurrentuserinfo',
        payload: {
          callback: (value: any) => {
            this.setCurrentUserInfo(JSON.parse(value));
          },
        },
      });
    }
  };
  setCurrentUserInfo = (value: any) => {
    this.setState({
      picPath: value.picPath, //设置头像地址
    });
  };
  //发布通知
  createNoticeCancel = () => {
    this.setState({
      noticeVisible: false,
      current: 0,
      step1form: {},
      step2form: {},
    });
    this.formRef1.current?.resetFields();
    this.formRef2.current?.resetFields();
  };
  //查看通知
  showSeeNoticeModal = (value: any) => {
    this.setState({
      seeNoticeVisible: true,
      noticeTitle: value.title,
      noticeContent: value.content,
      noticeId: value.taskId,
      stuDetailId: value.stuDetailId,
      promblemList: value.taskQuestions,
      downloadFile: JSON.parse(value.filePath),
    });
  };
  //已读和未读的人列表
  showCheckPeopleModal = (value: any) => {
    if ('leaderFlag' in value && value.leaderFlag === '2') {
      this.setState({
        sendButton: true,
      });
    }
    this.setState({
      checkPeopleVisible: true,
      noticeTitle: value.title,
      noticePeople: value.taskDetailGroups,
      noticeId: value.taskId,
    });
  };
  checkPeopleCancel = () => {
    this.setState({
      checkPeopleVisible: false,
    });
  };
  //问题列表
  showProblemListModal = (value: any) => {
    this.setState({
      problemListVisible: true,
      noticeTitle: value.title,
      promblemList: value.taskQuestions,
    });
  };
  problemListCancel = () => {
    this.setState({
      problemListVisible: false,
    });
  };
  //回答问题modal
  answerProblemModal = (value: any) => {
    this.answerFormRef.current?.setFieldsValue({
      questionId: value.questionId,
    });
    this.setState({
      answerProblemVisible: true,
      promblemTitle: value.problemName,
    });
  };
  answerProblemCancel = () => {
    this.setState({
      answerProblemVisible: false,
    });
  };
  answerProblemOnFinish = (value: any) => {
    const roleTag = localStorage.getItem('roles');
    const {dispatch} = this.props;
    dispatch({
      type: 'departmentnotice/answerQuestion',
      payload: value,
    }).then(() => {
      if (roleTag === '2') {
        dispatch({type: 'departmentnotice/getAllStuNotice'});
      } else {
        dispatch({type: 'departmentnotice/getAllTeacherNotice'});
      }
    });
    this.setState({
      answerProblemVisible: false,
      problemListVisible: false,
    });
  };

  //班级分组模板modal
  exampleShowModal = (value: any, type: any) => {
    const {dispatch} = this.props;
    if (type === 'see') {
      let groupListTemp: any =
        this.formRef2.current?.getFieldValue('groupList');
      if (
        'classExample' in groupListTemp[value] &&
        groupListTemp[value].classExample
      ) {
        let templateId = groupListTemp[value].classExample;
        dispatch({
          type: 'departmentnotice/getOneTemplate',
          payload: {templateId: templateId},
        }).then(() => {
          const {onetemplate} = this.props;
          this.setState({
            exampleChoseClassStu: JSON.parse(
              JSON.parse(onetemplate.content).temp,
            ).exampleChoseClassStu,
            groupLeader: JSON.parse(JSON.parse(onetemplate.content).temp)
              .groupLeader,
          });
          this.exampleFormRef.current?.setFieldsValue({
            exampleName: onetemplate.name,
            classid: onetemplate.classId,
            monitor: onetemplate.monitor,
            number: JSON.parse(onetemplate.content).number,
            groupList: JSON.parse(onetemplate.content).groupList,
            templateId: onetemplate.templateId,
          });
        });
      }
      this.setState({
        exampleTitle: '查看模板',
      });
    } else if (type === 'create') {
      this.setState({
        exampleTitle: '创建模板',
      });
    }
    this.setState({
      exampleVisible: true,
    });
  };
  exampleCancelModal = () => {
    this.setState({
      exampleVisible: false,
    });
    this.exampleFormRef.current?.resetFields();
  };
  exampleHandleOk = () => {
    const {dispatch} = this.props;
    const {exampleChoseClassStu, groupLeader, exampleTitle} = this.state;
    this.exampleFormRef.current?.validateFields().then((value: any) => {
      let temp: any = {
        exampleChoseClassStu: exampleChoseClassStu,
        groupLeader: groupLeader,
      };
      if (exampleTitle && exampleTitle === '查看模板') {
        dispatch({
          type: 'departmentnotice/updateTemplate',
          payload: {...value, temp: JSON.stringify(temp)},
        }).then(() => {
          dispatch({type: 'departmentnotice/getAllClassAndTemplate'}).then(
            () => {
              let formRef2Data: any = this.formRef2.current?.getFieldsValue();
              if ('groupList' in formRef2Data && formRef2Data.groupList) {
                formRef2Data.groupList.map((element: any, index: any) => {
                  if (value.classid === element.classId) {
                    this.classOnchange(element.classId, index);
                  }
                });
              }
              this.exampleFormRef.current?.resetFields();
            },
          );
        });
      } else {
        dispatch({
          type: 'departmentnotice/addTemplate',
          payload: {...value, temp: JSON.stringify(temp)},
        }).then(() => {
          dispatch({type: 'departmentnotice/getAllClassAndTemplate'}).then(
            () => {
              let formRef2Data: any = this.formRef2.current?.getFieldsValue();
              if ('groupList' in formRef2Data && formRef2Data.groupList) {
                formRef2Data.groupList.map((element: any, index: any) => {
                  if (value.classid === element.classId) {
                    this.classOnchange(element.classId, index);
                  }
                });
              }
              this.exampleFormRef.current?.resetFields();
            },
          );
        });
      }
    });
    this.setState({
      exampleVisible: false,
    });
  };

  //模板选定班级
  exampleChoseClass = (value: any) => {
    const {noticestutree} = this.props;
    let exampleChoseClassStuTemp: any = [];
    noticestutree.map((element: any, index: any) => {
      if (element.key === value) {
        exampleChoseClassStuTemp = element.children;
      }
    });
    this.exampleFormRef.current?.setFieldsValue({
      monitor: null,
      number: 0,
      groupList: [],
    });
    this.setState({
      exampleChoseClassStu: exampleChoseClassStuTemp,
    });
  };

  //设置几个班级
  classNumberOnChange = (value: any) => {
    let groupListTemp: any = [];
    for (let i = 0; i < value; i++) {
      groupListTemp.push({});
    }
    this.formRef2.current?.setFieldsValue({
      groupList: groupListTemp,
    });
  };
  //每个班级的模板不一样
  classOnchange = (value: any, fieldKey: any) => {
    const {classExample} = this.state;
    const {classandtemplate} = this.props;
    let classExampleOneTemp: any = [];
    classandtemplate.map((element: any, index: any) => {
      if (element.classid === value) {
        classExampleOneTemp = element.example;
      }
    });
    let classExampleTemp: any = JSON.parse(JSON.stringify(classExample));
    classExampleTemp[fieldKey] = classExampleOneTemp;
    this.setState({
      classExample: classExampleTemp,
    });
  };
  //设置几个分组
  groupingOnChange = (value: any) => {
    let groupListTemp: any = [];
    for (let i = 0; i < value; i++) {
      groupListTemp.push({});
    }
    this.exampleFormRef.current?.setFieldsValue({
      groupList: groupListTemp,
    });
  };
  //小组长的集合随着小组成员变化而变化
  groupOnChange = (value: any, fieldKey: any) => {
    this.setState({value});
    const {userlist} = this.props;
    const {groupLeader} = this.state;
    let selectTemp: any = [];
    value.map((element: any, index: any) => {
      let selectTempObj: any = {
        name: '',
        value: '',
      };
      userlist.map((elementsub: any, indexsub: any) => {
        if (element === elementsub.account) {
          selectTempObj.name = elementsub.userName;
          selectTempObj.value = elementsub.account;
        }
      });
      selectTemp.push(selectTempObj);
    });
    let groupLeaderTemp: any = JSON.parse(JSON.stringify(groupLeader));
    groupLeaderTemp[fieldKey] = selectTemp;
    this.setState({
      groupLeader: groupLeaderTemp,
    });
  };

  //分步表单点击下一步 上一步
  next = () => {
    const {current} = this.state;
    if (current === 0) {
      this.formRef1.current
        ?.validateFields()
        .then((value: any) => {
          value.file = this.state.filePath;
          this.setState({
            step1form: value,
            current: current + 1,
          });
        })
        .catch((info) => {
          message.info('请填写表单！');
        });
    }
    if (current === 1) {
      this.formRef2.current
        ?.validateFields()
        .then((value: any) => {
          this.setState({
            step2form: value,
            current: current + 1,
          });
        })
        .catch((info) => {
          message.info('请填写表单！');
        });
    }
    // this.setState({ current: current + 1 });
  };
  prev = () => {
    const {current} = this.state;
    this.setState({current: current - 1});
  };
  //删除通知的气泡确认框
  confirm = (e: any) => {
    const {dispatch} = this.props;
    const roleTag = localStorage.getItem('roles');
    dispatch({
      type: 'departmentnotice/delNotice',
      payload: {taskId: e.taskId},
    }).then(() => {
      if (roleTag === '2') {
        dispatch({type: 'departmentnotice/getAllStuNotice'});
      } else {
        dispatch({type: 'departmentnotice/getAllTeacherNotice'});
      }
    });
  };
  cancel = (e: any) => {
  };

  //添加附件
  uploadFile = (info: any) => {
    if (info.file.status !== 'uploading') {
      let filePathTemp: any = [];
      if ('response' in info.file && info.file.response) {
        info.fileList.map((element: any, index: any) => {
          let filePathTempObj: any = {
            uid: element.uid,
            name: element.name,
            path: element.response.data,
          };
          filePathTemp.push(filePathTempObj);
        });
      }
      this.setState({
        filePath: filePathTemp,
      });
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功！！`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败！！`);
    }
  };

  render() {
    const {
      dispatch,
      studentReport,
      noticestutree,
      teachernoticelist,
      stunoticelist,
      classandtemplate,
    } = this.props;
    const {
      noticeVisible,
      checkPeopleVisible,
      seeNoticeVisible,
      problemShow,
      footerShow,
      current,
      groupLeader,
      problemListVisible,
      answerProblemVisible,
      noticeTitle,
      promblemTitle,
      step1form,
      noticeContent,
      noticePeople,
      noticeId,
      promblemList,
      stuDetailId,
      sendButton,
      filePath,
      exampleVisible,
      exampleChoseClassStu,
      classExample,
      downloadFile,
      exampleTitle,
    } = this.state;
    const roleTag = localStorage.getItem('roles');
    const content = (
      <>
        <Paragraph>
          针对学院下发通知到精准人群的问题，此模块全方位展示学生查看通知和对通知是否存在疑问的情况。
        </Paragraph>
        <Paragraph>
          分小组下发通知并设置小组长，小组长对学院老师负责。小组长负责检查组内成员的查看情况并进行督促。
        </Paragraph>
        <Paragraph>
          学生可对通知中内容提出问题，问题提交后经过学院老师解答放置在公示处供所有人查看，避免提问相同问题。
        </Paragraph>
      </>
    );
    const Content = ({children, extraContent}: any) => (
      <Row>
        <div style={{flex: 1}}>{children}</div>
        <div className="image">{extraContent}</div>
      </Row>
    );
    const TeacherNoticeColumns = [
      {
        title: '通知标题',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
      },
      {
        title: '通知日期',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        render: (text: any, record: any) => {
          return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: '发布人',
        dataIndex: 'senderName',
        key: 'senderName',
        align: 'center',
      },
      {
        title: '通知内容',
        key: 'content',
        align: 'center',
        render: (text: any, record: any) => {
          return (
            <Button
              type="link"
              onClick={() => {
                this.showSeeNoticeModal(record);
              }}
            >
              查看通知
            </Button>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'read',
        key: 'read',
        align: 'center',
        render: (text: any, record: any) => {
          return (
            <Space>
              <Button
                type="link"
                onClick={() => {
                  this.showCheckPeopleModal(record);
                }}
              >
                学生详情
              </Button>
              <Badge count={record.unProblemNumber}>
                <Button
                  type="link"
                  onClick={() => {
                    this.showProblemListModal(record);
                  }}
                >
                  问题列表
                </Button>
              </Badge>
              <Popconfirm
                title="确定删除这个通知吗?"
                onConfirm={() => this.confirm(record)}
                onCancel={this.cancel}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link">删除</Button>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];
    const StudentNoticeColumns = [
      {
        title: '通知标题',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
      },
      {
        title: '通知日期',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
      },
      {
        title: '通知发布人',
        dataIndex: 'senderName',
        key: 'senderName',
        align: 'center',
      },
      {
        title: '操作',
        key: 'content',
        align: 'center',
        render: (text: any, record: any) => {
          return (
            <Space>
              <Button
                type="link"
                onClick={() => {
                  this.showSeeNoticeModal(record);
                }}
              >
                查看通知
              </Button>
              {record.leaderFlag === '0' ? null : (
                <Button
                  type="link"
                  onClick={() => {
                    this.showCheckPeopleModal(record);
                  }}
                >
                  组内详情
                </Button>
              )}
            </Space>
          );
        },
      },
      {
        title: '是否已读',
        dataIndex: 'stuState',
        key: 'stuState',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (text === 0) {
            return <Tag color="purple">未读</Tag>;
          } else if (text === 1) {
            return <Tag color="green">已读</Tag>;
          } else if (text === 2) {
            return <Tag color="red">存在疑问</Tag>;
          }
        },
      },
    ];
    const stuColumns = [
      {
        title: '学号',
        dataIndex: 'userId',
        key: 'userId',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        render: (text: any, record: any) => {
          const tag = record.charger;
          if (tag === '1') {
            return <Tag color="gold">{text}</Tag>;
          } else {
            return <span>{text}</span>;
          }
        },
      },
      {
        title: '班级',
        dataIndex: 'class',
        key: 'class',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (text: any, record: any) => {
          if (text === '0') {
            return <Tag color="purple">未读</Tag>;
          } else if (text === '1') {
            return <Tag color="green">已读</Tag>;
          } else if (text === '2') {
            return <Tag color="red">存在疑问</Tag>;
          } else {
            return <span></span>;
          }
        },
      },
      {
        title: '通知时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
      },
    ];
    const problemColumns = [
      {
        title: '问题内容',
        dataIndex: 'content',
        key: 'content',
        // width: 400,
        // align: 'center',
      },
      {
        title: '提问人',
        dataIndex: 'receiverName',
        key: 'receiverName',
        align: 'center',
      },
      {
        title: '提问时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
      },
      {
        title: '问题状态',
        dataIndex: 'states',
        key: 'states',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (text === 0) {
            return <Tag color="#108ee9">未解答</Tag>;
          } else if (text === 1) {
            return <Tag color="#87d068">已解答</Tag>;
          }
        },
      },
      {
        title: '解答内容',
        dataIndex: 'answer',
        key: 'answer',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          if (record.answer === null) {
            return <span>无</span>;
          } else {
            return <span>{text}</span>;
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'phone',
        key: 'phone',
        align: 'center',
        render: (text: any, record: any) => {
          return (
            <Button
              type="link"
              onClick={() => {
                this.answerProblemModal(record);
              }}
            >
              回答问题
            </Button>
          );
        },
      },
    ];
    const props = {
      name: 'file',
      action: 'http://10.1.40.84:7878/task/uploadFile',
      headers: {
        Authorization: localStorage.getItem('token') as string,
      },
    };
    const steps = [
      {
        title: '通知标题与内容',
        content: (
          <>
            <Form name="通知标题与内容" layout="vertical" ref={this.formRef1}>
              <Form.Item
                label="标题"
                name="title"
                rules={[{required: true, message: '请输入标题'}]}
              >
                <Input></Input>
              </Form.Item>
              <Form.Item
                label="通知内容"
                name="content"
                rules={[{required: true, message: '请输入通知内容'}]}
              >
                <TextArea rows={4}/>
              </Form.Item>
              <Form.Item label="添加附件" name="file">
                <Upload {...props} onChange={this.uploadFile}>
                  <Button icon={<UploadOutlined/>}>点击上传</Button>
                </Upload>
              </Form.Item>
            </Form>
          </>
        ),
      },
      {
        title: '目标人群分组',
        content: (
          <>
            <Form
              name="目标人群分组"
              // layout="vertical"
              ref={this.formRef2}
            >
              <Form.Item
                label="班级数量"
                name="number"
                rules={[{required: true, message: '请输入分组数量'}]}
                initialValue={0}
              >
                <InputNumber
                  min={0}
                  max={10}
                  onChange={this.classNumberOnChange}
                />
              </Form.Item>
              <Form.List name="groupList">
                {(fields, {add, remove}) => (
                  <>
                    {fields.map(({key, name, fieldKey, ...restField}) => (
                      <Space
                        key={key}
                        style={{
                          display: 'flex',
                          marginBottom: 8,
                          // marginLeft: 100,
                        }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          label="班级名称"
                          name={[name, 'classId']}
                          fieldKey={[fieldKey, 'classId']}
                          rules={[
                            {required: true, message: '请输入班级名称'},
                          ]}
                        >
                          <Select
                            style={{width: 160}}
                            onChange={(value: any) =>
                              this.classOnchange(value, fieldKey)
                            }
                          >
                            {classandtemplate?.map(
                              (element: any, index: any) => {
                                return (
                                  <Option value={element.classid} key={index}>
                                    {element.classname}
                                  </Option>
                                );
                              },
                            )}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="班级分组模板"
                          name={[name, 'classExample']}
                          fieldKey={[fieldKey, 'classExample']}
                          rules={[
                            {required: true, message: '请输入班级分组模板'},
                          ]}
                        >
                          <Select style={{width: 160}}>
                            {classExample[fieldKey]?.map(
                              (element: any, index: any) => {
                                return (
                                  <Option
                                    value={element.TEMPLATE_ID}
                                    key={index}
                                  >
                                    {element.TEMPLATE_NAME}
                                  </Option>
                                );
                              },
                            )}
                          </Select>
                        </Form.Item>

                        <Button
                          icon={<SearchOutlined/>}
                          onClick={() => {
                            this.exampleShowModal(fieldKey, 'see');
                          }}
                        >
                          查看模板
                        </Button>
                      </Space>
                    ))}
                  </>
                )}
              </Form.List>
            </Form>
          </>
        ),
      },
    ];
    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        {/* <Button onClick={() => {
          console.log(downloadFile);
        }}>ces</Button> */}
        <div style={{marginBottom: 30, backgroundColor: 'white'}}>
          <PageHeader
            title="院系通知"
            subTitle="下发通知和进行公示"
            tags={<Tag color="blue">运行中</Tag>}
            extra={
              <Space>
                {roleTag === '2' ? (
                  <></>
                ) : (
                  <Button
                    onClick={() => {
                      this.setState({
                        noticeVisible: true,
                      });
                    }}
                    type="primary"
                  >
                    发布院系通知
                  </Button>
                )}
              </Space>
            }
            avatar={{src: require('@/assets/picture/院校通知.png')}}
          >
            <Content
              extraContent={
                studentReport?.picPath ? (
                  <Avatar
                    size={120}
                    src={studentReport.picPath}
                    style={{marginRight: 20}}
                  />
                ) : (
                  <Avatar
                    size={120}
                    icon={<UserOutlined/>}
                    style={{marginRight: 20}}
                  />
                )
              }
            >
              {content}
            </Content>
          </PageHeader>
        </div>
        {roleTag === '2' ? (
          <Card title="通知列表">
            <Table
              dataSource={stunoticelist}
              columns={StudentNoticeColumns}
              rowKey={(record) => record.taskId}
            />
          </Card>
        ) : (
          <Card title="通知列表">
            <Table
              dataSource={teachernoticelist}
              columns={TeacherNoticeColumns}
              rowKey={(record) => record.taskId}
            />
          </Card>
        )}

        <Modal
          title="发布院系通知"
          visible={noticeVisible}
          onCancel={this.createNoticeCancel}
          footer={null}
          forceRender
          width="800px"
        >
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title}/>
            ))}
          </Steps>
          <Divider/>
          <div>{steps[current].content}</div>
          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button type="primary" onClick={this.next}>
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => {
                  this.formRef2.current
                    ?.validateFields()
                    .then((values: any) => {
                      let Parm: any = {
                        title: step1form.title,
                        content: step1form.content,
                        filePath: JSON.stringify(filePath),
                        receiverList: {
                          number: values.number,
                          groupList: JSON.stringify(values.groupList),
                        },
                      };

                      dispatch({
                        type: 'departmentnotice/publishNotice',
                        payload: Parm,
                      }).then(() => {
                        if (roleTag === '2') {
                          dispatch({
                            type: 'departmentnotice/getAllStuNotice',
                          });
                        } else {
                          dispatch({
                            type: 'departmentnotice/getAllTeacherNotice',
                          });
                        }
                      });

                      this.setState({
                        current: 0,
                        noticeVisible: false,
                        step1form: {},
                      });
                      this.formRef1.current?.resetFields();
                      this.formRef2.current?.resetFields();
                    })
                    .catch((info) => {
                      message.info('请填写表单！');
                    });
                }}
              >
                发布
              </Button>
            )}
            {current > 0 && (
              <>
                <Button style={{margin: '0 8px'}} onClick={this.prev}>
                  上一步
                </Button>
                <Button
                  icon={<PlusCircleOutlined/>}
                  onClick={() => {
                    this.exampleShowModal(null, 'create');
                  }}
                >
                  新建模板
                </Button>
              </>
            )}
          </div>
        </Modal>

        <Modal
          title={noticeTitle}
          visible={seeNoticeVisible}
          forceRender
          closable={false}
          width={'700px'}
          footer={
            footerShow ? (
              <Space>
                <Button
                  onClick={() => {
                    this.setState({
                      seeNoticeVisible: false,
                      problemShow: false,
                    });
                  }}
                >
                  取消
                </Button>
                <Button
                  onClick={() => {
                    this.setState({
                      problemShow: true,
                      footerShow: false,
                    });
                  }}
                >
                  存在疑问
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    dispatch({
                      type: 'departmentnotice/changeNoticeState',
                      payload: {detailId: stuDetailId},
                    }).then(() => {
                      if (roleTag === '2') {
                        dispatch({type: 'departmentnotice/getAllStuNotice'});
                      } else {
                        dispatch({
                          type: 'departmentnotice/getAllTeacherNotice',
                        });
                      }
                    });
                    this.setState({
                      seeNoticeVisible: false,
                      problemShow: false,
                    });
                  }}
                >
                  已阅读且无疑问
                </Button>
              </Space>
            ) : (
              <Space>
                <Button
                  onClick={() => {
                    this.setState({
                      footerShow: true,
                      problemShow: false,
                    });
                  }}
                >
                  返回
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    this.proFormRef.current
                      ?.validateFields()
                      .then((values: any) => {
                        this.proFormRef.current?.resetFields();
                        dispatch({
                          type: 'departmentnotice/askQuestion',
                          payload: {
                            detailId: stuDetailId,
                            taskId: noticeId,
                            content: values.content,
                          },
                        }).then(() => {
                          if (roleTag === '2') {
                            dispatch({
                              type: 'departmentnotice/getAllStuNotice',
                            });
                          } else {
                            dispatch({
                              type: 'departmentnotice/getAllTeacherNotice',
                            });
                          }
                        });
                        this.setState({
                          footerShow: true,
                          problemShow: false,
                          seeNoticeVisible: false,
                        });
                      })
                      .catch((info) => {
                        message.info('请填写问题！');
                      });
                  }}
                >
                  发送疑问
                </Button>
              </Space>
            )
          }
        >
          <Collapse defaultActiveKey={['1']}>
            <Panel header="通知内容" key="1">
              <div style={{whiteSpace: 'pre-line', fontSize: 20}}>
                {noticeContent}
              </div>
            </Panel>
            {downloadFile.length !== 0 ? (
              <Panel header="通知附件" key="2">
                <Space>
                  {downloadFile.map((element: any, index: any) => {
                    return (
                      <Button
                        key={index}
                        onClick={() => {
                          window.open(element.path);
                        }}
                      >
                        点击下载{element.name}
                      </Button>
                    );
                  })}
                </Space>
              </Panel>
            ) : null}
            {promblemList.length !== 0 ? (
              <Panel header="通知答疑" key="3">
                <Descriptions bordered>
                  {promblemList.map((element: any, index: any) => {
                    if (element.states === 1) {
                      let lableName = '问题' + '：' + element.content;
                      return (
                        <Descriptions.Item
                          key={index}
                          label={lableName}
                          span={3}
                        >
                          {element.answer}
                        </Descriptions.Item>
                      );
                    }
                  })}
                </Descriptions>
              </Panel>
            ) : null}
          </Collapse>
          {problemShow ? (
            <>
              <Divider/>
              <Form name="疑问" layout="vertical" ref={this.proFormRef}>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="我的疑问"
                      name="content"
                      rules={[{required: true, message: '请输入问题'}]}
                    >
                      <TextArea rows={4}/>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </>
          ) : null}
        </Modal>

        <Modal
          title={noticeTitle + '：' + '学生查看情况'}
          visible={checkPeopleVisible}
          onCancel={this.checkPeopleCancel}
          forceRender
          footer={
            sendButton ? (
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    dispatch({
                      type: 'departmentnotice/leaderSendMail',
                      payload: {taskId: noticeId},
                    }).then(() => {
                      this.setState({
                        checkPeopleVisible: false,
                      });
                    });
                  }}
                >
                  确认并通知老师
                </Button>
              </Space>
            ) : null
          }
          width={'800px'}
        >
          <Collapse>
            {noticePeople.map((element: any, index: any) => {
              return (
                <Panel header={element.class} key={index}>
                  <Collapse>
                    {element.content?.map((elementsub: any, indexsub: any) => {
                      return (
                        <Panel header={elementsub.name} key={indexsub}>
                          <Table
                            dataSource={elementsub.content}
                            columns={stuColumns}
                            rowKey={(record) => record.userId}
                            pagination={false}
                          />
                        </Panel>
                      );
                    })}
                  </Collapse>
                </Panel>
              );
            })}
          </Collapse>
        </Modal>

        <Modal
          title={noticeTitle + '：' + '学生反馈问题'}
          visible={problemListVisible}
          onCancel={this.problemListCancel}
          forceRender
          footer={null}
          width={'1300px'}
        >
          <Table
            dataSource={promblemList}
            columns={problemColumns}
            rowKey={(record) => record.questionId}
          />
        </Modal>

        <Modal
          title={promblemTitle}
          visible={answerProblemVisible}
          onCancel={this.answerProblemCancel}
          forceRender
          footer={null}
        >
          <Form
            name="回答问题"
            layout="vertical"
            ref={this.answerFormRef}
            onFinish={this.answerProblemOnFinish}
          >
            <Form.Item name="questionId" hidden>
              <Input></Input>
            </Form.Item>
            <Form.Item
              label="解答疑问"
              name="answer"
              rules={[{required: true, message: '请输入解答内容'}]}
            >
              <TextArea rows={4}/>
            </Form.Item>
            <Button type="primary" htmlType="submit" style={{width: '100%'}}>
              发送
            </Button>
          </Form>
        </Modal>

        <Modal
          title={exampleTitle}
          visible={exampleVisible}
          onCancel={this.exampleCancelModal}
          width={'800px'}
          // okText={'创建模板'}
          // cancelText={'取消'}
          forceRender
          footer={
            <Space>
              {exampleTitle && exampleTitle === '查看模板' ? (
                <>
                  <Button onClick={this.exampleCancelModal}>取消</Button>
                  <Button type="primary" onClick={this.exampleHandleOk}>
                    修改模板
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={this.exampleCancelModal}>取消</Button>
                  <Button type="primary" onClick={this.exampleHandleOk}>
                    创建模板
                  </Button>
                </>
              )}
            </Space>
          }
        >
          <Form
            name="目标人群分组"
            // layout="vertical"
            ref={this.exampleFormRef}
          >
            {exampleTitle && exampleTitle === '查看模板' ? (
              <Form.Item name="templateId" hidden>
                <Input></Input>
              </Form.Item>
            ) : null}
            <Form.Item
              label="模板名称"
              name="exampleName"
              rules={[{required: true, message: '请输入模板名称'}]}
            >
              <Input></Input>
            </Form.Item>
            <Row>
              <Col span={8}>
                <Form.Item
                  label="班级名称"
                  name="classid"
                  rules={[{required: true, message: '请输入班级名称'}]}
                >
                  <Select onChange={this.exampleChoseClass}>
                    {noticestutree?.map((element: any, index: any) => {
                      return (
                        <Option value={element.value} key={index}>
                          {element.title}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} offset={1}>
                <Form.Item
                  label="班长"
                  name="monitor"
                  rules={[{required: true, message: '请输入班长'}]}
                >
                  <Select>
                    {exampleChoseClassStu.map((element: any, index: any) => {
                      return (
                        <Option value={element.value} key={index}>
                          {element.title}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} style={{paddingLeft: 8}}>
                <Form.Item
                  label="分组数"
                  name="number"
                  rules={[{required: true, message: '请输入分组数量'}]}
                  initialValue={0}
                >
                  <InputNumber
                    min={0}
                    max={10}
                    onChange={this.groupingOnChange}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.List name="groupList">
              {(fields, {add, remove}) => (
                <>
                  {fields.map(({key, name, fieldKey, ...restField}) => (
                    <Space
                      key={key}
                      style={{
                        display: 'flex',
                        marginBottom: 8,
                        // marginLeft: 100,
                      }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        label="小组成员"
                        name={[name, 'groupStu']}
                        fieldKey={[fieldKey, 'groupStu']}
                        rules={[{required: true, message: '请输入小组成员'}]}
                      >
                        <Select
                          mode="multiple"
                          style={{width: 390}}
                          onChange={(value: any) =>
                            this.groupOnChange(value, fieldKey)
                          }
                        >
                          {exampleChoseClassStu.map(
                            (element: any, index: any) => {
                              return (
                                <Option value={element.value} key={index}>
                                  {element.title}
                                </Option>
                              );
                            },
                          )}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="小组长"
                        name={[name, 'groupLeader']}
                        fieldKey={[fieldKey, 'groupLeader']}
                        rules={[{required: true, message: '请输入小组长'}]}
                      >
                        <Select style={{width: '90px'}}>
                          {groupLeader[fieldKey]?.map(
                            (element: any, index: any) => {
                              return (
                                <Option key={index} value={element.value}>
                                  {element.name}
                                </Option>
                              );
                            },
                          )}
                        </Select>
                      </Form.Item>
                    </Space>
                  ))}
                </>
              )}
            </Form.List>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default connect(({user, departmentnotice}: any) => ({
  ...user,
  ...departmentnotice,
}))(DepartmentNotice);
