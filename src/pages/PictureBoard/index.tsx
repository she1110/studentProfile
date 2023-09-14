import {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect} from 'umi';
import {Button, Card, Form, Input, Modal, PageHeader, Row, Tag, Typography,} from 'antd';
import {PlusOutlined, RedoOutlined} from '@ant-design/icons';

import TABS from './component/tabs/index';

const {Paragraph} = Typography;

export type PictureBoardType = {
  dispatch?: Dispatch;
};

class PictureBoard extends Component<PictureBoardType> {
  state = {
    NewVisible: false, //新建画板modal
  };

  componentDidMount = () => {
  };

  //控制新建看板的modal显示
  showNewModal = () => {
    this.setState({NewVisible: true});
  };
  NewHandleOk = () => {
    this.setState({NewVisible: false});
  };
  NewHandleCancel = () => {
    this.setState({NewVisible: false});
  };
  NewonFinish = (value: any) => {
    const {dispatch} = this.props;
    this.setState({
      NewVisible: false,
    });
    if (dispatch) {
      dispatch({
        type: 'portraitboard/addBoard',
        payload: value,
      }).then(() => {
        dispatch({
          type: 'portraitboard/getMyAllBoard',
        });
      });
    }
  };

  reset = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'portraitboard/getMyAllBoard',
      });
    }
  };

  render() {
    const content = (
      <>
        <Paragraph>将用户感兴趣的画像整合成属于用户本身的画像看板。</Paragraph>
        <Paragraph>
          构建多维立体的用户画像画板，构成自定义看板，方便日常数据监控。
        </Paragraph>
        <Paragraph>
          不同角色可以根据自身对数据的跟踪需要将分析过程中保存的指标和图表添加到看板。
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
            title="画像看板"
            subTitle="用户个性化看板"
            tags={<Tag color="blue">运行中</Tag>}
            extra={[
              <Button
                key={'reset'}
                onClick={this.reset}
                icon={<RedoOutlined/>}
              >
                刷新看板
              </Button>,
              <Button
                key={'create'}
                type="primary"
                onClick={this.showNewModal}
                icon={<PlusOutlined/>}
              >
                新建看板
              </Button>,
            ]}
            avatar={{src: require('@/assets/picture/看板.png')}}
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

        <Card>
          <TABS/>
        </Card>

        <Modal
          title="新建看板"
          visible={this.state.NewVisible}
          onOk={this.NewHandleOk}
          onCancel={this.NewHandleCancel}
          footer={null}
        >
          <Form
            name={'NewBoard'}
            onFinish={this.NewonFinish}
            //  forceRender={true}
          >
            <Form.Item
              name={'boardName'}
              fieldKey={'boardName'}
              label="看板名称"
              rules={[{required: true, message: '请输入看板名称!'}]}
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
}))(PictureBoard);
