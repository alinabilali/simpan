import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateUserMutation } from './usersApiSlice';

import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';

const USER_REGEX = /^[A-z]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SettingsForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess }] = useUpdateUserMutation();

  const navigate = useNavigate();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');
  const [reminder, setReminder] = useState(user.reminder || '');
  const [validUsername, setValidUsername] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    if (isSuccess) {
      setName('');
      setEmail('');
      setUsername('');
      setReminder('');
      navigate('/dash/');
    }
  }, [isSuccess, navigate]);

  const onNameChanged = (e) => setName(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onReminderChanged = (e) => setReminder(e.target.value);

  const onSaveUserClicked = async (e) => {
    if (canSave) {
      const userData = {
        id: user.id,
        name,
        username,
        reminder: reminder || null, // Assign null if reminder is empty
      };

      if (password) {
        userData.password = password;
      }

      await updateUser(userData);

      Swal.fire({
        title: 'Settings updated!',
        text: `Newest information of ${user.name} has been saved in the system.`,
        icon: 'success',
      });
    }
  };

  const canSave = [name, username, validEmail].every(Boolean) && !isLoading;

  const content = (
    <>
      <Form
        style={{ width: '650px', margin: '0px auto' }}
        onSubmit={(e) => e.preventDefault()}
      >
        <FloatingLabel label="Name" className="mb-3">
          <Form.Control type="text" onChange={onNameChanged} value={name} />
        </FloatingLabel>

        <FloatingLabel label="Username" className="mb-3">
          <Form.Control
            type="text"
            onChange={onUsernameChanged}
            value={username}
          />
        </FloatingLabel>

        <FloatingLabel label="Email" className="mb-3">
          <Form.Control type="text" onChange={onEmailChanged} value={email} />
        </FloatingLabel>

        <Row className="g-2 mb-3">
          <Col md>
            <Button
              disabled={!canSave}
              title="Save"
              onClick={onSaveUserClicked}
              style={{
                margin: '10px 0',
                width: '100%',
                background: '#1A815C',
                border: 'none',
              }}
              variant="primary"
              size="lg"
            >
              Update Profile
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );

  return content;
};

export default SettingsForm;
