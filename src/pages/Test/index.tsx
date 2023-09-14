import React, {useEffect} from 'react';
import {useModel} from 'umi';
import {Button} from 'antd';

const Test: React.FC = (props) => {
  const Test = useModel('Test');
  const {getMyPersons, MyPersonsArry} = useModel('Test', (model) => ({
    MyPersonsArry: model.personsArry,
    getMyPersons: model.getMyPersons1,
  }));
  useEffect(() => {
    getMyPersons();
    // console.log(props);
  }, []);
  return (
    <div>
      <Button
        onClick={() => {
          console.log(Test);
        }}
      >
        Test
      </Button>
      <Button
        onClick={() => {
          console.log(getMyPersons);
        }}
      >
        getMyPersons
      </Button>
      <Button
        onClick={() => {
          console.log(MyPersonsArry);
        }}
      >
        MyPersonsArry
      </Button>
    </div>
  );
};

export default Test;
