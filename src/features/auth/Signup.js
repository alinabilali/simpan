import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Photo from '../../assets/img/simpanlogo.png';
import { Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useSignupMutation } from './authApiSlice';
import './signup.css'; // Import the custom CSS file for styling

const Signup = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signup, { isLoading }] = useSignupMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password, name, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}/.test(password)
      ) {
        setErrMsg(
          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character.'
        );
        errRef.current.focus();
        return;
      }

      const { accessToken } = await signup({
        username,
        password,
        name,
        email,
      }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername('');
      setPassword('');
      setName('');
      setEmail('');
      navigate('/dash');
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Missing Required Fields');
      } else if (err.status === 409) {
        setErrMsg('Username Already Exists');
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleNameInput = (e) => setName(e.target.value);
  const handleEmailInput = (e) => setEmail(e.target.value);

  if (isLoading) return <p>Loading...</p>;

  const content = (
    <div className="signup">
      <div className="background-signup">
        <img
          style={{ width: '200px', padding: '20px 0' }}
          src={Photo}
          alt="SVG Image"
        />
        <h1>Create your account</h1>
        <h3>
          Have an account? <Link to="/login"> Log in now</Link>
        </h3>

        <main className="signup-group">
          {errMsg !== '' && (
            <Alert variant="danger" role="alert">
              {errMsg}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              value={username}
              onChange={handleUserInput}
              autoComplete="off"
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={handlePwdInput}
              value={password}
              required
            />
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              onChange={handleNameInput}
              value={name}
              required
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              onChange={handleEmailInput}
              value={email}
              required
            />
            <button className="submit-button">Sign Up</button>
          </form>
        </main>
        <div className="right-side"></div>
      </div>
    </div>
  );

  return content;
};

export default Signup;
