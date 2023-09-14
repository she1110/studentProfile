import {Card, Col, Row, Skeleton} from 'antd';
import type {Dispatch} from 'umi';
import {connect} from 'umi';
import React from 'react';
import ColumnChart from '@/pages/CreatePortrait/components/SelectionChart/components/ColumnChart/index';
import PieChart from '@/pages/CreatePortrait/components/SelectionChart/components/PieChart/index';
import ThemeResultWords from './component/ThemeResultWords/index';
import PreviewRingProgress from './component/RingProgress/index';

export type PicturePreviewType = {
  dispatch?: Dispatch;
  selectAllInfo?: any;
};

class PreviewCard extends React.Component<PicturePreviewType> {
  state = {};
  componentDidMount = () => {
  };

  render() {
    const {selectAllInfo} = this.props;
    let originalcards: any = [];
    let primaryInfo: any = undefined;
    if (selectAllInfo) {
      originalcards = JSON.parse(selectAllInfo.originaljson).originalcards;
      primaryInfo = {
        total: JSON.parse(selectAllInfo.count).total,
        count: JSON.parse(selectAllInfo.count).count,
      };
    }
    return (
      <div>
        <Row gutter={16}>
          <Col span={24}>
            <Card title={'查询结果'} type="inner">
              {primaryInfo ? (
                <Row>
                  <Col span={3}>
                    <PreviewRingProgress primaryInfo={primaryInfo}/>
                  </Col>
                  <Col span={6}>
                    <ThemeResultWords
                      theme={selectAllInfo?.theme}
                      primaryInfo={primaryInfo}
                    />
                  </Col>
                </Row>
              ) : (
                <Skeleton/>
              )}
            </Card>
          </Col>
        </Row>

        <Row gutter={12}>
          {originalcards?.map((element: any, index: any) => {
            if (element.chart === 'pieChart') {
              return (
                <Col span={24} key={index}>
                  <Card title={element.name} type="inner">
                    <PieChart detail={element.detail}/>
                  </Card>
                </Col>
              );
            } else if (element.chart === 'columnChart') {
              return (
                <Col span={24} key={index}>
                  <Card title={element.name} type="inner">
                    <ColumnChart detail={element.detail}/>
                  </Card>
                </Col>
              );
            }
          })}
        </Row>
      </div>
    );
  }
}

export default connect(({}: any) => ({}))(PreviewCard);
