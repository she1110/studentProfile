import {Button} from 'antd';
import {history, NavLink} from 'umi';

const TestRoute = () => {
  return (
    <div>
      <Button
        onClick={() => {
          history.push('/TestRoute/TestRouteSon?name=why&age=18');
        }}
      >
        testRoute
      </Button>

      <NavLink
        to={{
          pathname: '/TestRoute/TestRouteSon',
          query: {name: 'kobe', age: 30},
          state: {height: 1.98, address: '洛杉矶'},
          search: '?name=kobe&age=30',
        }}
      >
        testRouteNavLink
      </NavLink>
    </div>
  );
};

export default TestRoute;
