import {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, history} from 'umi';
import {Button, Card, Col, message, PageHeader, Row, Space, Spin, Tag, Typography,} from 'antd';
import ThemeCard from './component/themeCard';
import PreviewCard from './component/PreviewCard';
import {PlusOutlined} from '@ant-design/icons';

const {Paragraph} = Typography;

export type PicturePreviewType = {
  dispatch?: Dispatch;
  location?: any;
  MyPersons?: object[];
  selectAllInfo?: any;
  addloading: boolean;
  // allinfo: {
  //   boardId: number;
  //   boardName: string;
  //   boardType: string;
  //   createTime: string;
  //   createUser: string;
  //   personasList: object[];
  // };//当前看板的信息 包括看板id
};

class PicturePreview extends Component<PicturePreviewType> {
  state = {
    themeinfo: {},
    chartsTable: [], //动态生成图表
    getPrimaryInfo: {},

    allinfo: undefined, //当前 看板 的所有信息 包括id
    selectAllInfo: undefined, //选中的 画像 的全部信息
  };

  componentDidMount = () => {
    const {dispatch, location} = this.props;
    if (location.state) {
      this.setState({
        allinfo: location.state,
      });
      if (dispatch) {
        dispatch({
          type: 'portrait/getMyPersons',
        });
      }
    } else {
      history.goBack();
    }
  };

  Add = () => {
    const {dispatch, location} = this.props;
    const {allinfo, selectAllInfo} = this.state;
    if (dispatch && allinfo && selectAllInfo) {
      let personasIdListTEMP: any = [];
      personasIdListTEMP.push(selectAllInfo.id);
      dispatch({
        type: 'portraitboard/addPersonasIntoBoard',
        payload: {
          boardId: allinfo.boardId,
          personasIdList: personasIdListTEMP,
        },
      });
    } else {
      message.info('请选择画像！！');
    }
  };

  selectPortrait = (value: object) => {
    this.setState({
      selectAllInfo: value,
    });
  };

  render() {
    const {allinfo, selectAllInfo} = this.state;
    const {MyPersons, addloading} = this.props;
    const content = (
      <>
        <Paragraph>预览用户群画像，包括分析过程中保存的指标和图表</Paragraph>
        <Paragraph>
          画像按照主题进行分类，方便用户按照自己感兴趣的主题进行画像预览。
        </Paragraph>
        <Paragraph>
          可以根据自身对数据的跟踪需要将分析过程中保存的指标和图表添加到用户个性化看板。
        </Paragraph>
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
            title="用户画像预览"
            subTitle="预览画像"
            tags={<Tag color="blue">运行中</Tag>}
            extra={[
              <Button
                key={'back'}
                type="primary"
                onClick={() => {
                  history.goBack();
                }}
                icon={<PlusOutlined/>}
              >
                返回看板
              </Button>,
            ]}
            avatar={{src: require('@/assets/picture/预览.png')}}
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
        </div>
        <Spin spinning={addloading ? addloading : false}>
          <Card title="看板添加画像">
            <Row gutter={36}>
              <Col span={6}>
                <Card title="画像选择">
                  <ThemeCard selectPortrait={this.selectPortrait}/>
                </Card>
              </Col>
              <Col span={17}>
                <Card
                  title="画像预览"
                  extra={
                    <Space>
                      <Button type="primary" onClick={this.Add}>
                        加入
                      </Button>
                    </Space>
                  }
                >
                  <PreviewCard selectAllInfo={selectAllInfo}/>
                </Card>
              </Col>
            </Row>
          </Card>
        </Spin>
      </div>
    );
  }
}

export default connect(({portraitboard, portrait, loading}: any) => ({
  ...portraitboard,
  ...portrait,
  addloading: loading.effects['portraitboard/addPersonasIntoBoard'],
}))(PicturePreview);
