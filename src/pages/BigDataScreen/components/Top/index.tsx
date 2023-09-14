import {Col, Row} from 'antd';
import React from 'react';
import FormatTime from './components/FormatTime';
import Title from './components/Title';
import {Decoration2, Decoration5, Decoration6, Decoration8,} from '@jiaminghi/data-view-react';

class Top extends React.Component {
  render() {
    return (
      <>
        <Row justify="center" align="middle">
          <Col span={8}>
            <Row>
              <Decoration8
                className="top_decoration8"
                // color={['#568aea', '#000000']}
                style={{width: '550px', height: '50px'}}
              />
            </Row>
            <Row></Row>
            <Row>
              <Decoration2 style={{width: '550px', height: '5px'}}/>
            </Row>
          </Col>
          <Col span={8}>
            <Row justify="space-around" align="middle">
              <Col>
                <Decoration5 style={{width: '550px', height: '40px'}}/>
              </Col>
            </Row>
            <Row justify="space-around" align="middle">
              <Col className="title-text">
                <Title/>
              </Col>
            </Row>
            <Row justify="space-around" align="middle">
              <Col span={8}>
                <Decoration6
                  className="top_decoration6"
                  reverse={true}
                  color={['#50e3c2', '#67a1e5']}
                  style={{height: '10px'}}
                />
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row justify="end">
              <Decoration8
                reverse={true}
                className="top_decoration8"
                // color={['#568aea', '#000000']}
                style={{width: '550px', height: '50px'}}
              />
            </Row>
            <Row></Row>
            <Row gutter={16} justify="end" align="middle">
              <Col>
                <FormatTime/>
              </Col>
              <Col></Col>
            </Row>
          </Col>
          {/* <Col span={8}>
						<Row justify='end'>
							<FormatTime />
						</Row>
					</Col> */}
        </Row>
      </>
    );
  }
}

export default Top;
