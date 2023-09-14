import {Empty, Table, Tabs} from 'antd';

const {TabPane} = Tabs;
const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

export default ({identifyDataInProfileData}: any) => {
  const jiangXueJinColumns = [
    {
      title: '奖项名称',
      dataIndex: 'jxjLevel',
      key: 'jxjLevel',
    },
    {
      title: '开始年度',
      dataIndex: 'start_year',
      key: 'start_year',
    },
    {
      title: '结束年度',
      dataIndex: 'end_year',
      key: 'end_year',
    },
    {
      title: '金额（元）',
      dataIndex: 'money',
      key: 'money',
    },
  ];
  const pinKunStuColumns = [
    {
      title: '贫困等级',
      dataIndex: 'poorLevel',
      key: 'poorLevel',
    },
    {
      title: '开始年度',
      dataIndex: 'startYear',
      key: 'startYear',
    },
    {
      title: '结束年度',
      dataIndex: 'endYear',
      key: 'endYear',
    },
  ];
  const liZhiJinagColumns = [
    {
      title: '奖项名称',
      dataIndex: 'lzjLevel',
      key: 'lzjLevel',
    },
    {
      title: '开始年度',
      dataIndex: 'start_year',
      key: 'age',
    },
    {
      title: '结束年度',
      dataIndex: 'end_year',
      key: 'address',
    },
    {
      title: '金额（元）',
      dataIndex: 'money',
      key: 'money',
    },
  ];
  const zhuXueJiangColumns = [
    {
      title: '开始年度',
      dataIndex: 'startYear',
      key: 'startYear',
    },
    {
      title: '结束年度',
      dataIndex: 'endYear',
      key: 'endYear',
    },
    {
      title: '金额（元）',
      dataIndex: 'money',
      key: 'money',
    },
  ];

  const callback = (value: any) => {
    // console.log(value);
  };
  return (
    <>
      {/* <Button onClick={() => {
                console.log(identifyDataInProfileData);
            }}>测试</Button> */}
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="奖学金" key="1">
          {identifyDataInProfileData.jiangXueJin ? (
            <Table
              dataSource={identifyDataInProfileData.jiangXueJin}
              columns={jiangXueJinColumns}
              size={'small'}
              pagination={{
                hideOnSinglePage: true,
              }}
              rowKey={'id'}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
          )}
        </TabPane>
        <TabPane tab="贫困生" key="2">
          {identifyDataInProfileData.pinKunStu ? (
            <Table
              dataSource={identifyDataInProfileData.pinKunStu}
              columns={pinKunStuColumns}
              size={'small'}
              pagination={{
                hideOnSinglePage: true,
              }}
              rowKey={'id'}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
          )}
        </TabPane>
        <TabPane tab="励志奖" key="3">
          {identifyDataInProfileData.liZhiJinag ? (
            <Table
              dataSource={identifyDataInProfileData.liZhiJinag}
              columns={liZhiJinagColumns}
              size={'small'}
              pagination={{
                hideOnSinglePage: true,
              }}
              rowKey={'id'}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
          )}
        </TabPane>
        <TabPane tab="助学奖" key="4">
          {identifyDataInProfileData.zhuXueJiang ? (
            <Table
              dataSource={identifyDataInProfileData.zhuXueJiang}
              columns={zhuXueJiangColumns}
              size={'small'}
              pagination={{
                hideOnSinglePage: true,
              }}
              rowKey={'id'}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
          )}
        </TabPane>
      </Tabs>
    </>
  );
};
