import { selectUserById } from './usersApiSlice';
import { useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import SettingsForm from './SettingsForm';
import PulseLoader from 'react-spinners/PulseLoader';

const Settings = () => {
  const { id } = useAuth();

  const user = useSelector((state) => selectUserById(state, id));

  if (!user) return <PulseLoader color={'#000'} />;
  const content = <SettingsForm user={user} />;

  return content;
};
export default Settings;
