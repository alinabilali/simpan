import React from 'react';
import useAuth from '../../hooks/useAuth';
import { useGetFoodQuery } from '../food/foodApiSlice';
import Food from '../food/Food';
import Notifications from '../food/Notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';

const Welcome = () => {
  const { id } = useAuth();

  const date = new Date();

  const today = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

  const { name } = useAuth();
  const newName = name.charAt(0).toUpperCase() + name.slice(1);

  const { data: foods, isSuccess } = useGetFoodQuery('foodList', {
    pollingInterval: 150000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let expiredList, nextExpiredList, lessQuantity;
  if (isSuccess) {
    const { ids, entities } = foods;
    // Filter food items that expire today or in the next week
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const tomorrow = new Date(Date.now() + 86400000); // adding 1 day in milliseconds

    let filteredIdsQuantity = ids.filter(
      (foodId) =>
        entities[foodId].user === id &&
        extractNumericQuantity(entities[foodId].quantity) <= 1
    );

    function extractNumericQuantity(quantity) {
      const numericPart = quantity.match(/\d+/); // Extract the numeric part using regular expression
      return numericPart ? parseInt(numericPart[0]) : 0; // Convert to integer or return 0 if no numeric part found
    }

    lessQuantity = filteredIdsQuantity.map((foodId) => {
      const { name, quantity } = entities[foodId];

      return (
        <Food
          key={foodId}
          foodId={foodId}
          name={name}
          quantity={extractNumericQuantity(quantity)}
        />
      );
    });

    let filteredIds = ids.filter(
      (foodId) =>
        entities[foodId].user === id &&
        new Date(entities[foodId].dateExpiry) <= nextWeek
    );

    expiredList = filteredIds
      .filter(
        (foodId) =>
          new Date(entities[foodId].dateExpiry).toLocaleDateString() ===
          new Date().toLocaleDateString()
      )
      .map((foodId) => {
        const { name, dateExpiry } = entities[foodId];

        return (
          <Food
            key={foodId}
            foodId={foodId}
            name={name}
            dateExpiry={dateExpiry}
          />
        );
      });

    nextExpiredList = filteredIds
      .filter((foodId) => {
        const expiryDate = new Date(entities[foodId].dateExpiry);
        return expiryDate > tomorrow && expiryDate < nextWeek;
      })
      .map((foodId) => {
        const { name, dateExpiry } = entities[foodId];
        const reminderDate = new Date(dateExpiry);
        const today = new Date();
        const daysUntilReminder = Math.ceil(
          (reminderDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
        );

        return (
          <Food
            key={foodId}
            foodId={foodId}
            name={name}
            dateExpiry={dateExpiry}
            daysUntilReminder={daysUntilReminder}
          />
        );
      });
  }

  const content = (
    <section className="welcome">
      <h1>Welcome back, {newName}!</h1>
      <p>Here is the overview of products that you have for {today}!</p>
      <div className="product-container">
        <div className="product-item">
          <div className="header">
            <h3>Expired products by today</h3>
          </div>

          {expiredList && expiredList.length ? (
            <ul>
              {expiredList.map((item) => (
                <li key={item.key}>
                  <span className="eproduct-name">{item.props.name}</span>

                  <Notifications name={item.props.name} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No products have expired today.</p>
          )}
        </div>
        <div className="product-item">
          <div className="header">
            <h3>Expired products by next week</h3>
            <button className="recipe-button">
              <FontAwesomeIcon className="recipe-icon" icon={faUtensils} />
              Create recipe
            </button>
          </div>
          {nextExpiredList && nextExpiredList.length ? (
            <ul>
              {nextExpiredList.map((item) => (
                <li key={item.key}>
                  <span className="eproduct-name">{item.props.name}</span>

                  {item.props.daysUntilReminder && (
                    <span className="expiry-date">
                      {item.props.daysUntilReminder} days before expired (
                      {new Date(item.props.dateExpiry).toLocaleDateString()})
                    </span>
                  )}
                  <Notifications name={item.props.name} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No products will expire within a week.</p>
          )}
        </div>
        <div className="product-item">
          <div className="header">
            <h3>Food that less than 2 items</h3>
          </div>
          {lessQuantity && lessQuantity.length ? (
            <ul>
              {lessQuantity.map((item) => (
                <li key={item.key}>
                  <span className="eproduct-name">{item.props.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No products will expire within a week.</p>
          )}
        </div>
      </div>
    </section>
  );

  return content;
};

export default Welcome;
