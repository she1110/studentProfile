import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {Avatar, Collapse, Input, PageHeader, Row, Select, Tabs, Tag, Typography,} from 'antd';
import {AuditOutlined, FileDoneOutlined, ReadOutlined, UsergroupAddOutlined,} from '@ant-design/icons';
import 'rc-texty/assets/index.css';
import styles from './index.less';
import CompetitionInfo from './components/CompetitionInfo';
import SorftwareConpyright from './components/SorftwareConpyright';
import PapersStatistical from './components/PapersStatistical';
import PatentsInfo from './components/PatentsInfo';

const {Search} = Input;
const {Option} = Select;
const {Paragraph} = Typography;
const {Panel} = Collapse;
const {TabPane} = Tabs;
const {TextArea} = Input;

export type APP = {
  courseId: string;
  courseName: string;
  courseType: string;
};

export type Props = {
  dispatch: Dispatch;
  softwareList?: object[]; //软件著作权信息列表
  paperList?: object[]; //论文信息列表
  patentList?: object[]; //专利信息列表
  competitionList?: object[]; //竞赛信息列表
};

class CompetitionFile extends Component<Props> {
  state = {
    TabsVisible: '1',
    // SoftwareList: [],//软件著作权信息列表
    // PaperList: [],//论文信息列表
    // PatentList: [],//专利信息列表
    // CompList: [],//竞赛信息列表
  };

  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'competition/getSoftPaperPatentComp',
        payload: {
          type: '0',
        },
      });
      dispatch({
        type: 'competition/getSoftPaperPatentComp',
        payload: {
          type: '1',
        },
      });
      dispatch({
        type: 'competition/getSoftPaperPatentComp',
        payload: {
          type: '2',
        },
      });
      dispatch({
        type: 'competition/getSoftPaperPatentComp',
        payload: {
          type: '3',
        },
      });
    }
  };

  TabsOnChange = (value: any) => {
    this.setState({
      TabsVisible: value,
    });
  };

  render() {
    const {competitionList, softwareList, paperList, patentList} = this.props;
    const {TabsVisible} = this.state;
    const content = (
      <>
        {/* <Paragraph>
                    <Texty>学生的个人报告应该全方位展示学生第一课堂和第二课堂的情况。</Texty>
                </Paragraph>
                <Paragraph>
                    <Texty>第一课堂，主要以学生参加选课，考试为主，包括选课表、单科考试成绩以及历年绩点成绩。</Texty>
                </Paragraph>
                <Paragraph>
                    <Texty>第二课堂，主要以学生参与活动、认证证书为主，包含思想政治引领、素质拓展提升、社会实践锻炼、志愿服务公益和自我管理服务等多维度能力培养与评估。</Texty>
                </Paragraph> */}
        <Tabs activeKey={TabsVisible} onChange={this.TabsOnChange} size="large">
          {
            <>
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <UsergroupAddOutlined/>
                    竞赛统计
                  </span>
                }
                key="1"
              />
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <ReadOutlined/>
                    论文统计
                  </span>
                }
                key="2"
              />
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <AuditOutlined/>
                    专利统计
                  </span>
                }
                key="3"
              />
              <TabPane
                tab={
                  <span className={styles.tabStyle}>
                    <FileDoneOutlined/>
                    软著统计
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
        <div style={{marginBottom: 30, backgroundColor: 'white'}}>
          <PageHeader
            title="竞赛档案"
            subTitle="对学生参加的竞赛、论文、专利、软著进行统计"
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
        {TabsVisible === '1' ? (
          <CompetitionInfo CompList={this.props.competitionList}/>
        ) : null}
        {TabsVisible === '2' ? (
          <PapersStatistical
            PaperList={this.props.paperList}
            unitList={this.props.unitlist}
          />
        ) : null}
        {TabsVisible === '3' ? (
          <PatentsInfo
            PatentList={this.props.patentList}
            unitList={this.props.unitlist}
          />
        ) : null}
        {TabsVisible === '4' ? (
          <SorftwareConpyright
            SoftwareList={this.props.softwareList}
            unitList={this.props.unitlist}
          />
        ) : null}

        {/* 软著名单 */}
        {/* <SorftwareConpyright /> */}
        {/* 图表 */}
      </div>
    );
  }
}

export default connect(({competition, loading, user}: any) => ({
  ...competition,
  ...user,
}))(CompetitionFile);
