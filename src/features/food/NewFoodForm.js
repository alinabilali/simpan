import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddNewFoodMutation } from './foodApiSlice';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import useAuth from '../../hooks/useAuth';
import { CATEGORIES } from '../../config/categories';
import { QUANTITIES } from '../../config/quantities';
import { PLACES } from '../../config/places';
import Select from 'react-select';
import Swal from 'sweetalert2';

const NewFoodForm = () => {
  const { id } = useAuth();
  const [user, setUser] = useState(id);
  const [name, setName] = useState('');
  const [dateExpiry, setDateExpiry] = useState('');
  const [category, setCategory] = useState('');
  const [place, setPlace] = useState('');
  const [quantity, setQuantity] = useState('');

  const [addNewFood, { isLoading, isSuccess, isError, error }] =
    useAddNewFoodMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      setUser('');
      setName('');
      setDateExpiry('');
      setCategory('');
      setPlace('');
      setQuantity('');
      navigate('/dash/food');
    }
  }, [isSuccess, navigate]);

  const onNameChanged = (e) => setName(e.target.value);
  const onDateExpiryChanged = (e) => setDateExpiry(e.target.value);
  const onCategoryChanged = (e) => setCategory(e.target.value);
  const onPlaceChanged = (e) => setPlace(e.target.value);

  const canSave =
    [name, place, dateExpiry, category, quantity].every(Boolean) && !isLoading;

  const onSaveFoodClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewFood({
        user,
        name,
        dateExpiry,
        category,
        place,
        quantity,
      });
    }
    Swal.fire({
      title: 'Food added!',
      text: `${name} has been added in the system.`,
      icon: 'success',
    });
  };

  const errClass = isError ? 'errmsg' : 'offscreen';
  // const validNameClass = !name ? 'form__input--incomplete' : '';
  // const validDateExpiryClass = !dateExpiry ? 'form__input--incomplete' : '';
  // const validCategoryClass = !category ? 'form__input--incomplete' : '';
  // const validPlaceClass = !place ? 'form__input--incomplete' : '';
  // const validQuantityClass = !quantity ? 'form__input--incomplete' : '';

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <Form
        style={{ width: '650px', margin: '0px auto' }}
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 style={{ textAlign: 'center' }}>Add Food</h1>
        <FloatingLabel
          controlId="floatingTextarea"
          label="Food name"
          className="mb-3"
          onChange={onNameChanged}
          value={name}
        >
          {' '}
          <Form.Control type="text" placeholder="Food name" />
        </FloatingLabel>
        <FloatingLabel controlId="floatingSelect" label="Add to">
          <Form.Select
            aria-label="Floating label select example"
            value={place}
            onChange={onPlaceChanged}
            className="mb-3"
          >
            {PLACES.map((place) => (
              <option key={place.value} value={place.value}>
                {place.text}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <FloatingLabel controlId="floatingDate" label="Select Date Expiry">
          <Form.Control
            type="date"
            placeholder="Date Expiry"
            onChange={onDateExpiryChanged}
            value={dateExpiry}
          />
        </FloatingLabel>

        <br></br>
        <FloatingLabel
          controlId="floatingSelect"
          label="Select category"
          className="mb-3"
        >
          <Form.Select
            aria-label="Floating label select example"
            value={category}
            onChange={onCategoryChanged}
            className="mb-3"
          >
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.text}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <Row className="g-2 mb-3">
          <Col md>
            <FloatingLabel
              controlId="floatingInputGrid"
              label="Number of Quantity"
            >
              <Form.Control
                type="number"
                min="1"
                value={quantity.split(' ')[0]}
                onChange={(e) =>
                  setQuantity(e.target.value + ' ' + quantity.split(' ')[1])
                }
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel
              controlId="floatingSelectGrid"
              label="Select quantity"
            >
              <Form.Select
                aria-label="Floating label select example"
                value={quantity.split(' ')[1]}
                onChange={(e) =>
                  setQuantity(quantity.split(' ')[0] + ' ' + e.target.value)
                }
              >
                {QUANTITIES.map((quantity) => (
                  <option key={quantity.value} value={quantity.value}>
                    {quantity.text}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <Button
          disabled={!canSave}
          title="Save"
          onClick={onSaveFoodClicked}
          style={{
            margin: '10px 0',
            width: '100%',
            background: '#1A815C',
            border: 'none',
          }}
          variant="primary"
          size="lg"
        >
          Add Food
        </Button>
      </Form>
    </>
  );

  return content;
};

export default NewFoodForm;
