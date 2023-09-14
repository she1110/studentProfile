import {Button} from 'antd';
import {useState} from 'react';

const TestRouteSon1 = (props: any) => {
  return (
    <div>
      <Button
        onClick={() => {
          console.log(props);
        }}
      >
        TestRouteSon1
      </Button>
    </div>
  );
};
const Foo = (props: any) => {
  console.log(props.name);
  return (
    <div>
      <h1> Foo </h1>
    </div>
  );
};

const App = () => {
  const [name, setName] = useState('App');

  return (
    <div className="App">
      <Foo name={name}/>
      <button onClick={() => setName('aaa')}>{name}</button>
    </div>
  );
};

export default App;
