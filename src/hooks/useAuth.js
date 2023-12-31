import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';
import jwtDecode from 'jwt-decode';

const useAuth = () => {
  const token = useSelector(selectCurrentToken);

  if (token) {
    const decoded = jwtDecode(token);
    const { id, username, name } = decoded.UserInfo;

    return { id, username, name };
  }

  return { id: '', username: '', name: '' };
};
export default useAuth;
