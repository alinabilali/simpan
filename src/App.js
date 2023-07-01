import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout';
import Welcome from './features/auth/Welcome';
import FoodList from './features/food/FoodList';
import BarcodeScanner from './features/scanning/BarcodeScan';
import Prefetch from './features/auth/PreFetch';
import NewFoodForm from './features/food/NewFoodForm';
import GetRecipe from './features/recipes/GetRecipe';
import PersistLogin from './features/auth/PersistLogin';
import EditFood from './features/food/EditFood';
import Settings from './features/users/Settings';
import { ScannedFood } from './features/scanning/ScannedFood';
import Signup from './features/auth/Signup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>
              <Route index element={<Welcome />} />

              <Route path="food">
                <Route index element={<FoodList />} />
                <Route path="new" element={<NewFoodForm />} />
                <Route path="scan" element={<BarcodeScanner />} />
                <Route path="scanned" element={<ScannedFood />} />
                <Route path="recipe" element={<GetRecipe />} />
                <Route path=":id" element={<EditFood />} />
              </Route>
              <Route path="users">
                <Route path=":id" element={<Settings />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
