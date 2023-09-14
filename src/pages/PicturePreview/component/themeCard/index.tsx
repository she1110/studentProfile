import {Button, Menu} from 'antd';
import type {Dispatch} from 'umi';
import {connect} from 'umi';
import React from 'react';

export type ThemeCardType = {
  dispatch?: Dispatch;
  MyPersons?: object[];
  selectPortrait: Function;
};
const {SubMenu} = Menu;

class ThemeCard extends React.Component<ThemeCardType> {
  state = {};

  componentDidMount = () => {
  };

  selectOne = (value: object) => {
    const {selectPortrait} = this.props;
    selectPortrait(value);
  };

  render() {
    const {MyPersons} = this.props;
    return (
      <div>
        <Menu
          style={{width: 320}}
          defaultOpenKeys={['sub1', 'sub2', 'sub3']}
          mode="inline"
        >
          <SubMenu key="sub1" title="学生主题">
            {MyPersons?.map((element: any, index: any) => {
              if (element.theme === 'studentprofile') {
                return (
                  <Menu.Item key={index}>
                    <Button
                      type="text"
                      onClick={() => {
                        this.selectOne(element);
                      }}
                    >
                      {element.name}
                    </Button>
                  </Menu.Item>
                );
              }
            })}
          </SubMenu>
          <SubMenu key="sub2" title="宿舍主题">
            {MyPersons?.map((element: any, index: any) => {
              if (element.theme === 'dormitoryprofile') {
                return (
                  <Menu.Item key={index}>
                    <Button
                      type="text"
                      onClick={() => {
                        this.selectOne(element);
                      }}
                    >
                      {element.name}
                    </Button>
                  </Menu.Item>
                );
              }
            })}
          </SubMenu>
          <SubMenu key="sub3" title="班级主题">
            {MyPersons?.map((element: any, index: any) => {
              if (element.theme === 'classprofile') {
                return (
                  <Menu.Item key={index}>
                    <Button
                      type="text"
                      onClick={() => {
                        this.selectOne(element);
                      }}
                    >
                      {element.name}
                    </Button>
                  </Menu.Item>
                );
              }
            })}
          </SubMenu>
          <SubMenu key="sub4" title="专业主题">
            {MyPersons?.map((element: any, index: any) => {
              if (element.theme === 'majorprofile') {
                return (
                  <Menu.Item key={index}>
                    <Button
                      type="text"
                      onClick={() => {
                        this.selectOne(element);
                      }}
                    >
                      {element.name}
                    </Button>
                  </Menu.Item>
                );
              }
            })}
          </SubMenu>
          {/* <SubMenu key="sub5" title="学院主题">
            {
              MyPersons?.map((element: any, index: any) => {
                if (element.theme === 'unitprofile') {
                  return (
                    <Menu.Item key={index}>
                      <Button type="text" onClick={() => { this.selectOne(element) }}>
                        {element.name}
                      </Button>
                    </Menu.Item>
                  )
                }
              })
            }
          </SubMenu>
          <SubMenu key="sub6" title="课程主题">
            {
              MyPersons?.map((element: any, index: any) => {
                if (element.theme === 'courseprofile') {
                  return (
                    <Menu.Item key={index}>
                      <Button type="text" onClick={() => { this.selectOne(element) }}>
                        {element.name}
                      </Button>
                    </Menu.Item>
                  )
                }
              })
            }
          </SubMenu> */}
        </Menu>
      </div>
    );
  }
}

export default connect(({user, portrait, picture}: any) => ({
  user,
  picture,
  ...portrait,
}))(ThemeCard);
