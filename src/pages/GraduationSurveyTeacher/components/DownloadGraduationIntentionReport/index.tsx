import React, {Component,useEffect} from 'react';
import type {Dispatch} from 'umi';
import {connect, Link} from 'umi';
import {Button, Space, Table, Tag} from 'antd';
import type {ColumnsType, TableProps} from 'antd/es/table';
import {isLoginStatus} from "@/utils/loginStatusChecker";

export type Props = {
  dispatch?: Dispatch;
  HullTree?: any;
  FirstLevelWarning?: any;
  HelpCandidate?: any;
  WarnQues?: any;
  data: any;
};

interface DataType {
  key: string;
  year: string;
  graduationNumber: number;
}

const data: DataType[] = [{key: '1',year: '2017',graduationNumber: 12}]

class DownloadGraduationIntentionReport extends Component<Props> {
  state = {
    tableData: []
  };

  componentDidMount = () => {
    if (!isLoginStatus()) return;
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'graduationsurvey/getGraduationIntentionReport',
        payload: {
          callback: (value: any) => {
            console.log(value)
            this.setState({tableData:value});
          },
        },
      });
    }
  };
  downloadReport = (year:any) => {
    console.log(year)
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'graduationsurvey/downloadReport',
        payload: {
          value:year
        },
      });
    }
  };

  render() {
    const columns: ColumnsType<DataType> = [
      {
        title: '学年',
        dataIndex: 'year',
        key: 'year',
        sorter: {
          // @ts-ignore
          compare: (a, b) => a.year - b.year,
          multiple: 1,
        },
        width: '34%',
        align: 'center'
      },
      {
        title: '毕业人数',
        dataIndex: 'graduationNumber',
        key: 'graduationNumber',
        sorter: {
          compare: (a, b) => a.graduationNumber - b.graduationNumber,
          multiple: 2,
        },//用于排序
        width: '33%',
        align: 'center'
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Button size="middle" onClick={()=>{this.downloadReport(record.year)}} >
            <a>Download report in {record.year}</a>
          </Button>
        ),
        width: '33%',
        align: 'center'
      },
    ];
    const onChange: TableProps<DataType>['onChange'] = (
      pagination,
      filters,
      sorter,
      extra,
    ) => {
      console.log('params', pagination, filters, sorter, extra);
    };
    return <Table columns={columns} dataSource={this.state.tableData} onChange={onChange}/>;
  }
}


export default connect(({graduationsurvey}: any) => ({
  ...graduationsurvey
  // @ts-ignore
}))(DownloadGraduationIntentionReport);
