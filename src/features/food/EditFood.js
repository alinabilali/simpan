import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectFoodById } from './foodApiSlice';
import EditFoodForm from './EditFoodForm';

const EditFood = () => {
  const { id } = useParams();

  const food = useSelector((state) => selectFoodById(state, id));

  const content = <EditFoodForm food={food} />;

  return content;
};
export default EditFood;
