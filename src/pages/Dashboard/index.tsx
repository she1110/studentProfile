import React, {useEffect} from 'react';
import {connect} from 'umi';

import {Col, Layout, Row} from 'antd';
import DashboardTopCard from './components/DashboardTopCard/index';
import DashboardList from './components/DashboardList/index';

const {Header, Footer, Sider, Content} = Layout;

const Dashboard = (props: any) => {
  useEffect(() => {
  }, []);

  return (
    <div>
      <Row>
        <Col span={24}>
          <DashboardTopCard/>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <DashboardList/>
        </Col>
      </Row>
    </div>
  );
};

export default connect(() => ({}))(Dashboard);
