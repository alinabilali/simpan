import { Link } from 'react-router-dom';
import Photo from '../assets/img/public-animation.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faUtensils,
  faBarcode,
} from '@fortawesome/free-solid-svg-icons';

const Public = () => {
  const content = (
    <div className="public-layout">
      <div className="public-box">
        <h1>
          Welcome to <span className="public-logo">simpan</span>
          <span className="dots">.</span>!
        </h1>
        <p>
          <span className="public-logo">simpan</span>
          <span className="dots">.</span> is the ultimate food management system
          designed to revolutionise the way you organise and manage your
          kitchen. Whether you're a busy professional, a home cook, or a
          culinary enthusiast, we simplify your life and ensure that you never
          waste food again by
        </p>
        <div style={{ margin: '20px 0' }}>
          <button className="features">
            <FontAwesomeIcon icon={faBell} /> Notify expiring food
          </button>
          <button className="features">
            <FontAwesomeIcon icon={faUtensils} /> Search recipe
          </button>
          <button className="features">
            <FontAwesomeIcon icon={faBarcode} /> Scan barcode to add
          </button>
        </div>
        <p>
          Experience the power of efficient kitchen management with{' '}
          <span className="public-logo">simpan</span>
          <span className="dots">.</span> today!
        </p>
        <Link to="/signup">
          <button className="sign-up">SIGN UP</button>
        </Link>
        <p>
          Have an account? Login <Link to="/login"> here</Link>
        </p>
      </div>
      <div className="public-box">
        <img style={{ width: '450px' }} src={Photo} alt="SVG Image" />
      </div>

      {/* <main className="public__main">
          Click <Link to="/login"> here </Link> to login
        </main>
        <footer>
          <Link to="/login"> Login</Link>
        </footer> */}
    </div>
  );
  return content;
};
export default Public;
