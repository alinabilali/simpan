import { useState, useEffect } from 'react';
import { useAddNewFoodMutation } from '../food/foodApiSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { CATEGORIES } from '../../config/categories';
import { PLACES } from '../../config/places';
import { QUANTITIES } from '../../config/quantities';
import useAuth from '../../hooks/useAuth';
import { BARCODES } from '../../config/barcode';
import Swal from 'sweetalert2';

export const ScannedFood = () => {
  const { id } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const results = location.state.results;
  const [addNewFood, { isLoading, isSuccess, isError, error }] =
    useAddNewFoodMutation();

  console.log(results);
  // const dateE = new Date(BARCODES.dateExpiry);
  const barcodeID = BARCODES.find(
    (num) => num.barcodeNum === results.toString()
  );
  const dateE = barcodeID.dateExpiry;
  console.log(dateE);
  // const newDate = dateE.toISOString().substring(0, 10);
  // const navigate = useNavigate();
  console.log(barcodeID.name);
  const [user, setUser] = useState(id);
  const [name, setName] = useState(barcodeID.name);
  const [dateExpiry, setDateExpiry] = useState(dateE);
  const [category, setCategory] = useState(barcodeID.category);
  const [place, setPlace] = useState(barcodeID.place);
  const [quantity, setQuantity] = useState(barcodeID.quantity);

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
    [name, dateExpiry, category, place, quantity].every(Boolean) && !isLoading;

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
      text: `Newest information of ${name} has been added in the system.`,
      icon: 'success',
    });
  };
  const errClass = isError ? 'errmsg' : 'offscreen';
  const content = (
    <>
      <h1 style={{ textAlign: 'center' }}>Add Food</h1>
      <p className={errClass}>{error?.data?.message}</p>
      <Form
        style={{ width: '650px', margin: '0px auto' }}
        onSubmit={(e) => e.preventDefault()}
      >
        <FloatingLabel
          controlId="floatingTextarea"
          label="Food name"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="Food name"
            onChange={onNameChanged}
            value={name}
          />
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
export default ScannedFood;
