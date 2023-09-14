import React from 'react';
import {Avatar, Card} from 'antd';
import styles from './style.less';
import {connect, Link} from 'umi';
import {BarsOutlined, DeleteOutlined, EditOutlined,} from '@ant-design/icons';

class Template extends React.Component {
  state = {
    pictureList: [],
  };

  componentDidMount = () => {
  };

  render() {
    const {picturelist}: any = this.props;

    return (
      <div style={{padding: 30, background: ' #ececec'}}>
        {picturelist.length != 0 ? (
          <Card
            className={styles.projectList}
            style={{marginBottom: 24}}
            title="用户群画像模板"
            bordered={false}
            // extra={<Link to="/">全部项目</Link>}
            bodyStyle={{padding: 0}}
          >
            {JSON.parse(picturelist.result).map((element: any, index: any) => {
              return (
                <Card.Grid className={styles.projectGrid} key={index}>
                  <Card
                    bodyStyle={{padding: 0}}
                    bordered={false}
                    actions={[
                      <BarsOutlined
                        key="setting"
                        onClick={() => {
                          console.log(JSON.parse(picturelist.result));
                        }}
                      />,
                      <EditOutlined key="edit"/>,
                      <DeleteOutlined key="delete"/>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div className={styles.cardTitle}>
                          <Avatar
                            size="small"
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                          />
                          <Link to="/userCenter">{element.name}</Link>
                        </div>
                      }
                      description="城镇中有那么多的酒馆，她却偏偏走进了我的酒馆"
                    />
                    <div className={styles.projectItemContent}>
                      <Link to="/userCenter">{element.author}</Link>
                      <span className={styles.datetime} title="科学搬砖">
                        {element.createtime}
                      </span>
                    </div>
                  </Card>
                </Card.Grid>
              );
            })}
          </Card>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default connect(({picture}: any) => ({
  ...picture,
}))(Template);
