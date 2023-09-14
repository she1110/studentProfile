import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
  Tag,
} from 'antd';
import {MinusCircleOutlined, PlusCircleOutlined,} from '@ant-design/icons';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';

const {Option} = Select;
const {RangePicker} = DatePicker;
const {TextArea} = Input;

export type Props = {
  dispatch: Dispatch;
  allCourseInfo?: object[]; //课程信息
  allTagInfo?: object[]; //所有标签信息
  allClassInfo?: object[]; //班级信息
};

class CourseTagsAnalysis extends Component<Props> {
  state = {
    FuzzyValueClass: [], //模糊查询的下拉框--班级
    selectedRowKeys: [], // table选择行 id值
    rowValue: [], // table选择行---所有数据
    modalAddVisible: false, //添加标签 是否弹出
    modalDeleteVisible: false, //删除标签 是否弹出
    modalCreateVisible: false, //创建标签 是否弹出
    Utags: [
      {
        tagId: undefined,
        tagName: undefined,
      },
    ], //标签并集用于删除
  };

  searchFormRef = React.createRef<FormInstance>();
  createTagFormRef = React.createRef<FormInstance>();
  addTagFormRef = React.createRef<FormInstance>();
  deleteTagFormRef = React.createRef<FormInstance>();

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'tags/getAllClassInfo',
      payload: {},
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
      type: 'tags/getFindClassInfo',
      payload: {
        enrollyear: value.enrollyear,
        classId: value.classId,
      },
    });
  };

  //重置
  resetSearchForm = () => {
    this.searchFormRef.current?.resetFields();
    this.props.dispatch({
      type: 'tags/getAllClassInfo',
      payload: {
        type: '3', //竞赛信息
      },
    });
  };
  //添加标签
  addTagsModal = () => {
    this.setState({
      modalAddVisible: true,
      modalDeleteVisible: false,
    });
    this.addTagFormRef.current?.resetFields();
  };
  addTagsForm = (value: any) => {
  };
  handleOKAddTags = () => {
    const {dispatch} = this.props;
    this.addTagFormRef.current?.validateFields().then((values: any) => {
      this.state.rowValue?.map((element: any, index: any) => {
        dispatch({
          type: 'tags/getentityAddTag',
          payload: {
            entityType: '4',
            entityId: element.classId,
            tagId: values.tagId,
            tagValue: values.tagValue,
          },
        }).then(() => {
          dispatch({
            type: 'tags/getAllClassInfo',
            payload: {},
          });
        });
      });
    });

    // this.reLoadData();
    this.setState({
      modalAddVisible: false,
      modalDeleteVisible: false,
      modalCreateVisible: false,
    });
  };
  //标签模糊查询
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
  handleCancel = () => {
    this.setState({
      modalAddVisible: false,
      modalDeleteVisible: false,
      modalCreateVisible: false,
    });
  };

  //创建标签
  createTags = () => {
    this.setState({
      modalCreateVisible: true,
      modalAddVisible: false,
    });
    this.createTagFormRef.current?.resetFields();
  };
  onFinishCreateTags = (value: any) => {
    console.log(value);
  };
  handleOKCreasteTags = () => {
    const {dispatch} = this.props;
    this.createTagFormRef.current?.validateFields().then((values: any) => {
      dispatch({
        type: 'tags/getCreateTags',
        payload: {
          tagName: values.tagName,
          bak: values.bak,
        },
      }).then(() => {
        dispatch({
          type: 'tags/getAllTagInfo',
          payload: {},
        });
      });
    });

    this.setState({
      modalCreateVisible: false,
    });
  };
  //删除标签
  handleOKDeleteTags = () => {
    const {dispatch} = this.props;
    this.deleteTagFormRef.current?.validateFields().then((values: any) => {
      this.state.rowValue?.map((element: any, index: any) => {
        dispatch({
          type: 'tags/getDelTag',
          payload: {
            entityType: '4',
            entityId: element.classId,
            tagId: values.tagId,
          },
        }).then(() => {
          dispatch({
            type: 'tags/getAllClassInfo',
            payload: {},
          });
        });
      });
    });
    dispatch({
      type: 'tags/getAllTagInfo',
      payload: {},
    });
    this.setState({
      modalDeleteVisible: false,
    });
  };
  deleteTagsModal = () => {
    //清空数组
    this.state.Utags.length = 0;
    //清空表格数据
    this.deleteTagFormRef.current?.resetFields();

    // const{ Utags } = this.state
    this.setState({
      Utag: [],
      modalDeleteVisible: true,
    });

    // 找到标签最少的
    let tagFlag = 0;
    let tagMin = 999;
    this.state.rowValue?.map((element: any, index: any) => {
      if (element.entityTagInfoBos.length < tagMin) {
        tagMin = element.entityTagInfoBos.length;
        tagFlag = index;
      }
    });
    //暴力循环遍历----可读性查
    // let Utag = []; //并集
    let tag_id: undefined; //用户查询的标签
    let tag_name: undefined; //用户查询的标签
    let n: 0; //包含tag的行数
    this.state.rowValue[tagFlag].entityTagInfoBos.map(
      (element: any, index: any) => {
        //拿到一个标签 element.entityTagInfoBos[index].tagId
        tag_id = element.tagId;
        tag_name = element.tagName;
        n = 0;
        this.state.rowValue.map((parent: any, p_index: any) => {
          for (var i = 0; i < parent.entityTagInfoBos.length; i++) {
            if (tag_id == parent.entityTagInfoBos[i].tagId) {
              n++;
              break;
            }
          }
        });
        if (n == this.state.rowValue.length) {
          // Utag.push(tag)
          // this.state.Utags.push(Utag[0])
          this.state.Utags.push({tagId: tag_id, tagName: tag_name});
        }
      },
    );
  };
  onFinishDeleteTags = (value: any) => {
    console.log(value);
  };

  //班级 模糊查询框
  handleclassSearch = (str: any) => {
    const {dispatch} = this.props;
    if (str) {
      dispatch({
        type: 'tags/getLike',
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

  onSelectChange = (selectedRowKeys: any, rowValue: any) => {
    this.setState({
      selectedRowKeys,
      rowValue,
    });
  };

  render() {
    const {allClassInfo, allTagInfo} = this.props;
    const {
      selectedRowKeys,
      rowValue,
      modalAddVisible,
      modalDeleteVisible,
      modalCreateVisible,
      FuzzyValueClass,
    } = this.state;
    const courseType = [
      '理想信念',
      '实践服务',
      '文化艺术',
      '学术科技',
      '社会工作',
      '体育素质',
    ];
    const ClassColumns = [
      {
        title: '年级',
        dataIndex: 'enrollyear',
        key: 'enrollyear',
        align: 'center',
      },
      {
        title: '班级',
        dataIndex: 'className',
        key: 'className',
        align: 'center',
      },

      {
        title: '课程/活动标签',
        dataIndex: 'entityTagInfoBos',
        key: 'entityTagInfoBos',
        align: 'center',
        render: (text: any, record: any) => {
          const tags = record.entityTagInfoBos;
          return (
            <>
              {tags.map((element: any, index: any) => {
                return element.tag !== null ? (
                  <Tag color="blue" key={index}>
                    {element.tagName}
                  </Tag>
                ) : null;
              })}
            </>
          );
        },
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      rowValue,
      onChange: this.onSelectChange,
    };
    return (
      <div>
        {/* 查询 */}
        <ConfigProvider locale={zhCN}>
          <Form onFinish={this.onSearchFinish} ref={this.searchFormRef}>
            <Row gutter={[16, 0]}>
              <Col span={4}/>
              <Col>
                <Form.Item label="年级" name="enrollyear">
                  <Input/>
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
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </Col>
              <Col>
                <Button type="primary" onClick={this.resetSearchForm}>
                  重置
                </Button>
              </Col>
              {/* <Col>
                <Button type="primary" onClick={this.handleDownloadExcel}>
                  下载
                </Button>
              </Col> */}
            </Row>
          </Form>
        </ConfigProvider>

        {/* 课程信息 */}
        <Card style={{marginBottom: 30}}>
          {/* 添加标签---删除标签 */}
          <Row>
            <Button
              type="link"
              onClick={this.addTagsModal}
              icon={<PlusCircleOutlined/>}
              key={'123'}
              style={{fontSize: 16}}
            >
              添加标签
            </Button>
            <Button
              danger
              type="text"
              onClick={this.deleteTagsModal}
              icon={<MinusCircleOutlined/>}
              key={'234'}
              style={{fontSize: 16}}
            >
              删除标签
            </Button>
          </Row>

          {/* 信息统计表 */}
          <Table
            columns={ClassColumns}
            dataSource={allClassInfo}
            rowSelection={rowSelection}
            rowKey={(record: any) => record.classId}
          />
        </Card>
        {/* 添加标签 */}
        <Modal
          title={'添加标签'}
          visible={modalAddVisible}
          // onOk={this.handleOKAddTags}
          onCancel={this.handleCancel}
          forceRender //被隐藏时是否渲染 DOM 结构
          footer={[
            <Button key="cancel" onClick={this.handleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOKAddTags}>
              创建
            </Button>,
          ]}
        >
          <Form
            name="addTags"
            // labelCol={{ span: 6}}//名称宽度
            // wrapperCol={{ span: 18 }}//输入框宽度
            onFinish={this.addTagsForm}
            ref={this.addTagFormRef}
          >
            <Row>
              <Col offset={4}>
                <Form.Item
                  label="选择标签"
                  name="tagId" //可以选择回传一个标签id或者标签名称
                  rules={[{required: true, message: '请选择标签'}]}
                >
                  <Select style={{width: 150}}>
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
              <Col span={1}>
                <Button type="link" onClick={this.createTags}>
                  创建标签
                </Button>
              </Col>
            </Row>
            <Row>
              <Col offset={4}>
                <Form.Item
                  label="任务积分"
                  name="tagValue"
                  rules={[{required: true, message: '请填写任务积分'}]}
                >
                  <InputNumber/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        {/* 创建标签 */}
        <Modal
          title={'创建标签'}
          visible={modalCreateVisible}
          onCancel={this.handleCancel}
          forceRender //被隐藏时是否渲染 DOM 结构
          footer={[
            <Button key="cancel" onClick={this.handleCancel}>
              取消
            </Button>,
            <Button type="primary" onClick={this.handleOKCreasteTags}>
              创建
            </Button>,
          ]}
        >
          <Form
            name="CreateTags"
            onFinish={this.onFinishCreateTags}
            ref={this.createTagFormRef}
          >
            <Row>
              <Col offset={3}>
                <Form.Item
                  label="标签名称"
                  name="tagName"
                  rules={[{required: true, message: '请填写标签名称'}]}
                >
                  <Input style={{width: 250}}/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col offset={3}>
                <Form.Item
                  label="备注信息"
                  name="bak"
                  rules={[{required: true, message: '请填备注信息'}]}
                >
                  <TextArea rows={6} style={{width: 250}}/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        {/* 删除标签 */}
        <Modal
          title={'删除标签'}
          visible={modalDeleteVisible}
          onCancel={this.handleCancel}
          forceRender //被隐藏时是否渲染 DOM 结构
          footer={[
            <Button type="primary" onClick={this.handleOKDeleteTags}>
              删除
            </Button>,
          ]}
        >
          <Form
            name="DeleteTags"
            onFinish={this.onFinishDeleteTags}
            ref={this.deleteTagFormRef}
          >
            <Row>
              <Col offset={3}>
                <Form.Item
                  label="选择标签"
                  name="tagId"
                  rules={[{required: true, message: '请填写标签名称'}]}
                >
                  <Select style={{width: 150}}>
                    {this.state.Utags?.map((element: any, index: any) => {
                      return (
                        <Option key={index} value={element.tagId}>
                          {element.tagName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default connect(({tags, user}: any) => ({
  ...tags,
  ...user,
}))(CourseTagsAnalysis);
