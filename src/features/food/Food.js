import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectFoodById } from './foodApiSlice';

const Food = ({ foodId }) => {
  const food = useSelector((state) => selectFoodById(state, foodId));

  const navigate = useNavigate();

  if (food) {
    const created = new Date(food.createdAt).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
    });

    const dateExpiry = new Date(food.dateExpiry).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const handleEdit = () => navigate(`/dash/food/${foodId}`);
    return (
      <tr>
        <td data-label="Added On">{created}</td>
        <td data-label="Name">{food.name}</td>
        <td data-label="Date Expiry">{dateExpiry}</td>
        <td data-label="Category">{food.category}</td>
        <td data-label="Place">{food.place}</td>
        <td data-label="Quantity">{food.quantity}</td>
        <td data-label="Edit">
          <button onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};
export default Food;
