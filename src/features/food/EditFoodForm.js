import { useState, useEffect } from 'react';
import { useUpdateFoodMutation, useDeleteFoodMutation } from './foodApiSlice';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { CATEGORIES } from '../../config/categories';
import { PLACES } from '../../config/places';
import { QUANTITIES } from '../../config/quantities';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const EditFoodForm = ({ food }) => {
  const { id } = useAuth();
  const [updateFood, { isLoading, isSuccess, isError, error }] =
    useUpdateFoodMutation();

  const [
    deleteFood,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteFoodMutation();

  const dateE = new Date(food.dateExpiry);

  const newDate = dateE.toISOString().substring(0, 10);
  const navigate = useNavigate();
  console.log(food.name);
  const [name, setName] = useState(food.name);
  const [dateExpiry, setDateExpiry] = useState(newDate);
  const [category, setCategory] = useState(food.category);
  const [place, setPlace] = useState(food.place);
  const [quantity, setQuantity] = useState(food.quantity);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setName('');
      setDateExpiry('');
      setCategory('');
      setPlace('');
      setQuantity('');
      navigate('/dash/food');
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onNameChanged = (e) => setName(e.target.value);
  const onDateExpiryChanged = (e) => setDateExpiry(e.target.value);
  const onCategoryChanged = (e) => setCategory(e.target.value);
  const onPlaceChanged = (e) => setPlace(e.target.value);

  const canSave =
    [name, dateExpiry, category, place, quantity].every(Boolean) && !isLoading;

  const onSaveFoodClicked = async (e) => {
    if (canSave) {
      await updateFood({
        id: food.id,
        user: id,
        name,
        dateExpiry,
        category,
        place,
        quantity,
      });

      Swal.fire({
        title: 'Food updated!',
        text: `Newest information of ${food.name} has been saved in the system.`,
        icon: 'success',
      });
    }
  };

  const onDeleteFoodClicked = async () => {
    const confirm = await Swal.fire({
      title: `Delete food?`,
      text: `Are you sure you want to delete ${food.name}? You won't be able to revert this action.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
    if (confirm.value) {
      await deleteFood({ id: food.id });
    }
  };

  // const errClass = isError || isDelError ? 'errmsg' : 'offscreen';
  // const validNameClass = !name ? 'form__input--incomplete' : '';
  // const validDateExpiryClass = !dateExpiry ? 'form__input--incomplete' : '';
  // const validCategoryClass = !category ? 'form__input--incomplete' : '';
  // const validPlaceClass = !place ? 'form__input--incomplete' : '';
  // const validQuantityClass = !quantity ? 'form__input--incomplete' : '';

  // const errContent = (error?.data?.message || delerror?.data?.message) ?? '';

  const content = (
    <>
      {/* <p className={errClass}>{error?.data?.message}</p> */}
      <Form
        style={{ width: '650px', margin: '0px auto' }}
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 style={{ textAlign: 'center' }}>Edit Food</h1>
        <FloatingLabel
          controlId="floatingTextarea"
          label="Food name"
          className="mb-3"
        >
          {' '}
          <Form.Control type="text" onChange={onNameChanged} value={name} />
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

        <FloatingLabel
          className="mb-3"
          controlId="floatingDate"
          label="Select Date Expiry"
        >
          <Form.Control
            type="date"
            onChange={onDateExpiryChanged}
            value={dateExpiry}
          />
        </FloatingLabel>

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

        {/* <Select options={CATEGORIES} onChange={(opt) => console.log(opt)} /> */}

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
        <Row className="g-2 mb-3">
          <Col md>
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
              Update Food
            </Button>
          </Col>
          <Col md>
            <Button
              title="Delete"
              onClick={onDeleteFoodClicked}
              style={{
                margin: '10px 0',
                width: '100%',
                background: '#FF0000',
                border: 'none',
              }}
              variant="primary"
              size="lg"
            >
              Delete Food
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );

  return content;
};

export default EditFoodForm;
