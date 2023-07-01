import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

import { useAddNewFoodMutation } from '../food/foodApiSlice';
import useAuth from '../../hooks/useAuth';
import { Card, Button, ListGroup } from 'react-bootstrap';

const Recipes = ({ title, calories, image, ingredients, url, source }) => {
  const { id } = useAuth();
  const today = new Date();
  const nextThreeDays = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  const formattedDate = nextThreeDays.toISOString().split('T')[0];

  const dateE = new Date(formattedDate);

  const [addNewFood, { isSuccess, isError }] = useAddNewFoodMutation();

  useEffect(() => {
    if (isSuccess) {
      Swal.fire({
        title: `${title} is cooked and saved!`,
        text: `Make sure to eat ${title} within 3 days.`,
        icon: 'success',
      });
    } else if (isError) {
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while saving the recipe.',
        icon: 'error',
      });
    }
  }, [isSuccess, isError, title]);

  const handleCookClick = async () => {
    try {
      await addNewFood({
        user: id,
        name: title,
        dateExpiry: dateE,
        category: 'Leftovers',
        place: 'Refridgerator',
        quantity: '1 serving(s)',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while saving the recipe.',
        icon: 'error',
      });
    }
  };

  return (
    <Card>
      <Card.Header as="h2">{title}</Card.Header>
      <Card.Body>
        <Card.Text>Calories: {calories}</Card.Text>
        <Card.Img src={image} alt={title} />
        <Card.Title>Ingredients:</Card.Title>
        <ListGroup>
          {ingredients.map((ingredient, index) => (
            <ListGroup.Item key={index}>{ingredient.text}</ListGroup.Item>
          ))}
        </ListGroup>
        <Card.Text>
          Instructions available at: <a href={url}>{source}</a>
        </Card.Text>
        <Button className="recipe-button" onClick={handleCookClick}>
          I cook this meal
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Recipes;
