import { useRef, useState, useEffect } from 'react';
import Photo from '../../assets/img/simpanlogo.png';
import { useNavigate, Link } from 'react-router-dom';
import './login.css'; // Import the custom CSS file for styling
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import LoadingGif from '../../assets/img/login.gif';

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [persist, setPersist] = usePersist();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername('');
      setPassword('');
      navigate('/dash');
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.status === 401) {
        setErrMsg('Unauthorised');
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  const errClass = errMsg ? 'errmsg' : 'offscreen';
  // CSS styles for the loading indicator
  const loadingStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
    color: '#555',
  };

  if (isLoading)
    <div style={loadingStyles}>
      <img src={LoadingGif} alt="Loading" />
      <p>This system is aimed to stop food waste</p>
      {/* Add additional styling or loading animation here */}
    </div>;

  const content = (
    <div className="background-container">
      <div className="login">
        <img
          style={{ width: '200px', padding: '20px 0' }}
          src={Photo}
          alt="SVG Image"
        />

        <h1>Login into your account</h1>
        <h3>
          Don't have an account? <Link to="/signup"> Sign Up</Link>{' '}
        </h3>
        <main>
          <p ref={errRef} className={errClass} aria-live="assertive">
            {errMsg}
          </p>

          <form className="login-group" onSubmit={handleSubmit}>
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
            <button>Log In</button>

            <label htmlFor="persist" className="form__persist">
              <input
                type="checkbox"
                id="persist"
                onChange={handleToggle}
                checked={persist}
              />
              Keep me Logged in
            </label>
          </form>
        </main>
        <div></div>
      </div>
    </div>
  );

  return content;
};
export default Login;
