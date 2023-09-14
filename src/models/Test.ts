import {useCallback, useState} from 'react';
import {getMyPersons} from '@/services/Portrait';

export default function Test() {
  const [personsArry, setPersonsArry] = useState([]);

  const getMyPersons1 = useCallback(async () => {
    const result = await getMyPersons(
      localStorage.getItem('token') as string,
      null,
    );
    setPersonsArry(result.data);
  }, []);

  return {
    personsArry,
    getMyPersons1,
  };
}
