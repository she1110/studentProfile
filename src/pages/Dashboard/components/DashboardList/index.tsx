import React from 'react';
import {Button, Card, Popconfirm, Table} from 'antd';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import moment from 'moment';
import styles from './style.less';

export type DashboardListType = {
  dispatch?: Dispatch;
  MyPersons?: object[];
};

export type ListContentType = {
  id?: number;
  name?: string;
  author?: string;
  createTime?: string;
  theme?: string;
};

class DashboardList extends React.Component<DashboardListType> {
  state = {};

  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'portrait/getMyPersons',
      });
    }
  };
  deletePortrait = (value: any) => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'portrait/deletePersonsById',
        payload: {
          id: value.id,
        },
      }).then(() => {
        dispatch({
          type: 'portrait/getMyPersons',
        });
      });
    }
  };

  render() {
    const {MyPersons} = this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        render: (text: any, value: any) => {
          const uuid = value.id;

          if (
            uuid === 18107 ||
            uuid === 18101 ||
            uuid === 18103 ||
            uuid === 18107 ||
            uuid === 18105
          ) {
            return <span>{text}</span>;
          } else {
            return (
              <Link
                to={{
                  pathname: '/CreatePortrait',
                  state: {
                    theme: value.theme,
                    createMethod: '1',
                    portrait: value,
                  },
                }}
              >
                {text}
              </Link>
            );
          }
        },
      },
      {
        title: '创建者',
        dataIndex: 'author',
        key: 'author',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createtime',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          return <span>{moment(text).format('YYYY-MM-DD')}</span>;
        },
      },
      {
        title: '主题',
        dataIndex: 'theme',
        key: 'theme',
        align: 'center',
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
        title: '操作',
        dataIndex: 'aciton',
        key: 'action',
        align: 'center',
        render: (text: any, value: any) => {
          return (
            <>
              <Popconfirm
                title="您确定要删除该画像吗？"
                onConfirm={() => this.deletePortrait(value)}
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

    const ListContent = ({
                           data: {id, name, author, createTime, theme},
                         }: {
      data: ListContentType;
    }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>创建者</span>
          <p>{author}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>创建时间</span>
          <p>{moment(createTime).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>主题</span>
          <p>{theme}</p>
        </div>
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };
    return (
      <div
        className="site-card-border-less-wrapper"
        style={{
          paddingRight: 30,
          paddingLeft: 30,
          paddingBottom: 30,
          background: ' #ececec',
        }}
      >
        {/* <Button onClick={()=>{console.log(MyPersons);
        }}>ces</Button> */}
        <Card title="用户群画像列表" bordered={false}>
          <Table
            columns={columns}
            dataSource={MyPersons}
            style={{height: 800}}
            rowKey={(record: any) => record.id}
          />
        </Card>

        {/* <Card
          className={styles.listCard}
          bordered={false}
          title="基本列表"
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: '0 32px 40px 32px' }}

        >

          <List
            size="large"
            rowKey="id"
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a
                    key="edit"
                    onClick={(e) => {
                      e.preventDefault();
                      showEditModal(item);
                    }}
                  >
                    编辑
                  </a>,
                  <MoreBtn key="more" item={item} />,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.logo} shape="square" size="large" />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={item.subDescription}
                />
                <ListContent data={item} />
              </List.Item>
            )}
          />
        </Card> */}
      </div>
    );
  }
}

export default connect(({portrait}: any) => ({
  ...portrait,
}))(DashboardList);
