import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NewFoodForm from './NewFoodForm';
import { selectUserById } from '../users/usersApiSlice';

const NewFood = () => {
  const { id } = useParams();

  const user = useSelector((state) => selectUserById(state, id));

  // if (!user) return <PulseLoader color={'#FFF'} />;

  const content = user ? <NewFoodForm user={user} /> : <p>Loading...</p>;

  return content;
};
export default NewFood;
