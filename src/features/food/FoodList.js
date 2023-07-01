import { useGetFoodQuery } from './foodApiSlice';
import Food from './Food';
import useAuth from '../../hooks/useAuth';
import { Alert } from 'react-bootstrap';

const FoodList = () => {
  const { id } = useAuth();

  const {
    data: foods,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetFoodQuery('foodList', {
    pollingInterval: 150000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = foods;

    let filteredIds = ids.filter((foodId) => entities[foodId].user === id);
    const tableContent = ids?.length
      ? filteredIds.map((foodId) => <Food key={foodId} foodId={foodId} />)
      : null;

    if (tableContent?.length) {
      content = (
        <div>
          <h1>Food List</h1>
          <table>
            <thead>
              <tr>
                <th scope="col">Added</th>

                <th scope="col">Name</th>
                <th scope="col">Date Expiry</th>
                <th scope="col">Category</th>
                <th scope="col">Place</th>
                <th scope="col">Quantity</th>
                <th scope="col">Edit</th>
              </tr>
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        </div>
      );
    } else {
      content = (
        <Alert key="info" variant="info">
          No food has been added.
        </Alert>
      );
    }
  }

  return content;
};
export default FoodList;
