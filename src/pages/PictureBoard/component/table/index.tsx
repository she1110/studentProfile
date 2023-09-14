import {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {Button, Card, Form, Input, Modal, Popconfirm, Space, Table,} from 'antd';

export type PictureBoardTableType = {
  dispatch?: Dispatch;
  onChange: Function;
  allinfo: {
    boardId: number;
    boardName: string;
    boardType: string;
    createTime: string;
    createUser: string;
    personasList: object[];
  }; //当前看板的信息 包括看板id
};

class PictureBoardTable extends Component<PictureBoardTableType> {
  state = {
    EditVisible: false,
  };

  componentDidMount = () => {
  };

  showEditModal = () => {
    this.setState({
      EditVisible: true,
    });
  };

  EditHandleCancel = () => {
    this.setState({
      EditVisible: false,
    });
  };

  EditonFinish = (value: any) => {
    const {dispatch, allinfo} = this.props;
    console.log(value);
    console.log(allinfo.boardId);
    // if (dispatch) {
    //   dispatch({
    //     type: 'board/updateboard',
    //     payload: {
    //       id: this.props.allinfo.id,
    //       boardName: value.boardName,
    //     },
    //   }).then(() => {
    //     dispatch({
    //       type: 'board/getuserboard',
    //     });
    //   }).then(() => {
    //       this.setState({
    //         EditVisible: false,
    //       });
    //     });
    // }
  };

  confirm = (value: any) => {
    const {dispatch, allinfo, onChange} = this.props;
    if (dispatch) {
      dispatch({
        type: 'portraitboard/deleteBoard',
        payload: {
          boardId: allinfo.boardId,
        },
      }).then(() => {
        dispatch({
          type: 'portraitboard/getMyAllBoard',
        });
        onChange('0');
      });
    }
  };

  miniconfirm = (value: any) => {
    const {dispatch, allinfo} = this.props;
    if (dispatch) {
      dispatch({
        type: 'portraitboard/removePersonasFromBoard',
        payload: {
          boardId: allinfo.boardId,
          personasId: value.personasId,
        },
      }).then(() => {
        dispatch({
          type: 'portraitboard/getMyAllBoard',
        });
      });
    }
  };

  render() {
    const columns = [
      {
        title: '画像ID',
        dataIndex: 'personasId',
      },
      {
        title: '画像名称',
        dataIndex: 'personasName',
        align: 'center',
        // render: (text: any, value: any) => (
        //   <Link to={{ pathname: '/CreateUserPicture', state: { value } }}>
        //     {' '}
        //     {text}
        //   </Link>
        // ),
      },
      {
        title: '主题',
        dataIndex: 'theme',
        render: (text: any, record: any, index: any) => {
          switch (text) {
            case 'studentprofile':
              return <span>学生</span>;
            case 'classprofile':
              return <span>班级</span>;
            case 'majorprofile':
              return <span>专业</span>;
            case 'dormitoryprofile':
              return <span>宿舍</span>;
            case 'courseprofile':
              return <span>课程</span>;
            case 'unitprofile':
              return <span>学院</span>;
            default:
          }
        },
      },
      {
        title: '创建人',
        dataIndex: 'author',
      },
      {
        title: '创建时间',
        dataIndex: 'personasTime',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: (text: any, value: any) => {
          return (
            <>
              <Popconfirm
                title="您确定要删除该画像吗？"
                onConfirm={() => this.miniconfirm(value)}
                okText="是"
                cancelText="否"
              >
                <Button type="link">删除</Button>
              </Popconfirm>
            </>
          );
        },
      },
    ];

    const {allinfo} = this.props;

    return (
      <div style={{background: ' #ececec', width: '100%'}}>
        <Card>
          <Table
            columns={columns}
            // dataSource={allinfo.personasList}
            dataSource={allinfo.personasList}
            rowKey={(record: any) => record.personasId}
          />
          <Space>
            <Button type="primary">
              <Link
                to={{
                  pathname: '/PicturePreview',
                  state: allinfo,
                }}
              >
                加入画像
              </Link>
            </Button>

            <Popconfirm
              title="确认删除画板吗?"
              onConfirm={this.confirm}
              okText="是"
              cancelText="否"
            >
              <Button type="primary">删除看板</Button>
            </Popconfirm>

            <Button type="primary" onClick={this.showEditModal}>
              编辑看板
            </Button>
          </Space>
        </Card>

        <Modal
          title="修改看板名字"
          visible={this.state.EditVisible}
          onCancel={this.EditHandleCancel}
          footer={null}
        >
          <Form
            name={'NewBoard'}
            onFinish={this.EditonFinish}
            //  forceRender={true}
          >
            <Form.Item
              name={'boardName'}
              fieldKey={'boardName'}
              label="看板名称"
              // rules={[{ required: true, message: '请输入用户昵称!' }]}
            >
              <Input style={{width: '100%'}}></Input>
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
      </div>
    );
  }
}

export default connect(({portraitboard}: any) => ({
  ...portraitboard,
}))(PictureBoardTable);
