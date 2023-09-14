/* 用于前台直接通过json导出Excel
   参数column和dataSource分别为列头和数据源
   参数格式与antd的Table组件的表头和数据源通用
*/
import {File} from 'better-xlsx/dist/xlsx';
import {saveAs} from 'file-saver';

function ExportExcel(
  column,
  dataSource,
  fileName = 'excel',
  columnWidth = [],
  cb,
) {
  // 新建工作谱
  const file = new File();
  // 新建表
  let sheet = file.addSheet('sheet1');
  // 获取表头行数
  let depth = getDepth(column);
  // 获取表头的列数
  let columnNum = getColumns(column);
  // 新建表头行数
  let rowArr = [];
  for (let k = 0; k < depth; k++) {
    let row = sheet.addRow();
    row.setHeightCM(1);
    rowArr.push(row);
  }
  // 根据列数填充单元格
  rowArr.map((ele) => {
    for (let j = 0; j < columnNum; j++) {
      let cell = ele.addCell();
      cell.value = j;
      border(cell, 1, 1, 1, 1);
      fillColor(cell, 1);
      // console.log(cell)
    }
  });
  // 初始化表头
  init(column, 0, 0);
  // 按顺序展平column
  let columnLineArr = [];
  columnLine(column);
  // 根据column,将dataSource里面的数据排序，并且转化为二维数组
  let dataSourceArr = [];
  /*
  dataSource.map(ele => {
    let dataTemp = []
    columnLineArr.map(item => {
      dataTemp.push({
        [item.dataIndex]: ele[item.dataIndex],
        value: ele[item.dataIndex]
      })
    })
    dataSourceArr.push(dataTemp)
  })
*/
  getDataAndChildren(dataSource);

  // 表格数据children 嵌套循环
  function getDataAndChildren(arr) {
    arr.map((ele) => {
      // debugger
      let dataTemp = [];
      columnLineArr.map((item) => {
        dataTemp.push({
          [item.dataIndex]: ele[item.dataIndex],
          value: ele[item.dataIndex],
        });
      });
      dataSourceArr.push(dataTemp);
      if (ele.children !== undefined && ele.children.length !== 0) {
        getDataAndChildren(ele.children);
      }
    });
  }

  // 绘画表格数据
  dataSourceArr.forEach((item, index) => {
    // 根据数据,创建对应个数的行
    let row = sheet.addRow();
    row.setHeightCM(0.8);
    // 创建对应个数的单元格
    item.map((ele) => {
      let cell = row.addCell();
      if (ele.hasOwnProperty('num')) {
        cell.value = index + 1;
      } else {
        cell.value = ele.value;
      }
      cell.style.align.v = 'center';
      cell.style.align.h = 'center';
      border(cell, 1, 1, 1, 1);
    });
  });
  // 设置每列的宽度,如果设置每列宽度则取参,否则按默认宽度设置
  if (columnWidth.length !== 0 && columnWidth.length === column.length) {
    for (let i = 0; i < column.length; i++) {
      sheet.col(i).width = columnWidth[i];
    }
  } else {
    for (let i = 0; i < column.length; i++) {
      sheet.col(i).width = 20;
    }
  }

  file.saveAs('blob').then(function (content) {
    saveAs(content, fileName + '.xlsx');
    if (cb) {
      cb();
    }
  });

  // 按顺序展平column
  function columnLine(column) {
    column.map((ele) => {
      if (ele.children === undefined || ele.children.length === 0) {
        columnLineArr.push(ele);
      } else {
        columnLine(ele.children);
      }
    });
  }

  // 初始化表头
  function init(column, rowIndex, columnIndex) {
    column.map((item, index) => {
      let hCell = sheet.cell(rowIndex, columnIndex);
      // 如果没有子元素, 撑满列
      if (item.title === '操作') {
        hCell.value = '';
      } else if (item.children === undefined || item.children.length === 0) {
        // 第一行加一个单元格
        hCell.value = item.title;
        hCell.vMerge = depth - rowIndex - 1;
        hCell.style.align.h = 'center';
        hCell.style.align.v = 'center';
        columnIndex++;
        // rowIndex++
      } else {
        let childrenNum = 0;
        let getColumns = (arr) => {
          arr.map((ele) => {
            if (ele.children) {
              getColumns(ele.children);
            } else {
              childrenNum++;
            }
          });
        };
        getColumns(item.children);
        hCell.hMerge = childrenNum - 1;
        hCell.value = item.title;
        hCell.style.align.h = 'center';
        hCell.style.align.v = 'center';
        let rowCopy = rowIndex;
        rowCopy++;
        init(item.children, rowCopy, columnIndex);
        // 下次单元格起点
        columnIndex = columnIndex + childrenNum;
      }
    });
  }

  // 获取表头rows
  function getDepth(arr) {
    const eleDepths = [];
    arr.forEach((ele) => {
      let depth = 0;
      if (Array.isArray(ele.children)) {
        depth = getDepth(ele.children);
      }
      eleDepths.push(depth);
    });
    return 1 + max(eleDepths);
  }

  function max(arr) {
    return arr.reduce((accu, curr) => {
      if (curr > accu) return curr;
      return accu;
    });
  }

  // 计算表头列数
  function getColumns(arr) {
    let columnNum = 0;
    arr.map((ele) => {
      if (ele.children) {
        getColumns(ele.children);
      } else {
        columnNum++;
      }
    });
    return columnNum;
  }

  function border(cell, top, right, bottom, left) {
    const light = 'ffded9d4';
    const dark = 'ff7e6a54';
    cell.style.border.top = 'thin';
    cell.style.border.topColor = top ? dark : light;
    cell.style.border.left = 'thin';
    cell.style.border.leftColor = left ? dark : light;
    cell.style.border.bottom = 'thin';
    cell.style.border.bottomColor = bottom ? dark : light;
    cell.style.border.right = 'thin';
    cell.style.border.rightColor = right ? dark : light;
    // console.log(hc.style.border.topColor=0?2:3)   3
    // console.log(hc.style.border.leftColor=0?2:3)  3
    // console.log(hc.style.border.bottomColor=0?2:3)3
    // console.log(hc.style.border.rightColor=1?2:3) 2
    // 也就是说给单元格设置边框颜色时,如果给边框赋值为0,则表示不给该边框赋值,转换为布尔值为false,反之则相反
  }

  // 给单元格填充背景,前景色
  function fillColor(cell, type) {
    type = type || 0;
    let colors = ['ffffffff', 'fff1eeec', 'ffe4e2de', 'fffff8df', '15263978'];
    //  0: white ,1: header, 2: first col, 3: second col, 4: gray,
    cell.style.fill.patternType = 'solid';
    cell.style.fill.fgColor = colors[type];
    cell.style.fill.bgColor = 'ffffffff';
  }
}

export default ExportExcel;
