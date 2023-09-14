import React from 'react';
import {Button, Card, Col, Collapse, Divider, Form, Input, message, Radio, Row, Select, Space, Tag,} from 'antd';
import {FormInstance} from 'antd/lib/form';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';

const {TextArea} = Input;
const {Option, OptGroup} = Select;
const {Panel} = Collapse;
const themeToName = {
  studentprofile: '学生',
  dormitoryprofile: '宿舍',
  classprofile: '班级',
  majorprofile: '专业',
  courseprofile: '课程',
  unitprofile: '学院',
};

export type SelectionFormType = {
  dispatch: Dispatch;
  location?: any;
  portrait?: any; //getone进入 画像信息
  theme: string; //主题
  createMethod: string; //创建方式
  cardTitle: string; //卡片头部名称
  attrLabel?: object[]; //用户属性lable
  actionLabel?: object[]; //用户行为lable
  tempid?: string; //临时id
  resultLoading?: boolean; //创建sql的请求
  resultLoading1?: boolean; //创建sql的请求
  UserGroupResult?: object[]; //是否已经有画像信息 如果有需要删掉
  GroupResultRequestParameters?: object[]; //是否已经有画像信息 如果有需要删掉
};

class SelectionForm extends React.Component<SelectionFormType> {
  state = {
    outerSwitch: false, //最外层且或是否显示
    allSwitch: true, //最外层 且或 初始值  true表示且  false表示或
    attrSwitch: true, //用户属性 且或 初始值 true表示且  false表示或
    actionSwitch: true, //用户行为 且或 初始值 true表示且  false表示或

    attrTableArry: {
      tableid: {},
      operation: {},
    }, //用户属性 选中每一行的第一个框 就确定了tableid和operation数组
    attrFuzzyValue: {}, //用户属性 fieldKey 模糊查询 下拉框的选项列表

    actionResultArry: [], //用户行为 总XX fieldKey 列表
    attrOfActionArry: [], //用户行为 小漏斗 属性 fieldKey 列表
    actionTableArry: {
      tableid: {},
      operation: {},
      inputOrSearch: {},
    }, //用户行为中的属性 就确定了tableid和operation数组
    attrOfactionFuzzyOption: {}, //用户行为 fieldKey subfieldKey 模糊查询 下拉框的选项列表

    TagShow: 0, //根据 公式的下拉板是否打开 展示tag：场景1 场景2
    CollapseKeys: [], //存储打开折叠面板的key

    isEdit: false, //getone进来 编辑按钮控制每个框是否为disable
    isEditButton: true, //编辑按钮是否能点
  };
  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    const {dispatch, portrait} = this.props;
    dispatch({
      type: 'portrait/getLabel',
    });
    if (portrait) {
      let formRefJson = JSON.parse(portrait.originaljson).originaljson;
      let FormStateTemp = JSON.parse(portrait.originaljson).FormState;
      this.setState(FormStateTemp);
      this.formRef.current?.setFieldsValue(formRefJson);
      this.onFinish(formRefJson);
      this.setState({
        isEdit: true,
        isEditButton: false,
      });
    }
  };

  //控制Card extra且或是否显示；在用户行为 是否显示‘场景’
  CollapseCallBack = (value: any) => {
    let attrsIn: boolean = false;
    let actionsIn: boolean = false;
    value.map((element: any, index: any) => {
      if (element === 'attrs') {
        attrsIn = true;
      }
      if (element === 'actions') {
        actionsIn = true;
      }
    });
    if (attrsIn && actionsIn) {
      this.setState({
        outerSwitch: true,
      });
    } else {
      this.setState({
        outerSwitch: false,
      });
    }
    if (value.indexOf('multiScene') !== -1) {
      this.setState({
        TagShow: 1,
      });
    } else {
      this.setState({
        TagShow: 0,
      });
    }
    this.setState({
      CollapseKeys: value,
    });
  };
  //用户属性 N属性选一个的时候触发
  attrOptionsOnchange = (fieldKey: any, value: any) => {
    const {attrLabel} = this.props;
    const {attrTableArry, attrFuzzyValue} = this.state;
    let tabletemp: any = undefined;
    let operationtemp: any = undefined;
    attrLabel?.map((element: any, index: any) => {
      if (element.value === value) {
        tabletemp = element.table;
        operationtemp = element.operation;
      }
    });
    let attrTableArrytemp: any = JSON.parse(JSON.stringify(attrTableArry));
    attrTableArrytemp.tableid[fieldKey] = tabletemp;
    attrTableArrytemp.operation[fieldKey] = operationtemp;

    let attrFuzzyValuetemp: any = JSON.parse(JSON.stringify(attrFuzzyValue));
    attrFuzzyValuetemp[fieldKey] = [];

    this.setState({
      attrTableArry: attrTableArrytemp,
      attrFuzzyValue: attrFuzzyValuetemp,
    });

    let form: any = this.formRef.current?.getFieldValue('attrs');

    //if判断 处理bug：用户属性条目全部删除后再新添加 没有完全解决
    if (form[fieldKey] && 'attr' in form[fieldKey]) {
      let formtemp: any = form;
      formtemp[fieldKey] = {
        attr: form[fieldKey].attr,
        relation: '',
        type: 'attr',
        value: '',
      };
      this.formRef.current?.setFieldsValue({
        attrs: formtemp,
      });
    } else {
      form.map((element: any, index: any) => {
        if (element.attr === value) {
          element.relation = '';
          element.value = '';
        }
      });
      this.formRef.current?.setFieldsValue({
        attrs: form,
      });
    }
  };
  //用户行为 三行为选一个的时候触发
  actionOptionsOnchange = (value: any, fieldKey: any) => {
    const {actionLabel} = this.props;
    const {actionResultArry, attrOfActionArry} = this.state;
    //保存相应fieldKey的result下拉框
    let sourcetemp: any = [];
    let childrentemp: any = [];
    actionLabel?.map((element: any, index: any) => {
      if (element.value === value) {
        sourcetemp = element.source;
        childrentemp = element.children;
      }
    });
    let actionResultArrytemp: any = JSON.parse(
      JSON.stringify(actionResultArry),
    );
    actionResultArrytemp[fieldKey] = sourcetemp;

    let attrOfActionArrytemp: any = JSON.parse(
      JSON.stringify(attrOfActionArry),
    );
    attrOfActionArrytemp[fieldKey] = childrentemp;

    let form: any = this.formRef.current?.getFieldValue('actions');
    if (form[fieldKey] && 'oper' in form[fieldKey]) {
      let formtemp: any = form;
      formtemp[fieldKey] = {
        customDate: form[fieldKey].customDate,
        oper: form[fieldKey].oper,
        relation: '',
        did: 'yes',
        filters: [],
        ljh_switch: 'and',
        result: '',
        value: '',
      };
      this.formRef.current?.setFieldsValue({
        actions: formtemp,
      });
    } else {
      form.map((element: any, index: any) => {
        if (element.oper === value) {
          element.filters = [];
          element.relation = '';
          element.result = '';
          element.value = '';
        }
      });
      this.formRef.current?.setFieldsValue({
        actions: form,
      });
    }

    //将值修改完，赋回state
    this.setState({
      actionResultArry: actionResultArrytemp,
      attrOfActionArry: attrOfActionArrytemp,
    });
  };
  //用户行为 小漏斗 属性变化
  attrOfActionOnchange = (value: any, fieldKey: any, subfieldKey: any) => {
    const {attrOfActionArry, actionTableArry} = this.state;
    let tableidtemp: any = [];
    let operationtemp: any = [];
    let inputOrSearchtemp: boolean = true; //true代表input false代表Search
    attrOfActionArry[fieldKey].map((element: any, index: any) => {
      if (element.value === value) {
        tableidtemp = element.table;
        operationtemp = element.operation;
        if (element.table !== '') {
          inputOrSearchtemp = false;
        }
      }
    });

    let actionTableArrytemp: any = JSON.parse(JSON.stringify(actionTableArry));
    actionTableArrytemp.tableid[fieldKey + '' + subfieldKey] = tableidtemp;
    actionTableArrytemp.operation[fieldKey + '' + subfieldKey] = operationtemp;
    actionTableArrytemp.inputOrSearch[fieldKey + '' + subfieldKey] =
      inputOrSearchtemp;

    let form: any = this.formRef.current?.getFieldValue('actions');
    if (
      form[fieldKey] &&
      form[fieldKey].filters[subfieldKey] &&
      'attr' in form[fieldKey].filters[subfieldKey]
    ) {
      form[fieldKey].filters[subfieldKey].relation = '';
      form[fieldKey].filters[subfieldKey].value = '';
      this.formRef.current?.setFieldsValue({
        actions: form,
      });
    } else {
      if (form[fieldKey]) {
        form[fieldKey].filters.map((element: any, index: any) => {
          if (element.attr === value) {
            element.relation = '';
            element.value = '';
          }
        });
      }
    }
    this.setState({
      actionTableArry: actionTableArrytemp,
    });
  };
  //用户属性 模糊查询框
  handleSearch = (str: any, fieldKey: any) => {
    const {dispatch} = this.props;
    const {attrTableArry} = this.state;
    const tableid = attrTableArry.tableid[fieldKey];
    if (str) {
      dispatch({
        type: 'portrait/getLike',
        payload: {
          payload: {
            id: tableid,
            str: str,
          },
          callback: (value: any) => {
            this.getLikeCallback(value, fieldKey);
          },
        },
      });
    }
  };
  getLikeCallback = (value: any, fieldKey: any) => {
    const {attrFuzzyValue} = this.state;
    let attrFuzzyValuetemp: any = JSON.parse(JSON.stringify(attrFuzzyValue));
    attrFuzzyValuetemp[fieldKey] = value;
    this.setState({
      attrFuzzyValue: attrFuzzyValuetemp,
    });
  };
  //用户行为 小漏斗 模糊查询框
  actionHandleSearch = (str: any, fieldKey: any, subfieldKey: any) => {
    const {dispatch} = this.props;
    const {actionTableArry} = this.state;
    const tableid = actionTableArry.tableid[fieldKey + '' + subfieldKey];

    if (tableid && str) {
      // console.log("存在tableid");
      dispatch({
        type: 'portrait/getLike',
        payload: {
          payload: {
            id: tableid,
            str: str,
          },
          callback: (value: any) => {
            this.actionGetLikeCallback(value, fieldKey, subfieldKey);
          },
        },
      });
    } else {
      // console.log("不存在tableid");
    }
  };
  actionGetLikeCallback = (value: any, fieldKey: any, subfieldKey: any) => {
    const {attrOfactionFuzzyOption} = this.state;
    let attrOfactionFuzzyOptiontemp: any = JSON.parse(
      JSON.stringify(attrOfactionFuzzyOption),
    );
    attrOfactionFuzzyOptiontemp[fieldKey + '' + subfieldKey] = value;
    this.setState({
      attrOfactionFuzzyOption: attrOfactionFuzzyOptiontemp,
    });
  };

  //多场景配置计算
  regCheck = (value: any, r1: any, r2: any) => {
    if (r1.test(value)) {
      return this.regCheck(value.replace(r2, ''), r1, r2);
    }
    return value;
  };
  check = (value: any) => {
    // 场景名称正则
    if (!/(场景[1-9])+/g.test(value)) {
      return {error: true, errorMsg: '请确保至少包含一个场景！'};
    }
    // 小括号是否配对
    if (/[()]/g.test(this.regCheck(value, /[(][^()]*[)]/, /[(][^()]*[)]/g))) {
      return {error: true, errorMsg: '请确保输入的小括号保持匹配！'};
    }
    // 中括号配对是否配对
    if (
      /[\[\]]/g.test(
        this.regCheck(value, /[\[][^\[\]]*[\]]/, /[\[][^\[\]]*[\]]/g),
      )
    ) {
      return {error: true, errorMsg: '请确保输入的中括号保持匹配！'};
    }
    // 大括号配对是否配对
    if (/[{}]/g.test(this.regCheck(value, /[{][^{}]*[}]/, /[{][^{}]*[}]/g))) {
      return {error: true, errorMsg: '请确保输入的大括号保持匹配！'};
    }
    // 只能是这些字符
    if (
      value.replace(
        /[0-9.\+\-\*\/=!=>>=<<=,:\|\&\[\]\{\}\(\)]|(SUM|AVG|MAX)|(场景[1-9])+/gi,
        '',
      ).length > 0
    ) {
      return {error: true, errorMsg: '运算公式不正确！'};
    }
    return {error: false, errorMsg: ''};
  };
  //重置表单的值
  restForm = () => {
    this.formRef.current?.resetFields();
  };

  //提交表单
  onFinish = (value: any) => {
    const {allSwitch, attrSwitch, actionSwitch} = this.state;
    const {
      theme,
      dispatch,
      createMethod,
      portrait,
      tempid,
      UserGroupResult,
      GroupResultRequestParameters,
    } = this.props;
    // console.log(value);

    dispatch({
      type: 'portrait/getOriginalJSON',
      payload: value,
    });

    let valuetemp: any = JSON.parse(JSON.stringify(value));
    let parameter: any = {
      switch: allSwitch ? 'intersect' : 'union',
      attrs: [],
      actions: [],
      theme: theme,
      formState:
        createMethod === '1'
          ? JSON.parse(portrait.originaljson).FormState
          : JSON.parse(JSON.stringify(this.state)),
      formula: value.formula,
    };
    if (
      'attrs' in valuetemp &&
      valuetemp.attrs &&
      valuetemp.attrs.length !== 0
    ) {
      let listtemp: any = [];
      valuetemp.attrs.map((element: any, index: any) => {
        element.type = 'attr';
        let attrstemp: any = {
          switch: 'and',
          list: [],
        };
        attrstemp.list.push(element);
        listtemp.push(attrstemp);
      });
      let attrs = {
        switch: attrSwitch ? 'and' : 'or',
        list: listtemp,
      };
      parameter.attrs = attrs;
    }
    if (
      'actions' in valuetemp &&
      valuetemp.actions &&
      valuetemp.actions.length !== 0
    ) {
      //调整filters的格式
      valuetemp.actions.map((element: any, index: any) => {
        let filterstemp: any = {
          filtersswitch: element.ljh_switch,
          list: [],
        };
        if (
          'filters' in element &&
          element.filters &&
          element.filters.length !== 0
        ) {
          let listtemp: any = [];
          element.filters.map((subelement: any, subindex: any) => {
            listtemp.push(subelement);
          });
          filterstemp.list = listtemp;
        }
        element.filters = filterstemp;
      });
      //调整actions的格式
      let listtemp: any = [];
      valuetemp.actions.map((element: any, index: any) => {
        let actionstemp: any = {
          switch: 'intersect',
          list: [],
        };
        actionstemp.list.push(element);
        listtemp.push(actionstemp);
      });
      let actions = {
        switch: actionSwitch ? 'intersect' : 'union',
        list: listtemp,
      };
      parameter.actions = actions;
    }

    if (parameter.attrs.length === 0) {
      delete parameter.attrs;
    }
    if (parameter.actions.length === 0) {
      delete parameter.actions;
    }
    if (
      !parameter.hasOwnProperty('attrs') &&
      !parameter.hasOwnProperty('actions')
    ) {
      message.info('请填写用户属性和用户行为！！！');
    } else {
      if (value.formula) {
        if (theme === 'studentprofile') {
          dispatch({
            type: 'portrait/createPreferenceLabelSQL',
            payload: parameter,
          });
        } else {
          if (value.tpConstraint && value.tpRelation && value.tpValue) {
            parameter.tpConstraint = value.tpConstraint;
            parameter.tpRelation = value.tpRelation;
            parameter.tpValue = value.tpValue;

            dispatch({
              type: 'portrait/createPreferenceLabelSQL',
              payload: parameter,
            });
          } else {
            message.info('请填写主题条件');
          }
        }
      } else {
        if (theme === 'studentprofile') {
          dispatch({
            type: 'portrait/createProfileSQL',
            payload: parameter,
          });
        } else {
          if (value.tpConstraint && value.tpRelation && value.tpValue) {
            parameter.tpConstraint = value.tpConstraint;
            parameter.tpRelation = value.tpRelation;
            parameter.tpValue = value.tpValue;

            dispatch({
              type: 'portrait/createProfileSQL',
              payload: parameter,
            });
          } else {
            message.info('请填写主题条件');
          }
        }
      }
    }

    //新建分群的时候 如果上个分群有画像 需要删除
    if (
      UserGroupResult?.length !== 0 ||
      GroupResultRequestParameters?.length !== 0
    ) {
      dispatch({
        type: 'portrait/deleteGroupResult',
        payload: {
          UserGroupResultTemp: [],
          GroupResultRequestParametersTemp: [],
        },
      });
      dispatch({
        type: 'portrait/deleteGetPrimaryInfo',
      });
    }
  };

  render() {
    const {
      theme,
      createMethod,
      cardTitle,
      attrLabel,
      resultLoading,
      resultLoading1,
    } = this.props;
    const {
      outerSwitch,
      attrTableArry,
      attrFuzzyValue,
      actionResultArry,
      attrOfActionArry,
      actionTableArry,
      attrOfactionFuzzyOption,
      allSwitch,
      attrSwitch,
      actionSwitch,
      TagShow,
      CollapseKeys,
      isEdit,
      isEditButton,
    } = this.state;
    const SelectionResultLoading: boolean =
      resultLoading || resultLoading1 || false;
    return (
      <div>
        <Card
          title={cardTitle}
          bordered={false}
          extra={
            <Space>
              {!outerSwitch ? null : (
                <Button
                  type="dashed"
                  // shape="circle"
                  onClick={() => {
                    this.setState({
                      allSwitch: !allSwitch,
                    });
                  }}
                  disabled={isEdit}
                >
                  {allSwitch ? '且' : '或'}
                </Button>
              )}
              <Button
                type="primary"
                disabled={isEditButton}
                onClick={() => {
                  this.setState({isEdit: false, isEditButton: true});
                }}
              >
                编辑
              </Button>
            </Space>
          }
        >
          <Row align="middle">
            <Col span={24}>
              <Form
                name="clusterCondition"
                onFinish={this.onFinish}
                autoComplete="off"
                ref={this.formRef}
              >
                <Collapse
                  onChange={this.CollapseCallBack}
                  activeKey={CollapseKeys}
                >
                  <Panel header="用户属性" key="attrs" forceRender={true}>
                    <Form.List name="attrs">
                      {(fields, {add, remove}) => (
                        <>
                          <Row>
                            <Col
                              span={18}
                              style={{
                                paddingTop: 20,
                                paddingLeft: 20,
                                backgroundColor: '#ececec',
                              }}
                            >
                              {fields.map(
                                ({key, name, fieldKey, ...restField}) => (
                                  <div key={key}>
                                    <Row gutter={12}>
                                      <Col span={4}>
                                        <Form.Item
                                          {...restField}
                                          name={[name, 'attr']}
                                          fieldKey={[fieldKey, 'attr']}
                                        >
                                          <Select
                                            disabled={isEdit}
                                            style={{width: '100%'}}
                                            placeholder="属性"
                                            onChange={(value: any) =>
                                              this.attrOptionsOnchange(
                                                fieldKey,
                                                value,
                                              )
                                            }
                                          >
                                            {attrLabel?.map(
                                              (element: any, index: any) => {
                                                return (
                                                  <Option
                                                    key={index}
                                                    value={element.value}
                                                  >
                                                    {element.name}
                                                  </Option>
                                                );
                                              },
                                            )}
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col span={4}>
                                        <Form.Item
                                          {...restField}
                                          name={[name, 'relation']}
                                          fieldKey={[fieldKey, 'relation']}
                                        >
                                          <Select
                                            style={{width: '100%'}}
                                            placeholder="情况"
                                            disabled={isEdit}
                                          >
                                            {attrTableArry.operation[
                                              fieldKey
                                              ]?.map(
                                              (element: any, index: any) => {
                                                return (
                                                  <Option
                                                    key={index}
                                                    value={
                                                      element.operationValue
                                                    }
                                                  >
                                                    {element.operation}
                                                  </Option>
                                                );
                                              },
                                            )}
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col span={8}>
                                        <Form.Item
                                          {...restField}
                                          name={[name, 'value']}
                                          fieldKey={[fieldKey, 'value']}
                                        >
                                          <Select
                                            showSearch
                                            // value={this.state.}
                                            // placeholder={this.props.placeholder}
                                            // style={this.props.style}
                                            disabled={isEdit}
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={false}
                                            onSearch={(str: any) => {
                                              this.handleSearch(str, fieldKey);
                                            }}
                                            // onChange={(value: any) => { this.handleChange(value, fieldKey) }}
                                            notFoundContent={null}
                                          >
                                            {attrFuzzyValue[fieldKey]?.map(
                                              (element: any, index: any) => {
                                                return (
                                                  <Option
                                                    key={index}
                                                    value={element.VALUE}
                                                  >
                                                    {element.LABEL}
                                                  </Option>
                                                );
                                              },
                                            )}
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col span={2}>
                                        <Button
                                          // disabled={!this.state.isedit}
                                          type="link"
                                        >
                                          <MinusCircleOutlined
                                            onClick={() => remove(name)}
                                          />
                                        </Button>
                                      </Col>
                                    </Row>
                                  </div>
                                ),
                              )}
                            </Col>
                            <Col span={1}></Col>
                            <Col span={4} style={{paddingTop: 20}}>
                              <Form.Item>
                                <Button
                                  type="primary"
                                  onClick={() => add()}
                                  icon={<PlusOutlined/>}
                                  disabled={isEdit}
                                >
                                  增加 用户属性
                                </Button>
                              </Form.Item>
                            </Col>

                            <Col span={1} style={{paddingTop: 20}}>
                              <Button
                                type="dashed"
                                shape="circle"
                                disabled={isEdit}
                                onClick={() => {
                                  this.setState({
                                    attrSwitch: !attrSwitch,
                                  });
                                }}
                              >
                                {attrSwitch ? '且' : '或'}
                              </Button>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Form.List>
                  </Panel>
                  <Panel header="用户行为" key="actions" forceRender={true}>
                    <Form.List name="actions">
                      {(fields, {add, remove}) => (
                        <Row>
                          <Col span={18}>
                            {fields.map(
                              ({key, name, fieldKey, ...restField}) => (
                                <div key={fieldKey}>
                                  <Card
                                    key={key}
                                    style={{
                                      width: '100%',
                                      marginBottom: 20,
                                      backgroundColor: '#ececec',
                                    }}
                                  >
                                    <Row gutter={16}>
                                      <Col span={TagShow}>
                                        <Tag
                                          color="#40a9ff"
                                          style={{
                                            float: 'left',
                                            marginTop: '6px',
                                          }}
                                        >
                                          场景{fieldKey + 1 + ''}
                                        </Tag>
                                      </Col>
                                      {/* <Col span={this.state.TagShow[1]}> */}
                                      <Col span={1}>
                                        <div
                                          style={{
                                            fontSize: 18,
                                            marginLeft: 17,
                                            marginTop: 2,
                                          }}
                                        >
                                          在
                                        </div>
                                      </Col>
                                      <Col span={4}>
                                        <Form.Item
                                          {...restField}
                                          name={[name, 'customDate']}
                                          fieldKey={[fieldKey, 'customDate']}
                                        >
                                          <Select
                                            placeholder="选择学期学年"
                                            disabled={isEdit}
                                          >
                                            <Option value="1-1">
                                              第一学年第一学期
                                            </Option>
                                            <Option value="1-2">
                                              第一学年第二学期
                                            </Option>
                                            <Option value="2-1">
                                              第二学年第一学期
                                            </Option>
                                            <Option value="2-2">
                                              第二学年第二学期
                                            </Option>
                                            <Option value="3-1">
                                              第三学年第一学期
                                            </Option>
                                            <Option value="3-2">
                                              第三学年第二学期
                                            </Option>
                                            <Option value="4-1">
                                              第四学年第一学期
                                            </Option>
                                            <Option value="4-2">
                                              第四学年第二学期
                                            </Option>
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col span={0}>
                                        <Form.Item
                                          {...restField}
                                          name={[name, 'did']}
                                          fieldKey={[fieldKey, 'did']}
                                          initialValue="yes"
                                        >
                                          <Input hidden/>
                                        </Form.Item>
                                      </Col>
                                      <Col span={1.5}>
                                        <div
                                          style={{fontSize: 18, marginTop: 2}}
                                        >
                                          做过
                                        </div>
                                      </Col>
                                      <Col span={3}>
                                        <Form.Item
                                          {...restField}
                                          name={[name, 'oper']}
                                          fieldKey={[fieldKey, 'oper']}
                                        >
                                          <Select
                                            placeholder="行为"
                                            disabled={isEdit}
                                            onChange={(value: any) =>
                                              this.actionOptionsOnchange(
                                                value,
                                                fieldKey,
                                              )
                                            }
                                          >
                                            {/* <Option value="studentcourse">
                                                                                            选课
                                                                                        </Option> */}
                                            <Option value="studentexam">
                                              考试
                                            </Option>
                                            <Option value="studentactivity">
                                              活动
                                            </Option>
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col span={3}>
                                        <Form.Item
                                          {...restField}
                                          name={[name, 'ljh_switch']}
                                          fieldKey={[fieldKey, 'ljh_switch']}
                                          initialValue={'and'}
                                        >
                                          <Radio.Group disabled={isEdit}>
                                            <Radio value={'and'}>且</Radio>
                                            <Radio value={'or'}>或</Radio>
                                          </Radio.Group>
                                        </Form.Item>
                                      </Col>
                                      <Col span={3}>
                                        <Form.Item
                                          {...restField}
                                          name={[name, 'result']}
                                          fieldKey={[fieldKey, 'result']}
                                        >
                                          <Select disabled={isEdit}>
                                            {actionResultArry[fieldKey]?.map(
                                              (element: any, index: any) => {
                                                return (
                                                  <Option
                                                    key={index}
                                                    value={element.VALUE}
                                                  >
                                                    {element.LABLE}
                                                  </Option>
                                                );
                                              },
                                            )}
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col span={2}>
                                        <Form.Item
                                          {...restField}
                                          name={[name, 'relation']}
                                          fieldKey={[fieldKey, 'relation']}
                                        >
                                          <Select disabled={isEdit}>
                                            <Option value=">">&gt;</Option>
                                            <Option value="<"> &#60;</Option>
                                            <Option value="=">=</Option>
                                            <Option value=">=">&ge;</Option>
                                            <Option value="<=">&le;</Option>
                                            <Option value="!=">&ne;</Option>
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col span={3}>
                                        <Form.Item
                                          {...restField}
                                          name={[name, 'value']}
                                          fieldKey={[fieldKey, 'value']}
                                        >
                                          <Input
                                            placeholder=""
                                            disabled={isEdit}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col span={1}>
                                        <div>
                                          <Button disabled={isEdit} type="link">
                                            <MinusCircleOutlined
                                              style={{width: '100%'}}
                                              onClick={() => remove(name)}
                                            />
                                          </Button>
                                        </div>
                                      </Col>
                                    </Row>

                                    <Form.Item
                                      {...restField}
                                      name={[name, 'filters']}
                                      fieldKey={[fieldKey, 'filters']}
                                    >
                                      <Form.List name={[name, 'filters']}>
                                        {(fields, {add, remove}) => (
                                          <>
                                            <Row>
                                              <Col span={14} offset={1}>
                                                {fields.map((sub, index) => {
                                                  // console.log(this.state.actiontableids);
                                                  return (
                                                    <div key={sub.key}>
                                                      <Row>
                                                        <Col span={5}>
                                                          <Form.Item
                                                            {...restField}
                                                            name={[
                                                              sub.name,
                                                              'attr',
                                                            ]}
                                                            fieldKey={[
                                                              sub.fieldKey,
                                                              'attr',
                                                            ]}
                                                          >
                                                            <Select
                                                              disabled={isEdit}
                                                              style={{
                                                                width: '100%',
                                                              }}
                                                              onChange={(
                                                                value,
                                                              ) =>
                                                                this.attrOfActionOnchange(
                                                                  value,
                                                                  fieldKey,
                                                                  sub.fieldKey,
                                                                )
                                                              }
                                                            >
                                                              {attrOfActionArry[
                                                                fieldKey
                                                                ]?.map(
                                                                (
                                                                  element: any,
                                                                  index: any,
                                                                ) => {
                                                                  return (
                                                                    <Option
                                                                      key={
                                                                        index
                                                                      }
                                                                      value={
                                                                        element.value
                                                                      }
                                                                    >
                                                                      {
                                                                        element.name
                                                                      }
                                                                    </Option>
                                                                  );
                                                                },
                                                              )}
                                                            </Select>
                                                          </Form.Item>
                                                        </Col>
                                                        <Col span={1}></Col>
                                                        <Col span={4}>
                                                          <Form.Item
                                                            {...restField}
                                                            name={[
                                                              sub.name,
                                                              'relation',
                                                            ]}
                                                            fieldKey={[
                                                              sub.fieldKey,
                                                              'relation',
                                                            ]}
                                                          >
                                                            <Select
                                                              style={{
                                                                width: '100%',
                                                              }}
                                                              placeholder="比较"
                                                              disabled={isEdit}
                                                            >
                                                              {actionTableArry.operation[
                                                              fieldKey +
                                                              '' +
                                                              sub.fieldKey
                                                                ]?.map(
                                                                (
                                                                  element: any,
                                                                  index: any,
                                                                ) => {
                                                                  return (
                                                                    <Option
                                                                      key={
                                                                        index
                                                                      }
                                                                      value={
                                                                        element.operationValue
                                                                      }
                                                                    >
                                                                      {
                                                                        element.operation
                                                                      }
                                                                    </Option>
                                                                  );
                                                                },
                                                              )}
                                                            </Select>
                                                          </Form.Item>
                                                        </Col>
                                                        <Col span={1}></Col>
                                                        <Col span={6}>
                                                          <Form.Item
                                                            {...restField}
                                                            name={[
                                                              sub.name,
                                                              'value',
                                                            ]}
                                                            fieldKey={[
                                                              sub.fieldKey,
                                                              'value',
                                                            ]}
                                                          >
                                                            {actionTableArry
                                                              .inputOrSearch[
                                                            fieldKey +
                                                            '' +
                                                            sub.fieldKey
                                                              ] ? (
                                                              <Input
                                                                disabled={
                                                                  isEdit
                                                                }
                                                              />
                                                            ) : (
                                                              <Select
                                                                showSearch
                                                                // disabled={isEdit}
                                                                // placeholder={this.props.placeholder}
                                                                // style={this.props.style}
                                                                defaultActiveFirstOption={
                                                                  false
                                                                }
                                                                showArrow={
                                                                  false
                                                                }
                                                                filterOption={
                                                                  false
                                                                }
                                                                onSearch={(
                                                                  str: any,
                                                                ) => {
                                                                  this.actionHandleSearch(
                                                                    str,
                                                                    fieldKey,
                                                                    sub.fieldKey,
                                                                  );
                                                                }}
                                                                // onChange={(value: any) => { this.actionHandleChange(value, fieldKey, sub.fieldKey) }}
                                                                notFoundContent={
                                                                  null
                                                                }
                                                              >
                                                                {attrOfactionFuzzyOption[
                                                                fieldKey +
                                                                '' +
                                                                sub.fieldKey
                                                                  ]?.map(
                                                                  (
                                                                    element: any,
                                                                    index: any,
                                                                  ) => {
                                                                    return (
                                                                      <Option
                                                                        key={
                                                                          index
                                                                        }
                                                                        value={
                                                                          element.VALUE
                                                                        }
                                                                      >
                                                                        {
                                                                          element.LABEL
                                                                        }
                                                                      </Option>
                                                                    );
                                                                  },
                                                                )}
                                                              </Select>
                                                            )}
                                                          </Form.Item>
                                                        </Col>
                                                        <Col span={1}></Col>
                                                        <Col span={4}>
                                                          <Button
                                                            disabled={isEdit}
                                                            type="link"
                                                          >
                                                            <MinusCircleOutlined
                                                              style={{
                                                                width: '100%',
                                                              }}
                                                              onClick={() =>
                                                                remove(sub.name)
                                                              }
                                                            />
                                                          </Button>
                                                        </Col>
                                                        <Col span={0}>
                                                          <Form.Item
                                                            {...restField}
                                                            name={[
                                                              sub.name,
                                                              'type',
                                                            ]}
                                                            fieldKey={[
                                                              sub.fieldKey,
                                                              'type',
                                                            ]}
                                                            initialValue="event"
                                                            style={{
                                                              width: 0,
                                                              height: 0,
                                                            }}
                                                          >
                                                            <Input hidden/>
                                                          </Form.Item>
                                                        </Col>
                                                        <Col span={0}>
                                                          <Form.Item
                                                            {...restField}
                                                            name={[
                                                              sub.name,
                                                              'valueType',
                                                            ]}
                                                            fieldKey={[
                                                              sub.fieldKey,
                                                              'valueType',
                                                            ]}
                                                            initialValue="number"
                                                            style={{
                                                              width: 0,
                                                              height: 0,
                                                            }}
                                                          >
                                                            <Input hidden/>
                                                          </Form.Item>
                                                        </Col>
                                                      </Row>
                                                    </div>
                                                  );
                                                })}
                                              </Col>
                                              <Col span={2}></Col>
                                              <Col span={4}>
                                                <Form.Item>
                                                  <Button
                                                    disabled={isEdit}
                                                    type="primary"
                                                    onClick={() => {
                                                      return add();
                                                    }}
                                                    style={{width: '100%'}}
                                                    // icon={<PlusOutlined />}
                                                  >
                                                    添加筛选条件
                                                  </Button>
                                                </Form.Item>
                                              </Col>
                                            </Row>
                                          </>
                                        )}
                                      </Form.List>
                                    </Form.Item>
                                  </Card>
                                  <Divider style={{fontSize: 100}}/>
                                </div>
                              ),
                            )}
                          </Col>
                          <Col span={1}></Col>
                          <Col span={4}>
                            <Form.Item>
                              <Button
                                type="primary"
                                onClick={() => add()}
                                icon={<PlusOutlined/>}
                                disabled={isEdit}
                              >
                                增加 用户行为
                              </Button>
                            </Form.Item>
                          </Col>

                          <Col span={1}>
                            <Button
                              type="dashed"
                              shape="circle"
                              disabled={isEdit}
                              onClick={() => {
                                this.setState({
                                  actionSwitch: !actionSwitch,
                                });
                              }}
                            >
                              {actionSwitch ? '且' : '或'}
                            </Button>
                          </Col>
                        </Row>
                      )}
                    </Form.List>
                  </Panel>
                  {theme !== 'studentprofile' ? (
                    <Panel
                      header={themeToName[theme] + '主题条件'}
                      key="3"
                      forceRender={true}
                    >
                      <Space>
                        <div
                          style={{
                            fontSize: 16,
                            marginRight: 10,
                            marginBottom: 24,
                          }}
                        >
                          符合条件学生在{themeToName[theme]}中
                        </div>
                        <Form.Item name={'tpConstraint'} style={{width: 120}}>
                          <Select placeholder="指标" disabled={isEdit}>
                            <Option value="count">数量</Option>
                            <Option value="percent">占比</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item name={'tpRelation'} style={{width: 80}}>
                          <Select placeholder="关系" disabled={isEdit}>
                            <Option value=">">大于</Option>
                            <Option value="<">小于</Option>
                            <Option value="=">等于</Option>
                            <Option value=">=">大于等于</Option>
                            <Option value="<=">小于等于</Option>
                            <Option value="!=">不等于</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item name={'tpValue'} style={{width: '100%'}}>
                          <Input disabled={isEdit}/>
                        </Form.Item>
                      </Space>
                    </Panel>
                  ) : null}
                  {/* <Panel
                    header="多场景配置计算"
                    key="multiScene"
                    forceRender={true}
                  >
                    <Row>
                      <Col span={24}>
                        <div style={{ marginBottom: 5 }}>
                          <span style={{ color: '#97a7bd' }}>
                            可识别运算符(英文)： 算术
                            <span style={{ color: '#f00' }}>{` + - * /`}</span>
                            &nbsp; 逻辑
                            <span
                              style={{ color: '#f00' }}
                            >{` = != > >= < <=`}</span>
                            &nbsp; 关系
                            <span style={{ color: '#f00' }}>{` | & , :`}</span>
                            &nbsp; 函数
                            <span
                              style={{ color: '#f00' }}
                            >{` SUM( ) AVG( ) MAX( )`}</span>
                            <span style={{ color: '#f00' }}>{`{ }`}</span>
                            进行组合运算,&nbsp;
                          </span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={1}>
                        <span
                          className="title"
                          style={{
                            fontSize: 20,
                            color: ' #333',
                            display: 'inline-block',
                            // lineHeight: 50,
                          }}
                        >
                          <span style={{ fontSize: 35 }}>f(x)=</span>
                        </span>
                      </Col>
                      <Col span={17}>
                        <Form.Item name={'formula'}>
                          <TextArea
                            style={{
                              height: 50,
                              fontSize: 24,
                              color: ' #333',
                              // border: '1px dashed #d9d9d9',
                              border: '1px dashed #d9d9d9',
                              boxShadow: 'none',
                              marginLeft: 10,
                              marginTop: 10,
                            }}
                            autoSize
                            disabled={isEdit}
                            onChange={(e) => {
                              if (e.target.value.trim() !== '') {
                                const error = this.check(e.target.value);
                                this.setState({
                                  hasError: error.error,
                                  errorMsg: error.errorMsg,
                                });
                                // if (props.onValuesChange)
                                // {
                                //   props.onValuesChange(
                                //     props.onValuesChange(
                                //       props.formId,
                                //       e.target.value,
                                //       error.errorMsg,
                                //     ),
                                //   );
                                // }
                              } else {
                                this.setState({
                                  hasError: false,
                                });
                              }
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <div
                        style={{
                          marginTop: 5,
                          marginLeft: 80,
                          visibility: 'visible',
                        }}
                      >
                        <span style={{ color: 'red' }}>
                          {this.state.errorMsg}
                        </span>
                      </div>
                    </Row>
                  </Panel> */}
                </Collapse>
                <Divider/>
                <Space>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={SelectionResultLoading || isEdit}
                    >
                      新建分群
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      onClick={this.restForm}
                      disabled={SelectionResultLoading || isEdit}
                    >
                      重置条件
                    </Button>
                  </Form.Item>
                </Space>
              </Form>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default connect(({portrait, loading}: any) => ({
  ...portrait,
  resultLoading: loading.effects['portrait/createProfileSQL'],
  resultLoading1: loading.effects['portrait/createPreferenceLabelSQL'],
}))(SelectionForm);
