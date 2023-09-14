import React, {Component} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {Button, Card, Col, ConfigProvider, Empty, Form, Row, Select, Table, Tabs,} from 'antd';
import {FormInstance} from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import DemoPie from './components/PieChart';
import ScatterChart from './components/ScatterChart';

export type Props = {
  dispatch?: Dispatch;
  getUserId?: any;
  getDormName?: any;
  getClassId?: any;

  gpa5yuData?: any;
  ScatterData?: any;
};

const {TabPane} = Tabs;
const {Option} = Select;
const gradeOption = (
  <>
    <Option value={5}>优秀</Option>
    <Option value={4}>良好</Option>
    <Option value={3}>中等</Option>
    <Option value={2}>合格</Option>
    <Option value={1}>不合格</Option>
  </>
);

class GPA5yuPage extends Component<Props> {
  state = {
    modalTitle: '', //modal标题
  };
  formRef = React.createRef<FormInstance>();
  componentDidMount = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'trainingplan/getGrade',
        payload: {
          year: '2017',
        },
      });
      dispatch({
        type: 'trainingplan/getDataByGpaAndFive',
        payload: {gpa: 5},
      });
    }
  };
  searchOnFinish = (value: any) => {
    console.log(value);
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'trainingplan/getDataByGpaAndFive',
        payload: value,
      });
    }
  };
  scatterOnFinish = (value: any) => {
    console.log(value);
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'trainingplan/getScatterPicture',
        payload: value,
      });
    }
  };

  render() {
    const {getClassId, getUserId, getDormName, gpa5yuData, ScatterData} =
      this.props;
    const {modalTitle} = this.state;
    const studentColumns = [
      {
        title: '学号',
        dataIndex: 'USERID',
        key: 'USERID',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'USERNAME',
        key: 'USERNAME',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          return (
            <Button
              type="link"
              onClick={() => {
                getUserId(record.USERID);
              }}
            >
              {text}
            </Button>
          );
        },
      },
      {
        title: '宿舍',
        dataIndex: 'DORMITORY',
        key: 'DORMITORY',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          return (
            <Button
              type="link"
              onClick={() => {
                getDormName(record.DORMITORY);
              }}
            >
              {text}
            </Button>
          );
        },
      },
      {
        title: '班级名称',
        dataIndex: 'CLASSNAME',
        key: 'CLASSNAME',
        align: 'center',
        render: (text: any, record: any, index: any) => {
          return (
            <Button
              type="link"
              onClick={() => {
                getClassId(record.CLASSID);
              }}
            >
              {' '}
              {text}
            </Button>
          );
        },
      },

      {
        title: '专业',
        dataIndex: 'MAJORNAME',
        key: 'MAJORNAME',
        align: 'center',
      },
      // {
      //     title: '学院',
      //     dataIndex: 'Unit',
      //     key: 'Unit',
      //     align: 'center',
      // },
      {
        title: '辅导员',
        dataIndex: 'COUNSELORID',
        key: 'COUNSELORID',
        align: 'center',
      },
      {
        title: 'GPA',
        dataIndex: 'GPA',
        key: 'GPA',
        align: 'center',
        // render: (text: any, record: any, index: any) => {
        //     if (text >= record.gradeAverageGpa) {
        //         return (
        //             <>
        //                 <span>{text}</span>
        //                 <ArrowUpOutlined style={{ color: 'red' }} />
        //             </>
        //         );
        //     } else {
        //         return (
        //             <>
        //                 <span>{text}</span>
        //                 <ArrowDownOutlined style={{ color: 'green' }} />
        //             </>
        //         );
        //     }
        // },
        // sorter: {
        //     compare: (a: { classAvgGpa: string }, b: { classAvgGpa: string }) =>
        //         a.classAvgGpa.localeCompare(b.classAvgGpa),
        //     multiple: 2,
        // },
      },
      {
        title: '五育总体',
        dataIndex: 'TOTAL',
        key: 'TOTAL',
        align: 'center',
      },
      {
        title: '德育',
        dataIndex: 'VIRTUE',
        key: 'VIRTUE',
        align: 'center',
      },
      {
        title: '智育',
        dataIndex: 'WISDOM',
        key: 'WISDOM',
        align: 'center',
      },
      {
        title: '体育',
        dataIndex: 'SPORTS',
        key: 'SPORTS',
        align: 'center',
      },
      {
        title: '美育',
        dataIndex: 'ART',
        key: 'ART',
        align: 'center',
      },
      {
        title: '劳动',
        dataIndex: 'LABOUR',
        key: 'LABOUR',
        align: 'center',
      },
    ];
    const studentDataSource = [
      {
        userId: '194996',
        userName: '张子涵',
        dormitory: '红桥校区东区九号楼406',
        classId: '718',
        className: '中法计191',
        Major: '专业1',
        Unit: '学院1',
        Counselor: '辅导员1',
        AvgGpa: '3.45',
        all5yu: '60',
        virtue: '1',
        wisdom: '2',
        sports: '3',
        art: '4',
        labour: '5',
      },
    ];
    return (
      <ConfigProvider locale={zhCN}>
        {/* <Button onClick={() => {
                    console.log(ScatterData);
                }}>ceshi</Button> */}
        <Card title={'查询条件'}>
          <Form layout={'inline'} onFinish={this.searchOnFinish}>
            <Form.Item label="GPA" name="gpa">
              <Select allowClear={true} style={{width: 120}} defaultValue={5}>
                {gradeOption}
              </Select>
            </Form.Item>

            <Form.Item label="“五育”总体" name="five">
              <Select style={{width: 120}} allowClear={true}>
                {gradeOption}
              </Select>
            </Form.Item>

            <Form.Item label="德育" name="virtue">
              <Select style={{width: 100}} allowClear={true}>
                {gradeOption}
              </Select>
            </Form.Item>

            <Form.Item label="智育" name="wisdom">
              <Select style={{width: 100}} allowClear={true}>
                {gradeOption}
              </Select>
            </Form.Item>

            <Form.Item label="体育" name="sports">
              <Select style={{width: 100}} allowClear={true}>
                {gradeOption}
              </Select>
            </Form.Item>

            <Form.Item label="美育" name={'art'}>
              <Select style={{width: 100}} allowClear={true}>
                {gradeOption}
              </Select>
            </Form.Item>

            <Form.Item label="劳动" name={'labour'}>
              <Select style={{width: 100}} allowClear={true}>
                {gradeOption}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card style={{marginTop: 30}} title="学生列表">
          {gpa5yuData ? (
            <Table
              dataSource={gpa5yuData.chart}
              columns={studentColumns}
              rowKey={(e: any) => e.USERID}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
          )}
        </Card>

        {gpa5yuData ? (
          <Card style={{marginTop: 30}}>
            <Row gutter={12}>
              <Col span={8}>
                <Card title={'班级排名'}>
                  <DemoPie type="class" pieData={gpa5yuData.class}/>
                </Card>
              </Col>
              <Col span={8}>
                <Card title={'专业排名'}>
                  <DemoPie type="major" pieData={gpa5yuData.major}/>
                </Card>
              </Col>
              <Col span={8}>
                <Card title={'辅导员排名'}>
                  <DemoPie type="counselor" pieData={gpa5yuData.counselor}/>
                </Card>
              </Col>
            </Row>
          </Card>
        ) : null}
        <Card
          title={'GPA-五育：分布散点图'}
          style={{marginTop: 30}}
          extra={
            <Form layout={'inline'} onFinish={this.scatterOnFinish}>
              <Form.Item
                label="年级"
                name="enrollyear"
                rules={[{required: true, message: '请输入年级'}]}
              >
                <Select allowClear={true} style={{width: 120}}>
                  {/* <Option value="2017">2017</Option> */}
                  <Option value="2018">2018</Option>
                  <Option value="2019">2019</Option>
                  <Option value="2020">2020</Option>
                  <Option value="2021">2021</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="专业"
                name={'majorId'}
                rules={[{required: true, message: '请输入专业'}]}
              >
                <Select style={{width: 220}} allowClear={true}>
                  <Option value="1401">电气工程及其自动化</Option>
                  <Option value="2823">新能源科学与工程</Option>
                  {/* <Option value="2412">计算机科学与技术(中外合作办学)</Option>
                  <Option value="2417">物联网工程(中外合作办学)</Option>
                  <Option value="28011">计算机科学与技术（双学位班）</Option>
                  <Option value="28012">
                    计算机科学与技术（人工智能新工科试点班）
                  </Option>
                  <Option value="2821">自动化</Option>
                  <Option value="2822">智能科学与技术</Option>
                  <Option value="28221">
                    智能科学与技术（人工智能新工科试点班）
                  </Option>
                  <Option value="28A">计算机类</Option>
                  <Option value="28051">
                    数据科学与大数据技术（人工智能新工科试点班）
                  </Option>
                  <Option value="2801">计算机科学与技术</Option>
                  <Option value="2804">物联网工程</Option>
                  <Option value="2802">软件工程</Option>
                  <Option value="2803">网络工程</Option>
                  <Option value="28041">物联网工程(中新)</Option>
                  <Option value="28013">计算机科学与技术(中法)</Option>
                  <Option value="2806">人工智能</Option>
                  <Option value="2805">数据科学与大数据技术</Option>
                  <Option value="28014">计算机科学与技术(第二学位)</Option> */}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </Form.Item>
            </Form>
          }
        >
          {ScatterData ? <ScatterChart ScatterData={ScatterData}/> : null}
        </Card>
      </ConfigProvider>
    );
  }
}

export default connect(({trainingplan, loading, user}: any) => ({
  ...trainingplan,
  ...user,
}))(GPA5yuPage);
