import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {Avatar, PageHeader, Row, Tabs, Tag,} from 'antd';
import {AuditOutlined, FileDoneOutlined, ReadOutlined, UsergroupAddOutlined,} from '@ant-design/icons';
import 'rc-texty/assets/index.css';
import styles from './index.less';
import CourseTagsAnalysis from './components/CourseTagsAnalysis';
import ClassTagsAnalysis from './components/ClassTagsAnalysis';
import DorTagsAnalysis from './components/DorTagsAnalysis';
import StudentTagsAnalysis from './components/StudentTagsAnalysis';
import PointAnalysis from './components/PointAnalysis';

const {TabPane} = Tabs;

export type Props = {
  dispatch: Dispatch;
  softwareList?: object[]; //软件著作权信息列表
  paperList?: object[]; //论文信息列表
  patentList?: object[]; //专利信息列表
  competitionList?: object[]; //竞赛信息列表
};

class TagsData extends Component<Props> {
  state = {
    TabsVisible: '1',
    flag: 1, //没卵用
  };

  componentDidMount = () => {
    // const { dispatch } = this.props;
    // if (dispatch) {
    //   dispatch({
    //     type: 'competition/getSoftPaperPatentComp',
    //     payload: {
    //       type: '3',
    //     },
    //   });
    // }
  };

  TabsOnChange = (value: any) => {
    this.setState({
      TabsVisible: value,
    });
  };

  render() {
    const {} = this.props;
    const {TabsVisible, flag} = this.state;
    const content = (
      <>
        <Tabs
          activeKey={TabsVisible}
          onChange={this.TabsOnChange}
          size="large"
          centered
        >
          {
            <>
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <UsergroupAddOutlined/>
                    活动分析
                  </span>
                }
                key="1"
              />
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <ReadOutlined/>
                    学生分析
                  </span>
                }
                key="2"
              />
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <AuditOutlined/>
                    宿舍分析
                  </span>
                }
                key="3"
              />
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <FileDoneOutlined/>
                    班级分析
                  </span>
                }
                key="4"
              />
            </>
          }
        </Tabs>
      </>
    );
    const Content = ({children, extraContent}: any) => (
      <Row>
        <div style={{flex: 1}}>{children}</div>
        <div className="image">{extraContent}</div>
      </Row>
    );

    return (
      <div style={{padding: 30, background: ' #ececec', width: '100%'}}>
        {/*
              有一个bug，在删除标签时，如果选择了空标签，就会报错
        */}
        <div style={{marginBottom: 30, backgroundColor: 'white'}}>
          <PageHeader
            title="标签积分查询"
            subTitle="--"
            tags={<Tag color="blue">运行中</Tag>}
            avatar={{src: require('@/assets/picture/报表.png')}}
          >
            <Content
              extraContent={
                <Avatar
                  size={60}
                  icon={<ReadOutlined/>}
                  style={{marginRight: 20}}
                />
              }
            >
              {content}
            </Content>
          </PageHeader>
        </div>
        {TabsVisible === '1' ? <CourseTagsAnalysis flag={1}/> : null}
        {TabsVisible === '2' ? <StudentTagsAnalysis flag={1}/> : null}
        {TabsVisible === '3' ? <DorTagsAnalysis flag={1}/> : null}
        {TabsVisible === '4' ? <ClassTagsAnalysis flag={1}/> : null}

        <PointAnalysis flag={1}/>
      </div>
    );
  }
}

export default connect(({competition, loading, user}: any) => ({
  ...competition,
  ...user,
}))(TagsData);
