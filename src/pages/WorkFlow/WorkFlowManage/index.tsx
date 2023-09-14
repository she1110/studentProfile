import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  ConfigProvider,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Image,
  Input,
  message,
  Modal,
  PageHeader,
  Radio,
  Row,
  Select,
  Space,
  Steps,
  Tabs,
  Tag,
  TreeSelect,
  Typography,
  Upload,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './index.css';
import NeedDoneCopy from './components/NeedDoneCopy/index';

import {MinusCircleOutlined, PlusOutlined, UserAddOutlined,} from '@ant-design/icons';

const {TabPane} = Tabs;
const {Search} = Input;
const {Option} = Select;
const {Panel} = Collapse;
const {TextArea} = Input;
const {RangePicker} = DatePicker;
const {Step} = Steps;
const {Paragraph} = Typography;

export type wfSteptempType = {
  workflowforms?: object[];
  remark?: string;
  approveroption?: object[];
};

export type Props = {
  dispatch: Dispatch;
  tag: number;
  tags: number[];
  workFlowList: object[];
  wfSteptemp: wfSteptempType[];
  columnTypeList: object[];
  dataTableList: object[];
  treeData: object[];
  lableList: object[];
  wfIdtemp: String;
  uploadtag: boolean;
  urltemp: String;
  current: number;
  desktopworkflow: object[];
  desktopcountersign: object[];
  checkedPerson: object[];
  needDealList: object[];
  doneList: object[];
  copyList: object[];
  indesktopworkflow: object[];
  indesktopcountersign: object[];
  wfTypeList: object[];
  simpleSteps: any;
  checkedOnePerson: any;
  personid: any;
  taskUsers: any;
  ccList: any;
  userList: any;
  peoplename: any;
};

class WorkFlowManage extends Component<Props> {
  state = {
    workflowvisible: false, //create workflow modal
    wfobjectvisible: false, //workflow create object modal
    myworkflowvisible: false, //add workflow to desktop
    datasourcevisible: false, // create datasource
    treevisible: false, // tree modal
    tags: [], //标识新建流程的第几步，例如 步骤1 tag就是这个1
    tag: 0,
    wfSteptemp: [], //用于预览
    wfIdtemp: '', //用于上传文件
    uploadtag: false, //上传成功 向表单填写地址
    urltemp: '', //上传文件返回的地址
    current: 0, //预览工作流类 标识步骤的
    checkedPerson: undefined, //根据范围选中的人，审核人和抄送人
    checkedOnePerson: undefined, //根据范围选中的人 或者 审核人 或者 抄送人，仅有一个
    wfobjecttitle: '', //发起流程 modal title
    simpleSteps: [], //整个流程包括发起人，审批人和抄送人
    personid: '', //在树中选中的人的id
    taskUsers: [], //发起流程中 审批人的数组
    ccList: [], //发起流程中 抄送人的数组
    peoplename: {ccList: [], taskUsers: []}, //回显 审批人和抄送人 的名字
    flowStepItem: [], //用户默认的审批人和抄送人
  };
  workflowRef = React.createRef<FormInstance>();
  wfpreviewRef = React.createRef<FormInstance>();
  wfobjectRef = React.createRef<FormInstance>();
  datasourceRef = React.createRef<FormInstance>();
  treeRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'workflow/getAllWorkFlow',
    });

    dispatch({
      type: 'user/getTreeByRole',
      payload: {
        node: '1001',
        roles: [],
      },
    });
    dispatch({
      type: 'user/getAll',
    });
    dispatch({
      type: 'workflow/getAll',
      payload: {
        flowType: '0',
      },
    });
    dispatch({
      type: 'workflow/getAll',
      payload: {
        flowType: '1',
      },
    });
    dispatch({
      type: 'workflow/getMyUserTask',
      payload: {
        state: '0',
      },
    }); //待办
    dispatch({
      type: 'workflow/getMyUserTask',
      payload: {
        state: '1',
      },
    }); //已办
    dispatch({
      type: 'workflow/getMyUserTask',
      payload: {
        state: '2',
      },
    }); //抄送

    dispatch({
      type: 'workflow/getAllColumnType',
    });
    dispatch({
      type: 'workflow/getAllWfType',
    });
    dispatch({
      type: 'workflow/getFLowFlag',
      payload: {
        type: '0',
      },
    });
    dispatch({
      type: 'workflow/getFLowFlag',
      payload: {
        type: '1',
      },
    });
    dispatch({
      type: 'workflow/lableget',
    });
  };

  //新建工作流对象的时候  一点开工作流图标发出请求
  wfObjectShowModal = (value: any) => {
    this.setState({wfobjectvisible: true});
    const {dispatch, checkedPerson} = this.props;
    let valuetemp: any = {
      ccList: [],
      ids: [],
    };
    if ('flowDo' in value) {
      valuetemp.ccList = JSON.parse(value.flowDo.ccList);
      if ('form' in value.flowDo) {
        JSON.parse(value.flowDo.form).map((element: any, index: any) => {
          let idstemp: any = {
            ids: [],
            index: '',
          };
          idstemp.ids = element.ids;
          idstemp.index = element.index;
          if (element.index !== '1') {
            valuetemp.ids.push(idstemp);
          }
        });
      }
    }

    dispatch({
      type: 'user/getTreeByFlow',
      payload: {
        valuetemp,
        callback: this.getByFlowCallback,
      },
    });

    dispatch({
      type: 'workflow/checkUserCanTask',
      payload: {
        workFlowId: {workFlowId: value.flow},
        callback: this.checkUserCanTaskCallback,
      },
    });
    let taskUsersTemp: any = [];
    let peoplenametaskUsersTemp: any = [];
    if (
      'flowStepItem' in value &&
      value.flowStepItem.length !== 0 &&
      value.flowStepItem.length !== 1
    ) {
      JSON.parse(value.flowStepItem)
        .slice(1)
        .map((element: any, index: any) => {
          let taskUsersTempObj = {
            index: element.index,
            id: element.value,
          };
          taskUsersTemp.push(taskUsersTempObj);
          peoplenametaskUsersTemp[element.index] = element.name;
        });
    } else {
      message.error('该用户无审批人 请联系管理员！！');
    }

    let peoplenameCcList: any = [];
    peoplenameCcList[1] = '王宁';
    this.setState({
      wfobjectvisible: true,
      wfSteptemp: JSON.parse(value.flowDo.form),
      wfIdtemp: value.flow,
      wfobjecttitle: value.flowDo.name,
      simpleSteps: value.flowDo.simpleSteps,
      taskUsers: taskUsersTemp, //发起流程中 审批人的数组
      ccList: [{index: '1', id: '1636526063587'}], //发起流程中 抄送人的数组
      peoplename: {
        ccList: peoplenameCcList,
        taskUsers: peoplenametaskUsersTemp,
      }, //回显 审批人和抄送人 的名字
      current: JSON.parse(value.flowStepItem).length,
    });
    this.wfobjectRef.current?.setFieldsValue({
      wfId: value.flow,
    });
  };

  //请求回来 树的数据，供学生在树中选择自己的审批人 抄送人
  getByFlowCallback = (value: any) => {
    let valuetemp: any = [];
    value.ids.map((element: any, index: any) => {
      valuetemp.push({});
    });
    this.wfobjectRef.current?.setFieldsValue({
      taskUsers: valuetemp,
    });
    this.setState({
      checkedPerson: value,
    });
  };
  //检查当前角色是否有权限建立流程
  checkUserCanTaskCallback = (value: any) => {
    if (value) {
      message.info('您具有权限，可以进行创建！');
    } else {
      message.info('您没有权限，请联系管理员！');
      this.setState({checkedPerson: undefined, wfobjectvisible: false});
    }
  };

  //新建工作流对象
  wfObjectHandleCancel = () => {
    this.setState({
      checkedPerson: undefined,
      wfobjectvisible: false,
      peoplename: {ccList: [], taskUsers: []},
    });
    this.wfobjectRef.current?.resetFields();
  };
  wfObjectHandleOk = () => {
    this.setState({checkedPerson: undefined, wfobjectvisible: false});
    this.wfobjectRef.current?.resetFields();
  };
  wfObjectOnFinish = (value: any) => {
    // if (!value.taskUsers || value.taskUsers.length === 0) {
    //     message.error('请输入审批人')
    //     return;
    // }
    const {dispatch} = this.props;
    const {taskUsers, ccList} = this.state;
    let valuetemp = JSON.parse(JSON.stringify(value));
    delete valuetemp.activityDay;
    delete valuetemp.wfId;
    value.taskForm = valuetemp;
    value.taskUsers = taskUsers;
    let ccListtemp: any = JSON.parse(JSON.stringify(ccList));
    if (ccList && ccList.length !== 0) {
      let ccListobjtemp: any = [];
      ccListtemp.map((element: any, index: any) => {
        ccListobjtemp.push(element.id);
      });
      value.ccList = ccListobjtemp;
    }
    this.setState({
      wfobjectvisible: false,
      peoplename: {ccList: [], taskUsers: []},
    });
    dispatch({
      type: 'workflow/createTask',
      payload: value,
    }).then(() => {
      dispatch({
        type: 'workflow/getMyUserTask',
        payload: {
          state: '1',
        },
      }); //已办
    });
  };

  //新建工作流模板
  workFlowShowModal = () => {
    this.setState({workflowvisible: true});
  };
  workFlowHandleCancel = () => {
    this.setState({workflowvisible: false});
    // this.workflowRef.current?.resetFields();
  };
  workFlowHandleOk = () => {
    this.setState({workflowvisible: false});
  };
  workFlowOnFinish = (values: any) => {
    if (!values.wfStep || values.wfStep.length === 0 || !values.wfStep[0]) {
      message.error('请添加流程步骤');
      return;
    }
    if (
      !values.wfStep[0].workflowforms ||
      values.wfStep[0].workflowforms.length === 0
    ) {
      message.error('请添加步骤1表单');
      return;
    }
    if (!values.ccList || values.ccList.length === 0) {
      message.error('请添加抄送人');
      return;
    }

    if (values.wfStep.length > 1) {
      const {dispatch} = this.props;
      values.wfStep.map((element: any, index: any) => {
        if (element) {
          let idstemp: any = [];
          if ('ids' in element && element.ids.length !== 0) {
            element.ids.map((elementsub: any, indexsub: any) => {
              idstemp.push(JSON.parse(elementsub));
            });
          }
          element.ids = idstemp;
        } else {
          message.error('请填写步骤内条目');
        }
      });
      let ccListtemptemp: any = [];
      if (values.ccList && values.ccList.length !== 0) {
        values.ccList.map((element: any, index: any) => {
          let firsttemp: any = [];
          if ('first' in element && element.first.length !== 0) {
            element.first.map((elementsub: any, indexsub: any) => {
              firsttemp.push(JSON.parse(elementsub));
            });
          }
          ccListtemptemp.push(firsttemp);
        });
      }

      values.ccList = ccListtemptemp;
      dispatch({
        type: 'workflow/addWorkFlow',
        payload: values,
      }).then(() => {
        message.info('新建成功！！！');
        dispatch({
          type: 'workflow/getAllWorkFlow',
        });
        dispatch({
          type: 'workflow/getFLowFlag',
          payload: {
            type: '0',
          },
        });
      });
      this.setState({workflowvisible: false});
      this.workflowRef.current?.resetFields();
    } else {
      if (values.wfStep[0]) {
        message.error('请填写审核人！！');
      } else {
        message.error('请填写发起人表单内容！！');
      }
    }
  };
  //用于循环出表单的各项条目
  whichOneComponent = (value: any, id: any, dataTable: any) => {
    if (dataTable !== undefined) {
      let optionstemp: any = JSON.parse(dataTable);
      switch (value) {
        case '1':
          return <Input key={Math.random()} id={id}/>;
        case '2':
          return (
            <Select key={Math.random()} id={id} style={{width: '100%'}}>
              {optionstemp.map((element: any, index: any) => {
                return (
                  <Option value={element.KEY} key={Math.random()}>
                    {element.VALUE}
                  </Option>
                );
              })}
            </Select>
          );
        case '3':
          return (
            <Radio.Group>
              {optionstemp.map((element: any, index: any) => {
                return (
                  <Radio value={element.KEY} key={Math.random()}>
                    {element.VALUE}
                  </Radio>
                );
              })}
            </Radio.Group>
          );
        case '4':
          return (
            <RangePicker key={Math.random()} id={id} locale={locale} showTime/>
          );
        case '7':
          return <Checkbox key={Math.random()} id={id}/>;
        case '5': {
          const props = {
            name: 'file',
            action: 'http://10.1.40.84:7779/uploadFile',
            headers: {
              Authorization: localStorage.getItem('token') as string,
            },
            data: {
              wfId: this.state.wfIdtemp,
            },
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
          return (
            <Upload key={Math.random()} id={id} {...props}>
              <Button type="link">点击上传</Button>
            </Upload>
          );
        }

        default:
      }
    } else {
      switch (value) {
        case '1':
          return <Input key={Math.random()} id={id}/>;
        case '2':
          return (
            <Select key={Math.random()} id={id} style={{width: '100%'}}>
              {/* {
                                columnTypeList.map((element: any, index: any) => {
                                    return <Option value={element.ID} key={element.ID}>{element.REMARK}</Option>
                                })
                            } */}
            </Select>
          );
        case '3':
          return (
            <Radio.Group>
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
            </Radio.Group>
          );
        case '4':
          return (
            <RangePicker key={Math.random()} id={id} locale={locale} showTime/>
          );
        case '7':
          return <Checkbox key={Math.random()} id={id}/>;
        case '5':
          return (
            <Upload key={Math.random()} id={id}>
              <Button type="link">点击上传</Button>
            </Upload>
          );
        default:
      }
    }
  };
  //树形modal
  treeShowModal = (value: any) => {
    const {checkedPerson} = this.state;
    if (value.key === 'taskUsers') {
      checkedPerson?.ids.map((element: any, index: any) => {
        if (element.index === value.value) {
          let treetemp: any = [];
          treetemp.push(element.ids);
          this.setState({
            checkedOnePerson: treetemp,
          });
        }
      });
    }

    if (value.key === 'ccList') {
      checkedPerson?.ccList.map((element: any, index: any) => {
        if (element.index === parseInt(value.value) - 1 + '') {
          let treetemp: any = [];
          treetemp.push(element.ids);
          this.setState({
            checkedOnePerson: treetemp,
          });
        }
      });
    }

    this.treeRef.current?.setFieldsValue({
      key: value.key,
      index: value.value,
    });
    this.setState({
      treevisible: true,
    });
  };
  treeHandleOk = () => {
    this.setState({
      treevisible: false,
    });
  };
  treeHandleCancel = () => {
    this.setState({
      treevisible: false,
    });
  };
  treeOnFinish = (value: any) => {
    const {taskUsers, ccList, peoplename} = this.state;
    const {userList} = this.props;
    if (value.key === 'taskUsers') {
      let taskUsersTemp: any = JSON.parse(JSON.stringify(taskUsers));
      let temp: any = {
        index: value.index,
        id: value.userid,
      };
      if (taskUsersTemp.length !== 0) {
        let tag: boolean = true;
        taskUsersTemp.map((element: any, index: any) => {
          if (element.index === temp.index) {
            element.id = temp.id;
            tag = false;
          }
        });
        if (tag) {
          taskUsersTemp.push(temp);
        }
      } else {
        taskUsersTemp.push(temp);
      }
      let peopleNameTemp: any = JSON.parse(JSON.stringify(peoplename));
      //id转name
      let username: any = '';
      userList.map((element: any, index: any) => {
        if (element.id === value.userid) {
          username = element.userName;
        }
      });
      peopleNameTemp.taskUsers[value.index] = username;
      this.setState({
        taskUsers: taskUsersTemp,
        peoplename: peopleNameTemp,
      });
    }
    if (value.key === 'ccList') {
      let ccListTemp: any = JSON.parse(JSON.stringify(ccList));
      let temp: any = {
        index: value.index,
        id: value.userid,
      };
      if (ccListTemp.length !== 0) {
        let tag: boolean = true;
        ccListTemp.map((element: any, index: any) => {
          if (element.index === temp.index) {
            element.id = temp.id;
            tag = false;
          }
        });
        if (tag) {
          ccListTemp.push(temp);
        }
      } else {
        ccListTemp.push(temp);
      }
      let peopleNameTemp: any = JSON.parse(JSON.stringify(peoplename));

      //id转name
      let username: any = '';
      userList.map((element: any, index: any) => {
        if (element.id === value.userid) {
          username = element.userName;
        }
      });
      peopleNameTemp.ccList[value.index] = username;
      this.setState({
        ccList: ccListTemp,
        peoplename: peopleNameTemp,
      });
    }
    this.setState({
      treevisible: false,
      checkedOnePerson: undefined,
    });
    this.treeRef.current?.resetFields();
  };
  //添加工作流模板到自己的桌面
  myWorkFlowShowModal = (value: any) => {
    this.setState({
      myworkflowvisible: true,
    });
  };
  myWorkFlowHandleOk = () => {
    this.setState({
      myworkflowvisible: false,
    });
  };
  myWorkFlowHandleCancel = () => {
    this.setState({
      myworkflowvisible: false,
    });
  };
  myWorkFlowOnFinish = (value: any) => {
    this.setState({
      myworkflowvisible: false,
    });
    const {dispatch} = this.props;
    dispatch({
      type: 'workflow/add',
      payload: {
        flow: value.id,
        flowType: '0',
      },
    }).then(() => {
      dispatch({
        type: 'workflow/getAll',
        payload: {
          flowType: '0',
        },
      });
      dispatch({
        type: 'workflow/getFLowFlag',
        payload: {
          type: '0',
        },
      });
    });
  };
  myWorkFlowDel = (value: any) => {
    this.setState({
      myworkflowvisible: false,
    });
    const {dispatch} = this.props;
    dispatch({
      type: 'workflow/moduleDel',
      payload: {
        id: value.id,
      },
    }).then(() => {
      dispatch({
        type: 'workflow/getAll',
        payload: {
          flowType: '0',
        },
      });
      dispatch({
        type: 'workflow/getFLowFlag',
        payload: {
          type: '0',
        },
      });
    });
  };
  //新建数据源
  dataSourceShowModal = (value: any) => {
    this.setState({
      datasourcevisible: true,
    });
  };
  dataSourceHandleOk = () => {
    this.setState({
      datasourcevisible: false,
    });
  };
  dataSourceHandleCancel = () => {
    this.setState({
      datasourcevisible: false,
    });
  };
  dataSourceOnFinish = (value: any) => {
    let lablestemp: any = [];
    if ('labels' in value) {
      value.labels.map((element: any, index: any) => {
        lablestemp.push(element.first);
      });
    }
    value.labels = lablestemp;
    this.setState({
      datasourcevisible: false,
    });
    const {dispatch} = this.props;
    dispatch({
      type: 'workflow/labeladd',
      payload: value,
    })
      .then(() => {
        dispatch({
          type: 'workflow/lableget',
        });
      })
      .then(() => {
        this.datasourceRef.current?.resetFields();
      });
  };
  //steps onchange
  stepsOnChange = (value: any) => {
    this.setState({current: value});
  };
  TreeSelectOnChange = (value: any) => {
    this.setState({
      personid: value,
    });
  };

  render() {
    const {
      workFlowList,
      columnTypeList,
      treeData,
      lableList,
      desktopworkflow,
      indesktopworkflow,
      wfTypeList,
    } = this.props;
    const {
      workflowvisible,
      tags,
      tag,
      wfSteptemp,
      wfobjectvisible,
      uploadtag,
      urltemp,
      current,
      myworkflowvisible,
      datasourcevisible,
      checkedPerson,
      wfobjecttitle,
      simpleSteps,
      treevisible,
      checkedOnePerson,
      peoplename,
    } = this.state;

    const setuploadtag = (value: any) => {
      this.setState({
        uploadtag: true,
        urltemp: value,
      });
    };
    const props = {
      name: 'file',
      action: 'http://10.1.40.84:7779/uploadFile',
      headers: {
        Authorization: localStorage.getItem('token') as string,
      },
      data: {
        wfId: this.state.wfIdtemp,
      },
      onChange(info: any) {
        if (info.file.status !== 'uploading') {
          // setuploadtag("1");
        }
        if (info.file.status === 'done') {
          setuploadtag(info.file.response.data);
          message.success(`${info.file.name} 文件上传成功！`);
        } else if (info.file.status === 'error') {
          // setuploadtag("3");
          message.error(`${info.file.name} 文件上传失败！`);
        }
      },
    };
    const setDataSource = (value: any) => {
      let datasourcetemp: any = [];

      if (value.length !== 0) {
        value.map((element: any, index: any) => {
          let datasourceobject: any = {
            first: '',
          };
          datasourceobject.first = element;
          datasourcetemp.push(datasourceobject);
        });
      }
      this.datasourceRef.current?.setFieldsValue({
        labels: datasourcetemp,
      });
      // this.setState({
      //     uploadtag: true,
      //     urltemp: value,
      // })
    };
    const datasourceprops = {
      name: 'file',
      action: 'http://10.1.40.91:8000/label/getByFile',
      headers: {
        Authorization: localStorage.getItem('token') as string,
      },
      onChange(info: any) {
        if (info.file.status !== 'uploading') {
          // setuploadtag("1");
        }
        if (info.file.status === 'done') {
          setDataSource(info.file.response.data);
          message.success(`${info.file.name} 文件上传成功！`);
        } else if (info.file.status === 'error') {
          // setuploadtag("3");
          message.error(`${info.file.name} 文件上传失败！`);
        }
      },
    };

    const content = (
      <>
        <Paragraph>
          事务管理实现电子化审批流程、沟通协作、考勤等业务，实现无纸化办公。
        </Paragraph>
        <Paragraph>
          有助于实现单位内部的协同管理，提升人与人、部门与部门之间的管理和办公效率。
        </Paragraph>
        <Paragraph>
          涵盖了单位内部的沟通与协作、信息与资料的共享、文档管理、工作流程(各类请示、汇报、审批)等内容。
        </Paragraph>
      </>
    );

    const Content = ({children, extraContent}: any) => (
      <Row>
        <div style={{flex: 1}}>{children}</div>
      </Row>
    );
    const roleTag = localStorage.getItem('roles');
    const isAdmin = localStorage.getItem('isAdmin');
    return (
      <div
        style={{
          paddingRight: 30,
          paddingTop: 30,
          paddingLeft: 30,
          background: ' #ececec',
          width: '100%',
        }}
      >
        <div style={{marginBottom: 30, backgroundColor: 'white'}}>
          <PageHeader
            title="事务管理"
            subTitle="办公自动化"
            tags={<Tag color="blue">运行中</Tag>}
            avatar={{src: require('@/assets/picture/事务.png')}}
          >
            <Content>{content}</Content>
          </PageHeader>
        </div>
        <ConfigProvider locale={zhCN}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="我的事务" key="1" style={{overflowX: 'auto'}}>
                <Space align="center" size={30}>
                  {desktopworkflow.length !== 0 ? (
                    desktopworkflow.map((element: any, index: any) => {
                      return (
                        <div key={index}>
                          <div style={{textAlign: 'center'}}>
                            {/* 1-7天 */}
                            {element.flow === '1637133668844' ? (
                              <Image
                                src={require('@/assets/WorkFlow/小于7天请假.png')}
                                style={{height: '50px', width: '50px'}}
                                preview={false}
                                onClick={() => {
                                  this.wfObjectShowModal(element);
                                }}
                              />
                            ) : null}
                            {/* 大于7天 */}
                            {element.flow === '1637111244778' ? (
                              <Image
                                src={require('@/assets/WorkFlow/大于7天请假.png')}
                                style={{height: '50px', width: '50px'}}
                                preview={false}
                                onClick={() => {
                                  this.wfObjectShowModal(element);
                                }}
                              />
                            ) : null}
                            {element.flow !== '1637133668844' &&
                            element.flow !== '1637111244778' ? (
                              <Image
                                src={require('@/assets/WorkFlow/1.png')}
                                style={{height: '50px', width: '50px'}}
                                preview={false}
                                onClick={() => {
                                  this.wfObjectShowModal(element);
                                }}
                              />
                            ) : null}
                          </div>
                          <div
                            style={{
                              overflow: 'hidden',
                              color: '#00000073',
                              fontWeight: 'bolder',
                              fontSize: '12px',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              marginLeft: 3,
                              paddingTop: 10,
                            }}
                          >
                            {element.flowDo?.name}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <></>
                  )}
                  <div>
                    {/* <Avatar size={46} icon={<PlusCircleOutlined />} /> */}
                    <img
                      src={require('@/assets/WorkFlow/添加.png')}
                      style={{height: '35px', width: '35px', marginLeft: 10}}
                      onClick={this.myWorkFlowShowModal}
                    />
                  </div>
                </Space>
              </TabPane>
              {roleTag === '0' ? (
                <TabPane tab="全部事务" key="2" style={{overflowX: 'auto'}}>
                  <Space align="center" size={30}>
                    {workFlowList ? (
                      workFlowList.map((element: any, index: any) => {
                        return (
                          <div key={index}>
                            <div style={{textAlign: 'center'}}>
                              <Image
                                src={require('@/assets/WorkFlow/0.png')}
                                style={{height: '64px', width: '64px'}}
                                preview={false}
                                // onClick={this.wfClassStepsShowModal}
                              />
                            </div>
                            <div
                              style={{
                                overflow: 'hidden',
                                color: '#00000073',
                                fontWeight: 'bolder',
                                fontSize: '15px',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                marginLeft: 3,
                              }}
                            >
                              {element.wfName}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <></>
                    )}
                    <div style={{backgroundColor: '#DDDDDD'}}>
                      <img
                        src={require('@/assets/WorkFlow/加号.png')}
                        style={{height: '64px', width: '64px'}}
                        onClick={this.workFlowShowModal}
                      />
                    </div>
                  </Space>
                </TabPane>
              ) : null}
            </Tabs>
          </Card>

          <NeedDoneCopy/>

          <Drawer
            title="选择工作流"
            width="500px"
            placement="right"
            onClose={this.myWorkFlowHandleCancel}
            visible={myworkflowvisible}
          >
            {indesktopworkflow && indesktopworkflow.length !== 0 ? (
              indesktopworkflow.map((element: any, index: any) => {
                return (
                  <Card title={element.kindName} bordered={false}>
                    {element.kindContent.map(
                      (elementsub: any, indexsub: any) => {
                        return (
                          <Row align="middle" key={indexsub}>
                            <Col span={4}>
                              <Image
                                src={require('@/assets/WorkFlow/1.png')}
                                style={{height: '64px', width: '64px'}}
                                preview={false}
                              />
                            </Col>
                            <Col span={6}>
                              <div style={{fontSize: 16, marginLeft: 20}}>
                                {elementsub.name}
                              </div>
                            </Col>
                            <Col span={5} offset={7}>
                              {elementsub.flag === '0' ? (
                                <Button
                                  style={{width: '100%'}}
                                  type="primary"
                                  onClick={() => {
                                    this.myWorkFlowOnFinish(elementsub);
                                  }}
                                >
                                  添加
                                </Button>
                              ) : (
                                <Button
                                  style={{width: '100%'}}
                                  onClick={() => {
                                    this.myWorkFlowDel(elementsub);
                                  }}
                                >
                                  移除
                                </Button>
                              )}
                            </Col>
                          </Row>
                        );
                      },
                    )}
                  </Card>
                );
              })
            ) : (
              <></>
            )}
          </Drawer>

          <Modal
            title="新建数据源"
            visible={datasourcevisible}
            onOk={this.dataSourceHandleOk}
            onCancel={this.dataSourceHandleCancel}
            footer={null}
            forceRender
            zIndex={1100}
          >
            <Form
              name="新建数据源"
              onFinish={this.dataSourceOnFinish}
              ref={this.datasourceRef}
            >
              <Form.Item
                label="名称"
                name="remark"
                rules={[{required: true, message: '请输入数据源名称'}]}
              >
                <Input></Input>
              </Form.Item>
              <Form.Item
                label="备注"
                name="tableName"
                rules={[{required: true, message: '请输入数据源备注'}]}
              >
                <Input></Input>
              </Form.Item>
              <Form.List name="labels">
                {(fields, {add, remove}) => (
                  <>
                    {fields.map(({key, name, fieldKey, ...restField}) => (
                      <Space
                        key={key}
                        style={{display: 'flex', marginBottom: 8}}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          label={'数据源条目'}
                          name={[name, 'first']}
                          fieldKey={[fieldKey, 'first']}
                          rules={[
                            {required: true, message: 'Missing first name'},
                          ]}
                        >
                          <Input
                            placeholder="数据源条目"
                            style={{width: '350px'}}
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)}/>
                      </Space>
                    ))}
                    <Divider/>
                    <Row>
                      <Col span={8} offset={6}>
                        <Form.Item>
                          <Button type="primary" onClick={() => add()}>
                            添加数据源条目
                          </Button>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          <Upload {...datasourceprops}>
                            <Button type="primary">上传Excel</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            提交
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )}
              </Form.List>
            </Form>
          </Modal>

          <Modal
            title="创建流程模板"
            width="850px"
            visible={workflowvisible}
            onOk={this.workFlowHandleOk}
            onCancel={this.workFlowHandleCancel}
            footer={null}
            forceRender
          >
            <Form
              name="流程名称"
              onFinish={this.workFlowOnFinish}
              ref={this.workflowRef}
            >
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="流程名称"
                    name="wfName"
                    rules={[{required: true, message: '请输入流程名称'}]}
                  >
                    <Input style={{width: '100%'}}/>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="流程备注"
                    name="wfBak"
                    rules={[{required: true, message: '请输入流程备注'}]}
                  >
                    <TextArea rows={4}/>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="&nbsp;&nbsp;流程类别&nbsp;"
                    name="wfType"
                    // rules={[{ required: true, message: '请输入流程类别' }]}
                  >
                    <Select placeholder="流程类别" style={{width: '100%'}}>
                      {wfTypeList.map((element: any, index: any) => {
                        return (
                          <Option value={element.typeName} key={index}>
                            {element.typeName}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.List name="wfStep">
                {(fields, {add, remove}) => (
                  <>
                    <Row align="middle">
                      <Col span={3}>
                        <span style={{marginTop: 10, marginLeft: 10}}>
                          新建步骤
                        </span>
                      </Col>
                      <Col span={1}>
                        <Form.Item>
                          <Button
                            type="primary"
                            style={{marginTop: 20}}
                            shape="circle"
                            size="small"
                            onClick={() => {
                              let tagstemp: any = tags;
                              if (tag === 0) {
                                tagstemp[tag] = tag + 1;
                              } else {
                                tagstemp[tag] = tagstemp[tag - 1] + 1;
                              }
                              this.setState({
                                tag: tag + 1,
                                tags: tagstemp,
                              });
                              add();
                            }}
                            block
                            icon={<PlusOutlined/>}
                          ></Button>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Collapse>
                      {fields.map(({key, name, fieldKey, ...restField}) => (
                        <Panel header={'步骤' + tags[fieldKey]} key={key}>
                          <Form.Item {...restField}>
                            <Row>
                              <Col span={0}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'index']}
                                  fieldKey={[fieldKey, 'index']}
                                  initialValue={tags[fieldKey] + ''}
                                >
                                  <Input style={{width: '100%'}}></Input>
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.List name={[name, 'workflowforms']}>
                              {(fields, {add, remove}) => (
                                <>
                                  <Row align="middle">
                                    <Col span={3}>
                                      <span
                                        style={{
                                          marginTop: 10,
                                          marginLeft: 10,
                                        }}
                                      >
                                        新建表单
                                      </span>
                                    </Col>
                                    <Col span={1}>
                                      <Form.Item>
                                        <Button
                                          type="primary"
                                          style={{marginTop: 20}}
                                          shape="circle"
                                          size="small"
                                          onClick={() => add()}
                                          block
                                          icon={<PlusOutlined/>}
                                        ></Button>
                                      </Form.Item>
                                    </Col>
                                    <Col span={3} offset={14}>
                                      <Button
                                        type="link"
                                        onClick={this.dataSourceShowModal}
                                      >
                                        <span
                                          style={{
                                            textDecoration: 'underline',
                                          }}
                                        >
                                          新建数据源
                                        </span>
                                      </Button>
                                    </Col>
                                  </Row>

                                  {fields.map((sub: any, index: any) => (
                                    <Row gutter={12} key={index}>
                                      <Col span={5} offset={1}>
                                        <Form.Item
                                          {...restField}
                                          label="命名"
                                          name={[sub.name, 'columnName']}
                                          fieldKey={[
                                            sub.fieldKey,
                                            'columnName',
                                          ]}
                                          rules={[
                                            {
                                              required: true,
                                              message: '请输入命名',
                                            },
                                          ]}
                                        >
                                          <Input
                                            style={{width: '100%'}}
                                          ></Input>
                                        </Form.Item>
                                      </Col>
                                      <Col span={8}>
                                        <Form.Item
                                          {...restField}
                                          label="录入方式"
                                          name={[sub.name, 'columnType']}
                                          fieldKey={[
                                            sub.fieldKey,
                                            'columnType',
                                          ]}
                                          rules={[
                                            {
                                              required: true,
                                              message: '请输入录入方式',
                                            },
                                          ]}
                                        >
                                          <Select
                                            placeholder="录入方式"
                                            style={{width: '100%'}}
                                          >
                                            {columnTypeList.map(
                                              (element: any, index: any) => {
                                                return (
                                                  <Option
                                                    value={element.ID}
                                                    key={element.ID}
                                                  >
                                                    {element.REMARK}
                                                  </Option>
                                                );
                                              },
                                            )}
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col span={6}>
                                        <Form.Item
                                          {...restField}
                                          label="数据源"
                                          name={[sub.name, 'dataTable']}
                                          fieldKey={[sub.fieldKey, 'dataTable']}
                                        >
                                          <Select
                                            placeholder="数据源"
                                            style={{width: '100%'}}
                                          >
                                            {lableList.map(
                                              (element: any, index: any) => {
                                                return (
                                                  <Option
                                                    value={element.tableArray}
                                                    key={index}
                                                  >
                                                    {element.tableName}
                                                  </Option>
                                                );
                                              },
                                            )}
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col span={1} style={{marginTop: 5}}>
                                        <MinusCircleOutlined
                                          onClick={() => remove(sub.name)}
                                        />
                                      </Col>
                                    </Row>
                                  ))}
                                </>
                              )}
                            </Form.List>
                          </Form.Item>
                          {tags[fieldKey] >= 2 ? (
                            <>
                              <Row gutter={12}>
                                <Col span={10}>
                                  <Form.Item
                                    {...restField}
                                    label="审批备注"
                                    name={[name, 'remark']}
                                    fieldKey={[fieldKey, 'remark']}
                                    rules={[
                                      {
                                        required: true,
                                        message: '请选择审批备注',
                                      },
                                    ]}
                                  >
                                    <Select
                                      placeholder="录入方式"
                                      style={{width: '100%'}}
                                    >
                                      <Option value={'1'}>输入框</Option>
                                      {/* {
                                                                                    columnTypeList.map((element: any, index: any) => {
                                                                                        return <Option value={element.ID} key={element.ID}>{element.REMARK}</Option>
                                                                                    })
                                                                                } */}
                                    </Select>
                                  </Form.Item>
                                </Col>

                                {/* <Col span={10}>
                                                                        <Form.Item
                                                                            {...restField}
                                                                            label="审批选项"
                                                                            name={[name, 'approveroption']}
                                                                            fieldKey={[fieldKey, 'approveroption']}
                                                                            rules={[{ required: true, message: '请输入审批选项' }]}
                                                                        >
                                                                            <Select
                                                                                placeholder="审批选项"
                                                                                style={{ width: '100%' }}
                                                                                mode="multiple"
                                                                                allowClear
                                                                            >
                                                                                <Option value='1'>同意</Option>
                                                                                <Option value='2'>拒绝</Option>
                                                                            </Select>
                                                                        </Form.Item>
                                                                    </Col> */}
                              </Row>
                              <Row gutter={12}>
                                <Col span={20}>
                                  <Form.Item
                                    {...restField}
                                    label="审批人员"
                                    name={[name, 'ids']}
                                    fieldKey={[fieldKey, 'ids']}
                                    rules={[
                                      {
                                        required: true,
                                        message: '请输入审批人员',
                                      },
                                    ]}
                                    // initialValue={'0'}
                                  >
                                    <TreeSelect
                                      style={{width: '100%'}}
                                      treeData={treeData}
                                      treeLine={true}
                                      treeIcon={false}
                                      multiple={true}
                                      suffixIcon={<UserAddOutlined/>}
                                    />
                                  </Form.Item>
                                </Col>

                                <Col
                                  span={1}
                                  style={{marginTop: 5, marginLeft: 10}}
                                >
                                  <MinusCircleOutlined
                                    style={{color: 'red', fontSize: 22}}
                                    onClick={() => {
                                      remove(name);
                                      let tagstemp: any = tags;
                                      tags.map((element: any, index: any) => {
                                        if (index >= fieldKey) {
                                          tagstemp[index] = tagstemp[index] - 1;
                                        }
                                      });
                                      this.setState({
                                        tags: tagstemp,
                                      });
                                    }}
                                  />
                                </Col>
                              </Row>
                            </>
                          ) : (
                            <Row>
                              <Col span={20}>
                                <Form.Item
                                  {...restField}
                                  label="发起人员"
                                  name={[name, 'ids']}
                                  fieldKey={[fieldKey, 'ids']}
                                  rules={[
                                    {
                                      required: true,
                                      message: '请输入发起人员',
                                    },
                                  ]}
                                >
                                  <TreeSelect
                                    style={{width: '100%'}}
                                    treeData={treeData}
                                    treeLine={true}
                                    treeIcon={false}
                                    multiple={true}
                                    suffixIcon={<UserAddOutlined/>}
                                  />
                                </Form.Item>
                              </Col>

                              <Col
                                span={1}
                                style={{marginTop: 5, marginLeft: 10}}
                              >
                                <MinusCircleOutlined
                                  style={{color: 'red', fontSize: 22}}
                                  onClick={() => {
                                    remove(name);
                                    let tagstemp: any = tags;
                                    tags.map((element: any, index: any) => {
                                      if (index >= fieldKey) {
                                        tagstemp[index] = tagstemp[index] - 1;
                                      }
                                    });
                                    this.setState({
                                      tags: tagstemp,
                                    });
                                  }}
                                />
                              </Col>
                            </Row>
                          )}
                        </Panel>
                      ))}
                    </Collapse>
                  </>
                )}
              </Form.List>
              <Divider/>
              <Form.List name="ccList">
                {(fields, {add, remove}) => (
                  <>
                    {fields.map(({key, name, fieldKey, ...restField}) => (
                      <Space
                        key={key}
                        style={{display: 'flex', marginBottom: 8}}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          label="&nbsp;抄&nbsp;送&nbsp;人&nbsp;"
                          name={[name, 'first']}
                          fieldKey={[fieldKey, 'first']}
                          rules={[{required: true, message: '请输入抄送人'}]}
                        >
                          <TreeSelect
                            style={{width: '400px'}}
                            treeData={treeData}
                            treeLine={true}
                            treeIcon={false}
                            multiple={true}
                            suffixIcon={<UserAddOutlined/>}
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)}/>
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined/>}
                      >
                        增加抄送人
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{width: '100%'}}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="部门"
            style={{height: '500px'}}
            visible={treevisible}
            onOk={this.treeHandleOk}
            onCancel={this.treeHandleCancel}
            footer={null}
            forceRender
            zIndex={1001}
          >
            <Form name="选择树" onFinish={this.treeOnFinish} ref={this.treeRef}>
              <Form.Item
                label="选择用户"
                name="userid"
                rules={[{required: true, message: '请输入用户'}]}
              >
                {checkedPerson ? (
                  <TreeSelect
                    style={{width: '100%'}}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    treeData={checkedOnePerson}
                    treeDefaultExpandAll
                    // onChange={this.TreeSelectOnChange}
                  />
                ) : (
                  <></>
                )}
              </Form.Item>

              <Form.Item label="key" name="key" hidden>
                <Input></Input>
              </Form.Item>

              <Form.Item label="index" name="index" hidden>
                <Input></Input>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{width: '100%'}}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          {/* 发起流程 */}
          <Modal
            title={wfobjecttitle}
            visible={wfobjectvisible}
            onOk={this.wfObjectHandleOk}
            onCancel={this.wfObjectHandleCancel}
            footer={null}
            forceRender
          >
            <Form
              name="工作流"
              onFinish={this.wfObjectOnFinish}
              ref={this.wfobjectRef}
              layout="vertical"
            >
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="事务模板"
                    name="wfId"
                    rules={[{required: true, message: '请选择工作流模板'}]}
                    hidden
                  >
                    <Select style={{width: '100%'}} disabled>
                      {workFlowList.map((element: any, index: any) => {
                        return (
                          <Option value={element.wfId} key={element.wfId}>
                            {element.wfName}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              {uploadtag ? (
                <Form.Item
                  key={Math.random()}
                  label={'路径'}
                  name={'path'}
                  initialValue={urltemp}
                  hidden
                >
                  <Input></Input>
                </Form.Item>
              ) : (
                <></>
              )}
              {wfSteptemp && wfSteptemp.length !== 0 ? (
                wfSteptemp[0].workflowforms.map((element: any, index: any) => {
                  if (element.columnType === '5') {
                    return (
                      <Row key={index}>
                        <Col span={24}>
                          <Form.Item
                            key={Math.random()}
                            label={element.columnName}
                            name={element.columnName}
                          >
                            <Upload key={Math.random()} {...props}>
                              <Button type="link">点击上传</Button>
                            </Upload>
                          </Form.Item>
                        </Col>
                      </Row>
                    );
                  } else {
                    return (
                      <Row>
                        <Col span={24}>
                          <Form.Item
                            key={Math.random()}
                            label={element.columnName}
                            name={element.columnName}
                            rules={[
                              {
                                required: true,
                                message: element.columnName + '',
                              },
                            ]}
                          >
                            {this.whichOneComponent(
                              element.columnType,
                              index,
                              element.dataTable,
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    );
                  }
                })
              ) : (
                <div></div>
              )}
              <Divider plain></Divider>
              <Row align="middle">
                <Col span={23} offset={1}>
                  <Steps
                    direction="vertical"
                    current={current}
                    onChange={this.stepsOnChange}
                  >
                    {simpleSteps && simpleSteps.length !== 0 ? (
                      simpleSteps.map((element: any, index: any) => {
                        return (
                          <Step
                            key={Math.random()}
                            title={
                              <>
                                <span>{element.name}</span>
                                <Button
                                  style={{marginLeft: 200}}
                                  icon={
                                    <PlusOutlined
                                      style={{color: '#1890ff'}}
                                    />
                                  }
                                  type="dashed"
                                  disabled={index === 0}
                                  onClick={() => {
                                    this.treeShowModal(element.value);
                                  }}
                                  // onClick={() => { console.log(peoplename[element.value.key][element.value.value])}}
                                />
                              </>
                            }
                            description={
                              <>
                                {peoplename[element.value.key] ? (
                                  <>
                                    <Button
                                      type="primary"
                                      size="small"
                                      disabled
                                    >
                                      {
                                        peoplename[element.value.key][
                                          element.value.value
                                          ]
                                      }
                                    </Button>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </>
                            }
                          />
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </Steps>
                </Col>
              </Row>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{width: '100%'}}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </ConfigProvider>
      </div>
    );
  }
}

export default connect(({workflow, user, countersign}: any) => ({
  ...workflow,
  ...user,
  ...countersign,
}))(WorkFlowManage);
