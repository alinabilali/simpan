import React, { useEffect, useState } from 'react';
import { useGetFoodQuery } from '../food/foodApiSlice';
import Recipes from './Recipes';
import useAuth from '../../hooks/useAuth';
import ErrorImage from '../../assets/img/recipe-error.png';
import LoadingGif from '../../assets/img/loading-recipe.webp';
import { APP_KEY, APP_ID } from '../../config/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col } from 'react-bootstrap';

const GetRecipes = () => {
  const { id } = useAuth();

  // states
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedNames, setSelectedNames] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // fetching food
  const { data: foods, isSuccess } = useGetFoodQuery('foodList', {
    pollingInterval: 150000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let nextExpiredList;
  if (isSuccess && foods) {
    const { ids, entities } = foods;
    // Filter food items that expire today or in the next week
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const tomorrow = new Date(Date.now() + 86400000); // adding 1 day in milliseconds

    let filteredIds = ids.filter(
      (foodId) =>
        entities[foodId].user === id &&
        new Date(entities[foodId].dateExpiry) <= nextWeek
    );

    let filteredCategory = filteredIds.filter((foodId) => {
      const category = entities[foodId].category;
      return (
        category !== 'Beverage' &&
        category !== 'Bread' &&
        category !== 'Coffee and Tea' &&
        category !== 'Leftovers'
      );
    });

    nextExpiredList = filteredCategory
      .filter((foodId) => {
        const expiryDate = new Date(entities[foodId].dateExpiry);
        return expiryDate > tomorrow && expiryDate < nextWeek;
      })
      .map((foodId) => {
        const { name } = entities[foodId];

        return name;
      });
  }

  useEffect(() => {
    if (query) {
      getRecipe();
    } else {
      setRecipes([]); // Clear the recipes when the query is empty
    }

    return () => {
      // Cleanup previous subscription
      setRecipes([]); // Clear the recipes when the component unmounts or when the query changes
    };
  }, [query, selectedNames]);

  const getRecipe = async () => {
    if (query) {
      setIsLoading(true);
      const response = await fetch(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
      );
      const data = await response.json();
      // console.log(data);
      setRecipes(data.hits);
      setIsLoading(false);
    } else {
      // If the query is empty, clear the recipes array
      setRecipes([]);
    }
  };

  const updateSearch = (e) => {
    setSearch(e.target.value);
  };

  const getSearch = (e) => {
    e.preventDefault();
    setQuery(search);
  };

  const getExpired = (e) => {
    e.preventDefault();
    const selectedName = e.target.value;

    // Check if the selected name is already in the selectedNames array
    const isSelected = selectedNames.includes(selectedName);

    if (isSelected) {
      // If the name is already selected, remove it from the array
      setSelectedNames(selectedNames.filter((name) => name !== selectedName));
    } else {
      // If the name is not selected, add it to the array
      setSelectedNames([...selectedNames, selectedName]);
    }

    setSearch(''); // Clear the search bar
    setQuery(selectedName); // Trigger the recipe search with the selected name
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      setSelectedNames([...selectedNames, e.target.value.trim()]);
      setSearch('');
    }
  };

  const removeSelectedName = (index) => {
    const remainingNames = selectedNames.filter((_, i) => i !== index);
    setSelectedNames(remainingNames);
    setQuery('');

    if (remainingNames.length > 0) {
      const newQuery = remainingNames.join(' ');
      setQuery(newQuery);
    }
  };

  return (
    <div>
      <div className="header-recipe">
        <h1>Recipe searcher</h1>
        <div className="search-bar">
          <form onSubmit={getSearch}>
            <input
              type="text"
              placeholder="enter ingredients or names of recipes"
              className="recipe-bar"
              value={search}
              onChange={updateSearch}
              onKeyDown={handleInputKeyDown}
            />
            <button className="recipe-button" type="submit">
              Search
            </button>
            <div className="selected-names">
              {selectedNames.map((name, index) => (
                <span key={index} className="selected-name">
                  {name}
                  <span
                    className="remove-icon"
                    onClick={() => removeSelectedName(index)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </span>
              ))}
            </div>
            <div className="divider">
              <span className="dash"></span>
              <span className="or">OR</span>
              <span className="dash"></span>
            </div>
            <div className="list-expired">
              <p style={{ fontSize: '17px', fontStyle: 'bold' }}>
                Use expiring food:
              </p>
              {nextExpiredList.map((name, index) => (
                <div className="list-expired-button" key={index}>
                  <input
                    type="button"
                    className="expiring-food"
                    id={`checkbox-${index}`}
                    value={name}
                    onClick={getExpired}
                  />
                </div>
              ))}
              <p
                style={{
                  fontSize: '12px',
                  fontStyle: 'italic',
                  margin: '10px 0',
                }}
              >
                *we encourage you to use expiring food above
              </p>
            </div>
          </form>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-recipe">
          <img src={LoadingGif} alt="Loading" />
          <h2>Searching the recipe...</h2>
        </div>
      ) : recipes.length ? (
        <Container>
          <Row>
            {recipes.map((recipe, index) => (
              <Col sm={4} key={index}>
                <Recipes
                  title={recipe.recipe.label}
                  calories={recipe.recipe.calories}
                  ingredients={recipe.recipe.ingredients}
                  image={recipe.recipe.image}
                  url={recipe.recipe.url}
                  source={recipe.recipe.source}
                />
              </Col>
            ))}
          </Row>
        </Container>
      ) : (
        query && (
          <div>
            <h1>
              <img src={ErrorImage} alt="recipe-error" />
              Oops! No recipe matches with{' '}
              <p style={{ color: '#1B815C' }}>{query}</p>
            </h1>
          </div>
        )
      )}
    </div>
  );
};

export default GetRecipes;
